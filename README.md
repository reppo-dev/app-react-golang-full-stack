# Full-Stack App: React + Golang Fiber

A modern full-stack web application with **React (TypeScript)** frontend and **Golang (Fiber)** backend. Features JWT authentication, role-based access control (RBAC), CRUD operations, and CSV export.

## 🛠 Tech Stack

### Frontend

- React 18 + TypeScript
- React Router Dom v6
- React Hook Form + Zod
- Tailwind CSS
- Axios

### Backend

- Golang + Fiber
- GORM (ORM)
- JWT Authentication
- MySQL/PostgreSQL

## ✨ Features

- **Authentication & Authorization**
  - JWT stored in HTTP‑only cookies
  - Password hashing with bcrypt
  - Role‑based access control (Admin / User / Manager)

- **Core Modules**
  - Products CRUD (Create, Read, Update, Delete)
  - Orders management
  - One‑click CSV export (Orders, Users, Products)
  - User & Role management (Admin only)

## 📁 Project Structure


├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Login.tsx
│ │ │ ├── Register.tsx
│ │ │ ├── Dashboard.tsx
│ │ │ ├── Products.tsx
│ │ │ ├── Users.tsx
│ │ │ ├── Orders.tsx
│ │ │ └── Profile.tsx
│ │ ├── components/
│ │ ├── services/
│ │ └── types/
│ └── package.json
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── middleware/
│ ├── routes/
│ └── main.go
│
└── README.md

## 🚀 Getting Started

### Backend

```bash
cd backend
go mod tidy
# set DB_URL and JWT_SECRET in .env
go run main.go


cd frontend
npm install
npm run dev
```
