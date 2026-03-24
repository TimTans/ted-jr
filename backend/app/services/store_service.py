"""store queries against supabase."""

from app.core.supabase import get_supabase


async def list_stores(
    chain: str | None = None,
    zip_code: str | None = None,
) -> list[dict]:
    """list all stores, optionally filtered by chain or zip."""
    sb = get_supabase()

    q = sb.table("stores").select("id, name, chain, store_number, zip_code, address")

    if chain:
        q = q.eq("chain", chain)
    if zip_code:
        q = q.eq("zip_code", zip_code)

    result = q.order("name").execute()
    return result.data


async def get_store_products(
    store_id: str,
    category_slug: str | None = None,
    page: int = 1,
    page_size: int = 50,
) -> dict:
    """get products available at a specific store with prices."""
    sb = get_supabase()
    offset = (page - 1) * page_size

    q = sb.table("store_products").select(
        "price, sale_price, in_stock, "
        "products(id, name, brand, image_url, unit_size, upc, "
        "product_categories(name, slug))",
        count="exact",
    ).eq("store_id", store_id)

    q = q.range(offset, offset + page_size - 1).order("price")
    result = q.execute()

    return {"data": result.data, "count": result.count}
