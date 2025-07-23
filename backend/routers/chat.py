from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Annotated, Any
from app.services.openAI import OpenAIService
from routers.users import validate_jwt
import os

router = APIRouter()

# Replace with your actual API keys
key: str = os.environ.get("OPEN_AI_API_KEY")
qloo_key: str = os.environ.get("QLOO_API_KEY")
# Initialize the OpenAI service once
openai_service = OpenAIService(
    api_key=key, qloo_api_key=qloo_key, model="gpt-4.1-mini")


class PromptRequest(BaseModel):
    prompt: str


@router.post("/chat")
async def chat_with_openai(request: PromptRequest, jwt: Annotated[dict, Depends(validate_jwt)]) -> Any:
    try:
        result = await openai_service.chat_with_tools(request.prompt)
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
