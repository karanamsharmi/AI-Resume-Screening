"""
Unit tests for the recommendation service.

Covers:
  - Known skills return correct recommendations
  - Unknown skills return the default message
  - Multiple skills aggregate recommendations
  - Duplicate recommendations are removed
  - Empty input returns default message
"""

import pytest

from app.services.recommendation_service import (
    get_recommendations,
    SKILL_RECOMMENDATIONS,
)


class TestGetRecommendations:
    """Tests for get_recommendations."""

    def test_known_skill_returns_recommendations(self):
        """A known missing skill produces the mapped recommendations."""
        result = get_recommendations(["python"])
        assert "Learn Advanced Python" in result
        assert "Practice Python coding on LeetCode" in result
        assert "Build Python automation projects" in result

    def test_unknown_skill_returns_default(self):
        """Skills not in the map produce the default 'Great Resume' message."""
        result = get_recommendations(["quantum computing"])
        assert "Great Resume! No major skill gaps found." in result

    def test_empty_missing_skills(self):
        """Empty list returns the default message."""
        result = get_recommendations([])
        assert "Great Resume! No major skill gaps found." in result

    def test_multiple_skills(self):
        """Multiple missing skills aggregate their recommendations."""
        result = get_recommendations(["python", "docker"])
        assert "Learn Advanced Python" in result
        assert "Learn Docker Basics" in result

    def test_no_duplicate_recommendations(self):
        """Recommendations list has no duplicates."""
        result = get_recommendations(["docker", "docker"])
        assert len(result) == len(set(result))

    def test_case_insensitive_lookup(self):
        """Skill lookup is case-insensitive (lowercased internally)."""
        result = get_recommendations(["PYTHON"])
        assert "Learn Advanced Python" in result

    def test_whitespace_handling(self):
        """Whitespace around skill names is stripped."""
        result = get_recommendations(["  git  "])
        assert "Practice Git Commands" in result

    def test_returns_list(self):
        """Return type is always a list."""
        result = get_recommendations(["python"])
        assert isinstance(result, list)

    def test_mixed_known_and_unknown_skills(self):
        """Mix of known and unknown skills returns only known recommendations."""
        result = get_recommendations(["python", "blockchain"])
        assert "Learn Advanced Python" in result
        assert "Great Resume! No major skill gaps found." not in result
