# 📋 ProjectFlow

> A full-stack, production-ready Project Management App built with **Next.js**, **Prisma**, and **Context API** — with secure authentication and a powerfull dashboard.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🚀 Live Demo

🔗 [View Live App](https://your-app.vercel.app) &nbsp;|&nbsp; 

---

## 📌 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Project Structure](#-project-structure)
- [Authentication Flow](#-authentication-flow)
- [API Routes](#-api-routes)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About The Project

**ProjectFlow** is a production-ready project management web application that allows teams to create, manage, and track projects and tasks efficiently. Built with modern web technologies, it features secure authentication, a clean dashboard, and full CRUD functionality.

---

## ✨ Features

- 🔐 **Secure Authentication** — Register, Login, Logout with protected routes
- 📊 **Dashboard** — Overview of all projects, tasks, and activity
- ✅ **CRUD Operations** — Create, Read, Update, Delete projects and tasks
- 🛡️ **Protected Routes** — Only authenticated users can access the app
- 🌐 **Context API** — Global auth state management across the app
- 💾 **Prisma ORM** — Type-safe database access and schema management
- 📱 **Responsive Design** — Works on all screen sizes
- ⚡ **Next.js App Router** — Fast, server-side rendering and routing

---

## 🛠️ Tech Stack

| Category         | Technology                      |
| ---------------- | ------------------------------- |
| **Frontend**     | Next.js 14, React, Tailwind CSS |
| **Backend**      | Next.js API Routes              |
| **Database ORM** | Prisma                          |
| **Auth**         | Context API + JWT / Cookies     |
| **Deployment**   | Vercel                          |
| **Language**     | JavaScript / TypeScript         |

---

## 🏁 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A database (PostgreSQL / MySQL / SQLite)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/projectflow.git
cd projectflow
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Fill in your values in `.env` (see [Environment Variables](#-environment-variables))

4. **Set up the database**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. **Run the development server**

```bash
npm run dev
```

6. **Open your browser**

```
http://localhost:3000
```

---

## 🔑 Environment Variables

Create a `.env` file in the root of your project and add the following:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/projectflow"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> ⚠️ **Never commit your `.env` file to GitHub!** It is already included in `.gitignore`

---

## 🗄️ Database Setup

This project uses **Prisma ORM**. The schema is located at `prisma/schema.prisma`.

```bash
# Run migrations
npx prisma migrate dev

# Open Prisma Studio (visual DB editor)
npx prisma studio

# Reset database
npx prisma migrate reset
```

### Schema Overview

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  projects  Project[]
  createdAt DateTime @default(now())
}

model Project {
  id          String   @id @default(cuid())
  title       String
  description String?
  tasks       Task[]
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Task {
  id        String   @id @default(cuid())
  title     String
  status    String   @default("TODO")
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  createdAt DateTime @default(now())
}
```

---

## 📁 Project Structure

```
projectflow/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages group
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/          # Protected dashboard
│   ├── projects/           # Projects pages
│   └── api/                # API Routes
│       ├── auth/
│       └── projects/
├── components/             # Reusable UI components
├── context/                # Context API (Auth)
│   └── AuthContext.js
├── lib/                    # Utility functions
│   ├── prisma.js           # Prisma client instance
│   └── auth.js             # Auth helpers
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
├── .env.example            # Example env file
└── README.md
```

---

## 🔐 Authentication Flow

Authentication is handled using **Context API** for global state management:

```
User visits app
       │
       ▼
Is token in cookie/localStorage?
       │
  Yes  │  No
       │   └──→ Redirect to /login
       ▼
  Fetch user from DB (Prisma)
       │
       ▼
  Set user in AuthContext
       │
       ▼
  Access protected routes ✅
```

### AuthContext Usage

```js
// Wrap your app
<AuthProvider>
  <App />
</AuthProvider>;

// Use anywhere in the app
const { user, login, logout } = useAuth();
```

---

## 🌐 API Routes

| Method   | Endpoint             | Description       | Auth Required |
| -------- | -------------------- | ----------------- | ------------- |
| `POST`   | `/api/auth/register` | Register new user | ❌            |
| `POST`   | `/api/auth/login`    | Login user        | ❌            |
| `POST`   | `/api/auth/logout`   | Logout user       | ✅            |
| `GET`    | `/api/projects`      | Get all projects  | ✅            |
| `POST`   | `/api/projects`      | Create a project  | ✅            |
| `PUT`    | `/api/projects/:id`  | Update a project  | ✅            |
| `DELETE` | `/api/projects/:id`  | Delete a project  | ✅            |
| `GET`    | `/api/tasks`         | Get all tasks     | ✅            |
| `POST`   | `/api/tasks`         | Create a task     | ✅            |

---

## 🚢 Deployment

This app is deployed on **Vercel**.

### Deploy Your Own

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add all environment variables from `.env` in Vercel dashboard
4. Click **Deploy** 🚀

### Post Deployment

```bash
# Run migrations on production DB
npx prisma migrate deploy
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the project
2. Create your feature branch — `git checkout -b feature/AmazingFeature`
3. Commit your changes — `git commit -m 'Add some AmazingFeature'`
4. Push to the branch — `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-linkedin)

---

<div align="center">
  Made with ❤️ using Next.js & Prisma
</div>
