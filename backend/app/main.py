import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import Base
from app.routers.resume import router as resume_router
from app.routers.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Resume Screening API",
    version="2.0.0"
)

cors_origins = os.getenv("CORS_ORIGINS")
if cors_origins:
    allow_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]
else:
    allow_origins = [
        "http://localhost:3000",
        "http://107.20.129.72:3000"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "status": "Running",
        "application": "AI Resume Screening Platform"
    }