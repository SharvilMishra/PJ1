# Frontend

React + TypeScript + Vite client for ELYVEX. Phone discovery and comparison are public; signing in is optional. Signed-in users can save recommendation categories to their Firebase account and see them applied on future visits. Guest priorities are kept in the current browser and copied to the account on first sign-in if no account preferences exist yet.

## Setup

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Configure the Firebase web app values in `.env`. In the Firebase console, enable the required Authentication providers and create a Cloud Firestore database. From the project root, deploy the included owner-only preference rules with `firebase deploy --only firestore:rules`. Never add private service credentials to frontend variables.
