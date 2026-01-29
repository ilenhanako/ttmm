from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    app_name: str = "TTMM PDF Extraction Service"
    debug: bool = False

    # CORS settings
    cors_origins: List[str] = [
        "http://localhost:3000",
        "https://ttmm.vercel.app"
    ]

    # File upload settings
    max_file_size_mb: int = 10

    # Chunking defaults
    default_chunk_size: int = 1000
    default_chunk_overlap: int = 200

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
