"""grocery list CRUD operations against supabase."""

from datetime import datetime, timezone

from app.core.supabase import get_supabase


async def get_user_lists(user_id: str) -> list[dict]:
    """get all grocery lists for a user."""
    sb = get_supabase()

    result = sb.table("grocery_lists").select(
        "id, name, status, budget_limit, created_at, updated_at"
    ).eq("user_id", user_id).order("created_at", desc=True).execute()

    return result.data


async def create_list(user_id: str, name: str, budget_limit: float | None = None) -> dict:
    """create a new grocery list."""
    sb = get_supabase()

    data = {
        "user_id": user_id,
        "name": name,
        "status": "active",
    }
    if budget_limit is not None:
        data["budget_limit"] = budget_limit

    result = sb.table("grocery_lists").insert(data).execute()
    return result.data[0]


async def get_list_detail(list_id: str, user_id: str) -> dict | None:
    """get a grocery list with all its items and product details."""
    sb = get_supabase()

    result = sb.table("grocery_lists").select(
        "id, name, status, budget_limit, created_at, updated_at, "
        "grocery_list_items("
        "  id, quantity, is_checked, custom_item_name, "
        "  products(id, name, brand, image_url, unit_size, upc, "
        "    store_products(price, sale_price, stores(name, chain)))"
        ")"
    ).eq("id", list_id).eq("user_id", user_id).execute()

    if not result.data:
        return None
    return result.data[0]


async def update_list(list_id: str, user_id: str, **updates) -> dict | None:
    """update a grocery list (name, budget_limit, status)."""
    sb = get_supabase()

    updates["updated_at"] = datetime.now(timezone.utc).isoformat()

    result = sb.table("grocery_lists").update(updates).eq(
        "id", list_id
    ).eq("user_id", user_id).execute()

    if not result.data:
        return None
    return result.data[0]


async def delete_list(list_id: str, user_id: str) -> bool:
    """delete a grocery list. returns True if deleted."""
    sb = get_supabase()

    result = sb.table("grocery_lists").delete().eq(
        "id", list_id
    ).eq("user_id", user_id).execute()

    return len(result.data) > 0


async def add_item(
    list_id: str,
    product_id: str | None = None,
    custom_item_name: str | None = None,
    quantity: int = 1,
) -> dict:
    """add an item to a grocery list."""
    sb = get_supabase()

    data = {
        "grocery_list_id": list_id,
        "quantity": quantity,
    }
    if product_id:
        data["product_id"] = product_id
    if custom_item_name:
        data["custom_item_name"] = custom_item_name

    result = sb.table("grocery_list_items").insert(data).execute()
    return result.data[0]


async def update_item(item_id: str, **updates) -> dict | None:
    """update a grocery list item (quantity, is_checked)."""
    sb = get_supabase()

    updates["updated_at"] = datetime.now(timezone.utc).isoformat()

    result = sb.table("grocery_list_items").update(updates).eq("id", item_id).execute()

    if not result.data:
        return None
    return result.data[0]


async def delete_item(item_id: str) -> bool:
    """remove an item from a grocery list."""
    sb = get_supabase()

    result = sb.table("grocery_list_items").delete().eq("id", item_id).execute()
    return len(result.data) > 0
