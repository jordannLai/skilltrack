# SkillTrack

SkillTrack is a personal dashboard for students and early-career developers to track their job search and portfolio progress in one place: job applications, side projects, skills, and an AI reviewer that gives resume-focused feedback on your projects.

## Features

- **Applications tracker** — log companies, roles, and application status (applied, interviewing, offer, rejected, etc.)
- **Projects tracker** — record project title, description, tech stack, and GitHub link
- **AI project feedback** — send a project to OpenAI (`gpt-4.1-mini`) and get resume-focused feedback on it
- **Skills tracker** — list skills with a proficiency level
- **Analytics dashboard** — at-a-glance counts: total applications, active (non-rejected) applications, total projects, total skills

## Tech stack

**Frontend** (`skilltrack-client/`)
- React 19 + Vite
- React Router
- Tailwind CSS
- Axios

**Backend** (`server/`)
- Node.js + Express
- PostgreSQL (via the `pg` driver, raw SQL queries)
- OpenAI API (project feedback)

## Project structure

```
skilltrack/
├── server/                 # Express API
│   ├── src/
│   │   ├── index.js         # app setup + route mounting
│   │   ├── db.js             # Postgres connection pool
│   │   └── routes/           # applications, projects, skills, analytics, ai
│   ├── api/index.js         # Vercel serverless entry point
│   └── vercel.json           # routes all requests to the serverless function
└── skilltrack-client/       # React (Vite) frontend
    └── src/
        ├── api/api.js         # Axios instance (backend base URL)
        ├── pages/             # Dashboard, Applications, Projects, Skills
        ├── components/        # Navbar, Sidebar
        └── layouts/           # DashboardLayout
```

## Getting started locally

### 1. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```
DATABASE_URL=postgresql://user:password@host:port/dbname
OPENAI_API_KEY=sk-...          # optional — only needed for the AI feedback feature
PORT=5000                       # optional, defaults to 5000
```

Create the tables SkillTrack expects (adjust types as you like):

```sql
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech TEXT[],
  github TEXT
);

CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT
);
```

Run the API:

```bash
npm run dev     # nodemon, auto-restart
# or
npm start
```

The API listens on `http://localhost:5000` by default.

### 2. Frontend

```bash
cd skilltrack-client
npm install
```

Create `skilltrack-client/.env`:

```
VITE_API_URL=http://localhost:5000
```

Run the dev server:

```bash
npm run dev
```

## API reference

| Resource | Endpoints |
|---|---|
| Applications | `GET/POST /applications`, `PUT/DELETE /applications/:id` |
| Projects | `GET/POST /projects`, `PUT/DELETE /projects/:id` |
| Skills | `GET/POST /skills`, `PUT/DELETE /skills/:id` |
| Analytics | `GET /analytics` |
| AI feedback | `POST /ai/project-feedback` — body: `{ title, description, tech }` |

## Deployment (Vercel)

SkillTrack is a monorepo with two independently deployable apps, so it's set up as **two Vercel projects** pointed at the same repo:

**Frontend project**
- Root Directory: `skilltrack-client`
- Framework preset: Vite (auto-detected)
- Environment variable: `VITE_API_URL` = the backend project's deployed URL

**Backend project**
- Root Directory: `server`
- Environment variables: `DATABASE_URL`, `OPENAI_API_KEY` (optional, needed for AI feedback)
- `server/vercel.json` rewrites every request to `server/api/index.js`, which re-exports the Express app so it runs as a Vercel serverless function instead of a long-lived process.

After both are deployed, set the frontend's `VITE_API_URL` to the backend project's production URL and redeploy the frontend.
