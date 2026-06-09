# House Renting Dublin

A full-stack property rental platform for Dublin, Ireland. Landlords can post listings with photos and location, renters can browse, filter, and view available properties.

**Live**: [houserenting.xyz](https://houserenting.xyz)

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16, React 19, TailwindCSS 4, Leaflet (maps) |
| **Backend** | NestJS 11, TypeScript, Prisma ORM 7 |
| **Database** | PostgreSQL (Prisma Cloud) |
| **Auth** | JWT + Passport.js, token blacklisting on logout |
| **Storage** | Cloudinary (images) |
| **Email** | Resend (verification, password reset) |
| **Monitoring** | Sentry (API + frontend) |
| **Infra** | Docker, Docker Compose |

---

## Features

- **Property listings** — Create, edit, and delete rental ads with up to 10 photos
- **Advanced search** — Filter by area code, property type, room type, price, bedrooms
- **Interactive map** — Leaflet map showing property location on detail pages
- **Authentication** — Register, login, logout with email verification
- **Password reset** — Secure token-based flow with 15-minute expiry
- **Image management** — Cloudinary upload with file type/size validation
- **Rate limiting** — Global (100 req/60s) and per-endpoint limits
- **Swagger docs** — Auto-generated API docs at `/api/docs`
- **Mobile-first** — Responsive UI with bottom navigation for mobile

---

## Project Structure

```
house-renting/
├── api/                    # NestJS backend
│   ├── src/
│   │   ├── auth/           # JWT auth, guards, strategies
│   │   ├── property/       # Listing CRUD
│   │   ├── users/          # User profile management
│   │   ├── upload/         # Cloudinary image upload
│   │   ├── email/          # Resend email service
│   │   ├── health/         # Health check endpoint
│   │   └── prisma/         # Database client
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── Dockerfile
│
├── web/                    # Next.js frontend
│   ├── app/                # App Router pages
│   │   ├── dashboard/      # Hero + recent listings
│   │   ├── properties/     # Search, detail, edit
│   │   ├── place-ad/       # Create listing
│   │   ├── profile/        # User profile
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-email/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── components/         # Shared UI components
│   ├── context/            # Auth context (global state)
│   ├── lib/                # API client wrappers
│   ├── hooks/              # Custom React hooks
│   └── Dockerfile
│
└── docker-compose.yml
```

---

## Database Schema

| Model | Key Fields |
|---|---|
| **User** | id, email, name, passwordHash, emailVerified |
| **Property** | id, street, number, areaCode, eirCode, propertyType, roomType, bedrooms, bathrooms, price, availableFrom, availableUntil |
| **Image** | id, url, publicId, propertyId |
| **VerificationToken** | token, userId, expiresAt (24h) |
| **PasswordResetToken** | token, userId, expiresAt (15min) |
| **TokenBlacklist** | token (for JWT logout) |

**Enums**: `PropertyType` (HOUSE, APARTMENT, FLAT, STUDIO) · `RoomType` (SINGLE, DOUBLE, SHARED)

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register + send verification email |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/verify-email` | Verify email via token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| POST | `/api/auth/logout` | Logout + blacklist token |

### Properties
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/properties` | No | List all (supports filters) |
| POST | `/api/properties` | Yes | Create listing |
| GET | `/api/properties/me` | Yes | Get own listings |
| GET | `/api/properties/:id` | No | Get property detail |
| PATCH | `/api/properties/:id` | Yes (owner) | Update listing |
| DELETE | `/api/properties/:id` | Yes (owner) | Delete listing |

### Users & Upload
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/me` | Yes | Get profile |
| PATCH | `/api/users/me` | Yes | Update profile |
| POST | `/api/upload/house-photos` | Yes | Upload images (max 10, 10MB each) |
| DELETE | `/api/upload` | Yes | Delete image from Cloudinary |
| GET | `/api/health` | No | Health check |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (for containerized setup)
- PostgreSQL database
- Cloudinary account
- Resend account

### Environment Variables

**Backend** (`api/.env`):
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="<random-32-byte-hex>"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"
FRONTEND_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000"
PORT=8080
```

**Frontend** — set at build time or in `web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Local Development

```bash
# Backend
cd api
npm install
npm run start:dev
# API: http://localhost:8080/api
# Swagger: http://localhost:8080/api/docs

# Frontend (separate terminal)
cd web
npm install
npm run dev
# Web: http://localhost:3000
```

### Docker Compose

```bash
docker-compose up -d
# Web: http://localhost:3000
# API: http://localhost:3001/api
```

---

## Scripts

### Backend (`api/`)

| Command | Description |
|---|---|
| `npm run start:dev` | Development server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start:prod` | Production server |
| `npm test` | Unit tests |
| `npm run test:e2e` | End-to-end tests |
| `npm run lint` | Lint and auto-fix |
| `npm run format` | Format with Prettier |

### Frontend (`web/`)

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | ESLint |

---

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens blacklisted on logout
- Email verification required before login
- Image uploads validated by MIME type and magic bytes
- Global rate limiting + tighter limits on auth endpoints
- Input validation via `class-validator` DTOs

---

## License

MIT
