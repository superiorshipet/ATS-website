# 🚀 ATS-websit - Smart Recruitment Platform

[![PHP Version](https://img.shields.io/badge/PHP-8.3-blue.svg)](https://php.net)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://postgresql.org)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev)
[![Railway](https://img.shields.io/badge/Railway-Deployed-brightgreen.svg)](https://railway.app)

---

## 📖 Overview

**ATS-websit** is a comprehensive Applicant Tracking System (ATS) designed to connect job seekers with employers through an intelligent and efficient platform. It streamlines the entire recruitment process from job posting to candidate tracking.

### 🎯 Key Features

- ✅ **Resume Management** - Build and upload professional resumes
- ✅ **Job Search** - Browse and filter available job positions
- ✅ **Online Applications** - Apply to jobs with one click
- ✅ **Application Tracking** - Monitor the status of your applications
- ✅ **Role-Based Dashboards** - Customized interfaces for each user type
- ✅ **Smart Chatbot** - AI-powered assistant for user support
- ✅ **Admin Panel** - Complete platform management and analytics

---

## 👥 User Roles

| Role | Function | Permissions |
|------|----------|-------------|
| 🎓 **Graduate** | Job Seeker | Build resume, Apply to jobs, Track applications |
| 🏢 **Employer** | Company/Recruiter | Post jobs, Manage jobs, Review applicants |
| 👑 **Admin** | Platform Manager | Manage users, Monitor jobs, Platform analytics |

---

## 🛠️ Tech Stack

### Backend
- **PHP 8.3** - Server-side language
- **PostgreSQL 15** - Database
- **PDO** - Database connection
- **PHP Built-in Server** - Development server

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type-safe code
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling and design
- **React Router DOM** - Navigation

### Deployment
- **Railway** - Cloud hosting platform
- **Nixpacks** - Build and deployment

---

## 📂 Project Structure
ATS-website/
├── 📁 config/ # Configuration files
│ └── database.php # Database connection
│
├── 📁 controllers/ # Business logic
│ ├── AuthController.php # Authentication
│ ├── JobController.php # Job management
│ ├── ApplicationController.php # Applications
│ ├── ProfileController.php # User profiles
│ ├── AdminController.php # Admin panel
│ └── CVController.php # Resume builder
│
├── 📁 routes/ # API routes
│ └── api.php # All API endpoints
│
├── 📁 src/ # React frontend
│ ├── 📁 app/
│ │ ├── 📁 pages/ # Application pages
│ │ │ ├── Auth.tsx # Login/Register
│ │ │ ├── Home.tsx # Homepage
│ │ │ ├── Root.tsx # Layout
│ │ │ ├── 📁 graduates/ # Graduate pages
│ │ │ ├── 📁 employers/ # Employer pages
│ │ │ └── 📁 admin/ # Admin pages
│ │ └── 📁 components/ # Reusable components
│ └── 📁 styles/ # CSS files
│
├── 📁 uploads/ # Uploaded files
│ ├── avatars/ # User profile pictures
│ └── resumes/ # Resume files (PDF/DOC)
│
├── 📁 public/ # Public assets
├── index.php # Backend entry point
├── package.json # Frontend dependencies
└── README.md # This file


---

## 🚀 Local Development Setup

### Prerequisites

- PHP 8.3 or higher
- PostgreSQL 15 or higher
- Node.js 18 or higher
- pnpm or npm

### Installation Steps

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/superiorshipet/ATS-website.git
cd ATS-website


2️⃣ Setup Database

# Create database
sudo -u postgres psql -c "CREATE DATABASE ats_system;"
sudo -u postgres psql -c "CREATE USER ats_user WITH PASSWORD 'ats123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ats_system TO ats_user;"

# Run database schema
sudo -u postgres psql -d ats_system -f database.sql


3️⃣ Install Dependencies
bash

# Install frontend dependencies
pnpm install
# OR
npm install

4️⃣ Start Backend Server
bash

php -S localhost:8000

5️⃣ Start Frontend Server
bash

# In a new terminal window
pnpm run dev
# OR
npm run dev

6️⃣ Open Browser


http://localhost:3000


🔑 Test Login Credentials
Role	Email	Password
👑 Admin	admin@ats.com	admin123
🎓 Graduate	graduate@test.com	123456
🏢 Employer	company@test.com	123456
📡 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/login	User login
POST	/api/auth/register	User registration
Jobs
Method	Endpoint	Description
GET	/api/jobs	Get all jobs
GET	/api/jobs/{id}	Get specific job
POST	/api/jobs	Create new job
PUT	/api/jobs/{id}	Update job
DELETE	/api/jobs/{id}	Delete job
Applications
Method	Endpoint	Description
POST	/api/applications	Apply to job
GET	/api/applications	Get user applications
Profile
Method	Endpoint	Description
GET	/api/profile	Get user profile
PUT	/api/profile	Update user profile
Admin
Method	Endpoint	Description
GET	/api/admin/users	Get all users
GET	/api/admin/stats	Get platform stats
🚢 Deployment on Railway
Automatic Deployment

    Push code to GitHub

    Create account on Railway

    Click "Deploy from GitHub repo"

    Select your repository

    Add environment variables

Required Environment Variables
env

DATABASE_URL=postgresql://user:pass@host:port/database
VITE_API_URL=https://your-app.up.railway.app/api

Manual Deployment
bash

# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up

# Add database
railway add

🧪 Testing API
bash

# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ats.com","password":"admin123"}'

# Get all jobs
curl http://localhost:8000/api/jobs

# Get platform stats
curl http://localhost:8000/api/admin/stats

💬 Smart Chatbot Commands

The platform includes an AI-powered chatbot to assist users:
Command	Response
hello / hi	Greeting message
jobs / work	Job search information
resume / cv	Resume building instructions
login / register	Authentication help
employer / company	Employer features
graduate / student	Graduate features
help / support	Show all commands
🤝 Contributing

We welcome contributions! Please follow these steps:

    Fork the repository

    Create a new branch (git checkout -b feature/amazing-feature)

    Make your changes (git commit -m 'Add amazing feature')

    Push to branch (git push origin feature/amazing-feature)

    Open a Pull Request

📝 License

This project is licensed under the MIT License.
📞 Contact & Support

    Email: support@ats-website.com

    Website: https://ats-website-production.up.railway.app

    GitHub: https://github.com/superiorshipet/ATS-website

🙏 Acknowledgments

Special thanks to all contributors and open-source projects that made this possible.

