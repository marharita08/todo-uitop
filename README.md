# Todo App
 
A full-stack task management application built with Next.js and NestJS.

> [!NOTE]
> The live backend is deployed on Render using a free tier. It may take some time (up to 1 minute) to "wake up" on the first request if it has been inactive for a while.
 
## Features
 
- Create tasks with text and a category
- Mark multiple tasks as completed using bulk selection
- Mark individual tasks as completed
- Delete tasks
- Filter tasks by category
- Maximum 5 tasks per category (enforced on the backend)
- Undo notification when completing or deleting a task
## Tech Stack
 
**Frontend:** Next.js, TypeScript, TailwindCSS, TanStack Query, React Hook Form  
**Backend:** NestJS, Prisma, SQLite
 
## Running with Docker
 
### Prerequisites
 
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed
### Steps
 
1. Clone the repository:
   ```bash
   git clone https://github.com/marharita08/todo-uitop
   cd todo-uitop
   ```
 
2. Create a `.env` file in the project root based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
 
3. Build and start the containers:
   ```bash
   docker compose up --build
   ```
 
4. Open the app in your browser:
   ```
   http://localhost:3000
   ```
 
To stop the containers:
 
```bash
docker compose down
```
 
To stop and remove all data (database volume):
 
```bash
docker compose down -v
```
 
## Environment Variables
 
Create a `.env` file in the project root. All variables are required.
 
| Variable | Description | Example |
|---|---|---|
| `BACKEND_PORT` | Port the NestJS API server listens on | `3001` |
| `FRONTEND_PORT` | Port the Next.js app listens on | `3000` |
| `FRONTEND_URL` | URL of the frontend, used by the backend for CORS | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | URL of the backend API, used by the frontend to make requests | `http://localhost:3001` |
| `NODE_ENV` | Application environment | `production` |
| `DATABASE_URL` | Path to the SQLite database file | `file:./db/database.sqlite` |
 
