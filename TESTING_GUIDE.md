# 🚀 Quick Start & Testing Guide - Security & Activity Tracking System

## ⚡ QUICK SETUP (5 minutes)

### Step 1: Apply Database Migrations

```bash
# Navigate to backend directory
cd backend

# Apply the new migrations
python manage.py migrate users

# You should see output like:
# Operations to perform:
#   Apply all migrations: users
# Running migrations:
#   Applying users.0002_add_activity_tracking... OK
```

### Step 2: Start Backend Server (if not already running)

```bash
python manage.py runserver
```

Expected output:
```
Starting development server at http://127.0.0.1:8000/
```

### Step 3: Start Frontend Server (in another terminal)

```bash
cd frontend
npm start
```

Expected output:
```
webpack compiled successfully
Compiled successfully!
```

---

## ✅ STEP-BY-STEP TESTING GUIDE

### TEST 1: Landing Page Role Selection

**Steps:**
1. Open http://localhost:3001/landing in browser
2. You should see three role cards: 👤 **Student**, 👨‍🏫 **Faculty**, 🔑 **Admin**
3. Click on **Student** card
4. Card should highlight with blue border and "✓ SELECTED" badge
5. Should auto-navigate to login page

**Expected Results:**
- ✅ Card shows selected state (blue border, background highlight)
- ✅ Redirected to login page
- ✅ No errors in browser console

**Troubleshooting:**
- If cards don't highlight: Check `Landingpage.css` has portal-card.selected styles
- If navigation doesn't work: Check `Landingpage.js` has handleRoleSelect function

---

### TEST 2: Create New Student Account

**Steps:**
1. From login page, click "Create Account"
2. Fill registration form:
   - Username: `teststudent1`
   - Email: `test@example.com`
   - Password: `Test@123`
   - Confirm Password: `Test@123`
3. Click "Register"
4. You should see: "✅ Account created! Awaiting admin approval"
5. Do NOT be able to login yet

**Expected Results:**
- ✅ Account created successfully
- ✅ Clear message about pending approval
- ✅ Cannot login with these credentials

**In Django Admin:**
1. Go to http://127.0.0.1:8000/admin
2. Login as admin (admin/Admin@123)
3. Go to "Users" > "User Profiles"
4. Find "teststudent1"
5. See `is_approved = unchecked` (False)

---

### TEST 3: Admin Approves Student Account

**Method 1: Using Django Admin**

1. Go to http://127.0.0.1:8000/admin
2. Click "User Profiles"
3. Click on "teststudent1"
4. Check the "is_approved" checkbox
5. Click "Save"
6. See message: "User profile changed successfully"

**Method 2: Using Admin Analytics Dashboard**

1. Login as admin: http://localhost:3001/login
   - Username: `admin`
   - Password: `Admin@123`
2. Click "📊 Analytics" button in dashboard
3. Or go to: http://localhost:3001/admin-analytics
4. Click "⏳ Pending Approvals" tab
5. See list of pending students
6. Find "teststudent1"
7. Click "✓ APPROVE" button
8. Page should refresh showing student was approved

**Expected Results:**
- ✅ Student moves from "Pending" list
- ✅ Success message shown
- ✅ Activity logged in database

---

### TEST 4: Approved Student Can Login

**Steps:**
1. Go to http://localhost:3001/login
2. Enter credentials:
   - Username: `teststudent1`
   - Password: `Test@123`
3. Click "Login"
4. Should be redirected to dashboard
5. See "Welcome, teststudent1"

**Expected Results:**
- ✅ Login successful
- ✅ Redirected to dashboard
- ✅ Correct username displayed

**Database Check:**
1. In Django admin, go to "User Activities"
2. Should see new entry with:
   - `activity_type = LOGIN`
   - `user = teststudent1`
   - `ip_address = 127.0.0.1`
   - `timestamp = current time`

---

### TEST 5: Activity Tracking - Page Views

**Steps:**
1. While logged in as teststudent1
2. Navigate to different pages by clicking sidebar icons
3. Click "👨‍🎓 Students"
4. Go back, click "📋 Attendance"
5. Go back, click "👤 Profile"
6. Each page should show normally

**Expected Results:**
- ✅ Page loads successfully
- ✅ No errors in console

**Database Check:**
1. Go to Django admin
2. Go to "User Activities"
3. Should see multiple entries:
   - `activity_type = PAGE_VIEW`
   - `page_or_action = /students`, `/attendance`, `/profile`, etc.
   - All have `user = teststudent1`
   - All have timestamps

---

### TEST 6: Admin Analytics Dashboard

**Steps:**
1. Login as admin
2. Go to http://localhost:3001/admin-analytics (or click 📊 Analytics button)
3. Dashboard should load with statistics

**You should see:**

