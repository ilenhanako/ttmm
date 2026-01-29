import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)


@pytest.fixture
def sample_text():
    """Sample text for chunking tests."""
    return (
        "Meeting Minutes - Q1 Planning Session. "
        "Date: January 15, 2024. Attendees: John, Jane, Bob. "
        "The team discussed the roadmap for Q1. "
        "Action items were assigned to each team member. "
        "Next meeting scheduled for January 22, 2024. "
        "End of meeting notes."
    )


@pytest.fixture
def long_sample_text():
    """Longer sample text that will require multiple chunks."""
    paragraph = (
        "This is a test paragraph for the text chunking algorithm. "
        "It contains multiple sentences to test sentence boundary detection. "
        "The chunker should break at appropriate points. "
        "This helps ensure context is preserved across chunks. "
    )
    # Repeat to create text longer than default chunk size
    return paragraph * 10
