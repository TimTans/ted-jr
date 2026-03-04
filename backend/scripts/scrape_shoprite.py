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
# store + category configurations.
#
# to find store_id and category_id: open shoprite.com in chrome, set your
# store, browse a product category, and copy the URL from the address bar.
#
# note: the url slug doesn't always match the breadcrumb (e.g. "bread & bakery"
# becomes "bread-bakery" in the path), so we store the full browse_url.
#
# Future (multi-store):
#   separate stores and categories into independent lists, then loop over
#   the cartesian product. add Store / Category dataclasses and a
#   StoreConfig.build() classmethod to shoprite.py. the slug mapping will
#   need a lookup or a scrape of the category nav tree.
#   use asyncio.Semaphore to limit concurrency (3-4 browsers max).
# ---------------------------------------------------------------------------
STORE_ID = "139"
ZIP_CODE = "07030"

CONFIGS = [
    StoreConfig(
        store_id=STORE_ID,
        zip_code=ZIP_CODE,
        category_id="520592",
        breadcrumb="grocery/dairy/milk",
        browse_url=(
            f"https://www.shoprite.com/sm/pickup/rsid/{STORE_ID}"
            "/categories/dairy/milk-id-520592"
            "?f=Breadcrumb%3Agrocery%2Fdairy%2Fmilk"
        ),
    ),
    StoreConfig(
        store_id=STORE_ID,
        zip_code=ZIP_CODE,
        category_id="520591",
        breadcrumb="grocery/dairy/eggs",
        browse_url=(
            f"https://www.shoprite.com/sm/pickup/rsid/{STORE_ID}"
            "/categories/dairy/eggs-id-520591"
            "?f=Breadcrumb%3Agrocery%2Fdairy%2Feggs"
        ),
    ),
    StoreConfig(
        store_id=STORE_ID,
        zip_code=ZIP_CODE,
        category_id="520567",
        breadcrumb="grocery/bread & bakery/bread",
        browse_url=(
            f"https://www.shoprite.com/sm/pickup/rsid/{STORE_ID}"
            "/categories/bread-bakery/bread-id-520567"
            "?f=Breadcrumb%3Agrocery%2Fbread+%26+bakery%2Fbread"
        ),
    ),
]

OUTPUT_DIR = Path(__file__).parent.parent / "data"
SESSION_PATH = OUTPUT_DIR / "shoprite_session.json"


async def main() -> int:
    """returns exit code: 0 on success, 1 on failure."""
    OUTPUT_DIR.mkdir(exist_ok=True)

    session = SESSION_PATH if SESSION_PATH.exists() else None
    if session:
        logger.info("using saved session: %s", SESSION_PATH)
    else:
        logger.warning(
            "no session file found at %s — cloudflare may block this request. "
            "run `PYTHONPATH=. uv run python scripts/save_session.py` to create one.",
            SESSION_PATH,
        )

    start = time.monotonic()
    all_products = []
    failed = []

    for config in CONFIGS:
        logger.info(
            "scraping store %s | category: %s (%s)",
            config.store_id, config.breadcrumb, config.category_id,
        )
        try:
            products = await scrape_store(config, session_state=session)
            all_products.extend(products)
            logger.info(
                "category %s: %d products", config.breadcrumb, len(products),
            )
        except Exception as e:
            logger.error("category %s failed: %s", config.breadcrumb, e)
            failed.append(config.breadcrumb)
            continue

    elapsed = time.monotonic() - start

    if not all_products:
        logger.error("no products collected from any category")
        return 1

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    output_path = OUTPUT_DIR / f"shoprite_{STORE_ID}_{timestamp}.json"

    output_path.write_text(
        json.dumps([p.to_dict() for p in all_products], indent=2),
        encoding="utf-8",
    )

    print(f"\n{'=' * 50}")
    print("ShopRite Scrape Complete")
    print(f"  Store:      {STORE_ID} (zip {ZIP_CODE})")
    print(f"  Categories: {len(CONFIGS) - len(failed)}/{len(CONFIGS)} succeeded")
    print(f"  Products:   {len(all_products)}")
    print(f"  Duration:   {elapsed:.1f}s")
    print(f"  Output:     {output_path}")
    if failed:
        print(f"  Failed:     {', '.join(failed)}")
    print(f"{'=' * 50}\n")

    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
