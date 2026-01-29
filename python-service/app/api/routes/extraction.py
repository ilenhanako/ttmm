from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional

from app.config import settings
from app.models.schemas import ExtractionResponse, ExtractionMetadata
from app.services.pdf_extractor import PDFExtractor
from app.services.text_chunker import TextChunker

router = APIRouter()

# Maximum file size in bytes
MAX_FILE_SIZE = settings.max_file_size_mb * 1024 * 1024


@router.post("/extract-pdf", response_model=ExtractionResponse)
async def extract_pdf(
    file: UploadFile = File(..., description="PDF file to extract text from"),
    chunk_size: Optional[int] = Form(default=None, description="Chunk size in characters"),
    chunk_overlap: Optional[int] = Form(default=None, description="Overlap between chunks")
) -> ExtractionResponse:
    """
    Extract text from a PDF file and return chunked text for AI processing.

    - **file**: PDF file (max 10MB)
    - **chunk_size**: Size of each text chunk (default: 1000)
    - **chunk_overlap**: Overlap between consecutive chunks (default: 200)
    """
    # Validate file type
    if not file.filename or not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="File must be a PDF document"
        )

    # Read file content
    content = await file.read()

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds maximum allowed size of {settings.max_file_size_mb}MB"
        )

    # Use defaults if not provided
    chunk_size = chunk_size or settings.default_chunk_size
    chunk_overlap = chunk_overlap or settings.default_chunk_overlap

    # Validate chunking parameters
    if chunk_overlap >= chunk_size:
        raise HTTPException(
            status_code=400,
            detail="chunk_overlap must be less than chunk_size"
        )

    try:
        # Extract text from PDF
        extractor = PDFExtractor()
        extraction_result = extractor.extract_from_bytes(content, file.filename)

        # Chunk the extracted text
        chunker = TextChunker(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        chunks = chunker.chunk_text(
            extraction_result["text"],
            extraction_result["page_boundaries"]
        )

        return ExtractionResponse(
            success=True,
            filename=file.filename,
            total_pages=extraction_result["total_pages"],
            total_characters=len(extraction_result["text"]),
            total_chunks=len(chunks),
            chunks=chunks,
            extraction_metadata=ExtractionMetadata(
                extractor="unstructured",
                processing_time_ms=extraction_result["processing_time_ms"],
                ocr_applied=extraction_result["ocr_applied"]
            )
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process PDF: {str(e)}"
        )
