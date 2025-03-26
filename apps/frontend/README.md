# 🧑‍💻 Frontend – Flight Booking System

This is the **Next.js-based frontend** for the Flight Booking System. It allows users to search, book, and manage flight reservations with support for one-way, round-trip, and multi-city itineraries. Designed to be offline-capable, fast, mobile-friendly, and real-time interactive.

---

## 🧱 System Design (Frontend)

### 🔄 Data Flow

[User] → Search Form → Input is validated and stored (React Context) → Calls Backend API or Supabase for results → Results are displayed from cache or live

[Search Results Page] → Uses IndexedDB to cache results → Filtering/Sorting happens in Web Workers → UI animated with Framer Motion

[Booking] → Pre-fills passenger info → Confirmation triggers API → Success popup shown + redirect to My Bookings

[My Bookings] → Displays all trips (with filters) → Allows seat/date change or cancel → Exports PDF via React-to-Print

---

### 🎯 Responsibilities

- Client-side routing for all user flows
- Smart validation on dates, segments, fare calendar
- IndexedDB support for offline caching
- Web Workers for heavy sorting/filtering
- SSE for real-time flight status
- Framer Motion for micro animations
- Dynamic PDF generation for bookings
- Responsive on all screen sizes

---

### ⚙️ Tech Stack

| Layer        | Tech                                             |
| ------------ | ------------------------------------------------ |
| Framework    | Next.js (App Router)                             |
| UI           | Tailwind CSS, Framer Motion, React Icons         |
| State        | React Context API + local hooks                  |
| Animations   | Framer Motion                                    |
| Offline Data | IndexedDB (via idb)                              |
| Workers      | Web Workers for filtering/sorting large datasets |
| Printing     | react-to-print for PDF exports                   |
| Data Fetch   | Custom Express backend APIs + Supabase DB/Auth   |

---

### 🧩 Key Features

- 🎫 One-way, round-trip, and multi-city flight search
- ✨ Animated and accessible UI
- 📆 Fare calendar with heatmap pricing
- 🧳 Passenger + class selection
- 🧠 Web Worker based performance filtering/sorting
- 🔁 Real-time status updates via SSE
- 📦 IndexedDB caching of flight results
- 📝 PDF generation of booking details
- ✅ Responsive design for mobile/tablet/desktop

---

### 🗂️ Folder Structure

```
apps/frontend/
├── components/             # UI components (forms, cards, filters)
│   ├── flight-search/      # Trip type tabs, date pickers, selectors
│   ├── flight-card/        # Direct and connecting flight cards
│   ├── filters/            # Sidebar filter widgets
│   ├── bookings/           # My bookings, details, confirmation UI
│   └── common/             # Buttons, skeletons, inputs, layout
├── lib/                    # Utility functions (Web Workers, API, cache)
├── pages/                  # App routes and pages
├── public/                 # Static assets (images, logos)
├── styles/                 # Tailwind base + globals
├── tests/                  # Frontend unit/component tests
└── README.md               # You're here
```

---

### 🛠️ Local Development

```bash
# Install pnpm globally (if not already)
npm install -g pnpm

# Install project dependencies
pnpm install

# Run the app in dev mode
pnpm run dev
By default, the frontend will be available at:
👉 http://localhost:3000
🚀 Production Build
# Build the app
pnpm run build

# Start the app in production
pnpm run start
```