**📈 Overview Tab (Default):**
- Total Users: X
- Admins: 1
- Teachers: X
- Students: X (including teststudent1)
- Pending Approvals: X
- Active Sessions: X
- Total Activities: X
- Logins (24h): X

**Cards should be color-coded:**
- Blue for info stats
- Green for success/teacher
- Orange for students
- Red/Orange for pending

**⏳ Pending Approvals Tab:**
- List should be empty (or show other pending students)
- Each pending student has:
  - ✓ APPROVE button (green)
  - ✕ REJECT button (red)

**👥 Most Active Users Tab:**
- Should show users ranked by activity count
- Show role badge (blue=admin, green=teacher, orange=student)
- Show activity count for each user

**Filter Buttons:**
- Click "Last 7 Days", "Last 14 Days", "Last 30 Days", "Last 90 Days"
- Statistics should update
- Different counts for different periods

---

### TEST 7: Reject Student Account

**Steps:**
1. Create another student account: `teststudent2`
2. Go to Admin Analytics
3. Go to "⏳ Pending Approvals" tab
4. Find "teststudent2"
5. Click "✕ REJECT" button
6. See confirmation message

**Expected Results:**
- ✅ Student removed from pending list
- ✅ Success message shown
- ✅ teststudent2 cannot login

**Verify Rejection:**
1. Try to login as teststudent2
2. Should see: "Invalid username or password" (or "Account pending approval")

---

### TEST 8: Activity Logging - Data Modifications

**Steps:**
1. Login as teacher (or create teacher account as admin)
2. Go to http://localhost:3001/students
3. Click "✏️ Edit" on any student
4. Change student name
5. Click "Save"
6. Should see success message

**Expected Results:**
- ✅ Student updated
- ✅ Redirected back to students list

**Database Check:**
1. Go to Django admin
2. Go to "User Activities"
3. Find newest entry with:
   - `activity_type = DATA_MODIFY`
   - `user = teacher_username`
   - `page_or_action = /edit-student/<id>`
   - `description = Student updated` (or similar)

---

### TEST 9: Teacher Account Management

**Steps (Admin Only):**
1. Login as admin
2. Go to dashboard, click "👨‍🏫 Add Faculty"
3. Create new faculty account:
   - First Name: Test
   - Last Name: Teacher
   - Email: teacher@test.com
   - Employee ID: T001
   - Click "Add"
4. Success message should show

**Expected Results:**
- ✅ Teacher account created
- ✅ Teacher can login immediately (no approval needed)
- ✅ Teacher cannot create other teachers

**Verify Teacher Cannot Create Other Teachers:**
1. Login as teacher
2. Try to access admin features
3. Should be blocked/redirected

---

### TEST 10: Role-Based Access Control

**Test 1: Student cannot access admin features**
1. Login as teststudent1
2. Try to visit http://localhost:3001/admin-analytics
3. Should be redirected or see "Access Denied"

**Test 2: Teacher cannot access certain admin features**
1. Login as teacher
2. Try to click "Add Faculty" button
3. Should not see this button or should be blocked

**Test 3: Only admin can approve accounts**
1. Login as teacher
2. Try to visit http://localhost:3001/admin-analytics
3. Should be blocked (only admin allowed)

**Expected Results:**
- ✅ All role-based restrictions enforced
- ✅ Users redirected appropriately
- ✅ No unauthorized access

---

### TEST 11: Session Tracking

**Steps:**
1. Login as any user
2. Stay on a page for 30+ seconds
3. Check Django admin under "User Sessions"

**Expected Results:**
- ✅ New UserSession created with:
   - `user = your_username`
   - `login_time = login timestamp`
   - `is_active = True`
   - `session_token = unique UUID`
   - `ip_address = 127.0.0.1`
   - `user_agent = browser info`

**After Logout:**
1. Click logout button
2. Should be redirected to login/landing page
3. Check Django admin "User Sessions"
4. Session should now have:
   - `logout_time = logout timestamp`
   - `is_active = False`
   - `session_duration = calculated time`

---

### TEST 12: IP Address & User Agent Tracking

**Steps:**
1. Create a test account
2. Login
3. Check activity in Django admin
4. Look at any activity record

**Expected Results:**
- ✅ `ip_address` should show: `127.0.0.1` (localhost)
- ✅ `user_agent` should show browser info like:
   ```
   Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 
   (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
   ```

---

## 🔍 VERIFICATION CHECKLIST

### Backend Models
- [ ] UserActivity table exists in database
- [ ] UserSession table exists in database
- [ ] UserProfile has `is_approved` field
- [ ] All fields are properly indexed

### Frontend Pages
- [ ] Landingpage.js loads with role selection
- [ ] Role cards highlight when clicked
- [ ] Login.js accepts role parameter
- [ ] AdminAnalytics.js loads and displays data
- [ ] Dashboard links to AdminAnalytics

