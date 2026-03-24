from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.auth.deps import require_auth
from app.services import grocery_list_service

router = APIRouter(prefix="/grocery-lists", tags=["grocery-lists"])


class CreateListRequest(BaseModel):
    name: str
    budget_limit: float | None = None


class AddItemRequest(BaseModel):
    product_id: str | None = None
    custom_item_name: str | None = None
    quantity: int = 1


class UpdateListRequest(BaseModel):
    name: str | None = None
    budget_limit: float | None = None
    status: str | None = None


class UpdateItemRequest(BaseModel):
    quantity: int | None = None
    is_checked: bool | None = None


@router.get("")
async def get_lists(user_id: str = Depends(require_auth)):
    """get all grocery lists for the authenticated user."""
    return await grocery_list_service.get_user_lists(user_id)


@router.post("", status_code=201)
async def create_list(body: CreateListRequest, user_id: str = Depends(require_auth)):
    """create a new grocery list."""
    return await grocery_list_service.create_list(
        user_id=user_id,
        name=body.name,
        budget_limit=body.budget_limit,
    )


@router.get("/{list_id}")
async def get_list(list_id: str, user_id: str = Depends(require_auth)):
    """get a grocery list with all items and product details."""
    result = await grocery_list_service.get_list_detail(list_id, user_id)
    if not result:
        raise HTTPException(status_code=404, detail="list not found")
    return result


@router.patch("/{list_id}")
async def update_list(
    list_id: str, body: UpdateListRequest, user_id: str = Depends(require_auth),
):
    """update a grocery list (name, budget, status)."""
    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="no fields to update")
    result = await grocery_list_service.update_list(list_id, user_id, **updates)
    if not result:
        raise HTTPException(status_code=404, detail="list not found")
    return result


@router.delete("/{list_id}", status_code=204)
async def delete_list(list_id: str, user_id: str = Depends(require_auth)):
    """delete a grocery list."""
    deleted = await grocery_list_service.delete_list(list_id, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="list not found")


@router.post("/{list_id}/items", status_code=201)
async def add_item(
    list_id: str, body: AddItemRequest, user_id: str = Depends(require_auth),
):
    """add an item to a grocery list."""
    return await grocery_list_service.add_item(
        list_id=list_id,
        product_id=body.product_id,
        custom_item_name=body.custom_item_name,
        quantity=body.quantity,
    )


@router.patch("/{list_id}/items/{item_id}")
async def update_item(
    list_id: str, item_id: str, body: UpdateItemRequest,
    user_id: str = Depends(require_auth),
):
    """update a grocery list item (quantity, checked status)."""
    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="no fields to update")
    result = await grocery_list_service.update_item(item_id, **updates)
    if not result:
        raise HTTPException(status_code=404, detail="item not found")
    return result


@router.delete("/{list_id}/items/{item_id}", status_code=204)
async def delete_item(
    list_id: str, item_id: str, user_id: str = Depends(require_auth),
):
    """remove an item from a grocery list."""
    deleted = await grocery_list_service.delete_item(item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="item not found")
