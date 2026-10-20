# Backend

FastAPI service for catalog normalization, phone recommendations, and two-phone comparisons.

## Local setup

From the project root, create and activate a Python virtual environment, install `requirements.txt`, then run:

```powershell
python -m uvicorn Backend.app:app --reload
```

API docs are available at `http://127.0.0.1:8000/docs`. The catalog routes require a CSV to be added under `Datasets/`; exact headers will be mapped after the dataset is supplied.
