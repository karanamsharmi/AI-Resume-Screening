from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String)

    job_description = Column(Text)

    resume_text = Column(Text)

    score = Column(Integer)

    matched_skills = Column(Text)

    missing_skills = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)