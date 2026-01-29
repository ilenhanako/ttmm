from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.routes import health, extraction

app = FastAPI(
    title=settings.app_name,
    description="PDF extraction service for TTMM meeting minutes",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(extraction.router, tags=["Extraction"])


@app.get("/")
async def root():
    return {
        "service": settings.app_name,
        "status": "running",
        "docs": "/docs"
    }
