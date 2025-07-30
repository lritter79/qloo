import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi_camelcase import CamelModel
from pydantic import BaseModel
from typing import Annotated, Any, List
from app.models import Chat
from app.services.openAI import OpenAIService
from app.db.supabase import create_supabase_client
from app.routers.users import validate_jwt
from datetime import datetime
import os

router = APIRouter()

# Replace with your actual API keys
key: str = os.environ.get("OPEN_AI_API_KEY")
qloo_key: str = os.environ.get("QLOO_API_KEY")
grayswan_key: str = os.environ.get("GRAYSWAN_KEY")
# Initialize the OpenAI service once
openai_service = OpenAIService(
    api_key=key, qloo_api_key=qloo_key, model="gpt-4.1-mini", base_url="https://api.grayswan.ai/cygnal", default_headers={"grayswan-api-key": grayswan_key,
                                                                                                                          "policy-id": "681b8b933152ec0311b99ac9",
                                                                                                                          "pre-violation": "0.5",
                                                                                                                          "pre-jailbreak": "0.5",
                                                                                                                          "post-violation": "0.5",
                                                                                                                          "post-violation-jb": "0.5",
                                                                                                                          "category-stay-on-topic": "Only answer questions related to recommendations based on tastes or preferences mentioned in the prompt"}
)


class PromptRequest(CamelModel):
    prompt: str
    chat_id: str


@router.get("/chats")
async def get_chats(jwt: Annotated[dict, Depends(validate_jwt)]) -> List[Chat]:
    try:
        supabase = create_supabase_client()

        response = (
            supabase.table("chats")
            .select("*")
            .eq("user_id", jwt["sub"])
            .execute()
        )
        return response.data
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/chat")
async def add_chat(jwt: Annotated[dict, Depends(validate_jwt)]) -> Any:
    try:
        supabase = create_supabase_client()
        # Create a datetime object
        now = datetime.now()

        # Convert datetime to string with a specific format
        formatted_date_string = now.strftime("%Y-%m-%d %H:%M:%S")
        response = (
            supabase.table("chats")
            .insert({"user_id": jwt["sub"], "created_at": formatted_date_string})
            .execute()
        )
        return Chat(user_id=response.data[0]["user_id"], created_at=response.data[0]["created_at"], id=response.data[0]["id"])
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/chat/{id}/message")
async def add_message_with_openai(request: PromptRequest, jwt: Annotated[dict, Depends(validate_jwt)]) -> Any:
    try:
        supabase = create_supabase_client()
        my_datetime_object = datetime.now()
        json_serializable_string = my_datetime_object.isoformat()
        user_response = (
            supabase.table("messages")
            .insert({"timestamp":
                     json_serializable_string, "content": request.prompt, "type": "user", "chat_id": request.chat_id})
            .execute()
        )
        result = await openai_service.chat_with_tools(request.prompt)
        my_datetime_object = datetime.now()
        json_serializable_string = my_datetime_object.isoformat()

        api_response = (
            supabase.table("messages")
            .insert({"timestamp": json_serializable_string, "content": result, "type": "api", "chat_id": request.chat_id})
            .execute()
        )
        return {"response": result}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/chat/{id}/messages")
async def get_messages(id: str, jwt: Annotated[dict, Depends(validate_jwt)]) -> List[dict]:
    try:
        supabase = create_supabase_client()
        response = (
            supabase.table("messages")
            .select("*")
            .eq("chat_id", id)
            .execute()
        )
        return response.data
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.delete("/chat/{id}")
async def delete_chat(id: str, jwt: Annotated[dict, Depends(validate_jwt)]) -> Any:
    try:
        supabase = create_supabase_client()
        # Delete messages associated with the chat
        supabase.table("messages").delete().eq("chat_id", id).execute()
        # Delete the chat itself
        response = (
            supabase.table("chats")
            .delete()
            .eq("id", id)
            .execute()
        )
        return {"message": "Chat deleted successfully"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
