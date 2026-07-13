from sqlalchemy.orm import Session
from app.models import Resume


# -----------------------------
# Save Resume
# -----------------------------
def save_resume(
    db: Session,
    filename,
    name,
    email,
    phone,
    education,
    experience,
    jd,
    resume_text,
    score,
    matched,
    missing
):

    resume = Resume(
        filename=filename,
        name=name,
        email=email,
        phone=phone,
        education=education,
        experience=experience,
        job_description=jd,
        resume_text=resume_text,
        score=score,
        matched=", ".join(matched),
        missing=", ".join(missing)
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume


# -----------------------------
# Get All Resumes
# -----------------------------
def get_all_resumes(db: Session):
    return (
        db.query(Resume)
        .order_by(Resume.uploaded_at.desc())
        .all()
    )


# -----------------------------
# Get Resume By ID
# -----------------------------
def get_resume_by_id(db: Session, resume_id: int):
    return (
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .first()
    )


# -----------------------------
# Delete Resume
# -----------------------------
def delete_resume(db: Session, resume_id: int):

    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .first()
    )

    if resume:
        db.delete(resume)
        db.commit()

        return {
            "message": "Resume deleted successfully"
        }

    return {
        "message": "Resume not found"
    }


# -----------------------------
# Leaderboard
# -----------------------------
def get_leaderboard(db: Session):

    return (
        db.query(Resume)
        .order_by(Resume.score.desc())
        .limit(10)
        .all()
    )


# -----------------------------
# Search Resume
# -----------------------------
def search_resumes(
    db: Session,
    keyword: str
):

    keyword = keyword.lower()

    resumes = db.query(Resume).all()

    return [

        resume

        for resume in resumes

        if
        keyword in (resume.name or "").lower()
        or keyword in (resume.email or "").lower()
        or keyword in (resume.matched or "").lower()
        or keyword in (resume.missing or "").lower()

    ]


# -----------------------------
# Filter By Score
# -----------------------------
def filter_resumes(
    db: Session,
    min_score: float,
    max_score: float
):

    return (
        db.query(Resume)
        .filter(
            Resume.score >= min_score,
            Resume.score <= max_score
        )
        .order_by(Resume.score.desc())
        .all()
    )