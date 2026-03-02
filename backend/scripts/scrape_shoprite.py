"""
standalone runner for the shoprite scraper

usage (from the backend/ directory):
    PYTHONPATH=. uv run python scripts/scrape_shoprite.py

output:
    - stdout: summary (product count, store, duration)
    - file:   data/shoprite_<store_id>_<timestamp>.json

# Future (database output): replace the JSON write block with:
#
#   from sqlalchemy.ext.asyncio import AsyncSession
#   from app.db.engine import engine  # async sqlalchemy engine
#   from app.models.product import ProductORM
#
#   async with AsyncSession(engine) as session:
#       orm_rows = [ProductORM(**p.to_dict()) for p in products]
#       session.add_all(orm_rows)
#       await session.commit()
#   print(f"inserted {len(products)} rows into database")
#
# add an upsert strategy (ON CONFLICT DO UPDATE) so re runs update prices
# rather than inserting duplicates.
"""

import asyncio
import json
import logging
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from app.scraper.shoprite import StoreConfig, scrape_store

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# store configuration — single store + category hardcoded for now.
#
# to find store_id and category_id: open shoprite.com in chrome, set your
# store, browse a product category, and inspect the network tab for requests
# to storefrontgateway.shoprite.com/api/stores/{store_id}/categories/{category_id}/search
#
# Future (multi-store): define a list[StoreConfig] and run concurrently:
#   STORES = [
#       StoreConfig(store_id="139", zip_code="07030", category_id="520592", breadcrumb="grocery/dairy/milk"),
#       StoreConfig(store_id="200", zip_code="07302", category_id="520592", breadcrumb="grocery/dairy/milk"),
#   ]
#   results = await asyncio.gather(*[scrape_store(s) for s in STORES])
# ---------------------------------------------------------------------------
STORE = StoreConfig(
    store_id="139",
    zip_code="07030",
    category_id="520592",
    breadcrumb="grocery/dairy/milk",
    browse_url=(
        "https://www.shoprite.com/sm/pickup/rsid/139"
        "/categories/dairy/milk-id-520592"
        "?f=Breadcrumb%3Agrocery%2Fdairy%2Fmilk"
    ),
)

OUTPUT_DIR = Path(__file__).parent.parent / "data"
SESSION_PATH = OUTPUT_DIR / "shoprite_session.json"


async def main() -> int:
    """returns exit code: 0 on success, 1 on failure."""
    OUTPUT_DIR.mkdir(exist_ok=True)

    logger.info(
        "starting shoprite scrape | store: %s | category: %s | zip: %s",
        STORE.store_id,
        STORE.category_id,
        STORE.zip_code,
    )

    if SESSION_PATH.exists():
        logger.info("using saved session: %s", SESSION_PATH)
    else:
        logger.warning(
            "no session file found at %s — cloudflare may block this request. "
            "run `PYTHONPATH=. uv run python scripts/save_session.py` to create one.",
            SESSION_PATH,
        )

    start = time.monotonic()

    try:
        products = await scrape_store(
            STORE,
            session_state=SESSION_PATH if SESSION_PATH.exists() else None,
        )
    except RuntimeError as e:
        # zero product guard —> scrape loop completed but collected nothing.
        # check store_id, category_id, and breadcrumb in STORE config.
        logger.error("%s", e)
        return 1
    except Exception as e:
        logger.error("scrape failed for store %s: %s", STORE.store_id, e)
        return 1

    elapsed = time.monotonic() - start
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    output_path = OUTPUT_DIR / f"shoprite_{STORE.store_id}_{timestamp}.json"

    output_path.write_text(
        json.dumps([p.to_dict() for p in products], indent=2),
        encoding="utf-8",
    )

    print(f"\n{'=' * 50}")
    print("ShopRite Scrape Complete")
    print(f"  Store:    {STORE.store_id} (zip {STORE.zip_code})")
    print(f"  Products: {len(products)}")
    print(f"  Duration: {elapsed:.1f}s")
    print(f"  Output:   {output_path}")
    print(f"{'=' * 50}\n")

    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
