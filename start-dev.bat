@echo off
cd backend
start "Backend Server" cmd /k "poetry run python manage.py runserver"
cd ..\frontend
start "Frontend Server" cmd /k "npm start"
cd ..