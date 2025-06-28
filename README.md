# Task Management Elite

A world-class full-stack task management application built with Next.js 15, Node.js/Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, Node.js/Express, TypeScript, PostgreSQL, Drizzle ORM
- **Real-time Communication**: Socket.IO for live updates
- **Authentication**: JWT-based auth with refresh tokens
- **State Management**: Zustand + React Query for optimal data flow
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries
- **Styling**: Tailwind CSS with Radix UI components
- **Development**: Hot reloading, TypeScript, ESLint, Prettier
- **Deployment**: Docker containers with production-ready configuration

## 🏗️ Project Structure

```
task-management/
├── 📁 client/                    # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/                  # App Router pages
│   │   ├── components/           # Reusable components
│   │   ├── lib/                  # API client & utilities
│   │   └── stores/               # Zustand stores
│   └── package.json
├── 📁 server/                    # Node.js/Express Backend
│   ├── src/
│   │   ├── db/                   # Database schema & connection
│   │   ├── middleware/           # Express middleware
│   │   ├── routes/               # API routes
│   │   └── utils/                # Server utilities
│   └── package.json
├── 📁 shared/                    # Shared types & utilities
│   ├── src/
│   │   ├── types/                # TypeScript types
│   │   └── utils/                # Shared utilities
│   └── package.json
├── 📄 package.json               # Root workspace configuration
├── 📄 docker-compose.yml         # Development containers
└── 📄 .env.example               # Environment variables template
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 16+ (or use Docker)
- Git

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd task-management

# Install dependencies for all packages
npm install

# Copy environment variables
cp .env.example .env
```

### 2. Environment Configuration

Edit `.env` file with your configuration:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskmanagement

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL and Redis containers
docker-compose up -d postgres redis

# Wait for containers to be ready, then run migrations
npm run db:migrate
```

#### Option B: Local PostgreSQL

```bash
# Create database
createdb taskmanagement

# Run migrations
npm run db:migrate
```

### 4. Start Development

```bash
# Start both client and server in development mode
npm run dev

# Or start individually:
npm run dev:client    # Frontend on http://localhost:3000
npm run dev:server    # Backend on http://localhost:5000
```

## 📦 Available Scripts

### Root Level Commands

```bash
npm run dev              # Start both client and server
npm run build            # Build all packages
npm run test             # Run all tests
npm run lint             # Lint all packages
npm run docker:dev       # Start development containers
```

### Client Commands

```bash
cd client
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Lint client code
npm run test             # Run client tests
npm run test:e2e         # Run E2E tests
```

### Server Commands

```bash
cd server
npm run dev              # Start Express dev server
npm run build            # Build TypeScript
npm run start            # Start production server
npm run test             # Run server tests
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data
```

## 🔧 Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/task-management

# Make changes and test
npm run dev
npm run test
npm run lint

# Commit with conventional commits
git add .
git commit -m "feat: add task creation functionality"

# Push and create PR
git push origin feature/task-management
```

### 2. Database Changes

```bash
# Modify schema files in server/src/db/schema/
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate
```

### 3. Adding Dependencies

```bash
# Add to specific package
cd client && npm install package-name
cd server && npm install package-name
cd shared && npm install package-name

# Add to root (development tools)
npm install -D package-name
```

## 🐳 Docker Development

### Full Stack with Docker

```bash
# Start all services (PostgreSQL, Redis, Server, Client)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Database Only

```bash
# Start only database services
docker-compose up -d postgres redis

# Connect to PostgreSQL
docker exec -it task-postgres-dev psql -U postgres -d taskmanagement
```

## 🔒 Authentication Flow

1. **Registration**: POST `/api/auth/register`
2. **Login**: POST `/api/auth/login`
3. **Token Storage**: JWT stored in httpOnly cookie + localStorage
4. **API Requests**: Automatic token attachment via Axios interceptors
5. **Token Refresh**: Automatic refresh on 401 responses
6. **Logout**: POST `/api/auth/logout` + client-side cleanup

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users` - Get all users (protected)

### Projects
- `GET /api/projects` - Get user projects (protected)

### Tasks
- `GET /api/tasks` - Get user tasks (protected)

## 🎨 Frontend Architecture

### State Management
- **Zustand**: Global state (auth, UI preferences)
- **React Query**: Server state management and caching
- **React Hook Form**: Form state management

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Animations and transitions

### Key Features
- Type-safe API client with automatic error handling
- Real-time updates via Socket.IO
- Responsive design with mobile-first approach
- Dark/light theme support
- Optimistic updates for better UX

## 🛠️ Backend Architecture

### Database
- **PostgreSQL**: Primary database
- **Drizzle ORM**: Type-safe database queries
- **Redis**: Caching and session storage

### Security
- JWT authentication with refresh tokens
- Rate limiting and request validation
- CORS configuration
- Helmet.js security headers
- Input sanitization and validation

### Real-time Features
- Socket.
