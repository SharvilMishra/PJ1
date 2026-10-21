# ELYVEX frontend

React, TypeScript, and Vite client for the ELYVEX phone catalog app. Visitors can browse the full catalog, search and filter, view device details, and compare two phones. A Firebase account is needed to save a recommendation profile.

## Local development

```powershell
npm install
npm run dev
```

Create a production build with `npm run build` and preview it with `npm run preview`.

## Firebase

The browser Firebase configuration is in `src/auth/firebase.ts`. It uses the public Firebase Web SDK configuration; no Vercel environment variables are required for this client setup. Enable Email/Password and Google sign-in in Firebase Authentication, create Cloud Firestore, and authorize the hosted domain plus `localhost`.

The app saves signed-in profiles to `userPreferences/{firebaseUid}`. Profile fields are `categories`, `persona`, `maxPrice`, and `updatedAt`. Deploy the matching owner-only Firestore rules from the repository root:

```powershell
firebase deploy --only firestore:rules --project ignite-1df6e
```

Persona ranking weights, data normalization, and Firebase setup steps are documented in the repository's `docs/user-preferences.md` and `docs/firebase-setup.md`.

## Catalog

`src/data/phones.json` is generated from `Datasets/sic_mobile_spec_PJ1.xlsx` by `scripts/build_phone_catalog.py` at the repository root. See the root README for regeneration steps and dataset limitations.
