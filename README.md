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
