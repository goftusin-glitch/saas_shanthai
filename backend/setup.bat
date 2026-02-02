@echo off
echo ========================================
echo MicroSaaS Platform - Backend Setup
echo ========================================
echo.

echo [1/4] Creating Python virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo Error: Failed to create virtual environment
    pause
    exit /b 1
)
echo ✓ Virtual environment created
echo.

echo [2/4] Activating virtual environment...
call venv\Scripts\activate
if %errorlevel% neq 0 (
    echo Error: Failed to activate virtual environment
    pause
    exit /b 1
)
echo ✓ Virtual environment activated
echo.

echo [3/4] Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [4/4] Setup environment file...
if not exist .env (
    copy .env.example .env
    echo ✓ Created .env file
    echo.
    echo ⚠ IMPORTANT: Please edit .env and update:
    echo   - DATABASE_URL with your MySQL credentials
    echo   - SECRET_KEY with a secure random key
) else (
    echo ✓ .env file already exists
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit backend\.env with your database credentials
echo 2. Create the database: CREATE DATABASE microsaas;
echo 3. Run: uvicorn main:app --reload
echo.
pause