### Security
- [ ] Student accounts require approval
- [ ] Unapproved students cannot login
- [ ] Only admin can create teachers
- [ ] Only admin can access analytics
- [ ] Role-based access control works

### Activity Tracking
- [ ] LOGIN activities logged
- [ ] LOGOUT activities logged
- [ ] PAGE_VIEW activities logged
- [ ] DATA_MODIFY activities logged
- [ ] All timestamps are accurate
- [ ] IP addresses captured
- [ ] User agents captured

### Admin Dashboard
- [ ] Dashboard loads without errors
- [ ] Statistics display correct counts
- [ ] Tabs work (Overview, Pending, Active Users)
- [ ] Filters work (7, 14, 30, 90 days)
- [ ] Approve button works
- [ ] Reject button works
- [ ] Activities display correctly

---

## 🐛 TROUBLESHOOTING

### Issue: "ModuleNotFoundError" when running migrations
```bash
# Solution: Make sure you're in backend directory
cd backend
python manage.py migrate
```

### Issue: CSS styling not loading
```bash
# Solution: Restart frontend server
npm start
```

### Issue: Analytics shows no data
```bash
# Solution: 
# 1. Wait a few seconds for page to load
# 2. Make sure you're logged in as admin
# 3. Make sure some activities have been logged
# 4. Check browser console for errors (F12)
```

### Issue: Pending approvals list empty
```bash
# This is actually good! It means:
# - No students are pending approval
# - Create a new student account to test
```

### Issue: Cannot login as student
```bash
# Check:
# 1. Did you click APPROVE in admin dashboard?
# 2. Is is_approved set to True in Django admin?
# 3. Are username and password correct?
```

### Issue: Admin Analytics page is blank
```bash
# Solution:
# 1. Check browser console (F12) for errors
# 2. Make sure you're logged in as admin
# 3. Make sure backend server is running
# 4. Try refreshing the page
```

---

## 📊 EXPECTED ACTIVITY LOG ENTRIES

After testing, you should see these activity types in Django Admin:

```
Activity Type          | When It's Logged
-----------------------|------------------------------------------
LOGIN                  | User logs in successfully
LOGOUT                 | User clicks logout
PAGE_VIEW              | User navigates to a page
ACTION                 | User clicks a button
DATA_MODIFY            | User creates/edits student/teacher
DATA_DELETE            | User deletes a record
SEARCH                 | User performs a search
DOWNLOAD               | User downloads a file
ERROR                  | System encounters an error
```

---

## 🎯 TESTING SCENARIOS SUMMARY

### Scenario 1: Complete Student Registration to Dashboard
```
1. Visit landing page → select Student role
2. Create new account → get "Pending approval" message
3. Login as admin → go to analytics
4. Approve student account
5. Login as student → access dashboard
6. Navigate pages → activities logged
7. View in analytics → see all student activities
```

### Scenario 2: Admin Monitoring
```
1. Login as admin
2. Go to Analytics Dashboard
3. View all user statistics
4. See pending approvals
5. Approve/reject as needed
6. View most active users
7. Filter by time period
8. See complete activity breakdown
```

### Scenario 3: Teacher Management
```
1. Login as admin
2. Create new faculty account
3. Faculty can login immediately
4. Faculty can mark attendance
5. Faculty actions tracked
6. Admin can see faculty activity
```

---

## 📱 TESTING ON MOBILE (Optional)

If you want to test responsive design:

1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or "Pixel 5"
4. Test landing page - should be mobile-friendly
5. Test login - should be mobile-friendly
6. Test analytics dashboard - should be responsive

---

## ✨ NEXT STEPS AFTER TESTING

Once all tests pass, you can:

1. **Deploy to Production**
   - Build frontend: `npm run build`
   - Collect static files: `python manage.py collectstatic`
   - Deploy to server

2. **Add More Features**
   - Email notifications for approvals
   - Daily activity reports
   - IP whitelist/blacklist
   - Two-factor authentication

3. **Monitor and Maintain**
   - Review analytics regularly
   - Check for suspicious activities
   - Archive old activity logs
   - Update security policies

---

## 📞 NEED HELP?

If something doesn't work:

1. **Check the console:**
   - Frontend: F12 → Console tab
   - Backend: Look at terminal output

2. **Check database:**
   - http://127.0.0.1:8000/admin
   - Verify tables exist
   - Check records are created

3. **Restart services:**
   ```bash
   # Terminal 1
   cd backend
   python manage.py runserver
   
   # Terminal 2
   cd frontend
   npm start
   ```

4. **Clear cache:**
   - Frontend: Ctrl+Shift+R
   - Backend: Restart server

---

**Document Status:** Ready for Testing ✅  
**Last Updated:** 2026  
**Author:** AI Assistant  
**System:** School Management System
