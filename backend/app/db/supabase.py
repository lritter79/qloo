import os
from dotenv import load_dotenv
from supabase import Client, create_client
from supabase.lib.client_options import ClientOptions

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
service_role: str = os.environ.get("SUPABASE_SERVICE_ROLE")


def create_supabase_client():
    supabase: Client = create_client(url, key)
    return supabase


def create_supabase_client_admin():
    supabase: Client = create_client(url, key, options=ClientOptions(
        auto_refresh_token=False,
        persist_session=False,
    ))
    return supabase.auth.admin
