from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    Query
)

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.services.pdf_service import (
    save_pdf,
    extract_text
)

from app.services.ai_service import calculate_score
from app.services.recommendation_service import get_recommendations

from app.crud import (
    save_resume,
    get_all_resumes,
    get_resume_by_id,
    delete_resume,
    get_leaderboard,
    search_resumes,
    filter_resumes
)

router = APIRouter(tags=["Resume"])


# ==========================================
# Resume Screening
# ==========================================
@router.post("/screen-resume")
async def screen_resume(
    job_description: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    file_path = await save_pdf(file)

    resume_text = extract_text(file_path)

    result = calculate_score(
        job_description=job_description,
        resume_text=resume_text
    )

    details = result["resume"]

    recommendations = get_recommendations(
        result["missing"]
    )

    save_resume(
        db=db,
        filename=file.filename,
        name=details["name"],
        email=details["email"],
        phone=details["phone"],
        education=", ".join(details["education"]),
        experience=", ".join(details["experience"]),
        jd=job_description,
        resume_text=resume_text,
        score=result["score"],
        matched=result["matched"],
        missing=result["missing"]
    )

    return {
        "success": True,
        "filename": file.filename,
        "resume_details": details,
        "match_score": result["score"],
        "matched_skills": result["matched"],
        "missing_skills": result["missing"],
        "recommendations": recommendations
    }


# ==========================================
# All Resumes
# ==========================================
@router.get("/resumes")
def get_resumes(
    db: Session = Depends(get_db)
):
    return get_all_resumes(db)


# ==========================================
# Leaderboard
# ==========================================
@router.get("/leaderboard")
def leaderboard(
    db: Session = Depends(get_db)
):
    return get_leaderboard(db)


# ==========================================
# Dashboard
# ==========================================
@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db)
):

    resumes = get_all_resumes(db)

    total = len(resumes)

    if total == 0:
        return {
            "total_resumes": 0,
            "highest_score": 0,
            "lowest_score": 0,
            "average_score": 0,
            "selected_candidates": 0,
            "rejected_candidates": 0
        }

    scores = [resume.score for resume in resumes]

    return {
        "total_resumes": total,
        "highest_score": max(scores),
        "lowest_score": min(scores),
        "average_score": round(sum(scores) / total, 2),
        "selected_candidates": len(
            [score for score in scores if score >= 70]
        ),
        "rejected_candidates": len(
            [score for score in scores if score < 40]
        )
    }


# ==========================================
# Search Resume
# ==========================================
@router.get("/search")
def search(
    keyword: str = Query(...),
    db: Session = Depends(get_db)
):
    return search_resumes(
        db,
        keyword
    )


# ==========================================
# Filter Resume
# ==========================================
@router.get("/filter")
def filter_by_score(
    min_score: float = 0,
    max_score: float = 100,
    db: Session = Depends(get_db)
):
    return filter_resumes(
        db,
        min_score,
        max_score
    )


# ==========================================
# Get Resume By ID
# ==========================================
@router.get("/resume/{resume_id}")
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):
    return get_resume_by_id(
        db,
        resume_id
    )


# ==========================================
# Delete Resume
# ==========================================
@router.delete("/resume/{resume_id}")
def remove_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):
    return delete_resume(
        db,
        resume_id
    )