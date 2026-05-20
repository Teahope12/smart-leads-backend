# Smart Leads Backend API

[![Node.js](https://img.shields.io/badge/Node.js-18.0+-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-green)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange)](https://jwt.io/)
[![Docker](https://img.shields.io/badge/Docker-24.0+-blue)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 📋 Overview

A production-ready RESTful API backend for the Smart Leads Dashboard - a comprehensive lead management system built with **Node.js**, **Express.js**, **TypeScript**, and **MongoDB**.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with secure token handling
- User registration and login with bcrypt password hashing
- Protected routes with authentication middleware
- Role-Based Access Control (Admin / Sales User)
- Token expiration and refresh capability

### 📊 Lead Management
- Complete CRUD operations for leads
- Advanced filtering (by status, source, date range)
- Real-time search (case-insensitive on name/email)
- Sorting (latest first / oldest first)
- Server-side pagination (10 records per page)
- CSV export with applied filters

### 👥 User Roles & Permissions

| Feature | Admin | Sales User |
|---------|-------|------------|
| View all leads | ✅ | ❌ (own only) |
| Create leads | ✅ | ✅ |
| Update leads | ✅ | ✅ |
| Delete leads | ✅ | ❌ |
| Export CSV | ✅ | ✅ |
| View analytics | ✅ | ✅ (limited) |

### 📈 Analytics Dashboard API
- Total leads count and trends
- Lead distribution by status and source
- Conversion rates and performance metrics
- Top performers identification
- Recent activity tracking

### 🛡️ Security Features
- Password hashing with bcrypt (10 rounds)
- JWT token authentication with expiration
- Request validation using express-validator
- CORS configuration for frontend access
- Environment variable protection
- No sensitive data in code

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4.18+ | Web framework |
| TypeScript | 5.0+ | Type safety |
| MongoDB | 7.0+ | NoSQL database |
| Mongoose | 8.0+ | ODM for MongoDB |
| JSON Web Token | 9.0+ | Authentication |
| bcryptjs | 2.4+ | Password hashing |
| express-validator | 7.0+ | Input validation |
| Docker | 24.0+ | Containerization |

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn package manager
- Git (optional)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-leads-backend.git
cd smart-leads-backend
2. Install dependencies
bash
npm install
3. Set up environment variables
bash
cp .env.example .env
Edit the .env file with your configuration:

env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/smart_leads

# JWT Authentication
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d

# Security
BCRYPT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:5173
4. Start MongoDB
Local MongoDB:

bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
Or use MongoDB Atlas (cloud):

Create a free cluster at MongoDB Atlas

Get your connection string

Update MONGODB_URI in .env

5. Run the application
bash
# Development mode (with auto-reload)
npm run dev

# Build for production
npm run build

# Production mode
npm start
🐳 Docker Setup
Build and run with Docker
bash
# Build the Docker image
docker build -t smart-leads-backend .

# Run the container
docker run -d \
  --name smart-leads-backend \
  -p 5000:5000 \
  --env-file .env \
  smart-leads-backend

# View logs
docker logs -f smart-leads-backend

# Stop container
docker stop smart-leads-backend
Docker Compose (with MongoDB)
bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
📡 API Documentation
Base URL
text
http://localhost:5000/api