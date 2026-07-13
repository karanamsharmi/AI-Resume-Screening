from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session

from app.services.ai_service import calculate_score
from app.services.pdf_service import save_pdf, extract_text
from app.dependencies import get_db
from app.crud import save_resume
from app.models import Resume

router = APIRouter()


@router.post("/screen-resume")
async def screen_resume(
    job_description: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Save uploaded PDF
    file_path = await save_pdf(file)

    # Extract text from PDF
    resume_text = extract_text(file_path)

    # Calculate resume score
    result = calculate_score(job_description, resume_text)

    # Save result to database
    save_resume(
        db=db,
        filename=file.filename,
        jd=job_description,
        resume_text=resume_text,
        score=result["score"],
        matched=result["matched"],
        missing=result["missing"]
    )

    # Return response
    return {
        "filename": file.filename,
        "match_score": result["score"],
        "matched_skills": result["matched"],
        "missing_skills": result["missing"]
    }


@router.get("/resumes")
def get_resumes(db: Session = Depends(get_db)):
    resumes = db.query(Resume).all()

    return resumes
@router.get("/leaderboard")
def leaderboard(db: Session = Depends(get_db)):
    resumes = db.query(Resume).order_by(Resume.score.desc()).all()

    return resumes