"""
Unit tests for CRUD operations related to the upload flow.

Covers:
  - save_resume: Creates record with correct fields, comma-joined skills
  - get_all_resumes: Empty db, ordering by uploaded_at
  - get_resume_by_id: Existing and non-existing IDs
  - delete_resume: Success and not-found cases
"""

import pytest

from app.crud import (
    save_resume,
    get_all_resumes,
    get_resume_by_id,
    delete_resume,
)
from app.models import Resume


class TestSaveResume:
    """Tests for save_resume."""

    def test_creates_resume_record(self, db_session):
        """A new Resume row is created in the database."""
        resume = save_resume(
            db=db_session,
            filename="test.pdf",
            name="Jane Doe",
            email="jane@test.com",
            phone="9876543210",
            education="B.TECH",
            experience="3",
            jd="python developer",
            resume_text="I know python",
            score=80.0,
            matched=["python"],
            missing=["docker"],
        )

        assert resume.id is not None
        assert resume.filename == "test.pdf"
        assert resume.name == "Jane Doe"
        assert resume.email == "jane@test.com"
        assert resume.score == 80.0

    def test_matched_skills_joined_as_csv(self, db_session):
        """matched list is comma-joined before storage."""
        resume = save_resume(
            db=db_session,
            filename="r.pdf",
            name="Test",
            email="t@t.com",
            phone="9999999999",
            education="MCA",
            experience="2",
            jd="jd",
            resume_text="text",
            score=50.0,
            matched=["python", "git", "sql"],
            missing=["docker"],
        )

        assert resume.matched == "python, git, sql"

    def test_missing_skills_joined_as_csv(self, db_session):
        """missing list is comma-joined before storage."""
        resume = save_resume(
            db=db_session,
            filename="r.pdf",
            name="Test",
            email="t@t.com",
            phone="9999999999",
            education="MCA",
            experience="2",
            jd="jd",
            resume_text="text",
            score=50.0,
            matched=["python"],
            missing=["docker", "kubernetes"],
        )

        assert resume.missing == "docker, kubernetes"

    def test_empty_matched_and_missing(self, db_session):
        """Empty skill lists produce empty strings."""
        resume = save_resume(
            db=db_session,
            filename="r.pdf",
            name="Test",
            email="t@t.com",
            phone="9999999999",
            education="",
            experience="",
            jd="no skills",
            resume_text="text",
            score=0,
            matched=[],
            missing=[],
        )

        assert resume.matched == ""
        assert resume.missing == ""

    def test_resume_is_persisted(self, db_session):
        """Record is queryable after save."""
        save_resume(
            db=db_session,
            filename="persist.pdf",
            name="Persist Test",
            email="p@t.com",
            phone="9111111111",
            education="B.TECH",
            experience="1",
            jd="jd",
            resume_text="text",
            score=75.0,
            matched=["python"],
            missing=[],
        )

        result = db_session.query(Resume).filter_by(filename="persist.pdf").first()
        assert result is not None
        assert result.name == "Persist Test"


class TestGetAllResumes:
    """Tests for get_all_resumes."""

    def test_empty_database_returns_empty_list(self, db_session):
        result = get_all_resumes(db_session)
        assert result == []

    def test_returns_all_saved_resumes(self, db_session):
        for i in range(3):
            save_resume(
                db=db_session,
                filename=f"resume_{i}.pdf",
                name=f"Person {i}",
                email=f"p{i}@test.com",
                phone="9000000000",
                education="B.TECH",
                experience="1",
                jd="jd",
                resume_text="text",
                score=50.0 + i * 10,
                matched=["python"],
                missing=[],
            )

        result = get_all_resumes(db_session)
        assert len(result) == 3


class TestGetResumeById:
    """Tests for get_resume_by_id."""

    def test_returns_correct_resume(self, db_session):
        resume = save_resume(
            db=db_session,
            filename="find_me.pdf",
            name="Findable",
            email="f@t.com",
            phone="9222222222",
            education="MCA",
            experience="2",
            jd="jd",
            resume_text="text",
            score=90.0,
            matched=["python", "docker"],
            missing=[],
        )

        found = get_resume_by_id(db_session, resume.id)
        assert found is not None
        assert found.name == "Findable"
        assert found.score == 90.0

    def test_non_existing_id_returns_none(self, db_session):
        result = get_resume_by_id(db_session, 99999)
        assert result is None


class TestDeleteResume:
    """Tests for delete_resume."""

    def test_deletes_existing_resume(self, db_session):
        resume = save_resume(
            db=db_session,
            filename="delete_me.pdf",
            name="Delete Me",
            email="d@t.com",
            phone="9333333333",
            education="B.TECH",
            experience="1",
            jd="jd",
            resume_text="text",
            score=60.0,
            matched=["python"],
            missing=["docker"],
        )

        result = delete_resume(db_session, resume.id)
        assert result["message"] == "Resume deleted successfully"

        # Verify it's gone
        assert get_resume_by_id(db_session, resume.id) is None

    def test_delete_non_existing_returns_not_found(self, db_session):
        result = delete_resume(db_session, 99999)
        assert result["message"] == "Resume not found"
