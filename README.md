# Employee Management System

A full-stack web application to manage employees, tasks, and shifts with secure authentication, role-based access control, and smooth UI animations.

---

[![Watch the video](https://img.youtube.com/vi/Nz1Ougz_TDI/maxresdefault.jpg)](https://youtu.be/Nz1Ougz_TDI)

---

## 🚀 Features

- ✨ Smooth animations using **Framer Motion**
- 🔐 JWT-based authentication & role-based access control
- 📅 Shift scheduling & calendar view
- 📊 Task assignment, status updates, and tracking
- 🗄️ Admin & Employee dashboards
- 📈 Reports & employee analytics (WIP)
- 📱 Fully responsive UI with **Tailwind CSS**

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- Tailwind CSS
- Framer Motion
- Axios

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for auth
- bcryptjs for password hashing
- node-cron for scheduled tasks

---

## 📁 Project Structure

```
employee-management-sys/
├── employee-management-backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
├── employee-management-frontend/
│   ├── components/
│   ├── pages/
│   ├── public/
│   ├── styles/
│   ├── lib/
│   └── next.config.js
└── README.md
```

---

## ⚙️ Installation

### Prerequisites

- Node.js v14+
- MongoDB

### Backend Setup

```bash
cd employee-management-backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Start server:

```bash
npm start
```

### Frontend Setup

```bash
cd employee-management-frontend
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

---

## 🪢 API Endpoints

### Auth

- POST `/api/auth/register`
- POST `/api/auth/login`

### Employees

- GET/POST `/api/employees`
- PUT/DELETE `/api/employees/:id`

### Tasks

- GET/POST `/api/tasks`
- PUT/DELETE `/api/tasks/:id`

### Shifts

- GET/POST `/api/shifts`
- PUT/DELETE `/api/shifts/:id`

---

## 🔐 Auth & Roles

- JWT-based stateless authentication
- Middleware guards for Admin and Employee access

---

## 📆 Scheduled Jobs

- Daily task summaries (node-cron)
- Auto-shift archiving (planned)

---

## 📸 Screenshots

> Add some key UI screens here with role views (Admin/Employee)

---

## 🤝 Contributing

```bash
git clone https://github.com/Dev-kaif/Employee-Management-Sys.git
cd repo && npm install
```

1. Create a branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -m "Added new feature"`
3. Push branch: `git push origin feature/new-feature`
4. Create Pull Request

---

## 📄 License

This project is [MIT Licensed](LICENSE)

---

## 📨 Contact

Created by [@Dev-kaif](https://github.com/Dev-kaif) — feel free to reach out!

---

## 💊 Credits

Inspired by real-world HR use-cases, built with modern React + Node stack.

---
