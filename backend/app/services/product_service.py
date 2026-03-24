"""
product queries against supabase.

all functions return plain dicts (supabase response data).
the route layer handles serialization to pydantic response models.
"""

from app.core.supabase import get_supabase


async def search_products(
    query: str | None = None,
    category_slug: str | None = None,
    store_id: str | None = None,
    page: int = 1,
    page_size: int = 50,
) -> dict:
    """
    search products with optional filters.

    returns {"data": [...products...], "count": total_matching}

    when store_id is provided, joins store_products to include price at that store.
    """
    sb = get_supabase()
    offset = (page - 1) * page_size

    q = sb.table("products").select(
        "id, name, brand, image_url, unit_size, upc, "
        "product_categories(id, name, slug), "
        "store_products(price, sale_price, in_stock, store_id, stores(name, chain, store_number))",
        count="exact",
    )

    if query:
        q = q.ilike("name", f"%{query}%")

    if category_slug:
        cat_result = sb.table("product_categories").select("id").eq("slug", category_slug).execute()
        if cat_result.data:
            q = q.eq("category_id", cat_result.data[0]["id"])

    q = q.range(offset, offset + page_size - 1).order("name")
    result = q.execute()

    return {"data": result.data, "count": result.count}


async def get_product(product_id: str) -> dict | None:
    """get a single product with all store prices."""
    sb = get_supabase()

    try:
        result = sb.table("products").select(
            "id, name, brand, image_url, unit_size, upc, "
            "product_categories(id, name, slug), "
            "store_products(price, sale_price, in_stock, store_id, "
            "stores(id, name, chain, store_number, zip_code))"
        ).eq("id", product_id).execute()

        if not result.data:
            return None
        return result.data[0]
    except Exception:
        return None


async def get_product_prices(product_id: str) -> list[dict]:
    """get all store prices for a product, sorted cheapest first."""
    sb = get_supabase()

    try:
        result = sb.table("store_products").select(
            "price, sale_price, in_stock, updated_at, "
            "stores(id, name, chain, store_number, zip_code)"
        ).eq("product_id", product_id).order("price").execute()

        return result.data
    except Exception:
        return []
