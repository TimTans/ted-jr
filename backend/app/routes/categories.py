from fastapi import APIRouter

from app.core.supabase import get_supabase

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("")
async def list_categories():
    """list all product categories."""
    sb = get_supabase()

    result = sb.table("product_categories").select(
        "id, name, slug"
    ).order("name").execute()

    return result.data
