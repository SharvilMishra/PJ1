# Firebase setup

ELYVEX uses Firebase Authentication for optional accounts and Cloud Firestore to save a signed-in user's recommendation profile. Browsing and phone discovery remain available to guests. Only signed-in users can save a persona and budget.

## Enable sign-in providers

In the Firebase console for project `ignite-1df6e`:

1. Open **Authentication → Sign-in method**.
2. Enable **Email/Password** and **Google**.
3. Open **Authentication → Settings → Authorized domains** and add `sharvilmishra.github.io`. Keep `localhost` enabled for local development.

## Create Firestore and deploy access rules

1. Open **Firestore Database** and create the database in the region you want to use.
2. From the repository root, run `firebase login` once if the CLI is not already authenticated, then deploy the rules:

   ```powershell
   firebase deploy --only firestore:rules --project ignite-1df6e
   ```

The deployed rules allow each authenticated user to read and update only their own `userPreferences/{uid}` document. They validate the `categories` list, an optional `persona` (`student`, `creator`, `gaming`, `business`, or `senior`), the `maxPrice` value (0–2,000), and the server timestamp. They do not grant public access to Firestore. Deploy these rules before testing profile saving after a rules update.

## Frontend configuration

The Firebase web app config is embedded in `Frontend/src/auth/firebase.ts`, so local and hosted frontend builds use the same Firebase project without deployment environment variables. This configuration is intended for browser use; it is not a Firebase Admin credential. Protect Firestore data with the deployed Security Rules, and never add a service account key or Admin SDK secret to frontend code.

GitHub Pages must use **GitHub Actions** as its deployment source. After committing frontend changes, rerun the **Deploy ELYVEX to GitHub Pages** workflow or push a commit to trigger a deployment.
