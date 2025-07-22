import os
from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")


def create_supabase_client():
    supabase: Client = create_client(url, key)
    return supabase
