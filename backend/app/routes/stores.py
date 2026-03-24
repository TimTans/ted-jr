from fastapi import APIRouter, Query

from app.services import store_service

router = APIRouter(prefix="/stores", tags=["stores"])


@router.get("")
async def list_stores(
    chain: str | None = Query(default=None, description="filter by chain (e.g. shoprite)"),
    zip_code: str | None = Query(default=None, description="filter by zip code"),
):
    """list all stores."""
    return await store_service.list_stores(chain=chain, zip_code=zip_code)


@router.get("/{store_id}/products")
async def get_store_products(
    store_id: str,
    category: str | None = Query(default=None, description="filter by category slug"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=200),
):
    """get products available at a specific store with prices."""
    return await store_service.get_store_products(
        store_id=store_id,
        category_slug=category,
        page=page,
        page_size=page_size,
    )
