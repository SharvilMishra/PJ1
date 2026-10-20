"""Side-by-side comparison of two normalized phone records."""


def compare_phones(first_phone, second_phone):
    """Return comparable fields and per-field differences for two phones."""
    if first_phone.get("id") == second_phone.get("id"):
        raise ValueError("Choose two different phones to compare.")
    fields = (
        "price", "ram_gb", "storage_gb", "battery_mah", "display_size_in",
        "refresh_rate_hz", "camera_main_mp", "processor", "os",
    )
    return {
        field: {"first": first_phone.get(field), "second": second_phone.get(field)}
        for field in fields
    }
