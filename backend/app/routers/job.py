from fastapi import APIRouter
from pydantic import BaseModel

from app.services.matching_service import calculate_match

router = APIRouter(prefix="/job", tags=["Job Matching"])


class JobRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post("/match")
def match_resume(request: JobRequest):

    result = calculate_match(
        request.resume_text,
        request.job_description
    )

    return {
        "success": True,
        "result": result
    }