from typing import List, Tuple
from app.models.schemas import TextChunk, ChunkMetadata


class TextChunker:
    """
    Sliding window text chunker with sentence-aware breaking.
    """

    SENTENCE_ENDINGS = (". ", "? ", "! ", ".\n", "?\n", "!\n")

    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        if chunk_overlap >= chunk_size:
            raise ValueError("chunk_overlap must be less than chunk_size")
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def find_sentence_boundary(self, text: str, target_pos: int, search_range: int = 100) -> int:
        """
        Find the nearest sentence boundary near target_pos.
        Searches within search_range characters before target_pos.
        Returns the position after the sentence ending, or target_pos if no boundary found.
        """
        search_start = max(0, target_pos - search_range)
        search_text = text[search_start:target_pos]

        best_pos = -1
        for ending in self.SENTENCE_ENDINGS:
            pos = search_text.rfind(ending)
            if pos > best_pos:
                best_pos = pos

        if best_pos != -1:
            return search_start + best_pos + len(text[search_start + best_pos:].split()[0]) + 1 if best_pos >= 0 else target_pos

        return target_pos

    def chunk_text(
        self,
        text: str,
        page_boundaries: List[Tuple[int, int]] = None
    ) -> List[TextChunk]:
        """
        Split text into overlapping chunks.

        Args:
            text: The full text to chunk
            page_boundaries: Optional list of (start_char, end_char) tuples for each page

        Returns:
            List of TextChunk objects
        """
        if not text or not text.strip():
            return []

        chunks = []
        text_length = len(text)
        start = 0
        index = 0

        while start < text_length:
            # Calculate end position
            end = min(start + self.chunk_size, text_length)

            # Try to break at sentence boundary if not at the end
            if end < text_length:
                # Look for sentence boundary near the end
                boundary = self._find_best_break_point(text, end)
                if boundary > start:
                    end = boundary

            # Extract chunk content
            content = text[start:end]

            # Determine page numbers for this chunk
            page_numbers = self._get_page_numbers(start, end, page_boundaries)

            # Create metadata
            metadata = ChunkMetadata(
                has_overlap_with_previous=index > 0,
                has_overlap_with_next=end < text_length
            )

            chunks.append(TextChunk(
                index=index,
                content=content,
                start_char=start,
                end_char=end,
                page_numbers=page_numbers,
                metadata=metadata
            ))

            # Move start position with overlap
            start = end - self.chunk_overlap if end < text_length else text_length
            index += 1

        return chunks

    def _find_best_break_point(self, text: str, target_pos: int) -> int:
        """
        Find the best break point near target_pos, preferring sentence boundaries.
        """
        search_range = min(100, self.chunk_overlap)
        search_start = max(0, target_pos - search_range)
        search_text = text[search_start:target_pos]

        best_pos = -1
        for ending in self.SENTENCE_ENDINGS:
            pos = search_text.rfind(ending)
            if pos > best_pos:
                best_pos = pos
                best_ending = ending

        if best_pos != -1:
            # Return position after the sentence ending
            return search_start + best_pos + len(best_ending)

        return target_pos

    def _get_page_numbers(
        self,
        start: int,
        end: int,
        page_boundaries: List[Tuple[int, int]] = None
    ) -> List[int]:
        """
        Determine which pages a chunk spans based on character positions.
        """
        if not page_boundaries:
            return [1]

        pages = []
        for page_num, (page_start, page_end) in enumerate(page_boundaries, start=1):
            # Check if chunk overlaps with this page
            if start < page_end and end > page_start:
                pages.append(page_num)

        return pages if pages else [1]
