# TTMM PDF Extraction Service

FastAPI service for extracting text from PDF meeting minutes using the Unstructured library.

## Features

- PDF text extraction with OCR support
- Configurable text chunking with overlap
- Sentence-aware chunk boundaries
- Page number tracking per chunk

## Quick Start

### Local Development

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

### Docker

```bash
# Build the image
docker build -t ttmm-pdf-service .

# Run the container
docker run -p 8000:8000 ttmm-pdf-service
```

## API Endpoints

### GET /health

Health check endpoint for container orchestration.

```bash
curl http://localhost:8000/health
```

### POST /extract-pdf

Extract text from a PDF file and return chunked text.

**Parameters:**
- `file`: PDF file (required, max 10MB)
- `chunk_size`: Size of each text chunk in characters (optional, default: 1000)
- `chunk_overlap`: Overlap between chunks in characters (optional, default: 200)

```bash
curl -X POST "http://localhost:8000/extract-pdf" \
  -F "file=@meeting.pdf" \
  -F "chunk_size=1000" \
  -F "chunk_overlap=200"
```

## Testing

```bash
pytest tests/ -v
```

## Environment Variables

See `.env.example` for available configuration options.

## API Documentation

Interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
