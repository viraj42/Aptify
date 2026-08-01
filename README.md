<div align="center">

<h1>⚡ Aptify</h1>
<p><strong>The Next-Generation AI-Powered Quantitative Preparation Platform featuring real-time AI generation, progressive Redis caching, and full analytics — built with Node.js, Express, React 19, and MongoDB.</strong></p>

<br />

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-Caching-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)
[![Anthropic](https://img.shields.io/badge/AI-Anthropic%20%7C%20Groq-purple?style=flat-square&logo=anthropic&logoColor=white)](https://anthropic.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

<br />

| 🌐 Live Demo |
|:---:|
| `https://quantpilot-ai.vercel.app/` *(Example URL)* |


</div>

---

## 📋 Table of Contents

1. [What is Aptify?](#-what-is-aptify)
2. [Architecture Overview](#-architecture-overview)
3. [Tech Stack](#-tech-stack)
4. [Feature Breakdown](#-feature-breakdown)
   - [Authentication & OAuth2](#1-authentication--oauth2)
   - [Dynamic AI Practice Engine](#2-dynamic-ai-practice-engine)
   - [High-Stakes Mock Assessments](#3-high-stakes-mock-assessments)
   - [Analytics & Telemetry](#4-analytics--telemetry)
   - [Progressive Redis Caching](#5-progressive-redis-caching)
   - [API Rate Limiting & Security](#6-api-rate-limiting--security)
5. [API Reference](#-api-reference)
6. [Project Structure](#-project-structure)
7. [Local Development Setup](#-local-development-setup)
8. [Environment Variables](#-environment-variables)
9. [Database Schema](#-database-schema)
10. [Security Design](#-security-design)

---

## 🚀 What is Aptify?

Aptify is a **full-stack learning and assessment ecosystem** designed to prepare candidates for rigorous quantitative interviews and exams. It completely replaces traditional, static question banks by harnessing advanced LLM architectures (Anthropic Claude & Groq) to generate dynamic, adaptive, and mathematically rigorous challenges **synchronously in real-time**.

Users never see the same question twice. The platform features an elite, glassmorphic UI, deep telemetry for tracking weak topics, and robust backend infrastructure featuring **Progressive Redis Caching** and **Strict API Rate Limiting** to ensure production-grade performance and security.

### What makes this different from static platforms?

| Capability | Aptify |
|---|---|
| Real-time AI Question Generation | ✅ |
| Google OAuth2 & JWT Authentication | ✅ |
| Progressive Redis Caching with Graceful Fallback | ✅ |
| Modular API Rate Limiting (Token/Endpoint level) | ✅ |
| Native `KaTeX` Mathematical Rendering | ✅ |
| Stateful Mock Exams with Timers | ✅ |
| Deep Analytics & Performance Radars | ✅ |
| Glassmorphic UI with Micro-Animations | ✅ |

---

## 🏗 Architecture Overview

```text
┌───────────────────────────────────────────────────────────────┐
│                      CLIENT / CONSUMER                        │
│             React 19 SPA (Vite) + TailwindCSS v4              │
└──────────────────────────┬────────────────────────────────────┘
                           │  JWT Bearer / Session Data
                           ▼
┌───────────────────────────────────────────────────────────────┐
│                     APTIFY API GATEWAY                        │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                   Express Middlewares                   │  │
│  │                                                         │  │
│  │  ① Rate Limiting (express-rate-limit)                   │  │
│  │     - /auth (20 req/15m) | /analytics (15 req/15m)      │  │
│  │  ② Authentication (auth.middleware.js)                  │  │
│  │     - Validates JWT | Injects req.user                  │  │
│  │  ③ Progressive Caching (cache.middleware.js)            │  │
│  │     - Intercepts GET requests | Checks Redis            │  │
│  │     - Fallback to DB if Redis is offline                │  │
│  └──────────────────────────┬──────────────────────────────┘  │
│                             ▼                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │ Auth APIs    │  │ Practice     │  │  Analytics & AI     │  │
│  │ /api/auth    │  │ /api/session │  │  /api/analytics     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬──────────┘  │
└─────────│─────────────────│─────────────────────│─────────────┘
          ▼                 ▼                     ▼
┌─────────────────┐ ┌────────────────┐ ┌────────────────────────┐
│  MongoDB Atlas  │ │  Redis Cloud   │ │ LLM Providers (Groq)   │
│ (Users, Mocks)  │ │ (Query Cache)  │ │ (Question Generation)  │
└─────────────────┘ └────────────────┘ └────────────────────────┘
```

---

## 🛠 Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas + Mongoose |
| Caching | Redis Cloud (ioredis) |
| Security | JWT + express-rate-limit |
| AI Integration | Anthropic SDK / Groq SDK |

### Frontend

| Layer | Technology |
|---|---|
| Library | React 19 |
| Build Tool | Vite |
| Routing | React Router DOM |
| Styling | Tailwind CSS v4 + Glassmorphism |
| Math Rendering| KaTeX / react-katex |
| Charts | react-chartjs-2 |
| Auth | @react-oauth/google |

---

## ✨ Feature Breakdown

### 1. Authentication & OAuth2
Users can sign up securely using standard email/password (BCrypt hashed) or instantly via **Google OAuth2**. The backend issues stateless JWT tokens that the frontend utilizes for protected route access.
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`

### 2. Dynamic AI Practice Engine
Unlike legacy platforms, Aptify synthesizes unique problems bounded by the user's selected syllabus topic and difficulty. The `aiQuestionGenerator.js` seamlessly hot-swaps between AI providers and returns structured JSON questions that are saved to MongoDB and rendered cleanly using native `KaTeX` on the frontend.

### 3. High-Stakes Mock Assessments
Replicates real-world testing environments. Mock exams have timers tracked server-side and lock out upon submission. End-of-test evaluations score attempts dynamically and generate a comprehensive review dashboard.
- `GET /api/mock/:id/start`
- `POST /api/mock/:id/submit`

### 4. Analytics & Telemetry
Deep analytics pipelines evaluate the user's history. The dashboard displays Multi-Axis Performance Radars and Weak/Strong topic identification, computed via high-performance MongoDB aggregation pipelines.

### 5. Progressive Redis Caching
To optimize performance and reduce DB load, a custom `cache.middleware.js` utilizing `ioredis` wraps read-heavy, low-churn catalog endpoints (e.g., Syllabus, Mock Companies).
- **Graceful Fallback**: If the Redis server is unreachable, the system silently and seamlessly routes the query to MongoDB without failing the request!

### 6. API Rate Limiting & Security
Strict API bounds are implemented using `express-rate-limit` to prevent abuse and LLM token exhaustion:
- **Auth Limiter**: 20 requests per 15 minutes.
- **AI Recommendation Limiter**: 15 requests per 15 minutes.
- **Global API Limiter**: 300 requests per 15 minutes.

---

## 📡 API Reference

### Complete Endpoint Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register a new user |
| POST | `/api/auth/login` | None | Login via credentials |
| POST | `/api/auth/google` | None | Login via Google OAuth2 |
| GET | `/api/syllabus/section` | None | Get all sections (Cached) |
| GET | `/api/syllabus/:sectionId` | None | Get topics by section (Cached) |
| POST | `/api/session/start` | JWT | Start AI Practice session |
| POST | `/api/session/:id/submit` | JWT | Submit practice answer |
| GET | `/api/mock/companies` | None | List available mocks (Cached) |
| GET | `/api/mock/:id/start` | JWT | Start a mock exam |
| POST | `/api/mock/:id/submit` | JWT | Submit mock exam |
| GET | `/api/analytics/profile` | JWT | Retrieve user statistics |
| GET | `/api/analytics/getInsight` | JWT | Generate AI study insight |
| GET | `/api/analytics/get_rank` | JWT | Get global leaderboard rank (Cached) |

---

## 📁 Project Structure

```text
Aptify/
├── Backend/
│   ├── controllers/         # Business logic (AIRecommandation, mock, session, etc.)
│   ├── middlewares/         # auth.middleware.js, cache.middleware.js, rateLimit.middleware.js
│   ├── models/              # Mongoose Schemas (User, Topic, MockAttempt, etc.)
│   ├── routes/              # Express Routers
│   ├── utils/               # aiQuestionGenerator, auth.validation
│   ├── server.js            # Express application entry point
│   └── .env                 # Secrets, MongoDB, Redis configuration
│
└── Frontend/my-app/
    ├── src/
    │   ├── api/             # Axios client interceptors & API functions
    │   ├── assets/          # Static SVGs, images
    │   ├── components/      # Reusable UI (GoogleAuthButton, Loaders, Sidebar)
    │   ├── pages/           # Route views (Dashboard, PracticeEngine, MockExam, etc.)
    │   ├── utils/           # AuthContext
    │   ├── App.jsx          # React Router DOM configuration
    │   └── main.jsx         # React DOM entry and GoogleOAuthProvider
    ├── package.json
    └── tailwind.config.js
```

---

## 🖥 Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Aptify.git
cd Aptify
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Configure `Backend/.env`:
```env
PORT=8080
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/aptify
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GROQ_API_KEY=gsk_...
REDIS_HOST=books-your-instance.db.redis.io
REDIS_PORT=12158
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
REDIS_URL=redis://default:password@host:port
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:
```bash
cd Frontend/my-app
npm install --legacy-peer-deps
```

Configure `Frontend/my-app/.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

Start the frontend development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 🔧 Environment Variables

### Backend (`Backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGO_URI` | ✅ | — | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | — | Secret key for JWT signing |
| `GOOGLE_CLIENT_ID` | ✅ | — | OAuth2 Client ID for Google Login |
| `GROQ_API_KEY` | ✅ | — | API key for LLM question generation |
| `REDIS_URL` | ❌ | `redis://127.0.0.1:6379` | Redis connection URI |
| `REDIS_HOST` | ❌ | — | Individual Redis host parameter |
| `PORT` | ❌ | `8080` | Express server port |

---

## 🗄 Database Schema

The core collections managed by Mongoose are mapped for high performance:

```javascript
// User Schema
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String }, // Optional for OAuth users
  googleId: { type: String },
  authProvider: { type: String, enum: ['local', 'google'] },
  insight: { text: String, lastGeneratedAt: Date },
  createdAt: { type: Date, default: Date.now }
}

// Question Schema (AI Generated)
{
  text: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String },
  explanation: { type: String },
  difficulty: { type: Number, min: 1, max: 5 },
  topicId: { type: ObjectId, ref: 'Topic' }
}

// MockAttempt Schema
{
  userId: { type: ObjectId, ref: 'User' },
  mockConfigId: { type: ObjectId, ref: 'MockConfig' },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  score: { type: Number },
  status: { type: String, enum: ['IN_PROGRESS', 'COMPLETED'] }
}
```

---

## 🔒 Security Design

| Layer | Mechanism |
|---|---|
| **Authentication** | Stateless JWT validated by `auth.middleware.js` on every secure route. |
| **Password Storage** | BCrypt hashing applied pre-save. |
| **OAuth2 Security** | Secure token exchange handled by `@react-oauth/google`. |
| **Rate Limiting** | Strict window constraints per IP via `express-rate-limit` for Brute Force & DDoS prevention. |
| **Database Caching** | Safe payload intercepts using `ioredis`, with silent fallbacks to prevent outage propagation. |
| **Route Protection** | Frontend routing gates wrapped in `AuthContext` to immediately bounce unauthenticated access. |

---

<div align="center">

Made with ☕ by **Viraj Padaval**

</div>
