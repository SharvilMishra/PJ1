# Technical decisions

- Frontend: Vite, React, TypeScript for a typed, component-based responsive UI.
- Authentication: Firebase Authentication web SDK; configuration comes from frontend environment variables.
- Backend: FastAPI provides catalog, recommendation, and comparison endpoints over the normalized phone catalog.
- Initial catalog storage: the owner-provided Excel workbook remains the source of truth; a script regenerates read-only JSON for the frontend and backend.
- Recommendation ranking: prioritize matches to user-selected derived categories, then rating, then lower numeric source price. Price currency and several units remain unconfirmed and are displayed as source values until clarified.
