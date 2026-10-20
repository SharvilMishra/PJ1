# Backend

FastAPI service for catalog normalization, phone recommendations, and two-phone comparisons.

## Local setup

From the project root, create and activate a Python virtual environment, install `requirements.txt`, then run:

```powershell
python -m uvicorn Backend.app:app --reload
```

API docs are available at `http://127.0.0.1:8000/docs`. The API and frontend use the normalized catalog generated from `Datasets/sic_mobile_spec_PJ1.xlsx`. To regenerate it after updating the source workbook, run `python scripts/build_phone_catalog.py` from the repository root.

Available endpoints include `GET /api/phones`, `GET /api/phones/{phone_id}`, `POST /api/recommendations`, and `GET /api/compare?first_id=…&second_id=…`.
