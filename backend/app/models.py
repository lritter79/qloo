from fastapi_camelcase import CamelModel
from pydantic import BaseModel
from typing import List, Literal


class User(BaseModel):
    name: str
    email: str
    password: str


class ForgotPassword(BaseModel):
    email: str


class ResetPassword(BaseModel):
    password: str


class Login(BaseModel):
    email: str
    password: str


class RefreshToken(BaseModel):
    refreshToken: str


class ChatMessage(BaseModel):
    id: str
    type: Literal['user', 'api']
    content: str
    timestamp: str
    parentId: str | None


class Chat(CamelModel):
    id: str
    created_at: str
    user_id: str
