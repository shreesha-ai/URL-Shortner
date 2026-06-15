# URL Shortener with Analytics

A production-ready URL shortener application built with the MERN stack (MongoDB, Express, React, Node.js).

## Architecture

```ascii
+----------------+       +-------------------+       +-----------------+
|   React (Vite) | <---> |  Express Backend  | <---> |  MongoDB Atlas  |
|   Tailwind CSS |       |  (JWT Auth, API)  |       |   (Mongoose)    |
+----------------+       +-------------------+       +-----------------+
        ^                         |
        |                         v
        +-------------------------+
             Redirection Flow
```

## Features

- **Authentication**: Secure Signup/Login with JWT.
- **Shortening**: Generate unique short codes for any URL.
- **Analytics**: Track clicks, last visit time, and recent history.
- **Dashboard**: Professional UI for managing your links.
- **Copy & Delete**: Quick actions for every URL.

## Folder Structure

- `/backend`: Node.js Express server, Mongoose models, and API routes.
- `/frontend`: React application with Tailwind CSS and Vite.

## Setup Instructions

### Prerequisites
- Node.js installed.
- MongoDB Atlas account (or local MongoDB).

### Backend Setup
1. `cd backend`
2. Configure `.env` (MONGODB_URI, JWT_SECRET).
3. `npm install`
4. `npm start`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## API Documentation

- `POST /api/auth/signup`: User registration.
- `POST /api/auth/login`: User login.
- `POST /api/url`: Create shortened URL (Protected).
- `GET /api/url`: Get user's URLs (Protected).
- `DELETE /api/url/:id`: Delete URL (Protected).
- `GET /api/url/:id/analytics`: Get analytics (Protected).
- `GET /:shortCode`: Dynamic redirection.

## Deployment Instructions

### Render (Backend)
1. Link your GitHub repository.
2. Set Environment Variables (`MONGODB_URI`, `JWT_SECRET`, etc.).
3. Build Command: `cd backend && npm install`.
4. Start Command: `cd backend && node server.js`.

### Vercel (Frontend)
1. Link your GitHub repository.
2. Set `VITE_API_URL` to your backend URL.
3. Deploy!

### MongoDB Atlas
1. Create a cluster.
2. Add your IP to the allowlist.
3. Copy the connection string.

---
This project is a part of a hackathon run by https://katomaran.com
