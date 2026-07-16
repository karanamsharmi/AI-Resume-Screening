"""
Integration tests for the /screen-resume upload endpoint.

Tests the full upload flow via FastAPI's TestClient by mocking the
external dependencies (PDF save, text extraction, AI scoring, recommendations)
while exercising the real router ↔ CRUD ↔ database pipeline.

Covers:
  - Successful upload returns 200 with correct response structure
  - File and job_description are sent as multipart form data
  - Resume is persisted in the database after upload
  - Response includes matched/missing skills and recommendations
  - Missing file or job_description returns 422
"""

import io
import pytest

from unittest.mock import patch, AsyncMock


# ─── Mock return values ─────────────────────────────────────────────

MOCK_SCORE_RESULT = {
    "resume": {
        "name": "John Doe",
        "email": "john@test.com",
        "phone": "9876543210",
        "education": ["B.TECH"],
        "experience": ["3"],
    },
    "score": 75.0,
    "rating": "Good",
    "matched": ["python", "git", "sql"],
    "missing": ["docker", "kubernetes"],
}

MOCK_RECOMMENDATIONS = [
    "Learn Docker Basics",
    "Containerize Projects",
    "Learn Kubernetes Architecture",
]


# ─── Tests ──────────────────────────────────────────────────────────

class TestScreenResumeEndpoint:
    """Integration tests for POST /screen-resume."""

    @patch("app.routers.resume.get_recommendations", return_value=MOCK_RECOMMENDATIONS)
    @patch("app.routers.resume.calculate_score", return_value=MOCK_SCORE_RESULT)
    @patch("app.routers.resume.extract_text", return_value="John Doe\njohn@test.com\npython git sql")
    @patch("app.routers.resume.save_pdf", new_callable=AsyncMock, return_value="uploads/test_resume.pdf")
    def test_successful_upload(self, mock_save, mock_extract, mock_score, mock_recs, client):
        """Happy path: upload returns 200 with complete response."""
        fake_pdf = io.BytesIO(b"%PDF-1.4 fake content")

        response = client.post(
            "/screen-resume",
            data={"job_description": "python developer with docker"},
            files={"file": ("test_resume.pdf", fake_pdf, "application/pdf")},
        )

        assert response.status_code == 200
        body = response.json()
        assert body["success"] is True
        assert body["filename"] == "test_resume.pdf"

    @patch("app.routers.resume.get_recommendations", return_value=MOCK_RECOMMENDATIONS)
    @patch("app.routers.resume.calculate_score", return_value=MOCK_SCORE_RESULT)
    @patch("app.routers.resume.extract_text", return_value="resume text")
    @patch("app.routers.resume.save_pdf", new_callable=AsyncMock, return_value="uploads/test.pdf")
    def test_response_contains_match_score(self, mock_save, mock_extract, mock_score, mock_recs, client):
        """Response includes the match_score from AI service."""
        fake_pdf = io.BytesIO(b"%PDF-1.4 fake")

        response = client.post(
            "/screen-resume",
            data={"job_description": "python"},
            files={"file": ("test.pdf", fake_pdf, "application/pdf")},
        )

        body = response.json()
        assert body["match_score"] == 75.0

    @patch("app.routers.resume.get_recommendations", return_value=MOCK_RECOMMENDATIONS)
    @patch("app.routers.resume.calculate_score", return_value=MOCK_SCORE_RESULT)
    @patch("app.routers.resume.extract_text", return_value="resume text")
    @patch("app.routers.resume.save_pdf", new_callable=AsyncMock, return_value="uploads/test.pdf")
    def test_response_contains_skills(self, mock_save, mock_extract, mock_score, mock_recs, client):
        """Response includes matched and missing skill lists."""
        fake_pdf = io.BytesIO(b"%PDF-1.4 fake")

        response = client.post(
            "/screen-resume",
            data={"job_description": "python docker"},
            files={"file": ("test.pdf", fake_pdf, "application/pdf")},
        )

        body = response.json()
        assert body["matched_skills"] == ["python", "git", "sql"]
        assert body["missing_skills"] == ["docker", "kubernetes"]

    @patch("app.routers.resume.get_recommendations", return_value=MOCK_RECOMMENDATIONS)
    @patch("app.routers.resume.calculate_score", return_value=MOCK_SCORE_RESULT)
    @patch("app.routers.resume.extract_text", return_value="resume text")
    @patch("app.routers.resume.save_pdf", new_callable=AsyncMock, return_value="uploads/test.pdf")
    def test_response_contains_recommendations(self, mock_save, mock_extract, mock_score, mock_recs, client):
        """Response includes recommendations for missing skills."""
        fake_pdf = io.BytesIO(b"%PDF-1.4 fake")

        response = client.post(
            "/screen-resume",
            data={"job_description": "python"},
            files={"file": ("test.pdf", fake_pdf, "application/pdf")},
        )

        body = response.json()
        assert body["recommendations"] == MOCK_RECOMMENDATIONS

    @patch("app.routers.resume.get_recommendations", return_value=MOCK_RECOMMENDATIONS)
    @patch("app.routers.resume.calculate_score", return_value=MOCK_SCORE_RESULT)
    @patch("app.routers.resume.extract_text", return_value="resume text")
    @patch("app.routers.resume.save_pdf", new_callable=AsyncMock, return_value="uploads/test.pdf")
    def test_response_contains_resume_details(self, mock_save, mock_extract, mock_score, mock_recs, client):
        """Response includes parsed resume details (name, email, etc.)."""
        fake_pdf = io.BytesIO(b"%PDF-1.4 fake")

        response = client.post(
            "/screen-resume",
            data={"job_description": "python"},
            files={"file": ("test.pdf", fake_pdf, "application/pdf")},
        )

        body = response.json()
        details = body["resume_details"]
        assert details["name"] == "John Doe"
        assert details["email"] == "john@test.com"

    @patch("app.routers.resume.get_recommendations", return_value=MOCK_RECOMMENDATIONS)
    @patch("app.routers.resume.calculate_score", return_value=MOCK_SCORE_RESULT)
    @patch("app.routers.resume.extract_text", return_value="resume text")
    @patch("app.routers.resume.save_pdf", new_callable=AsyncMock, return_value="uploads/test.pdf")
    def test_resume_persisted_in_db(self, mock_save, mock_extract, mock_score, mock_recs, client, db_session):
        """After upload, the resume is saved in the database."""
        fake_pdf = io.BytesIO(b"%PDF-1.4 fake")

        client.post(
            "/screen-resume",
            data={"job_description": "python developer"},
            files={"file": ("persist.pdf", fake_pdf, "application/pdf")},
        )

        from app.models import Resume
        resumes = db_session.query(Resume).all()
        assert len(resumes) == 1
        assert resumes[0].filename == "persist.pdf"

    def test_missing_file_returns_422(self, client):
        """Upload without a file returns a validation error."""
        response = client.post(
            "/screen-resume",
            data={"job_description": "python developer"},
        )
        assert response.status_code == 422

    def test_missing_job_description_returns_422(self, client):
        """Upload without job_description returns a validation error."""
        fake_pdf = io.BytesIO(b"%PDF-1.4 fake")

        response = client.post(
            "/screen-resume",
            files={"file": ("test.pdf", fake_pdf, "application/pdf")},
        )
        assert response.status_code == 422

    @patch("app.routers.resume.get_recommendations", return_value=MOCK_RECOMMENDATIONS)
    @patch("app.routers.resume.calculate_score", return_value=MOCK_SCORE_RESULT)
    @patch("app.routers.resume.extract_text", return_value="resume text")
    @patch("app.routers.resume.save_pdf", new_callable=AsyncMock, return_value="uploads/test.pdf")
    def test_save_pdf_called_with_file(self, mock_save, mock_extract, mock_score, mock_recs, client):
        """save_pdf is invoked with the uploaded file object."""
        fake_pdf = io.BytesIO(b"%PDF-1.4 fake")

        client.post(
            "/screen-resume",
            data={"job_description": "python"},
            files={"file": ("my_cv.pdf", fake_pdf, "application/pdf")},
        )

        mock_save.assert_called_once()

    @patch("app.routers.resume.get_recommendations", return_value=MOCK_RECOMMENDATIONS)
    @patch("app.routers.resume.calculate_score", return_value=MOCK_SCORE_RESULT)
    @patch("app.routers.resume.extract_text", return_value="resume text")
    @patch("app.routers.resume.save_pdf", new_callable=AsyncMock, return_value="uploads/test.pdf")
    def test_extract_text_called_with_saved_path(self, mock_save, mock_extract, mock_score, mock_recs, client):
        """extract_text is called with the path returned by save_pdf."""
        fake_pdf = io.BytesIO(b"%PDF-1.4 fake")

        client.post(
            "/screen-resume",
            data={"job_description": "python"},
            files={"file": ("cv.pdf", fake_pdf, "application/pdf")},
        )

        mock_extract.assert_called_once_with("uploads/test.pdf")
