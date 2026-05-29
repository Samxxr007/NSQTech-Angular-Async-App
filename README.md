<div align="center">

# 🔍 MPloyChek

### Enterprise Background Verification Platform

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

*A production-grade SaaS dashboard for managing employee background verification workflows with role-based access control, real-time analytics, and enterprise-level architecture.*

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Screenshots](#screenshots)
- [Docker Deployment](#docker-deployment)
- [Testing](#testing)

---

## 🎯 Overview

MPloyChek is an enterprise background verification management platform built as an internship assessment for **NSQTech**. It demonstrates production-quality engineering practices including:

- **Clean Architecture** — Modular, layered, SOLID-compliant codebase
- **Async Processing** — Simulated API latency with observable streams, retry logic, and loading states
- **RBAC** — JWT-based authentication with role guards on both frontend and backend
- **Enterprise UI** — Dark/light theme, glassmorphism, animated charts, skeleton loaders
- **Full-Stack TypeScript** — End-to-end type safety from database models to UI components

---

## ✨ Features

### Authentication
- 🔐 JWT-based authentication with token refresh
- 👥 Role-based access control (Admin / General User)
- 🔄 Auto-redirect based on auth state
- 💾 Remember me with persistent sessions
- 🔑 Password visibility toggle

### Dashboard
- 📊 Analytics cards with animated counters
- 📈 Interactive charts (ECharts) — verification status, risk distribution
- 📋 Recent cases overview table
- 🕒 Activity timeline with audit events
- ⏳ Skeleton loading states for all async data

### Case Management
- 📑 Sortable, searchable, paginated data table
- 🏷️ Color-coded status badges (Pending, In Progress, Completed, Failed, On Hold)
- ⚠️ Risk level indicators (Low → Critical)
- 🔍 Multi-filter (status, risk, verification type)
- ➕ Create/edit cases (admin only)

### Admin Panel
- 👤 User management (CRUD + enable/disable toggle)
- 🔑 Role assignment
- 📝 Audit log trail
- 🛡️ Route-guarded admin-only access

### UX / UI
- 🌙 Dark / Light theme toggle with persistence
- 🎨 Glassmorphism card effects
- ✨ Smooth route transition animations
- 📱 Fully responsive layout
- 🔔 Toast notifications
- 💀 Skeleton loaders for all data states

### Engineering
- ⏱️ Configurable API delay interceptor for async simulation
- 🔄 HTTP interceptors (JWT injection, error handling)
- 🧩 Reusable generic data table component
- 📐 Angular Signals + RxJS for reactive state
- 🏗️ Repository pattern on backend (easily swap to real DB)
- 🐳 Docker-ready with docker-compose

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Angular 17+)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Auth    │  │Dashboard │  │  Cases   │  │   Admin    │  │
│  │ Feature  │  │ Feature  │  │ Feature  │  │  Feature   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬──────┘  │
│       │              │              │              │         │
│  ┌────┴──────────────┴──────────────┴──────────────┴──────┐  │
│  │              Core Services + State Layer               │  │
│  │    (AuthService, ThemeService, HTTP Interceptors)       │  │
│  └────────────────────────┬───────────────────────────────┘  │
└───────────────────────────┼──────────────────────────────────┘
                            │ HTTP/REST + JWT
┌───────────────────────────┼──────────────────────────────────┐
│                      BACKEND (NestJS)                        │
│  ┌────────────────────────┴───────────────────────────────┐  │
│  │         API Gateway (Controllers + Guards)             │  │
│  │      (LatencyInterceptor, JWT Guard, Roles Guard)      │  │
│  └────┬──────────┬──────────────┬──────────────┬──────────┘  │
│       │          │              │              │              │
│  ┌────┴───┐ ┌───┴────┐  ┌─────┴─────┐  ┌────┴──────┐       │
│  │  Auth  │ │ Users  │  │   Cases   │  │  Audit    │       │
│  │Service │ │Service │  │  Service  │  │ Service   │       │
│  └────┬───┘ └───┬────┘  └─────┬─────┘  └────┬──────┘       │
│       │         │              │              │              │
│  ┌────┴─────────┴──────────────┴──────────────┴──────────┐  │
│  │            Database Layer (LowDB + Repository)         │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                            │
                   ┌────────┴────────┐
                   │  JSON Storage   │
                   │  (users.json,   │
                   │   cases.json,   │
                   │   audit.json)   │
                   └─────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Angular 17+ (Standalone) | SPA framework |
| **UI Library** | Angular Material | Component library |
| **Charts** | Apache ECharts (ngx-echarts) | Data visualization |
| **State** | RxJS + Angular Signals | Reactive state management |
| **Styling** | SCSS + CSS Custom Properties | Themeable styling |
| **Backend** | NestJS + TypeScript | API framework |
| **Auth** | JWT + Passport | Authentication |
| **Database** | LowDB (JSON) | Local persistence |
| **Validation** | class-validator | DTO validation |
| **Container** | Docker + Compose | Deployment |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- **Angular CLI** 17+ (`npm i -g @angular/cli`)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mploychek.git
cd mploychek

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

```bash
# Terminal 1 — Start backend (port 3000)
cd backend
npm run start:dev

# Terminal 2 — Start frontend (port 4200)
cd frontend
ng serve
```

Open **http://localhost:4200** in your browser.

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@mploychek.com | Admin@123 |
| **User** | user@mploychek.com | User@123 |

---

## 📁 Project Structure

```
mploychek/
├── backend/                        # NestJS API Server
│   ├── src/
│   │   ├── auth/                   # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   └── strategies/
│   │   ├── cases/                  # Verification cases module
│   │   ├── users/                  # User management module
│   │   ├── audit/                  # Audit logging module
│   │   ├── common/                 # Shared guards, interceptors, decorators
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── filters/
│   │   │   └── decorators/
│   │   ├── database/               # LowDB repository layer
│   │   ├── config/                 # App configuration
│   │   └── models/                 # TypeScript interfaces
│   └── data/                       # JSON data files (auto-generated)
│
├── frontend/                       # Angular 17+ SPA
│   └── src/
│       ├── app/
│       │   ├── core/               # Singleton services, interceptors, guards
│       │   ├── shared/             # Reusable components, pipes, models
│       │   ├── features/           # Feature modules (lazy loaded)
│       │   │   ├── auth/           # Login page
│       │   │   ├── dashboard/      # Analytics dashboard
│       │   │   ├── cases/          # Case management
│       │   │   └── admin/          # Admin panel
│       │   └── layout/             # Shell, sidebar, navbar
│       ├── styles/                 # Global SCSS
│       └── environments/           # Environment configs
│
├── docker-compose.yml
└── README.md
```

---

## 📡 API Documentation

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | Public | Authenticate and receive JWT |
| `GET` | `/api/auth/me` | JWT | Get current user profile |
| `POST` | `/api/auth/refresh` | JWT | Refresh access token |

### Verification Cases

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/cases` | JWT | List cases (paginated, filterable) |
| `GET` | `/api/cases/:id` | JWT | Get case by ID |
| `POST` | `/api/cases` | Admin | Create new case |
| `PATCH` | `/api/cases/:id` | Admin | Update case |
| `DELETE` | `/api/cases/:id` | Admin | Delete case |

### Users (Admin Only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/users` | Admin | List all users |
| `POST` | `/api/users` | Admin | Create user |
| `PATCH` | `/api/users/:id` | Admin | Update user |
| `DELETE` | `/api/users/:id` | Admin | Delete user |
| `PATCH` | `/api/users/:id/toggle` | Admin | Toggle active status |

### Audit Log

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/audit` | Admin | Get audit trail |

### Query Parameters (Cases)

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `search` | string | Search by employee name or company |
| `status` | string | Filter by status |
| `riskLevel` | string | Filter by risk level |
| `verificationType` | string | Filter by type |
| `sortBy` | string | Sort field |
| `sortOrder` | 'asc' \| 'desc' | Sort direction |

---

## 🔐 Authentication Flow

```
User Login → POST /auth/login → Validate credentials → Generate JWT → Return token + profile
    ↓
Store token in localStorage → Attach via HTTP interceptor → API calls authenticated
    ↓
Route Guards check token validity → Roles Guard checks role → Allow/deny access
    ↓
401 Response → Error Interceptor → Clear token → Redirect to /login
```

---

## 🖼 Screenshots

> Screenshots will be added after the application is running.

| Screen | Description |
|--------|-------------|
| Login | Enterprise login with branding |
| Dashboard | Analytics with charts and stat cards |
| Cases | Searchable, sortable data table |
| Admin | User management panel |

---

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## 🧪 Testing

```bash
# Backend unit tests
cd backend
npm run test

# Frontend unit tests
cd frontend
ng test
```

---

## 📝 Engineering Decisions

| Decision | Rationale |
|----------|-----------|
| **LowDB over MongoDB** | Zero infrastructure setup, clean repository abstraction allows easy swap |
| **Angular Standalone** | Modern Angular 17+ pattern, no NgModule boilerplate, better tree-shaking |
| **NestJS over Express** | Built-in DI, decorators, guards mirror enterprise patterns |
| **SCSS + CSS Custom Properties** | Theme switching without rebuild, maximum flexibility |
| **ECharts over Chart.js** | Better enterprise chart aesthetics, more chart types |
| **Simulated Latency** | Demonstrates async handling, loading states, optimistic UI patterns |

---

## 📄 License

This project is built for **MPloyChek / NSQTech** internship assessment.

---

<div align="center">
  <sub>Built with ❤️ using Angular 17+, NestJS, and TypeScript</sub>
</div>
