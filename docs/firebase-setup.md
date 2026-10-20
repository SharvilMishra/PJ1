# Firebase setup

ELYVEX uses Firebase Authentication for optional accounts and Cloud Firestore to save a signed-in user's recommendation preferences. Browsing and phone discovery remain available to guests.

## Enable sign-in providers

In the Firebase console for project `ignite-1df6e`:

1. Open **Authentication → Sign-in method**.
2. Enable **Email/Password** and **Google**.
3. Open **Authentication → Settings → Authorized domains** and add `sharvilmishra.github.io`. Keep `localhost` enabled for local development.

## Create Firestore and deploy access rules

1. Open **Firestore Database** and create the database in the region you want to use.
2. From the repository root, run `firebase login` once, then `firebase deploy --only firestore:rules --project ignite-1df6e`.

The deployed rules allow each authenticated user to read and update only their own `userPreferences/{uid}` document. They do not grant public access to Firestore.

## Configure the local frontend

The ignored `Frontend/.env` file holds the Firebase web app config and is not committed. Its keys are listed in `Frontend/.env.example`. Start the app from `Frontend` with `npm run dev` after filling them in.

## Configure GitHub Pages builds

GitHub Actions builds the frontend using repository Actions variables. In `SharvilMishra/PJ1`, open **Settings → Secrets and variables → Actions → Variables** and add these six variables using the matching values from `Frontend/.env`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

These are Firebase web app configuration values used by browser code, not Firebase Admin credentials. Never put a service account key or Admin SDK secret in a `VITE_` variable.

After the variables are saved, rerun the **Deploy ELYVEX to GitHub Pages** workflow so the app is rebuilt with Firebase configured. GitHub Pages must use **GitHub Actions** as its deployment source.
