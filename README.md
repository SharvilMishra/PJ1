# ELYVEX

ELYVEX helps people discover, rank, and compare mobile phones from the supplied catalog. Anyone can browse, search, filter, view phone details, and compare two devices. Signing in is required to save a personalized recommendation profile.

## Features

- Browse the catalog and filter phones by price, brand, category, and specifications.
- View detailed phone specifications and compare two selected phones.
- Get a top-five recommendation list based on a selected persona and maximum price.
- Save a persona, budget, and additional category priorities to the signed-in user's Firebase account.
- See the score for each recommendation and expand its breakdown to inspect each weighted contribution and missing specification.
- Use the app as a guest for browsing. Sign in with Firebase to save and sync a recommendation profile.

## Recommendation model

The recommender supports Student, Creator, Gaming, Business Professional, and Senior personas. Each persona has a weighted profile across price, rating, RAM, storage, battery, camera, and (for Senior) display size. Saved category priorities add weight to their matching catalog criteria. Phones over the selected budget (0–2,000 source price units) or without a listed price are excluded. The remaining phones are min-max normalized and ranked with a configurable hybrid score: 40% Weighted Sum Model (WSM), 35% TOPSIS closeness, and 25% cosine similarity. The page shows the components and each criterion's WSM contribution. Missing specifications contribute zero, are flagged, and are never inferred. Normalization uses the current budget-eligible set; equal present values are neutral.

The source catalog does not include GPU, refresh-rate, video capability, or objective processor benchmark data. Recommendations cannot evaluate those attributes reliably. The processor is stored as model-name text, and display type is categorical.

See [the persona weights and saved preference schema](docs/user-preferences.md). The dataset's price currency and some units have not been confirmed; displayed catalog prices use source values. See [dataset notes](docs/dataset-notes.md).

## Requirements

- Node.js and npm
- Python 3 with `openpyxl` only if regenerating the normalized phone catalog
- A Firebase project with Email/Password and Google Authentication enabled, and Cloud Firestore created
- Firebase CLI for deploying Firestore Security Rules

## Run locally

```powershell
cd Frontend
npm install
npm run dev
```

Vite prints a local URL when the development server starts. To create a production build:

```powershell
npm run build
```

Run the mathematical engine unit tests (Node.js 22.6+):

```powershell
npm run test:recommendations
```

The Firebase browser configuration is in `Frontend/src/auth/firebase.ts`. It contains public web-app identifiers, not Admin credentials. Do not put Firebase service-account keys or other server secrets in the frontend.

## Firebase setup

1. In Firebase Console, open **Authentication → Sign-in method** and enable **Email/Password** and **Google**.
2. Create a **Cloud Firestore** database.
3. Under **Authentication → Settings → Authorized domains**, add the domain hosting the app. For the current deployments, add `sharvilmishra.github.io` and `pj-1-five.vercel.app`; keep `localhost` enabled for local development.
4. From the repository root, sign in to the Firebase CLI if needed, then deploy the repository's owner-only profile rules:

   ```powershell
   firebase deploy --only firestore:rules --project ignite-1df6e
   ```

The rules validate the profile fields (`categories`, `persona`, `maxPrice`, and `updatedAt`) and restrict reads and writes to the authenticated owner of `userPreferences/{uid}`. Deploy the rules after pulling updates to `firestore.rules`; profile saving may be rejected until the latest rules are live. More detail is in [Firebase setup](docs/firebase-setup.md).

## Catalog data

The app reads `Frontend/src/data/phones.json`, normalized from `Datasets/sic_mobile_spec_PJ1.xlsx`. After updating the workbook, regenerate the JSON from the repository root:

```powershell
python scripts/build_phone_catalog.py
```

The generator requires `openpyxl` (`pip install -r requirements.txt`). Review [dataset notes](docs/dataset-notes.md) whenever the source workbook changes.

## Release checks

Before release, use the [focused release checklist](docs/release-checklist.md) to verify sign-in, saved profiles, persona ranking, budget behavior, mobile filters, comparison, and phone details on a production preview.
