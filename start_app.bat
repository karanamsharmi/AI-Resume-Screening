@echo off
setlocal
cd /d "%~dp0"

echo Starting AI Resume Screening application...
echo.
echo This will build and start the backend and frontend containers.
echo If Docker is not installed, please install Docker Desktop first.
echo.

docker compose up --build

if errorlevel 1 (
    echo.
    echo Failed to start the application.
    echo Make sure Docker Desktop is running and that Docker Compose is available.
    echo.
    pause
)
