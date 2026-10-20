# Phone CSV dataset contract

The source CSV will be supplied by the project owner. Keep the original file unchanged in `Datasets/`. The backend should normalize source-specific headers into a canonical phone model; do not couple the frontend to raw CSV column names.

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
