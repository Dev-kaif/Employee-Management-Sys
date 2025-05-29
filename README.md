# 🧑‍💼 Employee Management Backend

A secure and scalable role-based backend system for managing employees, shifts, and task assignments. Built with **TypeScript**, **Express.js**, and **MongoDB**, it provides complete authentication, role-based access, and background job scheduling.

---

## 🚀 Tech Stack

* **Node.js** + **Express v5** – REST API framework
* **TypeScript** – Type-safe development
* **MongoDB** + **Mongoose** – NoSQL database and ORM
* **JWT (jsonwebtoken)** – Token-based authentication
* **bcryptjs** – Password hashing
* **dotenv** – Environment variable management
* **node-cron** – Task scheduler for scheduled jobs

---

## 📁 Folder Structure

```
employee-management-backend/
├── src/
│   ├── config/               # Configuration (env variables)
│   │   └── config.ts
│   ├── controllers/          # Business logic for routes
│   │   ├── authController.ts
│   │   ├── employeeController.ts
│   │   ├── shiftController.ts
│   │   └── taskController.ts
│   ├── middlewares/          # JWT auth middleware
│   │   └── authMiddleware.ts
│   ├── models/               # MongoDB Mongoose schemas
│   │   ├── employeeModel.ts
│   │   ├── shiftModel.ts
│   │   └── taskModel.ts
│   ├── routes/               # Express route groups
│   │   ├── authRoutes.ts
│   │   ├── employeeRoutes.ts
│   │   ├── shiftRoutes.ts
│   │   └── taskRoutes.ts
│   ├── sheduler/             # Cron jobs to activate scheduled tasks
│   │   └── sheduler.ts
│   └── index.ts              # Server entry point
├── .env                      # Your private environment variables
├── .env.example              # Sample env config
├── package.json              # Project metadata and dependencies
├── tsconfig.json             # TypeScript compiler config
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root with the following:

```env
MONGO_DB=mongodb://localhost:27017/your-db
JWT_SECRET=your-secret-key
```

---

## 🧱 MongoDB Models

### 👤 Employee

```ts
{
  username: String,
  email: String,
  password: String,
  designation: String,
  department: String,
  role: 'admin' | 'employee'
}
```

### ⏱️ Shift

```ts
{
  employee: ObjectId (ref Employee),
  startTime: Date,
  endTime: Date,
  workSummary: String
}
```

### 📋 Task

```ts
{
  title: String,
  description: String,
  assignedTo: ObjectId (Employee),
  assignedBy: ObjectId (Admin),
  dueDate: Date,
  scheduledFor: Date,
  isScheduled: Boolean,
  status: 'pending' | 'assigned' | 'in-progress' | 'completed',
  startedAt: Date,
  completedAt: Date
}
```

---

## 🔐 Authentication Middleware

### Middleware: `authenticate`

* Verifies `Authorization: Bearer <token>`
* Decodes JWT payload and attaches `req.user = { userId, role }`
* Rejects unauthorized or expired tokens with `401`

---

## 📦 API Endpoints

### 🔑 Auth Routes (`/api/auth`)

| Method | Path   | Access | Description          |
| ------ | ------ | ------ | -------------------- |
| POST   | /login | Public | Employee/admin login |

---

### 👥 Employee Routes (`/api/employees`)

> **Admin only** - Must be authenticated with admin role

| Method | Path   | Description         |
| ------ | ------ | ------------------- |
| GET    | `/`    | Get all employees   |
| GET    | `/:id` | Get employee by ID  |
| POST   | `/`    | Create new employee |
| PUT    | `/:id` | Update employee     |
| DELETE | `/:id` | Delete employee     |

---

### ⏱️ Shift Routes (`/api/shifts`)

| Method | Path   | Access   | Description             |
| ------ | ------ | -------- | ----------------------- |
| POST   | /start | Employee | Start a new shift       |
| POST   | /end   | Employee | End current shift       |
| GET    | /my    | Employee | Get own shift info      |
| GET    | /      | Admin    | Get all employee shifts |

---

### 📋 Task Routes (`/api/tasks`)

| Method | Path           | Access   | Description                    |
| ------ | -------------- | -------- | ------------------------------ |
| POST   | /assign        | Admin    | Assign task to employee        |
| GET    | /              | Admin    | Get all tasks                  |
| GET    | /employee/\:id | Admin    | Get tasks by employee ID       |
| GET    | /my            | Employee | Get own tasks                  |
| PUT    | /update/\:id   | Employee | Update status of assigned task |

---

## ⏰ Task Scheduler

**File**: `src/sheduler/sheduler.ts`

* Runs **daily at midnight**
* Checks for tasks where `scheduledFor <= now`
* Changes `status` to `assigned` and `isScheduled` to false

---

## ▶️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Dev-kaif/Employee-Management-Sys.git
cd employee-management-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env` using `.env.example`:

```env
MONGO_DB=mongodb://localhost:27017/employees
JWT_SECRET=super-secret-key
```

### 4. Run the Server

```bash
npx ts-node-dev src/index.ts
```

### Optional: Compile for Production

```bash
tsc
node dist/index.js
```

---

## 🔐 Authentication Flow

1. Client sends credentials to `/api/auth/login`
2. Receives a JWT token
3. Use JWT in headers: `Authorization: Bearer <token>`
4. Protected routes require token and check for role

---

## 🧪 Sample `.env` File

```env
MONGO_DB=mongodb://localhost:27017/employee_db
JWT_SECRET=my_very_secret_key
```

---

## 📃 License

ISC

---

## 🤝 Contribution

Pull requests and improvements are welcome!

---

## 👨‍💻 Maintainer

* GitHub: [Dev-kaif](https://github.com/Dev-kaif)

---

## ✅ Project Status

> 🚀 Fully functional backend. Ready for integration with frontend UI.
