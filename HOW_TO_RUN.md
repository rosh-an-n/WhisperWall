# 🚀 How to Run WhisperWall - Simple Step-by-Step Guide

## ⚠️ IMPORTANT: Make sure MongoDB is running first!

### **Quick Check (30 seconds):**
Open Terminal and type:
```bash
mongosh
```
- ✅ **If it connects:** MongoDB is running! Type `exit` to close.
- ❌ **If it shows error:** MongoDB is not running - see below.

### **For Mac (You're on Mac!):**
Since MongoDB is installed via Homebrew, use:
```bash
brew services start mongodb-community
```

Then verify it's running:
```bash
mongosh
```

**📖 Need detailed instructions?** See `MONGODB_SETUP.md` file in this folder.

**🌐 Alternative:** Use MongoDB Atlas (cloud) - no installation needed! See `MONGODB_SETUP.md` for details.

---

## 📋 Step-by-Step Instructions

### **STEP 1: Setup Backend (5 minutes)**

1. **Open Terminal/Command Prompt**

2. **Go to the backend folder:**
   ```bash
   cd backend
   ```

3. **Install packages:**
   ```bash
   npm install
   ```
   (Wait for it to finish - this may take 1-2 minutes)

4. **Create .env file:**
   - Create a new file named `.env` in the `backend` folder
   - Copy this content into it:
   ```
   PORT=5555
   MONGO_URI=mongodb://localhost:27017/whisperwall
   JWT_SECRET=somesecretkey
   ```
   - **Note:** If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string

5. **Seed the database (create admin user and sample data):**
   ```bash
   npm run seed
   ```
   You should see: "✅ Database seeded successfully!"

6. **Start the backend server:**
   ```bash
   npm run dev
   ```
   You should see: "Server is running on port 5555" and "Connected to MongoDB"

   **👉 KEEP THIS TERMINAL WINDOW OPEN!**

---

### **STEP 2: Setup Frontend (3 minutes)**

1. **Open a NEW Terminal/Command Prompt window**

2. **Go to the frontend folder:**
   ```bash
   cd frontend
   ```

3. **Install packages:**
   ```bash
   npm install
   ```
   (Wait for it to finish - this may take 1-2 minutes)

4. **Start the frontend:**
   ```bash
   npm run dev
   ```
   You should see: "Local: http://localhost:3000"

   **👉 KEEP THIS TERMINAL WINDOW OPEN TOO!**

---

### **STEP 3: Open the Application**

Open your web browser and go to:
```
http://localhost:3000
```

You should see the WhisperWall homepage!

---

## 🎯 How to Demonstrate to Faculty

### **Demo Order:**

#### **1. Show the Homepage (30 seconds)**
- Open `http://localhost:3000`
- Show the navigation menu (Submit Feedback, Public Feed, Admin Login)

#### **2. Submit Anonymous Feedback (1 minute)**
- Click "Submit Feedback" or go to `/`
- Fill out the form:
  - Title: "Canteen Food Quality Needs Improvement"
  - Content: "The food quality in the canteen has been declining. Please look into this."
  - Category: Select "Canteen"
  - Tags: "food, quality"
- Click "Submit Feedback"
- Show the success message

#### **3. View Public Feed (1 minute)**
- Click "Public Feed" or go to `/feed`
- Show the list of feedback entries
- Demonstrate search: Type "canteen" in search box
- Demonstrate filter: Select "Canteen" from category dropdown
- Show pagination

#### **4. Admin Login (1 minute)**
- Click "Admin Login" or go to `/admin/login`
- Login with:
  - Email: `admin@college.edu`
  - Password: `password123`
- You'll be redirected to Admin Dashboard

#### **5. Admin Dashboard Features (2-3 minutes)**
- **Show all feedback:** Explain you can see all feedback (including private ones)
- **Filter demonstration:**
  - Filter by category (e.g., "Academics")
  - Filter by status (e.g., "open")
- **View details:** Click "View Details" on any feedback
  - Show that admin can see contact email (if provided)
  - Show replies section
- **Change status:** Select a different status from dropdown (e.g., "in-progress")
- **Add reply:**
  - Type a reply message
  - Check "Make reply public" checkbox
  - Click "Add Reply"
  - Show the reply appears in the details
- **Delete feedback:** Click "Delete" button (confirm deletion)

---

## 🔧 If Something Goes Wrong

### **Error: "Cannot connect to MongoDB"**
- Solution: Make sure MongoDB is running
- Check: Open another terminal, type `mongosh` - if it connects, MongoDB is running

### **Error: "Port 5555 already in use"**
- Solution: Either stop the other program using port 5555, OR change PORT in `.env` file to something else (like 5556)

### **Error: "Port 3000 already in use"**
- Solution: Vite will automatically use port 3001 or 3002 - just use that URL instead

### **Error: "Cannot find module"**
- Solution: Make sure you ran `npm install` in both backend and frontend folders

### **Frontend shows "Error" or blank page**
- Solution: Make sure backend is running first (check terminal for "Server is running")

---

## 📝 Quick Checklist Before Demo

- [ ] MongoDB is running
- [ ] Backend server is running (terminal shows "Server is running on port 5555")
- [ ] Frontend is running (terminal shows "Local: http://localhost:3000")
- [ ] Browser is open to `http://localhost:3000`
- [ ] You know the admin login credentials (admin@college.edu / password123)

---

## 🎤 What to Say During Demo

**Opening:**
> "I've built WhisperWall, an anonymous feedback system for college. Students can submit feedback without logging in, and admins can manage all feedback."

**While demonstrating:**
> "As you can see, students can submit feedback anonymously. The public feed shows all public feedback. Admins can log in to see all feedback, including private contact emails, and can reply or change status."

**Closing:**
> "The backend uses Node.js, Express, and MongoDB. All APIs are tested with Postman. The frontend is a simple React app for demonstration."

---

## 💡 Pro Tips for Demo

1. **Test everything once before faculty arrives** - Make sure it all works
2. **Have both terminals visible** - Shows you understand the architecture
3. **Keep Postman ready** - If asked, show API testing
4. **Explain the tech stack** - Mention Node.js, Express, MongoDB, React
5. **Be ready to show code** - They might ask to see the backend structure

---

## 🆘 Emergency: If Nothing Works

**Option 1: Use MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (free tier)
4. Get connection string
5. Replace `MONGO_URI` in `.env` file with Atlas connection string

**Option 2: Show Code Structure**
- Open the project in VS Code
- Show the folder structure
- Explain the MVC architecture
- Show model files, controllers, routes

---

**Good luck with your presentation! 🎓**

