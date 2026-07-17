from app.database import SessionLocal
from fastapi import Header, HTTPException
from typing import Optional

# Simple default token for the admin user. In production replace with secure auth.
DEFAULT_ADMIN_TOKEN = "admin-token"

def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")

    # Expect header value like: Bearer admin-token
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = parts[1]

    if token != DEFAULT_ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid token")

    return {"username": "admin"}