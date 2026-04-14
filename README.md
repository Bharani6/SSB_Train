<p align="center">
  <img src="https://i.pinimg.com/originals/30/31/a3/3031a322175f31f5ade065c8d1a4d377.jpg" alt="SSB Training System" width="120" height="120" style="border-radius: 50%;" />
</p>

<h1 align="center">🎖️ SSB Training System</h1>

<p align="center">
  <strong>India's Most Advanced AI-Powered SSB Interview Preparation Platform</strong>
</p>

<p align="center">
  <a href="#features"><img src="https://img.shields.io/badge/Modules-10+-10b981?style=for-the-badge&logo=target&logoColor=white" alt="Modules" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" /></a>
  <a href="#ai-evaluation"><img src="https://img.shields.io/badge/Gemini_AI-Powered-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge" alt="License" /></a>
</p>

<p align="center">
  <em>Simulate the complete 5-day SSB (Services Selection Board) interview process with real-time AI evaluation, psychological profiling, and comprehensive analytics — all under authentic test conditions.</em>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [SSB Test Modules](#-ssb-test-modules)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [AI Evaluation Engine](#-ai-evaluation-engine)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

The **SSB Training System** is a full-stack web application that replicates the real **Services Selection Board (SSB)** 5-day interview process used by the Indian Armed Forces for officer selection. It provides aspirants with an immersive, timed, and AI-evaluated training environment to practice all major SSB test modules — from OIR and PPDT on Day 1 to the Board Conference on Day 5.

Unlike generic quiz apps, this platform:

- ⏱️ Enforces **authentic SSB timing constraints** (e.g., 15s per WAT word, 30s PPDT observation)
- 🧠 Uses **Gemini AI** to evaluate responses through 3 independent evaluator personas (Psychologist, GTO, Interviewing Officer)
- 📊 Persists every session to a **PostgreSQL database** for historical tracking and analytics
- 🎯 Covers **all 10+ SSB modules** across the full 5-day schedule

---

## ✨ Features

### 🔐 Authentication & Security
- Secure user registration with email validation
- JWT-based authentication via Spring Security
- Password recovery with email verification
- Entry type selection (NDA / CDS / SSC Tech / AFCAT)

### 📊 Dashboard & Analytics
- **Tactical Overview** — Active days, tests logged, average score, streak tracking
- **Calendar Archive** — Browse training history by date
- **Recent Evaluations** — Quick access to last 3 evaluation reports
- **Day-wise Module Navigation** — Organized SSB 5-day schedule layout

### 🤖 AI-Powered Evaluation
- **3-Persona Grading** — Every response is evaluated by a simulated Psychologist, GTO, and Interviewing Officer
- **Per-question Breakdown** — Individual score, best answer, and explanation for each item
- **Composite Score** — Overall score out of 10 with detailed feedback
- **Anti-Bookish Detection** — AI flags rehearsed or artificial responses

### 🗃️ Data Persistence & Archival
- Full evaluation history stored in PostgreSQL
- Session-based tracking with date stamps
- Archival reports with day-wise browsing
- Exportable evaluation data

---

## 🎖️ SSB Test Modules

The application faithfully replicates the complete SSB 5-day schedule:

| Day | Module | Full Name | Description | Timing |
|:---:|:------:|-----------|-------------|--------|
| **1** | **OIR** | Officer Intelligence Rating | 50 verbal & non-verbal reasoning questions | 30 min |
| **1** | **PPDT** | Picture Perception & Discussion Test | Observe image → Write story → Discussion | 30s + 4 min |
| **2** | **WAT** | Word Association Test | 60 stimulus words, respond with first thought | 15s each |
| **2** | **TAT** | Thematic Apperception Test | 12 ambiguous images → Write stories | 30s + 4 min each |
| **2** | **SRT** | Situation Reaction Test | 60 real-life situations → Write reactions | 30 min |
| **2** | **SDT** | Self Description Test | 5 pillars of self-introspection | 15 min |
| **3** | **IO** | Interviewing Officer (Standard) | NDA/CDS general interview simulation | Untimed |
| **3** | **SSC Tech** | Technical Entry Interview | Engineering & CS core cross-examination | Untimed |
| **4** | **GD** | Group Discussion | 2 consecutive discussion topics | Timed |
| **4** | **GPE** | Group Planning Exercise | Crisis narrative planning under pressure | 15 min |
| **4** | **Lecturette** | Lecturette | 4 topics, prep + delivery | 3 + 3 min |
| **5** | **Conference** | Board Conference | Final results & comprehensive evaluation report | — |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework with functional components & hooks |
| **Vite 5** | Lightning-fast build tool & dev server |
| **React Router v6** | Client-side routing & navigation |
| **Framer Motion** | Premium animations & page transitions |
| **Axios** | HTTP client for API communication |
| **Lucide React** | Beautiful, consistent iconography |
| **TailwindCSS 3** | Utility-first CSS framework |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Java 17** | Core language |
| **Spring Boot 3.2** | Application framework |
| **Spring Security** | Authentication & authorization |
| **Spring Data JPA** | Database ORM & repository abstraction |
| **PostgreSQL** | Primary relational database |
| **JWT (jjwt 0.11.5)** | Stateless token-based authentication |
| **Lombok** | Boilerplate code reduction |

### AI & External Services
| Technology | Purpose |
|-----------|---------|
| **Google Gemini 1.5 Flash** | AI evaluation engine for test responses |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │  React 18  │  │ Framer Motion│  │  Gemini AI (Direct)  │  │
│  │  + Vite    │  │  Animations  │  │  Client-Side Eval    │  │
│  └─────┬──────┘  └──────────────┘  └──────────┬──────────┘  │
│        │                                       │             │
│        │  REST API (Axios)                     │ HTTPS       │
└────────┼───────────────────────────────────────┼─────────────┘
         │                                       │
         ▼                                       ▼
┌─────────────────────┐              ┌────────────────────────┐
│  Spring Boot 3.2    │              │  Google Gemini API     │
│  ┌───────────────┐  │              │  generativelanguage    │
│  │  Controllers  │  │              │  .googleapis.com       │
│  ├───────────────┤  │              └────────────────────────┘
│  │  Services     │  │
│  ├───────────────┤  │
│  │  JPA Repos    │  │
│  ├───────────────┤  │
│  │  JWT Security │  │
│  └───────┬───────┘  │
│          │          │
└──────────┼──────────┘
           │
           ▼
┌─────────────────────┐
│    PostgreSQL DB     │
│  ┌───────────────┐   │
│  │ Users         │   │
│  │ Evaluations   │   │
│  │ Questions     │   │
│  │ Sessions      │   │
│  └───────────────┘   │
└──────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | ≥ 18.x |
| **Java JDK** | 17 |
| **Maven** | 3.8+ |
| **PostgreSQL** | 14+ |
| **Gemini API Key** | [Get free key](https://aistudio.google.com/) |

### 1. Clone the Repository

```bash
git clone https://github.com/Bharani6/SSB_Train.git
cd SSB_Train
```

### 2. Backend Setup

```bash
cd backend

# Configure your database connection
# Create/edit: src/main/resources/application.properties
```

Add the following to `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ssb_training
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

Build and run:

```bash
./mvnw spring-boot:run
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The application will be available at **http://localhost:5173**

### 4. Configure Gemini API Key

After logging in, the application will prompt you for your **Gemini API Key**. You can obtain one for free at [Google AI Studio](https://aistudio.google.com/).

The key is stored securely in `localStorage` and is used client-side to evaluate test responses.

---

## 🔑 Environment Variables

### Backend (`application.properties`)

| Variable | Description | Default |
|----------|-------------|---------|
| `spring.datasource.url` | PostgreSQL connection URL | `jdbc:postgresql://localhost:5432/ssb_training` |
| `spring.datasource.username` | Database username | — |
| `spring.datasource.password` | Database password | — |
| `spring.jpa.hibernate.ddl-auto` | Schema generation strategy | `update` |
| `server.port` | Backend server port | `8080` |

### Frontend (Client-Side)

| Key | Storage | Description |
|-----|---------|-------------|
| `GEMINI_API_KEY` | localStorage | Google Gemini API key for AI evaluation |
| `USER_DATA` | localStorage | Authenticated user session data (JSON) |

---

## 🤖 AI Evaluation Engine

The platform's standout feature is its **3-persona AI evaluation system** powered by Google Gemini 1.5 Flash:

### Evaluation Personas

| Persona | Role | Evaluation Focus |
|---------|------|-----------------|
| 🧠 **Psych** | Strict Psychologist | Natural thinking vs artificial, consistency, OLQ (Officer Like Qualities) visibility |
| 🪖 **GTO** | Ground Testing Officer | Initiative, team behavior, practical intelligence. Flags "bookish" answers aggressively |
| 🎯 **IO** | Interviewing Officer | Deep cross-questioning, bluff detection, clarity & confidence assessment |

### Evaluation Output

Each test submission produces:
- **Composite Score** (1–10)
- **3 Persona Feedback** paragraphs
- **Per-question Breakdown**: individual score, ideal answer, and explanation
- Results are persisted to the database for historical tracking

---

## 📁 Project Structure

```
ssb-training-system/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/ssb/training/backend/
│   │   ├── BackendApplication.java   # Application entry point
│   │   ├── config/                   # Security & CORS configuration
│   │   ├── controller/
│   │   │   ├── AuthController.java   # Login, Register, Password Reset
│   │   │   ├── EvaluationController.java  # Test submissions & analytics
│   │   │   └── QuestionController.java    # Question bank API
│   │   ├── entity/
│   │   │   ├── User.java            # User model
│   │   │   ├── SessionReport.java   # Evaluation session records
│   │   │   ├── DailySession.java    # Daily activity tracking
│   │   │   ├── SSBQuestion.java     # Question bank model
│   │   │   ├── OirNonVerbalQuestion.java  # OIR-specific questions
│   │   │   └── ...                  # Other domain models
│   │   └── repository/              # JPA repositories
│   └── pom.xml                      # Maven dependencies
│
├── frontend/                         # React + Vite Frontend
│   ├── src/
│   │   ├── App.jsx                  # Root component & routing
│   │   ├── main.jsx                 # Application entry point
│   │   ├── index.css                # Global styles
│   │   ├── components/
│   │   │   └── Navbar.jsx           # Navigation bar
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Authentication (premium UI)
│   │   │   ├── Register.jsx         # User registration
│   │   │   ├── ForgotPassword.jsx   # Password recovery flow
│   │   │   ├── Dashboard.jsx        # Main dashboard & module hub
│   │   │   ├── OirTest.jsx          # Officer Intelligence Rating
│   │   │   ├── WatTest.jsx          # Word Association Test
│   │   │   ├── PpdtTest.jsx         # Picture Perception Test
│   │   │   ├── TatTest.jsx          # Thematic Apperception Test
│   │   │   ├── SrtTest.jsx          # Situation Reaction Test
│   │   │   ├── SdtTest.jsx          # Self Description Test
│   │   │   ├── IoTest.jsx           # Interview simulation
│   │   │   ├── GdTest.jsx           # Group Discussion
│   │   │   ├── GpeTest.jsx          # Group Planning Exercise
│   │   │   ├── LecturetteTest.jsx   # Lecturette module
│   │   │   ├── EvaluationReport.jsx # Detailed AI report view
│   │   │   ├── Archive.jsx          # Historical records browser
│   │   │   └── ArchivalReport.jsx   # Date-wise report view
│   │   ├── services/
│   │   │   └── aiService.js         # Gemini AI integration
│   │   └── utils/                   # Helper utilities
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── LICENSE                           # Apache 2.0
└── README.md
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new candidate |
| `POST` | `/api/auth/login` | Authenticate & get JWT token |
| `POST` | `/api/auth/check-email` | Verify if email exists (for password recovery) |

### Evaluations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/evaluations/submit` | Submit a test evaluation |
| `GET` | `/api/evaluations/dashboard/{email}` | Get dashboard statistics |
| `GET` | `/api/evaluations/user/{email}` | Get all evaluations for a user |
| `GET` | `/api/evaluations/{email}/ping` | Update daily active status |

### Questions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/questions/{module}` | Get questions for a test module |

---

## 🎨 Design Philosophy

The UI follows a **premium military-themed dark design** with:

- 🌑 **Deep dark backgrounds** (`#06120b`) inspired by night operations
- 💚 **Emerald & amber accent palette** — military precision meets warmth
- ✨ **Glassmorphism effects** — frosted glass cards with backdrop blur
- 🎬 **Framer Motion animations** — smooth page transitions, hover effects, and micro-interactions
- 🖼️ **Hero slideshow panels** — cinematic SSB imagery on auth pages
- 📱 **Fully responsive** — optimized for desktop, tablet, and mobile

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Contribution Ideas

- [ ] Add more OIR question varieties
- [ ] Implement real-time group discussion with WebSockets
- [ ] Add voice input for Lecturette module
- [ ] Mobile app (React Native)
- [ ] Admin panel for question management
- [ ] Leaderboard & peer comparison

---

## 📄 License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

**Bharani** — [@Bharani6](https://github.com/Bharani6)

---

<p align="center">
  <strong>🇮🇳 Jai Hind! Train Hard, Serve Harder. 🇮🇳</strong>
</p>

<p align="center">
  <sub>Built with ❤️ for every SSB aspirant who dreams of wearing the uniform.</sub>
</p>
