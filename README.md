# Enterprise HRMS - Project Implementation & Architecture Summary

## 🚀 Overview
The **Enterprise Human Resource Management System (HRMS)** is a production-ready monorepo full-stack application built with **NestJS**, **React (TypeScript + Vite + Tailwind CSS)**, and **PostgreSQL (via Prisma ORM)**. It features 14 core modules, strict CIDR-based internal network enforcement for attendance check-ins, progressive payroll calculation engine, leave workflow, and comprehensive audit trails.

---

## 🏗️ System Architecture

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Glassmorphic UI Aesthetics.
- **Backend**: NestJS 10, TypeScript, Passport JWT + Refresh Token Rotation, Swagger API Docs (`/api/docs`).
- **Database**: PostgreSQL with Prisma ORM (36 entities fully normalized).
- **Network Security**: `ipaddr.js` CIDR subnet matching directly on incoming request socket connection headers (`x-forwarded-for`, `remoteAddress`).

---

## 🔒 Critical Security Feature: CIDR Network Attendance Validation
To satisfy the core requirement of restricting attendance check-in/out to approved internal company networks:

1. **Backend Layer (`IpValidatorUtil`)**: Extracts the actual client IP address from socket connection headers. It compares the IP against active trusted network CIDR ranges (e.g. `192.168.1.0/24`, `10.0.0.0/8`, or `::ffff:127.0.0.1/128`).
2. **Untrusted Client Protection**: Any IP data passed in request bodies or query parameters by the frontend is **strictly ignored**.
3. **Rejection Exception**: When an unauthorized IP attempts attendance actions, the system throws a `ForbiddenException` with error code `ATTENDANCE_NETWORK_NOT_ALLOWED`.
4. **Dedicated Frontend Kiosk (`/my-attendance`)**: Displays a real-time digital clock, client IP address, network authorization badge, and prominently displays `ATTENDANCE_NETWORK_NOT_ALLOWED` when outside company Wi-Fi.

---

## 💰 Payroll Calculation Engine Formula
Implemented in `backend/src/payroll/payroll.service.ts`:

Net Salary = (Base + Allowances + Bonuses + Overtime Pay + Commission) - Deductions - Insurance - Tax

- **Overtime Rates**: 1.5x weekdays, 2.0x weekends.
- **Social/Health Insurance**: Capped progressive rate deduction based on `InsuranceConfiguration`.
- **Personal Income Tax (PIT)**: Progressive tax brackets stored in `TaxConfiguration`.

---

## 📁 Monorepo Directory Structure

```text
EmployeeManager/
├── package.json               # Root workspace scripts
├── .env.example               # System environment variables
├── backend/                   # NestJS Backend API
│   ├── prisma/
│   │   ├── schema.prisma      # 36 Core Entities & Relations
│   │   └── seed.ts            # Seed Data (Roles, Admin, Shifts, Tax Brackets)
│   └── src/
│       ├── auth/              # JWT + Refresh Tokens & Guards
│       ├── common/            # IpValidatorUtil, Roles Decorators
│       ├── employees/         # Employee CRUD & Profiles
│       ├── departments/       # Department Tree & Hierarchy
│       ├── positions/         # Job Titles & Salary Bands
│       ├── networks/          # Trusted Network CIDRs
│       ├── devices/           # Registered Device Tracking
│       ├── shifts/            # Work Shifts & Scheduling
│       ├── attendance/        # CIDR Restricted Attendance Check-In/Out
│       ├── leave/             # Balances & Approval Workflow
│       ├── overtime/          # Overtime Requests & Approvals
│       ├── payroll/           # Tax, Insurance, Automated Payroll Engine
│       ├── reports/           # Analytics & CSV Exports
│       ├── notifications/     # In-App Notifications
│       └── audit/             # Immutable Security Audit Trail
└── frontend/                  # React + TypeScript + Vite + Tailwind UI
    ├── src/
    │   ├── context/           # AuthContext & ThemeContext
    │   ├── components/        # Glassmorphic StatCards, Badges, Modals, Sidebar
    │   ├── services/          # Axios Interceptors & Auto-Refresh
    │   └── pages/             # All 15 Interactive Module Views
```

---

## 🏃 Local Deployment & Quickstart Instructions

### 1. Database Setup
Ensure PostgreSQL is running locally on your Linux machine:
```bash
sudo service postgresql start
# Create database
psql -U postgres -c "CREATE DATABASE hrms_db;"
```

### 2. Configure Environment Variables
Copy `.env.example` to `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hrms_db?schema=public"
JWT_SECRET="hrms_super_secret_jwt_access_key_2026"
JWT_REFRESH_SECRET="hrms_super_secret_jwt_refresh_key_2026"
PORT=4000
FRONTEND_URL="http://localhost:5173"
```

### 3. Run Database Migrations & Seed Data
```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Start Development Servers
From the root directory:
```bash
# Run both backend and frontend concurrently
npm run dev
```

- **Frontend Portal**: `http://localhost:5173`
- **Backend API**: `http://localhost:4000/api/v1`
- **Swagger API Documentation**: `http://localhost:4000/api/docs`

---

## 🔑 Pre-seeded Demo Accounts
- **Super Admin**: `admin@hrms.com` / `Password123!`
- **HR Admin**: `hr@hrms.com` / `Password123!`
- **Manager**: `manager@hrms.com` / `Password123!`
- **Employee**: `employee@hrms.com` / `Password123!`
# EmployeeManage
