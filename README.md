# JVL Cart Clone

A MERN stack e-commerce app (products, auth, cart, checkout, orders, image upload).

## Setup

### Backend
```
cd backend
npm install
```
Fill in `backend/config/config.env` with your own values (Mongo URI, JWT secret, Cloudinary keys).

### Frontend
```
cd frontend
npm install
```

### Run both together (from root)
```
npm install
npm run dev:full
```

Backend runs on http://localhost:8000, frontend on http://localhost:3000 (proxied to backend).

See PROJECT_NOTES.md for a full file-by-file explanation of the code.
