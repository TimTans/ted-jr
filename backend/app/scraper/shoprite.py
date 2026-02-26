"""
shoprite scraper using playwright + server-rendered state extraction.

navigates to shoprite category pages and extracts product data from
window.__PRELOADED_STATE__.search.productCardDictionary, the redux store
that the SSR page hydrates with product listings.

NOTE: the api (storefrontgateway.shoprite.com) rejects direct http calls due to tls
fingerprinting, so playwright with real crhomium is needed. products are
server rendered on initial page load rather than fetched via xhr, so we
read the preloaded redux state rather than intercepting network requests.

shoprite.com is behind cloudflare turnstile, which blocks headless browsers
to bypass, solve challenge once in a visible browser using
scripts/save_session.py, then pass the saved session file to scrape_store().

pagination is handled by navigating to successive page urls increment accordingly and extracting
fresh state from each page load.
"""

import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

logger = logging.getLogger(__name__)

_PAGE_SIZE = 30

# consistent user agent used by both save_session.py and scrape_store().
# cloudflare binds cf_clearance cookies to the user agent string, so both
# the headed session (where the challenge is solved) and the headless
# scraper must present the same one.
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/131.0.0.0 Safari/537.36"
)


@dataclass
class StoreConfig:
    """
    configuration for a single shoprite store + category to scrape.

    store_id: shoprite's numeric store id (e.g. "139")
    zip_code: human-readable location context, used in filenames and logs
    category_id: the category id (e.g. "520592")
    breadcrumb: the category breadcrumb (e.g. "grocery/dairy/milk")
    browse_url: the exact category page URL to navigate to. find this by
                opening shoprite.com, selecting your store, browsing to the
                category, and copying the URL from the address bar.

    # Future (multi-store): pass list[StoreConfig] to the runner
    # and call scrape_store() for each, either sequentially or with
    # asyncio.gather() for concurrent scraping.
    """
    store_id: str
    zip_code: str
    category_id: str
    breadcrumb: str
    browse_url: str


@dataclass
class ShopRiteProduct:
    """
    a single product scraped from shoprite.

    upc is nullable so products without a upc are still stored but cannot get
    further data via the fdc nutrition api (as of now - could look into alt option of searching?)

    # Future (full product data): add these fields once confirmed
    # present in the preloaded state:
    # category: str     - item.get("category")
    # image_url: str    - item.get("image", {}).get("default")
    # brand: str        - item.get("brand")
    # on_sale: bool.    - item.get("isDiscounted")
    # sale_price: float - parse item.get("wasPrice") when isDiscounted
    """
    name: str
    price: float
    unit_size: str
    upc: str | None
    store_id: str
    store_zip: str
    # ISO 8601
    scraped_at: str

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "price": self.price,
            "unit_size": self.unit_size,
            "upc": self.upc,
            "store_id": self.store_id,
            "store_zip": self.store_zip,
            "scraped_at": self.scraped_at,
        }


def _parse_preloaded_products(
    product_dict: dict, config: StoreConfig,
) -> list[ShopRiteProduct]:
    """
    parse products from __PRELOADED_STATE__.search.productCardDictionary.

    product_dict is a dict mapping sku -> product data. each product has:
        name, price ("$4.09"), brand, sku, unitOfSize, description, etc.

    malformed items are skipped with a warning.
    """
    products = []
    scraped_at = datetime.now(timezone.utc).isoformat()

    for sku, item in product_dict.items():
        try:
            name = item["name"]

            # price comes as "$4.09" string -> strip dollar sign and parse
            price_str = item["price"]
            price = float(price_str.replace("$", "").replace(",", ""))

            size = item.get("unitOfSize", {})
            unit_size = f"{size.get('size', '')} {size.get('abbreviation', '')}".strip()

            products.append(ShopRiteProduct(
                name=name,
                price=price,
                unit_size=unit_size,
                upc=sku,
                store_id=config.store_id,
                store_zip=config.zip_code,
                scraped_at=scraped_at,
            ))
        except (KeyError, TypeError, ValueError) as e:
            logger.warning("skipping malformed product (sku=%s): %s", sku, e)
            continue

    return products


