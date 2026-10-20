# Recommendation preferences

- Preference categories are `gaming`, `battery`, `camera`, `budget`, and `flagship`.
- Signed-in users save the selected categories to `userPreferences/{firebaseUid}` in Cloud Firestore. The client reads and writes only the active user's document.
- `firestore.rules` restricts reads, writes, and deletes to the document owner and validates the allowed categories. Enable Cloud Firestore in the Firebase project and deploy the rules with `firebase deploy --only firestore:rules`.
- Guests can select and save categories in browser local storage. When a user first signs in, guest selections migrate to their Firestore document only if it does not already exist. Existing account choices remain authoritative.
- Home recommendation cards are ranked by the number of selected derived categories each catalog phone matches; ties are broken by rating and then lower catalog price. The same normalized workbook records are used in search and comparison.
