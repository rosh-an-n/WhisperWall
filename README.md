# WhisperWall - Anonymous College Feedback System

**College Capstone Project**

WhisperWall is a full-stack web application that allows students to anonymously submit feedback, complaints, or suggestions to their college administration. Admins can log in to view, manage, and reply to those feedback entries.

## 📋 Project Overview

This project is built as a typical Node.js + Express + MongoDB + Mongoose backend application, suitable for a 2nd-year Computer Science capstone project evaluation. The focus is on building a robust backend API with a minimal frontend for demonstration purposes.

## 💻 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-rate-limit** - Rate limiting middleware
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React.js** - UI library
- **React Router** - Routing
- **Vite** - Build tool

### Development
- **nodemon** - Development server with auto-reload

## 📁 Project Structure

```
whisperwall/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── feedbackController.js
│   │   │   └── adminController.js
│   │   ├── models/
│   │   │   ├── AdminUser.js
│   │   │   └── Feedback.js
│   │   ├── routes/
│   │   │   ├── feedbackRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── middlewares/
│   │   │   ├── auth.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validation.js
│   │   └── index.js
│   ├── seed.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── SubmitFeedback.jsx
│   │   │   ├── FeedbackFeed.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── postman_collection.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   Create a `.env` file in the `backend` directory with the following content:
   ```
   PORT=5555
   MONGO_URI=mongodb://localhost:27017/whisperwall
   JWT_SECRET=somesecretkey
   ```
   **Note:** For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

4. **Seed the database:**
   ```bash
   npm run seed
   ```
   This will create:
   - One admin user: `admin@college.edu` / `password123`
   - 30 sample feedback entries across different categories

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5555`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:3000`

## 🧪 Testing with Postman

1. **Import the collection:**
   - Open Postman
   - Click "Import"
   - Select `postman_collection.json` from the project root

2. **Set up environment variables:**
   - The collection includes a `baseUrl` variable set to `http://localhost:5555`
   - The `adminToken` variable will be automatically set after logging in

3. **Test the APIs:**
   - Start with "Admin Login" to get the JWT token
   - The token will be automatically saved to the collection variable
   - Test all other endpoints using the saved token

### Sample API Endpoints

#### Public Endpoints

- **POST** `/api/feedback` - Submit anonymous feedback
- **GET** `/api/feedback` - Get public feedback list (paginated)
- **GET** `/api/feedback/:id` - Get single public feedback
- **GET** `/api/health` - Health check

#### Admin Endpoints (JWT Protected)

- **POST** `/api/admin/auth/login` - Admin login
- **GET** `/api/admin/feedback` - Get all feedback (with filters)
- **GET** `/api/admin/feedback/:id` - Get feedback details (including private fields)
- **PUT** `/api/admin/feedback/:id/status` - Update feedback status
- **POST** `/api/admin/feedback/:id/reply` - Add reply to feedback
- **DELETE** `/api/admin/feedback/:id` - Delete feedback

## 📊 Database Models

### AdminUser
```javascript
{
  name: String,
  email: String (unique, required),
  passwordHash: String,
  role: String (enum: ['admin', 'moderator']),
  createdAt: Date
}
```

### Feedback
```javascript
{
  title: String (required, max 150 chars),
  content: String (required),
  category: String (enum: ['Canteen', 'Academics', 'Hostel', 'Infrastructure', 'Transport', 'Other']),
  tags: [String],
  contactEmail: String (optional),
  status: String (enum: ['open', 'in-progress', 'resolved', 'closed']),
  isPublic: Boolean (default: true),
  replies: [{
    message: String,
    public: Boolean,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- **Password Hashing:** Admin passwords are hashed using bcrypt
- **JWT Authentication:** Admin endpoints are protected with JWT tokens
- **Rate Limiting:** Feedback submission is rate-limited (5 requests per 15 minutes per IP)
- **Input Validation:** All inputs are validated before processing
- **Data Sanitization:** Sensitive fields (contactEmail) are hidden from public APIs

## 📝 API Request/Response Examples

### Submit Feedback
```json
POST /api/feedback
{
  "title": "Canteen Food Quality",
  "content": "The food quality needs improvement.",
  "category": "Canteen",
  "tags": ["food", "quality"],
  "contactEmail": "student@example.com"
}
```

### Admin Login
```json
POST /api/admin/auth/login
{
  "email": "admin@college.edu",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": { ... }
  }
}
```

## 🎯 Frontend Pages

1. **Submit Feedback** (`/`) - Form to submit anonymous feedback
2. **Public Feed** (`/feed`) - Display public feedback with search and filter
3. **Admin Login** (`/admin/login`) - Admin authentication page
4. **Admin Dashboard** (`/admin/dashboard`) - Manage feedback, view details, add replies, change status

## 📚 Viva Answers

### Key Points to Explain During Viva

1. **Backend Architecture:**
   - The backend is built using Node.js, Express.js, and MongoDB with Mongoose ODM
   - The application follows MVC (Model-View-Controller) architecture pattern
   - Routes, controllers, models, and middleware are organized in separate folders for modularity

2. **Anonymous Feedback System:**
   - Anonymous feedback is stored securely without revealing student identity
   - Students can submit feedback without registration or login
   - Contact emails are optional and only stored if provided, never displayed in public APIs

3. **Admin Management:**
   - Admins can log in using JWT authentication
   - Admin endpoints are protected with authentication middleware
   - Admins can view all feedback (including private fields), manage status, add replies, and delete entries

4. **Data Validation & Security:**
   - Input validation ensures data integrity (required fields, category enums, title length)
   - Rate limiting prevents abuse (5 submissions per 15 minutes per IP)
   - Passwords are hashed using bcrypt before storage
   - JWT tokens are used for secure admin authentication

5. **Features & Functionality:**
   - Public paginated feedback feed with search and category filtering
   - Admin can filter feedback by category, status, and date range
   - Admin can add public or private replies to feedback
   - Status management (open, in-progress, resolved, closed)
   - All APIs were tested in Postman before frontend integration

6. **Database Design:**
   - Two main models: AdminUser and Feedback
   - Feedback model includes nested replies array
   - Proper indexing and validation at the schema level
   - Automatic timestamps for createdAt and updatedAt

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check the `MONGO_URI` in `.env` file

### JWT Token Issues
- Ensure `JWT_SECRET` is set in `.env` file
- Tokens expire after 24 hours - login again if token expires

### CORS Issues
- CORS is enabled for all origins in development
- For production, configure CORS to allow only your frontend domain

### Rate Limiting
- If you hit rate limit during testing, wait 15 minutes or restart the server


