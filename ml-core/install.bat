@echo off
REM TRAVIXO ML Server - Python 3.12 Installation Fix
REM This script fixes the numpy/Python 3.12 compatibility issue

echo.
echo ========================================
echo TRAVIXO ML Server Installation Fix
echo ========================================
echo.

REM Check Python version
echo Checking Python version...
python --version
echo.

REM Remove old virtual environment if exists
echo Removing old virtual environment...
if exist venv (
    echo Deleting existing venv...
    rmdir /s /q venv
)
echo.

REM Create new virtual environment
echo Creating new virtual environment...
python -m venv venv
echo.

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip
echo.

REM Install requirements
echo Installing requirements...
pip install -r requirements.txt
echo.

REM Verify installation
echo Verifying installation...
python -c "import fastapi, tensorflow, pandas, numpy; print('✅ All packages installed successfully!')"
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Activate virtual environment: venv\Scripts\activate
echo 2. Start ML server: python main.py
echo.
pause
