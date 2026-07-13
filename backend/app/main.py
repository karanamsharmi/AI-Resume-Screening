from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import resume
from app.database import engine
from app.models import Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Resume Screening API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)

@app.get("/")
def home():
    return {"message": "AI Resume Screening Platform"}