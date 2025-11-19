# 🗄️ How to Check and Start MongoDB

## Quick Check: Is MongoDB Running?

### **Method 1: Try to Connect (Easiest)**

Open Terminal and type:
```bash
mongosh
```

**If it connects:**
- ✅ MongoDB is running! You'll see: `test>`
- Type `exit` to close

**If you get an error:**
- ❌ MongoDB is NOT running - continue below to start it

---

## 🍎 For Mac Users (macOS)

### **Option A: If installed via Homebrew**

1. **Check if MongoDB is installed:**
   ```bash
   brew list | grep mongodb
   ```

2. **Start MongoDB:**
   ```bash
   brew services start mongodb-community
   ```
   OR
   ```bash
   mongod --config /usr/local/etc/mongod.conf
   ```

3. **Check if it's running:**
   ```bash
   brew services list
   ```
   Look for `mongodb-community` with status "started"

### **Option B: If installed manually**

1. **Start MongoDB:**
   ```bash
   mongod
   ```
   (Keep this terminal window open - MongoDB runs in this window)

2. **In a NEW terminal, test connection:**
   ```bash
   mongosh
   ```

### **Option C: Install MongoDB (if not installed)**

1. **Install via Homebrew:**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start it:**
   ```bash
   brew services start mongodb-community
   ```

---

## 🪟 For Windows Users

### **Option A: If installed as Windows Service**

1. **Press `Windows + R`**
2. **Type:** `services.msc` and press Enter
3. **Look for:** "MongoDB" or "MongoDB Server"
4. **If it says "Running":** ✅ You're good!
5. **If it says "Stopped":** Right-click → Start

### **Option B: Start MongoDB manually**

1. **Open Command Prompt as Administrator**
2. **Navigate to MongoDB bin folder** (usually):
   ```cmd
   cd C:\Program Files\MongoDB\Server\7.0\bin
   ```
   (Version number might be different - check your installation)

3. **Start MongoDB:**
   ```cmd
   mongod
   ```
   (Keep this window open)

### **Option C: Install MongoDB (if not installed)**

1. **Download from:** https://www.mongodb.com/try/download/community
2. **Run the installer**
3. **Choose "Complete" installation**
4. **Check "Install MongoDB as a Service"**
5. **After installation, MongoDB should start automatically**

---

## 🐧 For Linux Users

### **Check if MongoDB is running:**
```bash
sudo systemctl status mongod
```

### **Start MongoDB:**
```bash
sudo systemctl start mongod
```

### **Enable auto-start on boot:**
```bash
sudo systemctl enable mongod
```

---

## ✅ Verify MongoDB is Running

After starting MongoDB, test the connection:

```bash
mongosh
```

You should see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/?directConnection=true
Using MongoDB: ...
Using Mongosh: ...

test>
```

Type `exit` to close.

---

## 🌐 Alternative: Use MongoDB Atlas (Cloud - FREE)

**If you can't install MongoDB locally, use cloud version:**

### **Step 1: Create Free Account**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (it's free!)

### **Step 2: Create Cluster**
1. Click "Build a Database"
2. Choose FREE tier (M0)
3. Choose region closest to you
4. Click "Create"

### **Step 3: Get Connection String**
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

### **Step 4: Update Your .env File**
In `backend/.env`, replace:
```
MONGO_URI=mongodb://localhost:27017/whisperwall
```

With your Atlas connection string:
```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/whisperwall
```

**✅ Done! No need to run MongoDB locally.**

---

## 🆘 Troubleshooting

### **Error: "command not found: mongod" or "mongosh"**
- **Solution:** MongoDB is not installed or not in PATH
- Install MongoDB or use MongoDB Atlas (cloud)

### **Error: "Address already in use"**
- **Solution:** MongoDB is already running! ✅ You're good to go.

### **Error: "Permission denied"**
- **Solution (Mac/Linux):** Use `sudo` or install MongoDB properly
- **Solution (Windows):** Run Command Prompt as Administrator

### **Can't find MongoDB installation**
- **Solution:** Use MongoDB Atlas (cloud) - it's easier and free!

---

## 📝 Quick Checklist

- [ ] MongoDB is installed on your computer
- [ ] MongoDB is running (test with `mongosh`)
- [ ] Can connect to MongoDB (no errors)
- [ ] Ready to run `npm run seed` in backend folder

---

## 💡 Recommendation

**For a college project demo:**
- **Best option:** Use MongoDB Atlas (cloud) - no installation needed, works everywhere
- **Second option:** Install MongoDB locally if you have admin rights

**MongoDB Atlas is perfect because:**
- ✅ Free tier available
- ✅ No installation needed
- ✅ Works on any computer
- ✅ No "MongoDB not running" issues
- ✅ Easy to show your faculty

---

**Need more help? Check the main HOW_TO_RUN.md file!**



