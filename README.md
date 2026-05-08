# system-design
# iCore Celebrations

A full-stack web-based birthday planning platform.
By: Isha Ilyas & Isha Khan — Capstone Project

## Project Overview

iCore Celebrations allows users to:
- Browse birthday themes, venues, services, and packages
- Build a personalized event plan with cost estimates
- Complete checkout and submit orders for admin approval
- Track order status from their profile page

Admins can:
- Approve or reject customer orders
- Add, edit, and delete themes, venues, services, and packages

---

## Tech Stack
Frontend | React.js 
Backend | Node.js, Express.js 
Database | MySQL 
Authentication | JWT + bcrypt 
Frontend Deployment | Vercel 
Backend Deployment | Render 
Database Hosting | Railway 

---

Make sure you have the following installed before starting

- **Node.js** (v18 or higher) — [nodejs.org](https://nodejs.org)
- **MySQL** (v8.0 or higher) — [mysql.com](https://www.mysql.com)
- **MySQL Workbench** (recommended) — [mysql.com/products/workbench](https://www.mysql.com/products/workbench/)
- **Git** — [git-scm.com](https://git-scm.com)
- **npm** (comes with Node.js)

To verify installations:
```bash
node -v
npm -v
mysql --version
git --version
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/repo
```

---

### 2. Database Setup (MySQL)

#### Step 1 — Open MySQL Workbench and connect to your local MySQL server
#### Step 2 — Create the database and tables
#### Step 3 — Insert  data

schema.sql file included in the file 

#### Step 4 — Create admin account

Generate a hashed password first:
```bash
cd backend
node -e "const bcrypt = require('./node_modules/bcrypt'); bcrypt.hash('admin123', 10).then(h => console.log(h));"
```

Then run this SQL (replace the hash with the output from above):
```sql
USE icore_celebrations;
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@icore.com', 'PASTE_HASH_HERE', 'admin');
```

---

### 3. Backend Setup

#### Step 1 — Navigate to the backend folder
```bash
cd backend
```

#### Step 2 — Install dependencies
```bash
npm install
```

#### Step 3 — Create the `.env` file

Create a file named `.env` inside the `backend/` folder:

```bash
touch .env
```

Add the following content (replace with your actual MySQL credentials):

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=icore_celebrations
DB_PORT=3306
JWT_SECRET=icore_super_secret_key_123
```

> ⚠️ Never commit the `.env` file to GitHub. It is already listed in `.gitignore`.

#### Step 4 — Start the backend server
```bash
node server.js
```

You should see:
```
Server running on port 3001
Database connected successfully
```

---

### 4. Frontend Setup

#### Step 1 — Navigate to the frontend folder
```bash
cd frontendi
```

#### Step 2 — Install dependencies
```bash
npm install
```

#### Step 3 — Create the `.env` file

Create a file named `.env` inside the `frontendi/` folder:

```bash
touch .env
```

Add the following:

```env
REACT_APP_BACKEND_URL=http://localhost:3001
```

> To use the deployed backend instead, replace with:
> `REACT_APP_BACKEND_URL=https://icore-backend.onrender.com`

---

## Running the Application

You need **two terminals** running simultaneously:

**Terminal 1 — Start the backend:**
```bash
cd backend
node server.js
```

**Terminal 2 — Start the frontend:**
```bash
cd frontendi
npm start
```

The application will open automatically at:
```
http://localhost:3000
```

The backend runs at:
```
http://localhost:3001
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port for the Express server | `3001` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `yourpassword` |
| `DB_NAME` | Database name | `icore_celebrations` |
| `DB_PORT` | MySQL port | `3306` |
| `JWT_SECRET` | Secret key for JWT signing | `any_long_random_string` |

### Frontend (`frontendi/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | Base URL of the backend API | `http://localhost:3001` |

## API Endpoints

### Public (no authentication required)
```
GET  /api/themes              All themes
GET  /api/themes/:id          Single theme
GET  /api/venues              All venues
GET  /api/venues/:id          Single venue
GET  /api/services            All services
GET  /api/services/:id        Single service
GET  /api/packages            All packages
GET  /api/packages/:id        Single package
POST /api/auth/register       Register new user
POST /api/auth/login          Login user
```

### Protected (JWT required)
```
GET    /api/plans/my                  Get current plan
POST   /api/plans/theme               Create/update plan
POST   /api/plans/services            Add service to plan
POST   /api/plans/packages            Add package to plan
PUT    /api/plans/guests              Update guest count
DELETE /api/plans/services/:id        Remove service
DELETE /api/plans/packages/:id        Remove package
DELETE /api/plans/my                  Delete entire plan
POST   /api/orders                    Create order
GET    /api/orders/my                 Get user's orders
GET    /api/orders/:id                Get single order
POST   /api/checkout/create-session   Process payment
```

### Admin only (admin JWT required)
```
GET    /api/admin/orders              All orders
POST   /api/admin/orders/:id/approve  Approve order
POST   /api/admin/orders/:id/reject   Reject order
POST   /api/admin/themes              Add theme
PUT    /api/admin/themes/:id          Edit theme
DELETE /api/admin/themes/:id          Delete theme
POST   /api/admin/venues              Add venue
PUT    /api/admin/venues/:id          Edit venue
DELETE /api/admin/venues/:id          Delete venue
POST   /api/admin/services            Add service
PUT    /api/admin/services/:id        Edit service
DELETE /api/admin/services/:id        Delete service
POST   /api/admin/packages            Add package
PUT    /api/admin/packages/:id        Edit package
DELETE /api/admin/packages/:id        Delete package
```

---

## Deployment

The production system is deployed at:

| Service | Platform | URL |
|---------|----------|-----|
| Backend | Render | https://icore-backend.onrender.com |
| Database | Railway MySQL | ICORE_CELEBRATIONS database |
| Frontend | Vercel |  |

> **Note:** Render's free plan sleeps after 15 minutes of inactivity. The first request may take 30-60 seconds. Open the backend URL a few minutes before presenting to wake it up.

---

## Troubleshooting

**Backend won't start:**
- Check that MySQL is running locally
- Verify `.env` file exists in `backend/` with correct credentials
- Run `node server.js` from inside the `backend/` folder, not the root

**"Cannot connect to database":**
- Confirm MySQL service is running
- Check `DB_PASSWORD` in `.env` matches your MySQL root password
- Verify `DB_NAME` matches the database you created

**Frontend shows blank or errors:**
- Check that backend is running on port 3001
- Verify `REACT_APP_BACKEND_URL=http://localhost:3001` in `frontendi/.env`
- Restart the frontend after changing `.env`

**Port already in use:**
```bash
# Find and kill process on port 3001
lsof -i :3001
kill -9 <PID>
```