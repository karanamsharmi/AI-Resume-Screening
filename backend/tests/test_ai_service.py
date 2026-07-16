"""
Unit tests for the AI service (calculate_score) and parser service.

Covers:
  - Skill matching logic (matched / missing)
  - Score calculation (0%, partial, 100%)
  - Rating thresholds (Excellent, Good, Average, Needs Improvement)
  - Edge cases (no skills in JD, empty resume)
  - Resume detail extraction (name, email, phone, education, experience)
"""

import pytest

from app.services.ai_service import calculate_score, SKILLS
from app.services.parser_service import (
    parse_resume,
    extract_name,
    extract_email,
    extract_phone,
    extract_education,
    extract_experience,
)


# ═══════════════════════════════════════════════════════════════════
# Parser Service Tests
# ═══════════════════════════════════════════════════════════════════

class TestExtractName:
    """Tests for extract_name."""

    def test_extracts_first_line(self):
        assert extract_name("John Doe\nEngineer") == "John Doe"

    def test_empty_text_returns_unknown(self):
        assert extract_name("") == "Unknown"

    def test_whitespace_only_returns_unknown(self):
        assert extract_name("   \n   \n   ") == "Unknown"

    def test_single_line(self):
        assert extract_name("Jane Smith") == "Jane Smith"


class TestExtractEmail:
    """Tests for extract_email."""

    def test_standard_email(self):
        assert extract_email("Contact: user@example.com") == "user@example.com"

    def test_email_with_dots_and_dashes(self):
        result = extract_email("john.doe-work@company.co.in")
        assert result == "john.doe-work@company.co.in"

    def test_no_email_returns_empty(self):
        assert extract_email("No email here") == ""

    def test_multiple_emails_returns_first(self):
        text = "primary@a.com and secondary@b.com"
        result = extract_email(text)
        assert result == "primary@a.com"


class TestExtractPhone:
    """Tests for extract_phone."""

    def test_indian_mobile_with_prefix(self):
        result = extract_phone("Call me: +91 9876543210")
        assert "9876543210" in result

    def test_indian_mobile_without_prefix(self):
        result = extract_phone("Phone: 9876543210")
        assert "9876543210" in result

    def test_no_phone_returns_empty(self):
        assert extract_phone("No phone number here") == ""

    def test_invalid_starting_digit(self):
        """Indian mobile numbers start with 6-9."""
        assert extract_phone("Phone: 1234567890") == ""


class TestExtractEducation:
    """Tests for extract_education."""

    def test_btech_detected(self):
        result = extract_education("Completed B.Tech in CS")
        assert "B.TECH" in result

    def test_multiple_qualifications(self):
        text = "B.Tech, MCA, 12th, 10th completed"
        result = extract_education(text)
        assert "B.TECH" in result
        assert "MCA" in result
        assert "12TH" in result
        assert "10TH" in result

    def test_no_education_returns_empty_list(self):
        assert extract_education("No education info") == []

    def test_case_insensitive(self):
        result = extract_education("did btech and DIPLOMA")
        assert "BTECH" in result
        assert "DIPLOMA" in result


class TestExtractExperience:
    """Tests for extract_experience."""

    def test_years_pattern(self):
        result = extract_experience("3+ years of experience")
        assert "3" in result

    def test_multiple_experience_entries(self):
        text = "2 years at Company A. 5 years at Company B."
        result = extract_experience(text)
        assert "2" in result
        assert "5" in result

    def test_no_experience_returns_empty_list(self):
        assert extract_experience("Fresh graduate") == []

    def test_yrs_abbreviation(self):
        result = extract_experience("10 yrs in industry")
        assert "10" in result


