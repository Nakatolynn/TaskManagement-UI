# Task Management UI

Simple React + Vite frontend that consumes Task Management endpoints.

Environment
- Set VITE_API_BASE_URL to point at your API (defaults to http://localhost:3000)

Install and run

```bash
npm install
npm run dev
```

Run tests

```bash
npm run test
```

Notes
- The API client expects endpoints: GET /tasks, GET /tasks/:id, POST /tasks, PUT /tasks/:id, DELETE /tasks/:id
- This scaffold uses fetch and no auth. If your API requires auth, update `src/api/client.js` to attach headers.
