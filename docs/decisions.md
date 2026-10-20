# Technical decisions

- Frontend: Vite, React, TypeScript for a typed, component-based responsive UI.
- Authentication: Firebase Authentication web SDK; configuration comes from frontend environment variables.
- Backend: FastAPI keeps CSV parsing, normalization, recommendation ranking, and comparison behavior in one testable service boundary.
- Initial catalog storage: owner-provided CSV files, read-only at runtime. No database until persistence is needed.
- Recommendation ranking: start with transparent requirement matching and explainable weighted scoring; finalize weights after the dataset and requirements are reviewed.
