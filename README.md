# Financial_data_dashboard

Interactive, full-stack dashboard for uploading CSVs and exploring quarterly/yearly financial data across multiple entities. Users can register/login, upload line items or CSVs, search by old/new codes, and view tables and charts. Built with **Django + DRF** (backend) and **React** (frontend).

---

## Features
- 🔐 Authentication with JWT (signup, login, logout)
- 📂 CSV ingestion (files or line items)
- 📊 Data views: tables, bar, pie, donut, and utilization charts
- 🏛 Entity-level and aggregate reporting
- 📅 Quarterly & yearly rollups
- 🔎 Search/filter by old/new codes
- 🌗 Light/dark theme toggle

---

## Architecture

React (frontend) → Django REST API (backend) → Database (SQLite/Postgres)

- **React**: Dashboard UI, charts, table, theming  
- **Django + DRF**: Auth, uploads, financial data APIs  
- **DB**: Users, entities, line items, uploads  

---

## Tech Stack
- **Backend**: Python, Django, Django REST Framework  
- **Frontend**: React, Axios, React-Router, React-Toastify  
- **Database**: SQLite (dev), PostgreSQL (prod)  

---

## Setup Instructions

### Backend

git clone https://github.com/CITATS928/Financial_data_dashboard.git

python -m venv .venv
. .venv/Scripts/activate   # Windows
# source .venv/bin/activate   # Mac/Linux

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver

Frontend
  cd frontend
  npm install
  npm start

Screenshots
Signup
![image alt](https://github.com/CITATS928/Financial_data_dashboard/blob/0dd167eafda400d37b55c630a40fdd09da4a2d0a/Signup%20Page.png)
Login
![image_alt](https://github.com/CITATS928/Financial_data_dashboard/blob/0dd167eafda400d37b55c630a40fdd09da4a2d0a/Login%20Page.png)
Dashboard
![image_alt](https://github.com/CITATS928/Financial_data_dashboard/blob/0dd167eafda400d37b55c630a40fdd09da4a2d0a/Dashboard.png)
Charts

Bar Chart
![image_alt](https://github.com/CITATS928/Financial_data_dashboard/blob/0dd167eafda400d37b55c630a40fdd09da4a2d0a/Bar%20Chart.png)
Pie Chart
![image_alt](https://github.com/CITATS928/Financial_data_dashboard/blob/0dd167eafda400d37b55c630a40fdd09da4a2d0a/Pie%20Chart.png)
Donut Chart
![image_alt](https://github.com/CITATS928/Financial_data_dashboard/blob/0dd167eafda400d37b55c630a40fdd09da4a2d0a/Donut%20Chart.png)
Utilization Chart
![image_alt](https://github.com/CITATS928/Financial_data_dashboard/blob/0dd167eafda400d37b55c630a40fdd09da4a2d0a/Utilization%20Chart.png)

API Reference

Auth

  POST /api/signup/

  POST /api/login/

  POST /api/logout/

  GET /api/user/

Uploads

  POST /dashboard/upload/

  GET /api/my/uploads/files/

Financial Data

  GET /api/financial-data/?filters

  GET /api/aggregate-report/

  GET /api/entity/{id}/

CSV Format

  entity, date, year, quarter, code_old, code_new, description, amount_actual, amount_budget

Troubleshooting

  403 errors → Configure CSRF or use JWT

  405 errors → Check HTTP verb and URL

  CORS issues → Add frontend URL to CORS_ALLOWED_ORIGINS

  JWT issues → Confirm axios interceptor is set

Roadmap

  Report exports (CSV/XLSX/PDF)

  Saved dashboards per user

  Role-based access control

  Docker deployment

  CI/CD integration