class TestParseResume:
    """Tests for parse_resume (integration of all extractors)."""

    def test_full_resume_parse(self, sample_resume_text):
        result = parse_resume(sample_resume_text)

        assert result["name"] == "John Doe"
        assert result["email"] == "john.doe@example.com"
        assert "9876543210" in result["phone"]
        assert "B.TECH" in result["education"]
        assert "3" in result["experience"]

    def test_returns_all_required_keys(self, sample_resume_text):
        result = parse_resume(sample_resume_text)
        expected_keys = {"name", "email", "phone", "education", "experience"}
        assert set(result.keys()) == expected_keys


# ═══════════════════════════════════════════════════════════════════
# AI Service – calculate_score Tests
# ═══════════════════════════════════════════════════════════════════

class TestCalculateScore:
    """Tests for calculate_score."""

    def test_full_match_returns_100(self):
        """All JD skills found in resume → 100%."""
        jd = "python git"
        resume = "I know python and git very well"
        result = calculate_score(jd, resume)

        assert result["score"] == 100.0
        assert result["rating"] == "Excellent"
        assert len(result["missing"]) == 0

    def test_no_match_returns_0(self):
        """No JD skills found in resume → 0%."""
        jd = "kubernetes terraform"
        resume = "I like painting and cooking"
        result = calculate_score(jd, resume)

        assert result["score"] == 0
        assert result["rating"] == "Needs Improvement"
        assert set(result["matched"]) == set()

    def test_partial_match(self):
        """Some skills matched, some missing."""
        jd = "python git sql"
        resume = "I know python and git well"
        result = calculate_score(jd, resume)

        assert "python" in result["matched"]
        assert "git" in result["matched"]
        assert "sql" in result["missing"]
        assert result["score"] == pytest.approx(66.67, abs=0.01)

    def test_score_excellent_threshold(self):
        """Score >= 80 → Excellent rating."""
        # 4 out of 5 skills = 80%
        jd = "python git sql linux aws"
        resume = "python git sql linux expert"
        result = calculate_score(jd, resume)

        assert result["rating"] == "Excellent"

    def test_score_good_threshold(self):
        """Score 60-79 → Good rating."""
        # 3 out of 5 = 60%
        jd = "python git sql linux aws"
        resume = "I know python git sql well"
        result = calculate_score(jd, resume)

        assert result["rating"] == "Good"

    def test_score_average_threshold(self):
        """Score 40-59 → Average rating."""
        # 2 out of 5 = 40%
        jd = "python git sql linux aws"
        resume = "I know python and git"
        result = calculate_score(jd, resume)

        assert result["rating"] == "Average"

    def test_score_needs_improvement_threshold(self):
        """Score < 40 → Needs Improvement."""
        # 1 out of 5 = 20%
        jd = "python git sql linux docker"
        resume = "I only know python"
        result = calculate_score(jd, resume)

        assert result["rating"] == "Needs Improvement"

    def test_no_skills_in_jd(self):
        """JD with no recognizable skills → score 0."""
        jd = "We need someone who is a team player"
        resume = "I know python and docker"
        result = calculate_score(jd, resume)

        assert result["score"] == 0

    def test_result_contains_resume_details(self, sample_resume_text):
        """Result includes parsed resume details."""
        jd = "python developer"
        result = calculate_score(jd, sample_resume_text)

        assert "resume" in result
        assert "name" in result["resume"]
        assert "email" in result["resume"]

    def test_result_structure(self):
        """Result dict has all required keys."""
        result = calculate_score("python", "python developer")
        expected_keys = {"resume", "score", "rating", "matched", "missing"}
        assert set(result.keys()) == expected_keys

    def test_case_insensitive_matching(self):
        """Skill matching is case-insensitive."""
        jd = "PYTHON DOCKER"
        resume = "python docker"
        result = calculate_score(jd, resume)

        assert result["score"] == 100.0

    def test_matched_and_missing_are_lists(self):
        """matched and missing are always lists."""
        result = calculate_score("python docker", "python expert")
        assert isinstance(result["matched"], list)
        assert isinstance(result["missing"], list)
