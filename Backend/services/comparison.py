"""Side-by-side comparison of two normalized phone records."""


def compare_phones(first_phone, second_phone):
    """Return comparable fields and per-field differences for two phones."""
    if first_phone.get("id") == second_phone.get("id"):
        raise ValueError("Choose two different phones to compare.")
    fields = (
        "price", "rating", "ramGb", "storageGb", "batteryMah", "displaySizeIn",
        "displayType", "cameraMainMp", "weightG", "processor", "os",
    )
    return {
        field: {"first": first_phone.get(field), "second": second_phone.get(field)}
        for field in fields
    }
