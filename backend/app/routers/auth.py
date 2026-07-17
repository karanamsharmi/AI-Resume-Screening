from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(tags=["Auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


# Default credentials. Change as needed.
DEFAULT_ADMIN_USER = "admin"
DEFAULT_ADMIN_PASSWORD = "admin123"
DEFAULT_ADMIN_TOKEN = "admin-token"


@router.post("/login")
def login(payload: LoginRequest):
    if payload.username == DEFAULT_ADMIN_USER and payload.password == DEFAULT_ADMIN_PASSWORD:
        return {"success": True, "token": DEFAULT_ADMIN_TOKEN}

    raise HTTPException(status_code=401, detail="Invalid credentials")