def _dedup_products(products: list[ShopRiteProduct]) -> list[ShopRiteProduct]:
    """
    remove duplicate products. deduplicates by upc when available,
    falls back to product name when upc is None.
    """
    seen: set[str] = set()
    result = []
    for product in products:
        key = product.upc if product.upc is not None else product.name
        if key not in seen:
            seen.add(key)
            result.append(product)
    return result


async def scrape_store(
    config: StoreConfig,
    session_state: str | Path | None = None,
) -> list[ShopRiteProduct]:
    """
    scrape all products for a single shoprite store + category.

    navigates to the category page, extracts product data from the
    server-rendered redux state (__PRELOADED_STATE__), then paginates
    by appending &page=N to the url and extracting fresh state from each load.

    session_state: path to a playwright storage-state JSON file containing
        cookies from a previous cloudflare-verified session. generate one
        with scripts/save_session.py. if None, the scraper will attempt
        without session cookies (will fail if cloudflare is active).

    edge case of 0 products but "successful" scraoe ->
    raise RuntimeError if zero products are collected.

    # Future (multi-store): call concurrently:
    #   results = await asyncio.gather(*[scrape_store(c) for c in configs])
    #   all_products = [p for batch in results for p in batch]

    # Future (fastapi integration):
    #   background_tasks.add_task(scrape_store, config)
    """
    from playwright.async_api import async_playwright

    if session_state is not None:
        session_state = Path(session_state)
        if not session_state.exists():
            raise FileNotFoundError(
                f"session file not found: {session_state}\n"
                "run `PYTHONPATH=. uv run python scripts/save_session.py` "
                "to create one."
            )

    collected: list[ShopRiteProduct] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            storage_state=str(session_state) if session_state else None,
            user_agent=USER_AGENT,
        )
        page = await context.new_page()

        page_num = 1
        total_items = None

        while True:
            # build url: append &page=N for pages 2+
            url = config.browse_url
            if page_num > 1:
                sep = "&" if "?" in url else "?"
                url = f"{url}{sep}page={page_num}"

            logger.info("loading page %d: %s", page_num, url)
            await page.goto(url, wait_until="domcontentloaded")
            await page.wait_for_load_state("load")
            await page.wait_for_timeout(2000)

            # detect cloudflare challenge page
            title = await page.title()
            if "just a moment" in title.lower():
                raise RuntimeError(
                    "blocked by cloudflare challenge. session cookies are "
                    "missing or expired — run:\n"
                    "  PYTHONPATH=. uv run python scripts/save_session.py"
                )

            # extract product data from the redux preloaded state
            state = await page.evaluate("""() => {
                const s = window.__PRELOADED_STATE__;
                if (!s || !s.search) return null;
                return {
                    products: s.search.productCardDictionary || {},
                    totalItems: (s.search.pagination && s.search.pagination.category)
                        ? s.search.pagination.category.totalItems
                        : 0,
                };
            }""")

            if not state or not state["products"]:
                logger.info("no products on page %d, stopping", page_num)
                break

            products = _parse_preloaded_products(state["products"], config)
            collected.extend(products)

            if total_items is None:
                total_items = state["totalItems"]
            logger.info(
                "page %d: %d products (collected: %d / %d total)",
                page_num, len(products), len(collected), total_items,
            )

            # check if we've collected everything
            if total_items and len(collected) >= total_items:
                logger.info("collected all %d items", total_items)
                break

            # safety: if page returned products we already have, stop
            if not products:
                break

            page_num += 1

        await browser.close()

    products = _dedup_products(collected)

    if not products:
        raise RuntimeError(
            f"scrape completed for store {config.store_id} / category "
            f"{config.category_id} but no products were collected — "
            "check browse_url in StoreConfig. if cloudflare is active, "
            "run scripts/save_session.py to refresh session cookies."
        )

    logger.info("scraped %d unique products from store %s", len(products), config.store_id)
    return products
