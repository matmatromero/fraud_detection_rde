---
description: How to run the Agentic Fraud Investigator app
---

To run the Agentic Fraud Investigator app, follow these steps:

### 1. Start the Python Backend
Run the following command to install dependencies and start the FastAPI server:
// turbo
```bash
python3 -m pip install -r backend/requirements.txt && python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Start the React Frontend
In a new terminal window, run:
// turbo
```bash
npm install && npm run dev
```

The app will be available at http://localhost:5173 (Frontend) and the api docs at http://localhost:8000/docs (Backend).
