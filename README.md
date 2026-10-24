# AI-Powered Smart Resume & Job Matching System

A ready-to-run full-stack Java project for parsing resumes, managing job postings, and ranking jobs by resume similarity.

## Tech stack
- Backend: Java 17, Spring Boot 3.3, Spring Web, Spring Data JPA, Bean Validation
- NLP: Apache Tika text extraction + token normalization, stop-word filtering, TF-IDF weighted vectors, cosine similarity
- Database: PostgreSQL
- Frontend: React + Vite
- Hosting/dev: Docker Compose

> This is a transparent, explainable baseline matching system, not a hiring decision engine. Scores are similarity estimates and should not be used as the sole basis for employment decisions.

## Quick start (Docker)
Requirements: Docker Desktop / Docker Engine with Compose.

```bash
docker compose up --build
```

Then open:
- Frontend: http://localhost:5173
- Backend health: http://localhost:8080/api/health
- API docs by endpoint list below.

On first startup the backend creates the database tables and inserts sample jobs.

## Local development
### 1. PostgreSQL
Start only the database:
```bash
docker compose up -d db
```

### 2. Backend
Requirements: Java 17+ and Maven 3.9+.
```bash
cd backend
mvn spring-boot:run
```
Default connection is `localhost:5432`, database `resume_matcher`, user `resume_user`, password `resume_pass`. Override with `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`.

### 3. Frontend
Requirements: Node.js 20+.
```bash
cd frontend
npm install
npm run dev
```
Vite proxies `/api` to `http://localhost:8080`.

## API
- `GET /api/health` — health check
- `GET /api/jobs` — list jobs
- `GET /api/jobs/{id}` — get one job
- `POST /api/jobs` — create job (JSON)
- `DELETE /api/jobs/{id}` — delete job
- `POST /api/resumes/analyze` — multipart upload with `file` and optional `resumeText`
- `POST /api/matches` — JSON `{ "resumeText": "...", "topK": 10 }`; returns ranked jobs with score and matched terms
