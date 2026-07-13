from pydantic import BaseModel


class ResumeResponse(BaseModel):

    id: int

    filename: str

    name: str

    email: str

    phone: str

    education: str

    experience: str

    score: float

    matched: str

    missing: str

    class Config:

        from_attributes = True