"""
shared supabase client instance.

uses the service role key (not anon key) because this is a trusted backend
it needs to bypass row level security for operations like upserting scraped
products and reading across all users' grocery lists.

the anon key is what ios/android clients use directly for auth.
"""

from supabase import create_client, Client

from app.core.config import settings


def get_supabase() -> Client:
    """return a supabase client. creates a new instance each call."""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
