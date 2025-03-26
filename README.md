# ✈️ Flight Booking System

A full-stack web-based flight booking platform allowing users to search, book, and manage flight reservations — with support for one-way, round-trip, and multi-city itineraries. Designed with performance, modern UX, and scalability in mind.

---

## 🔗 Live Demo

👉 [Visit the Live App](https://flight-booking-frontend-three.vercel.app)  
🔙 Backend API deployed on [Koyeb](https://tropical-doroteya-metheme-5c0caad1.koyeb.app)

---

## 🧱 System Architecture

![System Architecture](https://ytjwfsvqxlgwnzmvukpf.supabase.co/storage/v1/object/public/images//Screenshot%202025-03-26%20at%209.38.47%20PM.png)

---

## 📦 Key Features

- 🔐 Authentication & User Profiles (Supabase Auth)
- 🔍 Flight Search (One-way / Round-trip / Multi-city)
- 📆 Fare Calendar with price heatmap
- 💺 Booking Flow with real-time seat availability
- ✉️ Email Notifications on Booking/Updates
- 🔁 Modify/Cancel Booking + Real-Time Updates (SSE)
- 🛜 Offline Search Caching (IndexedDB)
- 🧠 Optimized Filters & Sorting (Web Workers)
- 📃 Booking Details Page with PDF Download
- 📊 Admin Dashboard _(in progress)_

---

## 🧱 Tech Stack

| Layer    | Tech                                                     |
| -------- | -------------------------------------------------------- |
| Frontend | React, Next.js, Tailwind CSS, Framer Motion, React Icons |
| Backend  | Express.js, Prisma, SSE, Nodemailer                      |
| Database | Supabase (PostgreSQL)                                    |
| Auth     | Supabase Auth                                            |
| DevOps   | Docker, Vercel (frontend), Koyeb (backend)               |
| Testing  | Jest, Supertest (unit + integration)                     |
| Caching  | IndexedDB, Web Workers                                   |

---

## 🗂️ Monorepo Structure

```txt
.
├── apps
│   ├── frontend   # Next.js client app
│   └── backend    # Express.js API with Prisma
├── prisma         # DB schema and migrations
├── public         # Shared assets
├── .env           # Environment variables
├── Dockerfile     # Monorepo-aware Docker setup
├── docker-compose.yml
└── README.md      # (you are here)

```

#

# Local Development

### Install pnpm globally (if not already installed)

npm install -g pnpm

### Install all project dependencies

pnpm install

### Run all apps in development mode

pnpm run dev

### Build all apps using Turborepo

pnpm run build

### Start all apps in production mode

pnpm run start
