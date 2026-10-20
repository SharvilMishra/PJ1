"""Starter API for the ELYVEX phone catalog."""
from fastapi import FastAPI
from Backend.routers.phones import router as phones_router

app = FastAPI(title="ELYVEX API", version="0.1.0")
app.include_router(phones_router, prefix="/api")


@app.get("/api/health", tags=["health"])
def health() -> dict[str, str | int]:
    """Report whether the normalized dataset is available."""
    from Backend.services.catalog import load_catalog

    return {"status": "ok", "catalog": "ready", "phone_count": len(load_catalog())}

