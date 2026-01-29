from pydantic import BaseModel, Field
from typing import List, Optional


class ChunkMetadata(BaseModel):
    has_overlap_with_previous: bool
    has_overlap_with_next: bool


class TextChunk(BaseModel):
    index: int
    content: str
    start_char: int
    end_char: int
    page_numbers: List[int]
    metadata: ChunkMetadata


class ExtractionMetadata(BaseModel):
    extractor: str = "unstructured"
    processing_time_ms: int
    ocr_applied: bool


class ExtractionResponse(BaseModel):
    success: bool
    filename: str
    total_pages: int
    total_characters: int
    total_chunks: int
    chunks: List[TextChunk]
    extraction_metadata: ExtractionMetadata


class ExtractionErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[str] = None


class HealthResponse(BaseModel):
    status: str = "healthy"
    service: str = "ttmm-pdf-extraction"
    version: str = "1.0.0"
