# Phone catalog notes and import contract

The supplied source is `Datasets/sic_mobile_spec_PJ1.xlsx`, a single-sheet Excel workbook with 413 phone records and 11 columns. Keep the original file unchanged. `scripts/build_phone_catalog.py` normalizes source-specific headers into the shared phone model; do not couple the frontend to raw source column names.

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

There are no blank cells or duplicate names/full rows. The app now uses a generated normalized JSON catalog derived from the workbook; the original workbook remains unchanged. Ranking uses the numeric price values as supplied and displays them without a currency symbol until the currency is confirmed. The camera value `0` is normalized to unknown. RAM, storage, battery, camera, display, weight, and processor drive the actual search and comparison UI.

## Suggested canonical fields

| Field | Meaning |
| --- | --- |
| `id` | Stable unique identifier generated from the source phone name |
| `name`, `brand`, `model` | Source name plus first-token brand and remaining model name |
| `price` | Numeric price in a single documented currency |
| `categories` | Inferred gaming, battery, camera, budget, and flagship tags |
| `ramGb`, `storageGb` | Numeric memory/storage values |
| `batteryMah` | Battery capacity |
| `displaySizeIn`, `displayType` | Display diagonal and source type |
| `cameraMainMp` | Main camera megapixels; zero mapped to null |
| `weightG` | Phone weight |
| `processor` | Source chipset string, formatted for display |
| `rating` | Source rating |
| `os`, `imageUrl` | Null because the source workbook contains no such fields |

These are mapping notes, not a requirement that a future CSV use exact headers. The importer maps the current workbook fields into the canonical names above. It treats absent or unparseable values as null, and storage `1TB` as 1024 GB. Confirm the currency and suspected measurement units before publishing those labels as authoritative.
