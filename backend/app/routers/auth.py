import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(tags=["Auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


DEFAULT_ADMIN_USER = os.getenv("ADMIN_USER", "admin")
DEFAULT_ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
DEFAULT_ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "admin-token")

if DEFAULT_ADMIN_PASSWORD == "admin123":
    VALID_ADMIN_PASSWORDS = {"admin", "admin123"}
else:
    VALID_ADMIN_PASSWORDS = {DEFAULT_ADMIN_PASSWORD}


@router.post("/login")
def login(payload: LoginRequest):
    if payload.username == DEFAULT_ADMIN_USER and payload.password in VALID_ADMIN_PASSWORDS:
        return {"success": True, "token": DEFAULT_ADMIN_TOKEN}

    raise HTTPException(status_code=401, detail="Invalid credentials")
