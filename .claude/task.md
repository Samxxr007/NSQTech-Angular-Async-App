You are a senior full-stack software engineer and system architect.

Your task is to build a production-quality internship assessment project for MPloyChek / NSQTech.

This is NOT a beginner CRUD app.
The application must look like a real enterprise SaaS dashboard with clean architecture, modularity, async handling, role-based access control, and professional UI/UX.

====================================================
TECH STACK REQUIREMENTS
====================================================

Frontend:
- Angular 17+ standalone architecture preferred
- TypeScript strict mode
- Angular Material OR PrimeNG
- RxJS best practices
- Route guards
- Lazy loaded modules
- Reactive Forms
- Signals where useful
- SCSS styling
- Responsive enterprise UI

Backend:
- Node.js + Express OR NestJS
- TypeScript
- Modular API architecture
- JWT authentication (dummy/local acceptable)
- Simulated async delays
- REST APIs
- Clean service layer

Database:
Use ONE:
- MongoDB
- DynamoDB
- Local JSON DB
- SQLite

Preferred:
Use low-complexity local JSON persistence with clean repository abstraction.

====================================================
APPLICATION REQUIREMENTS
====================================================

Build a complete SPA application.

ROLES:
1. General User
2. Admin

====================================================
FEATURES
====================================================

1. LOGIN PAGE
- Enterprise-style login UI
- Fields:
  - User ID
  - Password
  - Role selector
- Include:
  - form validation
  - loading states
  - error handling
  - password visibility toggle
  - remember me checkbox

Use dummy authentication API.

Backend should:
- validate credentials
- return JWT token
- return user profile
- simulate network delay

Create seeded users:
Admin:
- admin@mploychek.com
- password: Admin@123

General User:
- user@mploychek.com
- password: User@123

====================================================
2. DASHBOARD PAGE
====================================================

After login:
- Show user profile card
- Show role badge
- Show async loading skeletons
- Fetch records from API
- Display records in modern data table

Table features:
- sorting
- pagination
- search/filter
- status badges
- loading spinner
- empty states

Dummy records should represent:
- background verification cases
- employee records
- verification statuses

Example columns:
- Employee Name
- Company
- Verification Type
- Status
- Created Date
- Risk Level

====================================================
3. ADMIN FEATURES
====================================================

If logged in as Admin:
- show admin panel
- manage users
- create users
- edit users
- delete users
- enable/disable users
- role assignment

Use RBAC route guards.

====================================================
4. ASYNC PROCESSING REQUIREMENT
====================================================

VERY IMPORTANT:
Demonstrate asynchronous processing clearly.

Implement:
- configurable API delay interceptor
- fake latency simulation
- retry handling
- optimistic UI updates
- observable streams
- loading progress indicators

Show:
- dashboard loading workflow
- delayed API calls
- concurrent requests

====================================================
5. APPLICATION ARCHITECTURE
====================================================

Use enterprise architecture.

Frontend structure:
- core/
- shared/
- features/
- auth/
- dashboard/
- admin/
- services/
- interceptors/
- guards/
- models/
- state/

Backend structure:
- controllers/
- services/
- repositories/
- middleware/
- routes/
- models/

====================================================
6. UI/UX REQUIREMENTS
====================================================

Design inspiration:
- enterprise SaaS dashboard
- modern HRTech platform
- clean dark/light theme
- glassmorphism subtle effects
- smooth animations
- professional typography

Must include:
- responsive layout
- sidebar navigation
- top navbar
- animated charts
- dashboard widgets
- toast notifications
- skeleton loaders
- empty states
- hover effects

Color palette:
Use professional blue + cyan + white enterprise palette.

DO NOT make it look like a student project.

====================================================
7. ADVANCED FEATURES TO IMPRESS REVIEWERS
====================================================

Include these if possible:

- Theme switcher
- JWT interceptor
- HTTP interceptor
- Route animations
- State management
- Dashboard analytics cards
- Audit logs
- Activity timeline
- Reusable generic table component
- Environment configs
- Docker support
- API documentation
- Unit tests for key components
- Role-based menu rendering

====================================================
8. CODE QUALITY
====================================================

CRITICAL:
This project will be reviewed by engineers.

Code must:
- follow SOLID principles
- use reusable components
- avoid duplicated logic
- use interfaces/types properly
- include comments only where necessary
- follow clean naming conventions
- use scalable folder structure

NO copied boilerplate style.

====================================================
9. GITHUB REQUIREMENTS
====================================================

Generate:
- professional README.md
- setup instructions
- architecture explanation
- screenshots placeholders
- API flow explanation
- feature list
- folder structure explanation

Also generate:
- meaningful commit messages
- clean Git history strategy

====================================================
10. OUTPUT FORMAT
====================================================

Work step-by-step.

First generate:
1. system architecture
2. folder structure
3. API contract
4. database schema
5. UI wireframe plan

Then implement:
- backend
- frontend
- authentication
- dashboard
- admin module
- async simulation
- polish UI

Do not skip steps.
Do not generate simplistic code.
Always explain engineering decisions briefly.

Act like a senior engineer building a real SaaS MVP.