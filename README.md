# AI-Resume-Screening
# 🚀 AI Resume Screening System

An AI-powered Resume Screening System built using **React.js**, **FastAPI**, **SQLite**, **Docker**, **Jenkins**, and **AWS EC2**.

The system analyzes resumes against a given Job Description, calculates a matching score, identifies matched and missing skills, recommends improvements, and provides an admin dashboard for analytics.

---

# 📌 Features

- 📄 Upload Resume (PDF)
- 🤖 AI Resume Screening
- 🎯 ATS Match Score
- ✅ Matched Skills Detection
- ❌ Missing Skills Detection
- 💡 AI Skill Recommendations
- 👤 Resume Information Extraction
- 📊 Dashboard Analytics
- 🏆 Leaderboard
- 🔍 Search Resume
- 🎛 Filter by Score
- 🗑 Delete Resume
- 🐳 Docker Support
- ⚙ Jenkins CI Pipeline
- ☁ AWS EC2 Deployment

---

# 🛠 Tech Stack

## Frontend

- React.js
- Axios
- CSS

## Backend

- FastAPI
- Python
- SQLAlchemy
- SQLite

## DevOps

- Docker
- Docker Compose
- Jenkins
- GitHub
- AWS EC2

---

# 📂 Project Structure

```
AI-Resume-Screening
│
├── backend
│   ├── app
│   ├── uploads
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend
│   ├── src
│   ├── public
│   ├── Dockerfile
│   └── package.json
│
├── jenkins
├── nginx
├── terraform
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/nithin05060423/AI-Resume-Screening.git

cd AI-Resume-Screening
```

---

# Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs on

```
http://localhost:8000
```

Swagger Documentation

```
http://localhost:8000/docs
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm start
```

Frontend runs on

```
http://localhost:3000
```

---

# Docker Deployment

```bash
docker compose up --build
```

---

# Jenkins Pipeline

Pipeline Stages

- Checkout Source Code
- Docker Build
- Build Frontend
- Build Backend
- Deploy Containers

---

# AWS Deployment

The application is deployed on AWS EC2 using Docker Compose.

Frontend

```
http://<EC2-PUBLIC-IP>:3000
```

Backend

```
http://<EC2-PUBLIC-IP>:8000
```

Swagger

```
http://<EC2-PUBLIC-IP>:8000/docs
```

---

# API Endpoints

| Method | Endpoint | Description |
|----------|------------------|------------------------------|
| POST | /screen-resume | Upload Resume |
| GET | /resumes | Get All Resumes |
| GET | /leaderboard | Top Candidates |
| GET | /dashboard | Dashboard Statistics |
| GET | /search | Search Resume |
| GET | /filter | Filter Resume |
| GET | /resume/{id} | Get Resume |
| DELETE | /resume/{id} | Delete Resume |

---

# Screenshots

Add screenshots here:

- Home Page
- Dashboard
- Resume Upload
- Resume Result
- Leaderboard
- Search
- Filter
- Swagger UI
- Docker Containers
- Jenkins Pipeline
- AWS EC2 Deployment

---

# Future Improvements

- Authentication
- PostgreSQL Database
- Role-Based Access
- Email Notifications
- AI Resume Ranking
- Resume History
- Export Reports
- Cloud Storage Integration

---

## Running Frontend Tests in CI

The frontend tests disable auth gating during test runs by using a global test helper.
You can control this behavior via environment variables.

- CI (common): set `CI=true` in your environment — the test helper will disable auth gating.
- Explicit flag: set `REACT_APP_TEST_REQUIRE_AUTH=false` to disable auth gating during tests.

Example GitHub Actions step to run frontend tests (disables auth gating):

```yaml
- name: Run frontend tests
	run: |
		npm --prefix frontend ci
		REACT_APP_TEST_REQUIRE_AUTH=false npm --prefix frontend test -- --watchAll=false
	env:
		CI: true
```

Alternatively, the helper will also disable auth when `NODE_ENV=test` (Jest runs with this by default), so running tests locally with `npm --prefix frontend test` will also work.


# Author

**Nithin Goli**

GitHub

https://github.com/nithin05060423

---

# License

This project is developed for learning, portfolio, and educational purposes.
