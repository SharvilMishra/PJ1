"""Explainable filtering and ranking against catalog fields and priorities."""


def recommend_phones(phones, requirements):
    """Apply hard requirements, then rank category matches, rating, and price."""
    requirements = requirements or {}
    categories = set(requirements.get("categories") or [])
    query = str(requirements.get("query") or "").strip().casefold()
    brands = {str(brand).casefold() for brand in requirements.get("brands") or []}
    filters = (
        ("maxPrice", "price", lambda value, limit: value is not None and value <= limit),
        ("minPrice", "price", lambda value, limit: value is not None and value >= limit),
        ("minRamGb", "ramGb", lambda value, limit: value is not None and value >= limit),
        ("minStorageGb", "storageGb", lambda value, limit: value is not None and value >= limit),
        ("minBatteryMah", "batteryMah", lambda value, limit: value is not None and value >= limit),
        ("minCameraMainMp", "cameraMainMp", lambda value, limit: value is not None and value >= limit),
    )

    def matches(phone):
        if query and query not in " ".join(str(phone.get(key) or "") for key in ("name", "brand", "model", "processor")).casefold():
            return False
        if brands and str(phone.get("brand") or "").casefold() not in brands:
            return False
        return all(key not in requirements or check(phone.get(field), requirements[key])
                   for key, field, check in filters)

    filtered = [phone for phone in phones if matches(phone)]
    return sorted(filtered, key=lambda phone: (
        -len(categories.intersection(phone.get("categories") or [])),
        -(phone.get("rating") or 0),
        phone.get("price") if phone.get("price") is not None else float("inf"),
    ))
