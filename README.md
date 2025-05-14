# 🏠 Booking Management System (Airbnb Clone)

This is a full-stack **Booking Management System**, inspired by Airbnb. It allows users to list, browse, and book rental properties with secure authentication, booking management, messaging, and notifications.

---

## 📚 Project Overview

The project is a web-based platform enabling seamless interaction between two roles: **Guests** and **Hosts**. Guests can search for listings, filter by availability and location, and make bookings. Hosts can create listings and manage booking requests. The system includes a **chat interface**, **notification system**, and **admin-controlled access**, ensuring a responsive and intuitive experience.

---

## 🎯 Features

-   🔐 **Authentication** via Firebase Google OAuth
-   🏠 **Listings System** with image upload
-   📅 **Bookings** with availability conflict prevention
-   ✅ **Booking Request Approval** by hosts
-   💬 **Messaging System** (Guest ↔ Host post-booking)
-   🔔 **Notifications** for all user actions
-   🌙 **Dark mode UI** (Bootstrap-based)
-   🎨 Responsive Design (mobile, tablet, desktop)

---

## 💻 Tech Stack

| Layer          | Technology                             |
| -------------- | -------------------------------------- |
| Frontend       | React.js (Vite), Bootstrap             |
| Backend        | Node.js, Express.js                    |
| Authentication | Firebase Authentication (Google OAuth) |
| Database       | PostgreSQL                             |
| File Upload    | Multer                                 |
| Styling        | Bootstrap, CSS                         |

---

## 🔧 Functional Modules

### 👤 User Roles

-   **Guest**: Can book properties, chat with hosts, view bookings
-   **Host**: Can create listings, approve/reject bookings, chat with guests

### 📦 Core Modules

-   User Authentication & Role Management
-   Listings CRUD
-   Booking Request System
-   Approval/Rejection Workflow
-   Messaging per Booking
-   Notification Center with real-time status
-   Error handling & form validation

---

## 📂 Folder Structure

```
├── client/                # Frontend (React)
│   ├── components/
│   ├── pages/
│   └── ...
├── server/                # Backend (Node.js + Express)
│   ├── routes/
│   ├── controllers/
│   └── models/
├── uploads/               # Image storage
├── README.md
└── ...
```

---

## 🧪 Testing & Debugging

-   Manual UI Testing for each role
-   Postman-tested backend endpoints
-   Booking conflicts, date validation, auth-protected routes
-   Auto-refresh for notification center

---

## 🧠 Future Enhancements

-   Ratings & Reviews
-   Map-based property search
-   Calendar integration (Google Calendar)
-   Payment gateway
-   Mobile App (React Native / Flutter)

---

## 👨‍💻 Author

Developed by:

**Tarun Chauhan**

---

## 📖 References

-   [Firebase Docs](https://firebase.google.com/docs)
-   [React Docs](https://reactjs.org/docs/)
-   [PostgreSQL Docs](https://www.postgresql.org/docs/)
-   [Express.js Docs](https://expressjs.com/)
-   [Bootstrap Docs](https://getbootstrap.com/)
