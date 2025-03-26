# 🧑‍💻 Backend – Flight Booking System

This is the **Node.js (Express + Prisma)-based backend** for the Flight Booking System. It powers all business logic behind user management, flight search, bookings, and real-time flight updates.

The backend is modular, testable, and built for scalability. Supabase handles auth and PostgreSQL database, while custom APIs manage flight logic, filtering, caching, and booking workflows.

---

## 🧱 System Design (Backend)

### 🏗️ Architecture Overview

[Client] → [Express API Layer] → [Supabase (PostgreSQL/Auth)] ↓ [Prisma ORM Layer] ↓ [Business Logic + Caching + SSE]

### 🧩 Key Concepts

- **Express.js API server** for all client interactions
- **Supabase PostgreSQL** as the primary DB (hosted)
- **Prisma ORM** for schema management and querying
- **Supabase Auth** for user signup/login and JWT-based access control
- **Server-Sent Events (SSE)** for real-time flight updates
- **Modular controllers/services architecture** (SRP, testable)
- **Cloud-deployed via Koyeb**, with CI/CD support
- **Swagger API docs** available at `/api/docs`

---

## 🗄️ Database Tables (via Prisma Schema)

### ✅ Users

```prisma
model User {
  id             String    @id @default(uuid())
  email          String    @unique
  password       String?
  fullName       String
  phoneNumber    String?
  createdAt      DateTime  @default(now())
  bookings       Booking[]
}
✈️ Flights
model Flight {
  id            String     @id @default(uuid())
  flightNumber  String
  airline       String
  origin        String
  destination   String
  departureTime DateTime
  arrivalTime   DateTime
  duration      Int
  price         Float
  availableSeats Int
  classType     ClassType
  createdAt     DateTime   @default(now())
}
🧳 Booking
model Booking {
  id            String     @id @default(uuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id])
  status        BookingStatus
  bookingDate   DateTime   @default(now())
  itineraries   Itinerary[]
}
🔀 Itinerary
model Itinerary {
  id          String    @id @default(uuid())
  bookingId   String
  booking     Booking   @relation(fields: [bookingId], references: [id])
  type        TripType  // one-way, round-trip, multi-city
  classType   ClassType
  passengers  Int
  legs        FlightLeg[]
}
🧱 Flight Legs
model FlightLeg {
  id          String    @id @default(uuid())
  itineraryId String
  itinerary   Itinerary @relation(fields: [itineraryId], references: [id])
  flightId    String
  flight      Flight    @relation(fields: [flightId], references: [id])
  departureDate DateTime
}

```

🧠 Core System Design Principles

Principle Implementation

```
Modular Design	/routes, /controllers, /services, /db
Separation of Concerns	API layer ≠ DB layer ≠ business logic
Scalability	Optimized queries, stateless APIs, SSE
Extensibility	Multi-city, fare calendar, seat change support
Performance	SSE, caching layer (IndexedDB + API), web workers on frontend
Observability	Logging, error tracking
Security	Supabase Auth + role-based access + input validation
```

⚙️ Tech Stack

```
Layer	Tech
Runtime	Node.js
Framework	Express.js
DB	Supabase PostgreSQL
Auth	Supabase Auth
ORM	Prisma
Realtime	Server-Sent Events (SSE)
Docs	Swagger
Deployment	Koyeb (Dockerized)
Email	Nodemailer or Supabase Edge Functions
Logging	Console-based or external integration
Testing	Vitest/Jest (Unit + Integration)
```

🔌 API Structure

```

/api/
  ├── auth/                 # Supabase auth integration
  ├── users/                # Get/update user profile
  ├── flights/              # Search flights, fare calendar, SSE
  ├── bookings/             # Book, cancel, modify
  └── utils/                # Health, logs, etc.
```

Sample Endpoints:

```
GET /api/flights?origin=DEL&destination=BOM&date=2025-03-28
POST /api/bookings – create a booking
PATCH /api/bookings/modify/:id – change date/class
POST /api/bookings/cancel/:id – cancel booking
GET /api/flights/status/subscribe – SSE stream
POST /api/flights/status/update – send flight status update
```

🧪 Local Development

# Setup

pnpm install

# Start dev server

pnpm run dev

# Lint + format

pnpm run lint

pnpm run format

# Run tests

pnpm run test
Backend runs on: http://localhost:5001

```
📜 Swagger Docs

Available at: http://localhost:5001/api/docs
✅ Supported Features

🔐 Auth + user info via Supabase
✈️ Flight search with query filters
📆 Fare calendar with date-based pricing
📦 Booking + e-ticket generation
🛫 Real-time flight updates (SSE)
🧾 Booking modification/cancellation
🧠 PDF itinerary generation (triggered on frontend)
🧪 Tests and error monitoring



## 🧠 System Design Principles
```

| Principle                    | Implementation & Justification                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------- |
| **Separation of Concerns**   | Clear split between API routes (`/routes`), business logic (`/services`), and data access (`/db`) |
| **Single Responsibility**    | Each controller/service does one job—e.g., `bookFlight()` handles booking logic only              |
| **Modular Architecture**     | Folder structure is layered and modular for maintainability, testing, and extensibility           |
| **Scalability**              | APIs are stateless, designed for horizontal scaling; SSE used for real-time without polling       |
| **Resilience**               | Error handling with proper try-catch blocks and response codes; retries handled client-side       |
| **Security**                 | Supabase Auth with JWT, role-based access; input validation with Zod/Yup                          |
| **Performance Optimization** | Web Workers (frontend) + filtered queries (backend); no overfetching from DB                      |
| **Offline Support**          | Frontend uses IndexedDB; backend supports cache-friendly APIs and deterministic responses         |
| **Real-time Communication**  | Implemented using Server-Sent Events (SSE) for live flight updates                                |
| **API-first Design**         | Backend exposes RESTful APIs designed with frontend use cases in mind, documented via Swagger     |
| **Infrastructure as Code**   | Docker-based deployment, reproducible builds                                                      |
| **Testing Strategy**         | Unit + integration tests written with clear separation of mocks and real services                 |
