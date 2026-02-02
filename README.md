# MicroSaaS Platform

A comprehensive full-stack platform that guides users to build their own MicroSaaS applications using AI-powered templates. Built with React + Vite + TypeScript on the frontend and FastAPI + MySQL on the backend.

## Features

- 🔐 **Authentication System** - Secure email/password authentication with JWT tokens
- 📊 **Dashboard** - Overview with statistics and quick actions
- 📝 **Templates** - Browse and use pre-built MicroSaaS templates
- 📚 **Documentation** - Comprehensive guides for building your SaaS
- 🛒 **Marketplace** - Premium integrations and features
- 💳 **Subscription Management** - Multiple pricing tiers
- ⚙️ **Settings** - User profile and preferences management

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Axios** - HTTP client

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - ORM
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## Color Theme

- Primary: `#f7a252` (Orange)
- Secondary: `#120d08` (Dark Brown/Black)
- No gradients used throughout the design

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **MySQL** 8.0+

## Installation

### 1. Clone the Repository

```bash
cd makeprod_ai
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env` if needed (default API URL is `http://localhost:8000`).

### 3. Backend Setup

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

### 4. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE microsaas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update `backend/.env` with your MySQL credentials:

```env
DATABASE_URL=mysql+pymysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/microsaas
SECRET_KEY=your-very-long-random-secret-key-here
```

The database tables will be created automatically when you start the backend server.

## Running the Application

### Start the Backend

```bash
cd backend
# Activate virtual environment if not already activated
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

### Start the Frontend

Open a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Sign up with your email and password
3. You'll be redirected to the dashboard
4. Explore the different pages using the sidebar navigation:
   - **Dashboard** - View your overview and stats
   - **Templates** - Browse MicroSaaS templates
   - **Docs** - Read documentation
   - **Marketplace** - Explore integrations
   - **Subscription** - Manage your plan
   - **Settings** - Update your profile

## Project Structure

```
makeprod_ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   └── DashboardLayout.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   └── LoginSignup.tsx
│   │   │   ├── Dashboard/
│   │   │   ├── Templates/
│   │   │   ├── Docs/
│   │   │   ├── Marketplace/
│   │   │   ├── Subscription/
│   │   │   └── Settings/
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── store/
│   │   │   └── authStore.ts
│   │   ├── types/
│   │   │   └── auth.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── backend/
    ├── models/
    │   └── user.py
    ├── routes/
    │   └── auth.py
    ├── schemas/
    │   └── user.py
    ├── utils/
    │   └── auth.py
    ├── main.py
    ├── config.py
    ├── database.py
    └── requirements.txt
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user (protected)

### Health

- `GET /` - API information
- `GET /health` - Health check

## Development

### Frontend Development

```bash
cd frontend
npm run dev  # Start dev server
npm run build  # Build for production
npm run preview  # Preview production build
```

### Backend Development

The FastAPI server runs with auto-reload enabled for development.

Access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (.env)

```env
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/microsaas
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
CORS_ORIGINS=["http://localhost:5173"]
```

## Security Notes

⚠️ **Important for Production:**

1. Change the `SECRET_KEY` in backend `.env` to a strong, random value
2. Use environment-specific configuration
3. Enable HTTPS
4. Configure proper CORS origins
5. Use strong database passwords
6. Implement rate limiting
7. Add input validation and sanitization

## License

MIT License - feel free to use this template for your own projects!

## Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ using React, FastAPI, and modern web technologies.
