import time
from typing import List, Tuple
from unstructured.partition.pdf import partition_pdf


class PDFExtractor:
    """
    PDF text extraction using the Unstructured library.
    """

    def __init__(self):
        self.extractor_name = "unstructured"

    def extract(self, file_path: str) -> dict:
        """
        Extract text from a PDF file.

        Args:
            file_path: Path to the PDF file

        Returns:
            dict with keys:
                - text: Full extracted text
                - page_boundaries: List of (start_char, end_char) for each page
                - total_pages: Number of pages
                - ocr_applied: Whether OCR was used
                - processing_time_ms: Time taken for extraction
        """
        start_time = time.time()

        # Extract elements using unstructured
        elements = partition_pdf(
            filename=file_path,
            strategy="auto",  # Uses OCR if needed
            include_page_breaks=True
        )

        # Process elements to build text and track pages
        text_parts = []
        page_boundaries: List[Tuple[int, int]] = []
        current_page = 1
        current_page_start = 0
        current_position = 0
        ocr_applied = False

        for element in elements:
            # Check if this is a page break
            if element.category == "PageBreak":
                # Record the boundary for the completed page
                page_boundaries.append((current_page_start, current_position))
                current_page += 1
                current_page_start = current_position
                continue

            # Get element text
            element_text = str(element)
            if element_text:
                text_parts.append(element_text)
                current_position += len(element_text) + 1  # +1 for newline

            # Check metadata for OCR
            if hasattr(element, 'metadata') and element.metadata:
                if getattr(element.metadata, 'detection_origin', None) == 'ocr':
                    ocr_applied = True

        # Add final page boundary
        if current_position > current_page_start:
            page_boundaries.append((current_page_start, current_position))

        # Join all text with newlines
        full_text = "\n".join(text_parts)

        processing_time = int((time.time() - start_time) * 1000)

        return {
            "text": full_text,
            "page_boundaries": page_boundaries,
            "total_pages": len(page_boundaries) or 1,
            "ocr_applied": ocr_applied,
            "processing_time_ms": processing_time
        }

    def extract_from_bytes(self, file_bytes: bytes, filename: str) -> dict:
        """
        Extract text from PDF bytes.

        Args:
            file_bytes: PDF file content as bytes
            filename: Original filename for reference

        Returns:
            Same as extract()
        """
        import tempfile
        import os

        # Write bytes to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name

        try:
            return self.extract(tmp_path)
        finally:
            # Clean up temporary file
            os.unlink(tmp_path)
