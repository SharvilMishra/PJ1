# Phone catalog notes and import contract

The supplied source is `Datasets/sic_mobile_spec_PJ1.xlsx`, a single-sheet Excel workbook with 413 phone records and 11 columns. Keep the original file unchanged. The backend should normalize source-specific headers into a canonical phone model; do not couple the frontend to raw source column names.

## Source fields and data check

| Source field | Current meaning / issue |
| --- | --- |
| `name` | Unique phone name; 413 distinct values. |
| `rating` | Numeric, 2.9–4.9; no blank values. |
| `price` | 413 populated values, but two are text with a `$` prefix while the other 411 are numbers. The currency is not consistently specified. |
| `camera` | Numeric megapixel-like values; one phone is `0`, which should be confirmed as unknown rather than treated as a real zero. |
| `display_type` | Five labels, including `other_types`; consider preserving the raw label until it is clarified. |
| `display_size` | Numeric values (4.5–7.6); confirm the unit is inches. |
| `battery` | Numeric values (3000–7000); likely mAh, but confirm the unit. |
| `storage` | Mixed numeric and text cells (`64` through `512`, plus `256GB`, `512GB`, `1TB`); normalize to numeric GB. |
| `ram` | Numeric values (2–12); confirm values represent GB. |
| `weight` | Numeric values (138–234); confirm the unit is grams. |
| `processor` | Text values with inconsistent compact naming; normalize whitespace/casing for search without changing the source. |

There are no blank cells or duplicate names/full rows. Before ranking by price or showing formatted specs, confirm price currency and the suspected units above. Treat the zero camera value as unknown until verified. The workbook is currently not loaded by the UI; current phone cards are still placeholder examples.

## Suggested canonical fields

| Field | Meaning |
| --- | --- |
| `id` | Stable unique identifier (or generated from a stable source key) |
| `brand`, `model` | Display name |
| `price` | Numeric price in a single documented currency |
| `category` | Optional category labels |
| `ram_gb`, `storage_gb` | Numeric memory/storage values |
| `battery_mah` | Battery capacity |
| `display_size_in` | Screen diagonal |
| `refresh_rate_hz` | Display refresh rate |
| `camera_main_mp` | Main camera megapixels |
| `processor` | Chipset name |
| `os` | Operating system |
| `image_url` | Optional externally hosted image URL |

These are recommendations, not a requirement that the incoming CSV use these exact headers. Confirm units, missing values, duplicate phones, and currency before implementing the mapping. Avoid inferring absent specs as zero; represent unknown values as null and explain unavailable comparisons in the UI.
