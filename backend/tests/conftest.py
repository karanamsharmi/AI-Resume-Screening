"""
Shared test fixtures for backend unit tests.

Provides:
  - In-memory SQLite database session
  - FastAPI TestClient wired to the test database
  - Reusable sample data factories
"""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from fastapi.testclient import TestClient

from app.database import Base
from app.dependencies import get_db
from app.main import app


# ─── In-memory SQLite for test isolation ────────────────────────────
TEST_DATABASE_URL = "sqlite:///./test_resume.db"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ─── Fixtures ───────────────────────────────────────────────────────
@pytest.fixture(autouse=True)
def setup_database():
    """Create tables before each test, drop them after."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db_session():
    """Yield a fresh database session for each test."""
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(db_session):
    """FastAPI TestClient that uses the test database."""

    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


# ─── Sample data helpers ────────────────────────────────────────────
@pytest.fixture()
def sample_resume_text():
    """Realistic resume text for parsing tests."""
    return (
        "John Doe\n"
        "Software Engineer\n"
        "john.doe@example.com\n"
        "+91 9876543210\n"
        "\n"
        "Education\n"
        "B.Tech in Computer Science\n"
        "XYZ University, 2020\n"
        "\n"
        "Experience\n"
        "3+ years of experience in software development\n"
        "\n"
        "Skills\n"
        "Python, Django, FastAPI, Docker, Git, SQL, Linux, AWS\n"
    )


@pytest.fixture()
def sample_job_description():
    """Job description with known skills to match against."""
    return (
        "We are looking for a Python developer with experience in "
        "Django, FastAPI, Docker, Kubernetes, Jenkins, Git, SQL, "
        "Linux, AWS, and Terraform."
    )
