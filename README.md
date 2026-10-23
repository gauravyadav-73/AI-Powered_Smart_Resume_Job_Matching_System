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
