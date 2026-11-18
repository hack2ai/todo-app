# To-Do List App — MERN Stack (Assignment 8)

A full-stack To-Do List application built with **MongoDB**, **Express.js**, **React**, and **Node.js**.

---

## Project Structure

```
todo-app/
├── backend/
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/
│   │   └── todoController.js   # Request/response handlers
│   ├── middleware/
│   │   ├── errorHandler.js     # Global error handling
│   │   └── validators.js       # express-validator rules
│   ├── models/
│   │   └── Todo.js             # Mongoose schema
│   ├── routes/
│   │   └── todoRoutes.js       # API route definitions
│   ├── services/
│   │   └── todoService.js      # Business logic layer
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express entry point
│
└── frontend/
    ├── public/index.html
    └── src/
        ├── components/
        │   ├── FilterBar.jsx   # Search + filter controls
        │   ├── StatsBar.jsx    # Summary stats dashboard
        │   ├── TodoForm.jsx    # Create/edit form
        │   └── TodoItem.jsx    # Single task card
        ├── hooks/
        │   └── useTodos.js     # Custom hook for all state/API logic
        ├── services/
        │   └── todoService.js  # Axios API calls
        ├── App.jsx
        ├── App.css
        └── index.js
```

---

## API Endpoints

| Method | Endpoint               | Description                              |
|--------|------------------------|------------------------------------------|
| GET    | /api/todos             | Get all todos (search, filter, paginate) |
| GET    | /api/todos/stats       | Get summary counts by status             |
| GET    | /api/todos/:id         | Get single todo                          |
| POST   | /api/todos             | Create new todo                          |
| PUT    | /api/todos/:id         | Update a todo (all fields)               |
| PATCH  | /api/todos/:id/status  | Update status only                       |
| DELETE | /api/todos/:id         | Delete a todo                            |

### Query params for GET /api/todos
- `search` — search title + description (case-insensitive)
- `status` — `pending` | `in-progress` | `completed`
- `priority` — `low` | `medium` | `high`
- `page` — page number (default: 1)
- `limit` — items per page (default: 10)

---

## Local Setup

### 1. Clone the repository

```bash
git clone <your-github-repo-url>
cd todo-app
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add your MongoDB Atlas connection string
npm run dev
```

The API runs on **http://localhost:5000**

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

The app runs on **http://localhost:3000**

> The React dev server proxies `/api/*` requests to `localhost:5000` via the `"proxy"` field in `package.json`.

---

## Environment Variables (backend/.env)

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/todoapp?retryWrites=true&w=majority
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

---

## Deployment

### Backend → Render

1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set Root Directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (`MONGODB_URI`, `NODE_ENV=production`, `CLIENT_URL=<netlify-url>`)

### Frontend → Netlify

1. Create a new site on [netlify.com](https://netlify.com)
2. Set Base directory to `frontend`
3. Build command: `npm run build`
4. Publish directory: `frontend/build`
5. Add environment variable: `REACT_APP_API_URL=https://<your-render-url>/api/todos`

---

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| CORS errors between frontend and backend | Configured `cors` middleware with explicit `origin` allowing the Netlify URL |
| Mongoose CastError on invalid ObjectId | Centralized `errorHandler` middleware detects `CastError` and returns 400 |
| Search + filter + pagination composability | Built `getAllTodos` service to strip empty params and compose a dynamic Mongoose query |
| Optimistic UI vs. consistency | Chose server-driven updates (re-fetch after mutations) for correctness over optimistic patching |
| Status cycle (3-way toggle) | `STATUS_CYCLE` map in `TodoItem` drives next-state without conditional chains |

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Frontend:** React 18 (functional components, hooks)
- **HTTP client:** Axios
- **Validation:** express-validator (backend) + custom client-side validation
- **Deployment:** Render (backend) + Netlify (frontend)
