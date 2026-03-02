from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:8081"]
    FDC_API_KEY: str = ""

    model_config = {"env_file": ".env", "case_sensitive": True}


settings = Settings()
