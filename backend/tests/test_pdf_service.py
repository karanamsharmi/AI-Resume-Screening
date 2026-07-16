"""
Unit tests for the PDF service (save_pdf, extract_text).

Covers:
  - File saving to disk with correct content
  - File saving creates the uploads directory if needed
  - Text extraction from a real (minimal) PDF
  - Handling of empty / multi-page PDFs
"""

import os
import pytest
import fitz  # PyMuPDF

from unittest.mock import AsyncMock, MagicMock, patch

from app.services.pdf_service import save_pdf, extract_text


# ─── save_pdf tests ─────────────────────────────────────────────────

class TestSavePdf:
    """Tests for the async save_pdf function."""

    @pytest.mark.asyncio
    async def test_save_pdf_writes_file(self, tmp_path):
        """File bytes are written to uploads/<filename>."""
        mock_file = AsyncMock()
        mock_file.filename = "resume.pdf"
        mock_file.read.return_value = b"%PDF-1.4 fake content"

        with patch("app.services.pdf_service.UPLOAD_FOLDER", str(tmp_path)):
            result_path = await save_pdf(mock_file)

        assert os.path.exists(result_path)
        with open(result_path, "rb") as f:
            assert f.read() == b"%PDF-1.4 fake content"

    @pytest.mark.asyncio
    async def test_save_pdf_returns_correct_path(self, tmp_path):
        """Returned path is <UPLOAD_FOLDER>/<filename>."""
        mock_file = AsyncMock()
        mock_file.filename = "test_cv.pdf"
        mock_file.read.return_value = b"data"

        with patch("app.services.pdf_service.UPLOAD_FOLDER", str(tmp_path)):
            result_path = await save_pdf(mock_file)

        expected = os.path.join(str(tmp_path), "test_cv.pdf")
        assert result_path == expected

    @pytest.mark.asyncio
    async def test_save_pdf_preserves_filename(self, tmp_path):
        """Original filename is preserved (no sanitisation in current impl)."""
        mock_file = AsyncMock()
        mock_file.filename = "my resume (2).pdf"
        mock_file.read.return_value = b"pdf bytes"

        with patch("app.services.pdf_service.UPLOAD_FOLDER", str(tmp_path)):
            result_path = await save_pdf(mock_file)

        assert os.path.basename(result_path) == "my resume (2).pdf"

    @pytest.mark.asyncio
    async def test_save_pdf_overwrites_existing_file(self, tmp_path):
        """If a file with the same name exists, it is overwritten."""
        existing = tmp_path / "dup.pdf"
        existing.write_bytes(b"old data")

        mock_file = AsyncMock()
        mock_file.filename = "dup.pdf"
        mock_file.read.return_value = b"new data"

        with patch("app.services.pdf_service.UPLOAD_FOLDER", str(tmp_path)):
            await save_pdf(mock_file)

        assert existing.read_bytes() == b"new data"

    @pytest.mark.asyncio
    async def test_save_pdf_empty_file(self, tmp_path):
        """An empty upload still creates a file (0 bytes)."""
        mock_file = AsyncMock()
        mock_file.filename = "empty.pdf"
        mock_file.read.return_value = b""

        with patch("app.services.pdf_service.UPLOAD_FOLDER", str(tmp_path)):
            result_path = await save_pdf(mock_file)

        assert os.path.getsize(result_path) == 0


# ─── extract_text tests ────────────────────────────────────────────

def _create_pdf(path, pages_text):
    """Helper: create a real PDF with the given text per page."""
    doc = fitz.open()
    for text in pages_text:
        page = doc.new_page()
        page.insert_text((72, 72), text)
    doc.save(str(path))
    doc.close()


class TestExtractText:
    """Tests for the extract_text function."""

    def test_extract_text_single_page(self, tmp_path):
        """Single-page PDF returns the inserted text."""
        pdf_path = tmp_path / "single.pdf"
        _create_pdf(pdf_path, ["Hello World"])

        text = extract_text(str(pdf_path))
        assert "Hello World" in text

    def test_extract_text_multi_page(self, tmp_path):
        """Multi-page PDF returns text from all pages."""
        pdf_path = tmp_path / "multi.pdf"
        _create_pdf(pdf_path, ["Page One Content", "Page Two Content"])

        text = extract_text(str(pdf_path))
        assert "Page One Content" in text
        assert "Page Two Content" in text

    def test_extract_text_empty_pdf(self, tmp_path):
        """PDF with no text returns an empty string."""
        pdf_path = tmp_path / "empty.pdf"
        _create_pdf(pdf_path, [""])

        text = extract_text(str(pdf_path))
        assert text.strip() == ""

    def test_extract_text_returns_string(self, tmp_path):
        """Return type is always str."""
        pdf_path = tmp_path / "type.pdf"
        _create_pdf(pdf_path, ["some text"])

        result = extract_text(str(pdf_path))
        assert isinstance(result, str)

    def test_extract_text_special_characters(self, tmp_path):
        """Special characters are preserved."""
        pdf_path = tmp_path / "special.pdf"
        _create_pdf(pdf_path, ["john.doe@email.com +91-9876543210"])

        text = extract_text(str(pdf_path))
        assert "john.doe@email.com" in text
        assert "+91-9876543210" in text
