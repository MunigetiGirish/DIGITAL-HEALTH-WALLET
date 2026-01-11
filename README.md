# 🏥 Digital Health Wallet

A secure, cloud-ready **Digital Health Wallet** that allows users to store, visualize and share their medical reports and vitals with doctors, family members and friends — built using **React, Node.js, and SQLite**.

---

## 🚀 Features

### 👤 User Management
- User registration & login
- Role-based access (Patient / Doctor / Viewer)
- Secure JWT authentication

### 📄 Medical Reports
- Upload medical reports (PDF / Image)
- Store metadata:
  - Report type (Blood Test, X-Ray, MRI, General Checkup)
  - Date
  - Associated vitals
- Download and view reports securely

### ❤️ Vitals Tracking
- Store BP, Sugar and Heart Rate over time
- Display vitals trends using interactive charts
- Filter vitals by date and type

### 🔍 Report Search
- Search reports by:
  - Date
  - Report type
  - Vital values

### 🔐 Secure Sharing
- Share selected reports with:
  - Doctors
  - Family members
  - Friends
- Read-only access for shared users
- Doctors can view reports without editing or deleting

---

## 🛠️ Technology Stack

| Layer | Technology |
|------|------------|
| Frontend | ReactJS |
| Backend | Node.js (Express) |
| Database | SQLite |
| Auth | JWT |
| Charts | Chart.js |
| File Uploads | Multer |

---

## 🧩 System Architecture

React (UI)  
⬇  
Node.js REST APIs  
⬇  
SQLite Database  
⬇  
Local file storage (Medical Reports)

---

git clone https://github.com/your-username/digital-health-wallet.git
cd digital-health-wallet
