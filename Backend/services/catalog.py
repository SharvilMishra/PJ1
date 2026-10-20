"""Load the shared normalized phone catalog generated from the source workbook."""

import json
from functools import lru_cache
from pathlib import Path

CATALOG_PATH = Path(__file__).resolve().parents[2] / "Frontend" / "src" / "data" / "phones.json"


@lru_cache(maxsize=1)
def load_catalog() -> list[dict]:
    """Return normalized records, shared with the static frontend."""
    with CATALOG_PATH.open(encoding="utf-8") as source:
        return json.load(source)
