# Quick Setup Guide

## Step 1: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```
PORT=5555
MONGO_URI=mongodb://localhost:27017/whisperwall
JWT_SECRET=somesecretkey
```

Seed the database:
```bash
npm run seed
```

Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5555`

## Step 2: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

## Step 3: Test with Postman

1. Import `postman_collection.json` into Postman
2. Test Admin Login first (this will set the token automatically)
3. Test all other endpoints

## Default Admin Credentials

- Email: `admin@college.edu`
- Password: `password123`

## Troubleshooting

- Make sure MongoDB is running
- Check that `.env` file exists in backend folder
- Ensure ports 5555 and 3000 are not in use
- Check console for error messages



