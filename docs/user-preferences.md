# Recommendation preferences

- Preference categories are `gaming`, `battery`, `camera`, `budget`, and `flagship`. They continue to personalize Discover and Compare.
- The recommender profile also stores a persona (`student`, `creator`, `gaming`, `business`, or `senior`) and a maximum catalog price from 0 to 2,000.
- Signed-in users save these fields to `userPreferences/{firebaseUid}` in Cloud Firestore. The client reads and writes only the active user's document.
- `firestore.rules` restricts reads, writes, and deletes to the document owner and validates the allowed categories, persona, and budget. Deploy updated rules with `firebase deploy --only firestore:rules` before using the new profile save flow.
- Guests can select and save categories in browser local storage. When a user first signs in, guest selections migrate to their Firestore document only if it does not already exist. Existing account choices remain authoritative.
- The What we recommend page excludes phones above the selected price and phones without a listed price, then shows the top five. Each persona has a documented set of weights across price, rating, RAM, storage, battery, camera, and (for seniors) display size. Every saved category priority adds 15 weight points to its corresponding criterion before all weights are normalized to sum to one.
- Eligible phone values are min-max normalized for the current budget-filtered set. Benefit criteria use `(x - min) / (max - min)`; price uses `(max - x) / (max - min)`. An equal-value criterion is neutral for present values; missing values contribute zero and are flagged.
- The final 0–100 suitability score blends WSM (40%), TOPSIS closeness (35%), and cosine similarity (25%). WSM contributions and all three component scores are shown in the result breakdown. These blend weights are configured in `Frontend/src/data/recommendationEngine.ts`.
- The source workbook has no GPU, refresh rate, or video-capability fields. Processor entries are model-name text, not benchmark scores; display type is categorical. The engine does not claim to rank those qualities.
- The same normalized workbook records are used in search and comparison. The source data's currency is unspecified; the recommender budget uses the source's numeric price units.

## Persona weight model

Persona base weights total 100 before user priorities are applied. The active user priorities add weight to the matching criteria; the final criterion weights are then normalized to total one. See the hybrid scoring description above. The table below shows persona base weights only.

| Persona | Price | Rating | RAM | Storage | Battery | Camera | Display size |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Student | 35 | 10 | 10 | 15 | 20 | 10 | — |
| Creator | 5 | 15 | 15 | 20 | 10 | 35 | — |
| Gaming | 10 | 15 | 30 | 15 | 20 | 10 | — |
| Business Professional | 10 | 25 | 15 | 15 | 25 | 10 | — |
| Senior | 20 | 20 | 5 | 5 | 25 | 10 | 15 |
