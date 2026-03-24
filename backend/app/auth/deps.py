"""
fastapi dependencies for supabase JWT authentication.

extracts the user_id from the supabase JWT in the Authorization header.
uses supabase's built-in auth.get_user() to validate the token:
this handles signature verification, expiry, etc.

usage in routes:
    @router.get("/my-stuff")
    async def my_stuff(user_id: str = Depends(require_auth)):
        ...
"""

from fastapi import HTTPException, Header

from app.core.supabase import get_supabase


async def require_auth(authorization: str = Header(...)) -> str:
    """
    validate supabase JWT and return user_id.

    expects header: Authorization: Bearer <jwt_token>
    raises 401 if token is invalid or expired.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="invalid authorization header")

    token = authorization.removeprefix("Bearer ")

    try:
        sb = get_supabase()
        user_response = sb.auth.get_user(token)
        return user_response.user.id
    except Exception:
        raise HTTPException(status_code=401, detail="invalid or expired token")
