import pytest
from fastapi.testclient import TestClient


class TestHealthEndpoint:
    """Tests for the health check endpoint."""

    def test_health_check(self, client):
        """Test health endpoint returns healthy status."""
        response = client.get("/health")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "ttmm-pdf-extraction"
        assert "version" in data


class TestRootEndpoint:
    """Tests for the root endpoint."""

    def test_root(self, client):
        """Test root endpoint returns service info."""
        response = client.get("/")

        assert response.status_code == 200
        data = response.json()
        assert "service" in data
        assert data["status"] == "running"
        assert data["docs"] == "/docs"


class TestExtractionEndpoint:
    """Tests for the PDF extraction endpoint."""

    def test_extract_no_file(self, client):
        """Test extraction endpoint requires a file."""
        response = client.post("/extract-pdf")

        assert response.status_code == 422  # Validation error

    def test_extract_non_pdf_file(self, client):
        """Test extraction endpoint rejects non-PDF files."""
        response = client.post(
            "/extract-pdf",
            files={"file": ("test.txt", b"Hello world", "text/plain")}
        )

        assert response.status_code == 400
        assert "PDF" in response.json()["detail"]

    def test_extract_invalid_chunk_params(self, client):
        """Test extraction endpoint validates chunk parameters."""
        # Create a minimal PDF-like content (just for testing the validation)
        pdf_content = b"%PDF-1.4 test"

        response = client.post(
            "/extract-pdf",
            files={"file": ("test.pdf", pdf_content, "application/pdf")},
            data={"chunk_size": "100", "chunk_overlap": "150"}
        )

        assert response.status_code == 400
        assert "chunk_overlap" in response.json()["detail"]

    def test_extract_file_too_large(self, client):
        """Test extraction endpoint rejects files over size limit."""
        # Create content larger than 10MB
        large_content = b"%PDF-1.4" + (b"x" * (11 * 1024 * 1024))

        response = client.post(
            "/extract-pdf",
            files={"file": ("large.pdf", large_content, "application/pdf")}
        )

        assert response.status_code == 400
        assert "size" in response.json()["detail"].lower()
