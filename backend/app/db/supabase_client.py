import os
from typing import Optional
from app.core.config import settings

class SupabaseManager:
    _instance = None

    @classmethod
    def get_client(cls):
        """Get or initialize Supabase Python Client."""
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            return None
        
        if cls._instance is None:
            try:
                from supabase import create_client, Client
                cls._instance: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            except Exception as e:
                print(f"Warning: Supabase client initialization failed: {e}")
                return None
        return cls._instance

    @classmethod
    async def log_message(cls, interview_id: str, role: str, content: str, q_num: int, level: int, is_hint: bool = False, is_panic: bool = False):
        client = cls.get_client()
        if not client:
            return
        try:
            client.table("interview_messages").insert({
                "interview_id": interview_id,
                "role": role,
                "content": content,
                "question_number": q_num,
                "level": level,
                "is_hint": is_hint,
                "is_panic": is_panic
            }).execute()
        except Exception as e:
            print(f"Error persisting message to Supabase: {e}")
