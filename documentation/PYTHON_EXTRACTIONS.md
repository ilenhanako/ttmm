# Python PDF Extraction Service

## Overview
Create a FastAPI service that extracts text from PDF meeting minutes using the Unstructured library and returns chunked text for downstream AI processing.

## Project Location
Create new directory: `python-service/` at the root level (sibling to the Next.js app)

## Project Structure
```
python-service/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app with CORS
│   ├── config.py               # Environment configuration
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── health.py       # GET /health
│   │       └── extraction.py   # POST /extract-pdf
│   ├── services/
│   │   ├── __init__.py
│   │   ├── pdf_extractor.py    # Unstructured PDF parsing
│   │   └── text_chunker.py     # Text chunking algorithm
│   └── models/
│       ├── __init__.py
│       └── schemas.py          # Pydantic models
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_extraction.py
│   └── test_chunker.py
├── requirements.txt
├── Dockerfile
├── .env.example
└── README.md
```

## Dependencies (requirements.txt)
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-multipart==0.0.6
unstructured[pdf]==0.12.0
pdf2image==1.17.0
pytesseract==0.3.10
pillow==10.2.0
pydantic==2.5.3
pydantic-settings==2.1.0
pytest==7.4.4
pytest-asyncio==0.23.3
httpx==0.26.0
python-dotenv==1.0.0
```

## API Endpoints

### POST /extract-pdf
**Request:** `multipart/form-data`
- `file`: PDF file (required, max 10MB)
- `chunk_size`: int (optional, default 1000)
- `chunk_overlap`: int (optional, default 200)

**Response (200):**
```json
{
  "success": true,
  "filename": "meeting.pdf",
  "total_pages": 3,
  "total_characters": 4523,
  "total_chunks": 6,
  "chunks": [
    {
      "index": 0,
      "content": "Meeting Minutes - Q1 Planning...",
      "start_char": 0,
      "end_char": 1000,
      "page_numbers": [1],
      "metadata": {
        "has_overlap_with_previous": false,
        "has_overlap_with_next": true
      }
    }
  ],
  "extraction_metadata": {
    "extractor": "unstructured",
    "processing_time_ms": 1234,
    "ocr_applied": false
  }
}
```

**Error Responses:**
| Status | Error Code | Description |
|--------|------------|-------------|
| 400 | INVALID_FILE_TYPE | Only PDF files are accepted |
| 400 | FILE_TOO_LARGE | File exceeds 10MB limit |
| 400 | INVALID_CHUNK_PARAMS | chunk_overlap must be less than chunk_size |
| 500 | EXTRACTION_FAILED | Failed to extract text from PDF |

### GET /health
Returns service health status for container orchestration.

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-25T10:30:00Z"
}
```

## Text Chunking Algorithm
- Sliding window: 1000 chars with 200 char overlap
- Sentence-aware breaking (tries to break at `. `, `? `, `! `)
- Tracks overlap metadata for each chunk

```
Text: [============================================]
Chunk 0: [0 --------- 1000]
Chunk 1:     [800 --------- 1800]     (200 overlap)
Chunk 2:         [1600 --------- 2600]
...
```

## Implementation Order

### 1. Project Setup
- [ ] Create `python-service/` directory
- [ ] Create virtual environment
- [ ] Create `requirements.txt`
- [ ] Install dependencies

### 2. Core Application
- [ ] Create `app/main.py` - FastAPI app with CORS middleware
- [ ] Create `app/config.py` - Settings with pydantic-settings
- [ ] Create `app/models/schemas.py` - Pydantic models

### 3. Services
- [ ] Create `app/services/text_chunker.py` - Chunking algorithm
- [ ] Create `app/services/pdf_extractor.py` - Unstructured integration

### 4. API Routes
- [ ] Create `app/api/routes/health.py` - Health check
- [ ] Create `app/api/routes/extraction.py` - PDF extraction endpoint

### 5. Testing
- [ ] Create `tests/test_chunker.py` - Unit tests for chunking
- [ ] Create `tests/test_extraction.py` - Integration tests
- [ ] Test with sample PDFs

### 6. Docker & Deployment
- [ ] Create `Dockerfile` with system dependencies
- [ ] Create `.env.example`
- [ ] Test Docker build locally

## CORS Configuration
```python
allow_origins=["http://localhost:3000", "https://ttmm.vercel.app"]
allow_methods=["GET", "POST"]
```

## Dockerfile
```dockerfile
FROM python:3.11-slim

# Install system dependencies for Unstructured
RUN apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Verification
1. `pip install -r requirements.txt` — dependencies install
2. `uvicorn app.main:app --reload` — server starts on port 8000
3. `curl http://localhost:8000/health` — returns healthy
4. Upload PDF via curl or Postman to `/extract-pdf` — returns chunks
5. `pytest tests/ -v` — all tests pass
6. `docker build -t ttmm-pdf-service .` — Docker builds successfully
