"""
admin endpoint to trigger scraping.

in production this would use proper role-based auth.
"""

from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.scraper.config import STORES, CATEGORIES, build_browse_url, StoreInfo, CategoryConfig
from app.scraper.shoprite import StoreConfig, scrape_store
from app.scraper.db_writer import ensure_store_exists, ensure_category_exists, upsert_products

router = APIRouter(prefix="/scraper", tags=["scraper"])


class ScrapeRequest(BaseModel):
    store_id: str | None = None
    category_slug: str | None = None


class ScrapeResult(BaseModel):
    store: str
    category: str
    products: int


async def _run_scrape(store: StoreInfo, category: CategoryConfig) -> ScrapeResult:
    """scrape one store+category and write to supabase."""
    session_path = Path("data/shoprite_session.json")
    config = StoreConfig(
        store_id=store.store_id,
        zip_code=store.zip_code,
        browse_url=build_browse_url(store, category),
    )

    products = await scrape_store(
        config,
        session_state=session_path if session_path.exists() else None,
    )

    store_uuid = await ensure_store_exists(store)
    cat_uuid = await ensure_category_exists(category)
    await upsert_products(products, store_uuid, cat_uuid)

    return ScrapeResult(store=store.name, category=category.name, products=len(products))


@router.post("/run")
async def trigger_scrape(body: ScrapeRequest = ScrapeRequest()):
    """
    trigger a scrape run. optionally filter by store_id or category_slug.
    scrapes all matching store x category combinations and writes to supabase.
    """
    stores = STORES
    categories = CATEGORIES

    if body.store_id:
        stores = [s for s in STORES if s.store_id == body.store_id]
        if not stores:
            raise HTTPException(status_code=400, detail=f"unknown store_id: {body.store_id}")

    if body.category_slug:
        categories = [c for c in CATEGORIES if c.slug == body.category_slug]
        if not categories:
            raise HTTPException(status_code=400, detail=f"unknown category: {body.category_slug}")

    results = []
    for store in stores:
        for category in categories:
            try:
                result = await _run_scrape(store, category)
                results.append(result.model_dump())
            except Exception as e:
                results.append({
                    "store": store.name,
                    "category": category.name,
                    "products": 0,
                    "error": str(e),
                })

    return {"results": results}
