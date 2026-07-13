from sqlalchemy.orm import Session
from app.models import Resume

def save_resume(db: Session, filename, jd, resume_text, score, matched, missing):

    resume = Resume(
        filename=filename,
        job_description=jd,
        resume_text=resume_text,
        score=score,
        matched_skills=",".join(matched),
        missing_skills=",".join(missing)
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume