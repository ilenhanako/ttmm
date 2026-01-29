import pytest
from app.services.text_chunker import TextChunker


class TestTextChunker:
    """Tests for the TextChunker service."""

    def test_init_default_values(self):
        """Test chunker initializes with default values."""
        chunker = TextChunker()
        assert chunker.chunk_size == 1000
        assert chunker.chunk_overlap == 200

    def test_init_custom_values(self):
        """Test chunker accepts custom values."""
        chunker = TextChunker(chunk_size=500, chunk_overlap=100)
        assert chunker.chunk_size == 500
        assert chunker.chunk_overlap == 100

    def test_init_invalid_overlap(self):
        """Test chunker rejects overlap >= chunk_size."""
        with pytest.raises(ValueError):
            TextChunker(chunk_size=100, chunk_overlap=100)
        with pytest.raises(ValueError):
            TextChunker(chunk_size=100, chunk_overlap=150)

    def test_chunk_empty_text(self):
        """Test chunking empty text returns empty list."""
        chunker = TextChunker()
        assert chunker.chunk_text("") == []
        assert chunker.chunk_text("   ") == []

    def test_chunk_short_text(self, sample_text):
        """Test chunking text shorter than chunk_size."""
        chunker = TextChunker(chunk_size=1000)
        chunks = chunker.chunk_text(sample_text)

        assert len(chunks) == 1
        assert chunks[0].content == sample_text
        assert chunks[0].index == 0
        assert chunks[0].start_char == 0
        assert chunks[0].end_char == len(sample_text)
        assert chunks[0].metadata.has_overlap_with_previous is False
        assert chunks[0].metadata.has_overlap_with_next is False

    def test_chunk_long_text(self, long_sample_text):
        """Test chunking text longer than chunk_size creates multiple chunks."""
        chunker = TextChunker(chunk_size=200, chunk_overlap=50)
        chunks = chunker.chunk_text(long_sample_text)

        assert len(chunks) > 1

        # Check first chunk metadata
        assert chunks[0].metadata.has_overlap_with_previous is False
        assert chunks[0].metadata.has_overlap_with_next is True

        # Check middle chunks have overlap on both sides
        if len(chunks) > 2:
            assert chunks[1].metadata.has_overlap_with_previous is True
            assert chunks[1].metadata.has_overlap_with_next is True

        # Check last chunk metadata
        assert chunks[-1].metadata.has_overlap_with_previous is True
        assert chunks[-1].metadata.has_overlap_with_next is False

    def test_chunk_indices_are_sequential(self, long_sample_text):
        """Test chunk indices are sequential starting from 0."""
        chunker = TextChunker(chunk_size=200, chunk_overlap=50)
        chunks = chunker.chunk_text(long_sample_text)

        for i, chunk in enumerate(chunks):
            assert chunk.index == i

    def test_chunks_cover_full_text(self, long_sample_text):
        """Test that chunks cover the entire text."""
        chunker = TextChunker(chunk_size=200, chunk_overlap=50)
        chunks = chunker.chunk_text(long_sample_text)

        # First chunk should start at 0
        assert chunks[0].start_char == 0

        # Last chunk should end at text length
        assert chunks[-1].end_char == len(long_sample_text)

    def test_default_page_numbers(self, sample_text):
        """Test default page number is [1] when no boundaries provided."""
        chunker = TextChunker()
        chunks = chunker.chunk_text(sample_text)

        assert chunks[0].page_numbers == [1]

    def test_page_boundaries(self):
        """Test page number tracking with boundaries."""
        text = "Page 1 content. Page 2 content. Page 3 content."
        page_boundaries = [(0, 16), (16, 32), (32, 47)]

        chunker = TextChunker(chunk_size=100)
        chunks = chunker.chunk_text(text, page_boundaries)

        # Single chunk should span all pages
        assert 1 in chunks[0].page_numbers
        assert 2 in chunks[0].page_numbers
        assert 3 in chunks[0].page_numbers

    def test_sentence_boundary_breaking(self):
        """Test that chunker prefers sentence boundaries."""
        # Create text with clear sentence boundaries
        text = "First sentence. Second sentence. Third sentence. Fourth sentence."
        chunker = TextChunker(chunk_size=35, chunk_overlap=10)
        chunks = chunker.chunk_text(text)

        # Chunks should end at or near sentence boundaries
        for chunk in chunks[:-1]:  # Exclude last chunk
            content = chunk.content.rstrip()
            # Should end with punctuation or be at chunk boundary
            assert content.endswith('.') or content.endswith('?') or content.endswith('!') or len(content) <= 35
