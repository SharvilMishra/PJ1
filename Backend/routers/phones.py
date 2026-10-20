"""Phone catalog, recommendation, and comparison endpoints."""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from Backend.services.catalog import load_catalog
from Backend.services.comparison import compare_phones
from Backend.services.recommendations import recommend_phones

router = APIRouter(tags=["phones"])


class RecommendationRequest(BaseModel):
    query: str | None = None
    categories: list[str] = Field(default_factory=list)
    brands: list[str] = Field(default_factory=list)
    minPrice: float | None = None
    maxPrice: float | None = None
    minRamGb: float | None = None
    minStorageGb: float | None = None
    minBatteryMah: float | None = None
    minCameraMainMp: float | None = None


@router.get("/phones")
def get_phones(query: str | None = None, brand: str | None = None, limit: int | None = Query(None, ge=1, le=1000)):
    requirements = {"query": query, "brands": [brand] if brand else []}
    results = recommend_phones(load_catalog(), requirements)
    return results[:limit] if limit is not None else results


@router.get("/phones/{phone_id}")
def get_phone(phone_id: str):
    phone = next((item for item in load_catalog() if item["id"] == phone_id), None)
    if phone is None:
        raise HTTPException(status_code=404, detail="Phone not found")
    return phone


@router.post("/recommendations")
def get_recommendations(requirements: RecommendationRequest):
    return recommend_phones(load_catalog(), requirements.dict(exclude_none=True))


@router.get("/compare")
def get_comparison(first_id: str, second_id: str):
    catalog = {phone["id"]: phone for phone in load_catalog()}
    first, second = catalog.get(first_id), catalog.get(second_id)
    if first is None or second is None:
        raise HTTPException(status_code=404, detail="Both phone IDs must exist in the catalog")
    try:
        return {"first": first, "second": second, "specifications": compare_phones(first, second)}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
