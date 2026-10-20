# Application architecture

```text
React + TypeScript frontend
  ├── Firebase Authentication (optional accounts)
  ├── Firebase Cloud Firestore (per-user saved preferences)
  └── JSON API
        ↓
FastAPI backend
  ├── normalized workbook catalog loader and validation
  ├── requirement/category recommendation service
  └── two-phone comparison service
        ↓
Datasets/sic_mobile_spec_PJ1.xlsx (source workbook)
```

Phone discovery, search, and comparison remain public for guests. Firebase Authentication identifies signed-in users. The frontend stores recommendation categories in the signed-in user's Firestore document, `userPreferences/{uid}`; see [user-preferences.md](user-preferences.md) and [firestore.rules](../firestore.rules). Guest-selected categories are kept in that browser and copied to a new account when it has no saved preference document. Saved phone and compare selections are currently browser-local.

The supplied workbook is normalized by `scripts/build_phone_catalog.py` into `Frontend/src/data/phones.json`. The frontend imports that shared catalog for static GitHub Pages hosting; FastAPI reads the same JSON for catalog, recommendation, and comparison endpoints. Category tags are derived from measurable fields (RAM, battery, camera, price, and premium price/RAM thresholds), and recommendations are ranked by preference matches, rating, then price. Do not put Firebase Admin credentials in the browser.

The Excel workbook remains the read-only source. Regenerate the normalized JSON after replacing it. Firestore is used only for user-owned preferences; saved and comparison phone IDs remain in the current browser's local storage.
