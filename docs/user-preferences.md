# Recommendation preferences

- Preference categories are `gaming`, `battery`, `camera`, `budget`, and `flagship`. They continue to personalize Discover and Compare.
- The recommender profile also stores a persona (`student`, `creator`, `gaming`, `business`, or `senior`) and a maximum catalog price from 0 to 2,000.
- Signed-in users save these fields to `userPreferences/{firebaseUid}` in Cloud Firestore. The client reads and writes only the active user's document.
- `firestore.rules` restricts reads, writes, and deletes to the document owner and validates the allowed categories, persona, and budget. Deploy updated rules with `firebase deploy --only firestore:rules` before using the new profile save flow.
- Guests can select and save categories in browser local storage. When a user first signs in, guest selections migrate to their Firestore document only if it does not already exist. Existing account choices remain authoritative.
- The What we recommend page excludes phones above the selected price and shows the top five. Each persona has a documented set of weights across price, rating, RAM, storage, battery, camera, and (for seniors) display size. Each available value is normalized against the catalog range and multiplied by its persona weight; these weighted contributions sum to the match score. Missing specs contribute zero and are called out in the score breakdown.
- The same normalized workbook records are used in search and comparison. The source data's currency is unspecified; the recommender budget uses the source's numeric price units.

## Persona weight model

Weights total 100 per persona. Each available field is normalized from its catalog minimum to maximum. For price, the score is inverted so lower prices score higher. A phone above the chosen maximum price is excluded before ranking. A missing field contributes zero points and is shown as missing rather than estimated.

| Persona | Price | Rating | RAM | Storage | Battery | Camera | Display size |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Student | 35 | 10 | 10 | 15 | 20 | 10 | — |
| Creator | 5 | 15 | 15 | 20 | 10 | 35 | — |
| Gaming | 10 | 15 | 30 | 15 | 20 | 10 | — |
| Business Professional | 10 | 25 | 15 | 15 | 25 | 10 | — |
| Senior | 20 | 20 | 5 | 5 | 25 | 10 | 15 |
