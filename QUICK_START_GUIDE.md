# 🎓 School Management System - Quick Reference Guide

## Getting Started

### Login
- **URL:** http://localhost:3001/login
- **Admin Credentials:**
  - Username: `admin`
  - Password: `Admin@123`

### Main Dashboard
After login, you'll see:
- Real-time clock in top-right
- Welcome message with your role
- Quick action buttons for common tasks
- Statistics panel (Students, Faculty, Records)
- Recent registrations table
- Notifications panel

---

## 📚 Student Management

### View Students
1. Click **👨‍🎓** icon in sidebar OR click **Students** in navbar
2. Search by name or roll number using the search bar
3. View student details (Class, Contact, Status)
4. Click **👁️** to view full profile
5. Click **🗑️** to delete record

### Add New Student
1. Click **➕ Register Student** from Dashboard OR
2. Click **Add Student** in navbar
3. Fill in all sections:
   - Personal Information
   - Academic Information
   - Contact Information
   - Guardian Information
   - Additional Information
4. Upload photo (optional, max 5MB)
5. Click **✓ Register Student**

### Edit Student
1. Click **👨‍🎓** in sidebar
2. Click **👁️** on student card
3. Click **Edit** button
4. Modify information
5. Save changes

---

## 👨‍🏫 Faculty Management

### View Faculty
1. Click **💼** icon in sidebar OR click **Staff** in navbar
2. Search by name, ID, or email
3. View faculty details (Designation, Contact, Status)
4. Click **👁️** to view full profile
5. Click **🗑️** to delete record

### Add Faculty
1. Click **Add Staff** in navbar OR
2. Click **👨‍🏫 Add Faculty** from Dashboard
3. Fill in faculty information
4. Upload photo (optional)
5. Click **➕ Add Faculty**

---

## 📋 Attendance Management

### Mark Attendance
1. Click **Attendance** in navbar
2. Select **Student** from dropdown
3. Select **Teacher** who's marking attendance
4. Select **Status** (Present, Absent, Late Entry)
5. Click **EXECUTE LOG**

### View Attendance Records
- View **LIVE_ATTENDANCE_FEED** table
- Check **LEAVE_MONITOR** for today's absences
- Status automatically updates in system

---

## 👁️ Eye Scanner

### Register Iris Pattern
1. Click **👁️ Scanner** in navbar
2. Select **Identity Level** (Student or Staff)
3. Enter **Authorized UID** (ID number)
4. Click **📸 Register Iris Pattern**
5. Position iris in front of webcam
6. System captures pattern

### Verify Iris Pattern
1. Click **👁️ Scanner** in navbar
2. Select **Identity Level**
3. Enter **Authorized UID**
4. Click **👁️ Start Verification**
5. System matches pattern against database
6. Shows verification result

---

## ⚙️ Settings & Profile

### User Settings
1. Click **⚙️** in sidebar
2. **Preferences:**
   - Toggle Notifications
   - Toggle Auto-Refresh
   - Click **Save Settings**
3. **Security:**
   - Click **Change Password**
4. **Account:**
   - View current user info
   - Click **Logout** to exit

### User Profile
1. Click **👤** in sidebar
2. View your profile information
3. Edit profile (if allowed)
4. Change preferences

---

## 🔍 Search & Filter

### Search Students
- Use search bar on Students page
- Search by: Name OR Roll Number
- Results update in real-time

### Search Faculty
- Use search bar on Staff page
- Search by: Name OR ID OR Email
- Results update in real-time

### Filter by Class
- Coming soon in next update

---

## 📱 Mobile Usage

### Mobile Layout
- Sidebar collapses to icons only
- Cards stack vertically
- Touch-friendly button sizes
- Full functionality maintained
- All forms accessible

### Recommended Mobile Browsers
- Chrome
- Firefox
- Safari
- Edge

---

## ⌨️ Keyboard Shortcuts

- **D** - Go to Dashboard
- **S** - Go to Students
- **T** - Go to Teachers/Staff
- **A** - Go to Attendance
- **E** - Go to Eye Scanner
- **G** - Go to Settings
- **L** - Logout (with confirmation)

*(Coming in next update)*

---

## 🔐 Security Tips

1. **Change Default Password**
   - Login with admin credentials
   - Go to Settings → Security
   - Click "Change Password"
   - Enter new password

2. **Keep Session Secure**
   - Don't share login credentials
   - Logout when finished
   - Auto-logout after 10 minutes of inactivity

3. **Data Protection**
   - All data transmitted via HTTPS (in production)
   - JWT tokens used for authentication
   - Role-based access prevents unauthorized access

---

## 🆘 Troubleshooting

### Can't Login
- Check username: `admin`
- Check password: `Admin@123`
- Ensure backend server is running
- Clear browser cache and retry

### Page Won't Load
- Check internet connection
- Verify backend is running on port 8000
- Refresh page (Ctrl+R or Cmd+R)
- Clear browser cookies

### Search Not Working
- Ensure page is fully loaded
- Check spelling of search term
- Try searching by different field
- Refresh page

### Eye Scanner Issues
- Check webcam permissions
- Allow browser access to camera
- Good lighting required
- Position iris clearly

### Photo Upload Fails
- File must be JPG or PNG
- File size max 5MB
- Check internet connection
- Try different file

---

## 📞 Support

For additional help:
1. Check recent status reports in system
2. Review system notifications
3. Contact administrator
4. Check system logs

---

## 🎯 Common Tasks

### Register a New Student (5 steps)
1. Click "Add Student"
2. Fill all fields (marked with *)
3. Upload photo
4. Click "Register Student"
5. Success! Check Students list

### Mark Daily Attendance (4 steps)
1. Click "Attendance"
2. Select student
3. Select teacher
4. Click "EXECUTE LOG"

### Add Faculty Member (4 steps)
1. Click "Add Staff"
2. Fill information
3. Upload photo
4. Click "Add Faculty"

### View Student Details (2 steps)
1. Go to Students
2. Click 👁️ icon

---

## 📊 Dashboard Statistics

The dashboard shows:
- **Total Students:** Count of all registered students
- **Faculty Members:** Count of all staff members
- **Attendance Records:** Total attendance logs
- **Recent Registrations:** Last 5 added students
- **System Notifications:** Real-time alerts

---

## 🎨 User Interface

### Navigation Sidebar
- **🏠 Home:** Go to Dashboard
- **👨‍🎓 Students:** Student management
- **👁️ Scanner:** Eye/Iris recognition
- **📋 Attendance:** Mark attendance
- **💼 Teachers:** Faculty management
- **👤 Profile:** Your profile
- **⚙️ Settings:** Preferences & security
- **🚪 Logout:** Exit system

### Top Navigation Bar
- School name/logo
- Quick links to common pages
- User logout button
- Role indicator

---

## ✅ System Status

**Current Status:** ✅ OPERATIONAL

All systems are live and fully operational. The school management system is ready for production use.

---

**Last Updated:** Today
**System Version:** 1.0
**Status:** Production Ready ✅
