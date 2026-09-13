# Ivy Homes — Full-Stack Real Estate Marketplace & Investigation Suite

> **Submission for Software Engineering Internship Assignment**  
> **Candidate:** Kuldip Gupta ([kuldipgupta@mnnit.ac.in](mailto:kuldipgupta@mnnit.ac.in))  
> **Repository:** [https://github.com/kuldipgupta/ivy-homes-assignment](https://github.com/kuldipgupta/ivy-homes-assignment)  
> **Live Demo:** [https://ivy-homes-marketplace.vercel.app](https://ivy-homes-marketplace.vercel.app)  
> **API Key:** `IVY26-8C91903DE8E1`  
> **Reference Evaluation Time:** `2026-09-10T00:00:00+05:30`

---

## Executive Summary

This repository contains a full-stack real estate marketplace and comprehensive Node.js investigation suite engineered specifically for the Ivy Homes Bangalore property dataset.

The system is architected around two major pillars:
1. **Automated Investigation & Verification Engine**: Scripts that probe upstream API endpoints, uncover 12 distinct API documentation discrepancies and dataset anomalies, and compute mathematically exact answers for all 10 evaluation questions.
2. **Production-Grade MERN Marketplace**: A responsive property discovery portal featuring sale listings, rental units, residential projects, MongoDB-backed favorites, JWT authentication with silent token refresh, interactive market analytics charts, and a real-time live API diagnostics drawer.

---

## System Architecture

```
                                    +----------------------------------------+
                                    |       Ivy Homes Upstream API           |
                                    |       (https://solve.ivy.homes)        |
                                    +-------------------+--------------------+
                                                        |
                                       X-API-Key Header | Axios / Rate-Limited
                                                        v
+---------------------------------------------------------------------------------------------------+
| Express.js Proxy & Normalization Engine (Port 5000)                                               |
|                                                                                                   |
|  +---------------------------+   +-------------------------------+   +-------------------------+  |
|  | Normalization Layer       |   | Resilience & Cache Engine     |   | Discrepancy Mitigator   |  |
|  | - Unit conversion (sqm->ft|   | - In-memory cached dataset    |   | - Silent 15m JWT refresh|  |
|  | - Lakhs/Crores project fix|   | - MongoDB graceful fallback   |   | - Local filter/sort fix |  |
|  | - Impossible data filter  |   | - 1200 req/min rate limiter   |   | - Synthesized analytics |  |
|  +---------------------------+   +-------------------------------+   +-------------------------+  |
+---------------------------------------------------+-----------------------------------------------+
                                                    |
                                      REST JSON API | /api/*
                                                    v
+---------------------------------------------------------------------------------------------------+
| React 18 + Vite SPA Frontend (Port 5173 / Production Dist)                                        |
|                                                                                                   |
|  * Property Discovery        * Rental Hub               * Builder Projects     * Market Insights  |
|  * Saved Watchlist (Auth)    * Real-time Diagnostics    * Responsive Filters   * Recharts Visuals |
+---------------------------------------------------------------------------------------------------+
```

### Architectural Safeguards & Design Decisions
- **Defensive Unit Normalization:** Project prices (`price_min` / `price_max`) in the upstream API mix Lakhs and Crores; listings from MagicHomes mix square meters and square feet. The backend normalizes all monetary values to standard INR and all areas to square feet before exposing them to the UI.
- **Silent JWT Refresh Interceptor:** The upstream authentication documentation falsely claims tokens expire in 24 hours (86,400s). In reality, tokens expire in 15 minutes (900s). Both the server auth layer and the frontend Axios interceptor capture `401 Unauthorized` responses and automatically exchange `refresh_token` via `/auth/refresh` without session disruption.
- **Resilient Multi-Tier Persistence:** Saved favorites use MongoDB when available and gracefully maintain state in-memory / local storage if the database is unreachable.
- **Server-Side Fallback Filtering & Sorting:** Upstream ignores `min_price`, `max_price`, and `order=desc`. The Express layer provides genuine multi-criteria filtering, search, and bidirectional sorting across the entire dataset.

---

## Investigation Answers (The 10 Evaluation Questions)

The questions below were answered by querying the empirical dataset retrieved from `https://solve.ivy.homes`:

| # | Question Key | Value | Technical Methodology & Integrity Notes |
|---|--------------|-------|-----------------------------------------|
| **Q1** | `total_listing_records` | **4,700** | Full pagination using `offset=0,50,...` beyond documented `total: 4381` until `offset=4650`. |
| **Q2** | `unique_properties` | **4,689** | Deduplicated by `(apartment_name, locality, bedroom, floor, carpet_area, facing_direction)`. 11 duplicate properties syndicate across portals. |
| **Q3** | `active_listings` | **3,722** | Filtered by `is_live === true`. Exactly 978 listings are inactive/withdrawn. |
| **Q4** | `corrupt_listing_ids` | **32 listings** | Impossible physical records: negative prices (8), `floor > total_floors` (8), `super_area < carpet_area` (8), and residential units with 0 bed/0 bath (8). Sorted alphabetically. |
| **Q5** | `total_monthly_rent` | **₹7,079,400** | Sum of `price` across all 204 rental units in assigned locality **Sarjapur Road**. |
| **Q6** | `avg_price_per_sqft_2bhk` | **₹21,141.32** | Mean of `(price / carpet_area)` across active 2BHK listings excluding corrupt records (Q4) and scam listings (Q9). Formatted to 2 decimal places. |
| **Q7** | `costliest_project` | **P10255** (₹48,900,000 / ₹4.89 Cr) | Normalized Lakhs (`>= 10`) and Crores (`< 10`). Unadjusted price was 4.89; normalized value is ₹4.89 Crores. |
| **Q8** | `listings_last_7_days` | **149** | Window `[2026-09-03T00:00:00+05:30, 2026-09-10T00:00:00+05:30)` in Indian Standard Time (IST). |
| **Q9** | `fake_listing_ids` | **92 listings** | Advance-token fee scam phrases: *"token amount of rs 25,000"*, *"booking amount is paid"*, *"below market price, this week only"*. |
| **Q10** | `projects_with_wrong_listing_count` | **392 projects** | Comparing `project.total_listings` against actual linked retrievable records grouped by `project_id`. |

All answers are verifiable via `npm run calculate` and exported to `submission.json`.

---

## Verified API Discrepancies (The 12 Findings)

The table below summarizes the 12 verified discrepancies documented in `submission.json`:

| Category | Endpoint | Documented Behavior | Actual Upstream Behavior | Architectural Impact |
|----------|----------|---------------------|--------------------------|----------------------|
| **Auth** | `*` (All) | API key passed as query parameter `?api_key=...` | Returns `401 Unauthorized`. Requires `X-API-Key` request header. | Query parameter authentication fails 100% of requests. Backend injects `X-API-Key` header on all requests. |
| **Auth** | `/auth/login` | Token valid for 24h (86,400s); returns user name & email; no refresh flow. | Token expires in 15 mins (900s); returns `refresh_token` and `refresh_url: /auth/refresh`; user name omitted. | Implemented silent JWT token refresh on server and client Axios interceptors; derived user names from email handle. |
| **Auth** | `/auth/logout` | Server-side token invalidation. | Returns `{ ok: true, note: 'tokens are stateless; discard them client side' }`. | Logout enforced client-side by clearing stored JWT and refresh tokens. |
| **Pagination** | `/v1/listings` | Supports `page` (default 1) and `limit` (max 200). Response returns `page`, `page_size`. | Ignores `page` (requires `offset`). Limit capped at 50 max. Response uses `offset`, `limit`, `has_more`. | Pagination proxy translates `page` to `offset = (page - 1) * limit` and caps requests at 50. |
| **Pagination** | `/v1/listings` | `total` is the exact number of matching records. | Metadata reports `total: 4381`, but paging continues until offset 4650 (yielding 4,700 total records). | Clients relying on `total` drop 319 active listings. Paging continues until `has_more === false`. |
| **Completeness**| `/v1/listings` | Returns only active sale listings. | Returns all 4,700 listings, including 978 with `is_live: false`. | Client and backend default to active listings and display status badges for inactive properties. |
| **Missing Routes** | `/v1/listing/{id}` | Singular `GET /v1/listing/{id}` returns single listing. | Returns `404 Not Found`. Working route is plural `GET /v1/listings/{id}`. | All routing mapped to plural endpoints. |
| **Missing Routes** | `/v1/listings/{id}/similar` | Returns 10 comparable properties. | Returns `404 Not Found`. | Backend calculates comparable listings based on locality, price bracket, and BHK. |
| **Missing Routes** | `/v1/analytics/summary` | Returns pre-computed city aggregates. | Returns `404 Not Found`. | Built custom analytics engine computing genuine median prices, rates/sqft, and distributions. |
| **Missing Routes** | `/v1/favourites` | Documented `/v1/favourites` for saved properties. | Returns `404 Not Found`. | Persisted user favorites in MongoDB with localStorage fallback. |
| **Filtering & Sorting** | `/v1/listings` | Supports `min_price`, `max_price`, `bedroom`, `order=desc`. | `min_price`, `max_price`, `order=desc` are ignored; `bedroom` ignored (requires `bhk`). | Express layer implements full multi-criteria filtering and bidirectional sorting. |
| **Data Units** | `/v1/projects` & `/v1/listings` | Integer Rupees everywhere; Area in square feet. | Projects: values `>= 10` are Lakhs, `< 10` are Crores. Listings: 24 MagicHomes listings report area in sqm. | Normalizer multiplies Lakhs/Crores into integer Rupees and converts sqm to sqft (`* 10.7639`). |

---

## Features Walkthrough

### 1. Home Marketplace
- Hero search by locality, BHK configuration, and budget.
- Quick locality chips for Bangalore's top residential hubs (Sarjapur Road, Whitefield, Indiranagar, Bellandur, etc.).
- Curated featured listings with verified status badges and live pricing.

### 2. Browse Sale Listings (`/listings`)
- Real-time multi-criteria filtering: Locality, BHK (1 to 4+ BHK), Property Type (Apartment, Villa, Plot, Builder Floor), Price Range, Furnishing, Status (Active vs Withdrawn).
- Bidirectional sorting: Price (Low to High, High to Low), Carpet Area, Date Posted.
- Data integrity badges: Highlights verified listings, withdrawn properties, and flagged corrupt records.
- True server-side pagination across all 4,700 listing records.

### 3. Residential Rentals (`/rentals` & `/rentals/:id`)
- Scoped exploration of Bangalore rental inventory including Sarjapur Road hub.
- Security deposit, maintenance fees, and preferred tenant type breakdown.
- Interactive visit booking & tenant application scheduler.

### 4. Builder Projects (`/projects` & `/projects/:id`)
- 520 residential development projects across Bangalore.
- Price ranges normalized from Lakhs and Crores into formatted INR.
- Cross-referenced actual available listing inventory vs project metadata.

### 5. Market Insights & Intelligence (`/insights`)
- Recharts visualizations: Locality median prices, Price/sqft distribution, BHK distribution.
- Interactive audit panels:
  - **Corrupt Records Inspector:** 32 impossible listings categorized by anomaly type (negative price, floor violation, area mismatch).
  - **Scam Detection Inspector:** 92 advance-token bait listings flagged with trigger phrases.
  - **Discrepancy Matrix:** Interactive audit of all 12 undocumented API behaviors.

### 6. User Watchlist & Saved Favorites (`/favourites` / `/saved`)
- Protected route requiring authentication.
- Persists user bookmarks in MongoDB with immediate client-side optimistic updates.
- Quick filter between Saved Sale Properties and Saved Rentals.

### 7. Real-Time API Diagnostics Drawer
- Floating diagnostics tool accessible from any page.
- Live inspection of outbound HTTP requests, status codes, latency, and discrepancy alerts.

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB** *(Optional)*: Local or MongoDB Atlas URI (falls back gracefully to in-memory/localStorage if not running)

### 1. Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/kuldipgupta/ivy-homes-assignment.git
cd ivy-homes-assignment

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 2. Environment Configuration

Create `.env` inside `server/`:

```bash
# server/.env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/ivy_homes_db
IVY_API_BASE_URL=https://solve.ivy.homes
IVY_API_KEY=IVY26-8C91903DE8E1
JWT_SECRET=super_secret_ivy_homes_jwt_key_2026
```

### 3. Running the Investigation Scripts

```bash
# 1. Fetch complete raw dataset from Ivy Homes API (cached to server/data/)
npm run fetch-data

# 2. Run API investigation & probe discrepancies
npm run investigate

# 3. Calculate answers to the 10 evaluation questions
npm run calculate

# 4. Generate final submission.json
npm run generate-submission
```

### 4. Running the Application Locally

In two separate terminals:

```bash
# Terminal 1: Start Express backend
cd server
npm run dev

# Terminal 2: Start Vite frontend
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

Demo credentials for logging in:
- **Email:** `demo1@ivy.homes` (or `demo2@ivy.homes`, `demo3@ivy.homes`)
- **Password:** `2d172eb5da`

### 5. Building for Production

```bash
# Build the React application
cd client
npm run build
```

---

## Directory Structure

```
ivy-homes-assignment/
├── .env.example
├── .gitignore
├── package.json               # Root scripts runner
├── README.md                  # Comprehensive documentation
├── submission.json            # Final assignment submission artifact
├── client/                    # React + Vite + Tailwind frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── components/        # Reusable UI components & Diagnostics drawer
│   │   ├── context/           # Auth, Favourites, and Diagnostics context
│   │   ├── layouts/           # Main application layout & navigation
│   │   ├── pages/             # All application views & detail screens
│   │   ├── services/          # Client API services with token refresh interceptor
│   │   └── utils/             # Formatters for INR, dates, and sqft
└── server/                    # Express backend & analysis suite
    ├── data/                  # Cached empirical datasets (listings, rentals, projects)
    ├── package.json
    └── src/
        ├── app.js             # Express application configuration
        ├── server.js          # Server entry point
        ├── config/            # DB and environment configuration
        ├── controllers/       # Route handlers
        ├── middleware/        # JWT auth, error handling, rate limiting
        ├── models/            # Mongoose schemas (User, Favourite)
        ├── routes/            # Modular Express routes
        ├── scripts/           # fetchAllData, investigateApi, calculateAnswers, generateSubmission
        ├── services/          # Business logic, Ivy API client, normalizers
        └── utils/             # Unit converters, API error handler, response standardizer
```

---

## License & Candidate Declaration

Developed with highest attention to data integrity, code cleanliness, and security best practices by **Kuldip Gupta** for the Ivy Homes Software Engineering Internship evaluation.
