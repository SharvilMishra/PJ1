# Application architecture

```text
React + TypeScript frontend
  ├── Firebase Authentication (optional accounts)
  ├── Firebase Cloud Firestore (per-user saved preferences)
  └── JSON API
        ↓
FastAPI backend
  ├── CSV dataset loader and validation
  ├── requirement/category recommendation service
  └── two-phone comparison service
        ↓
Datasets/*.csv (owner-provided catalog)
```

Phone discovery, search, and comparison remain public for guests. Firebase Authentication identifies signed-in users. The frontend stores recommendation categories in the signed-in user's Firestore document, `userPreferences/{uid}`; see [user-preferences.md](user-preferences.md) and [firestore.rules](../firestore.rules). Guest-selected categories are kept in that browser and copied to a new account when it has no saved preference document.

The UI currently ranks sample phone cards by category matches so the preference flow can be used before the CSV arrives. Once the phone dataset is supplied, map its categories and specifications into the canonical model and move ranking into the backend recommendation service so clients share the same results. Do not put Firebase Admin credentials in the browser.

The initial phone catalog remains a read-only CSV. Firestore is used only for user-owned preferences; other persistence can be added when the product needs it.
