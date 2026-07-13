from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.database import Base


class Resume(Base):

    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String)

    name = Column(String)

    email = Column(String)

    phone = Column(String)

    education = Column(String)

    experience = Column(String)

    resume_text = Column(String)

    job_description = Column(String)

    score = Column(Float)

    matched = Column(String)

    missing = Column(String)

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )