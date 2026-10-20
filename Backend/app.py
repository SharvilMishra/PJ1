"""Starter API for the ELYVEX phone catalog."""
from fastapi import FastAPI

app = FastAPI(title="ELYVEX API", version="0.1.0")


@app.get("/api/health", tags=["health"])
def health() -> dict[str, str]:
    """Basic service health; dataset readiness will be reported when wired in."""
    return {"status": "ok", "catalog": "not_configured"}

