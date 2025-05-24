# RedKnot - Multi-Page Form Application

## 🚀 Features

- Modern React with TypeScript
- Beautiful UI components using Radix UI
- Responsive design with Tailwind CSS
- Form handling with React Hook Form and Zod validation
- Authentication with Clerk
- Express.js backend server
- Prisma ORM for database management
- MongoDB integration
- Real-time form validation
- Modern development setup with Vite

## 🛠️ Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Vite
  - React Router DOM
  - Radix UI Components
  - Tailwind CSS
  - React Hook Form
  - Zod
  - Clerk Authentication

- **Backend:**
  - Express.js
  - Prisma ORM
  - MongoDB
  - Express Validator

- **Development Tools:**
  - ESLint
  - TypeScript
  - PostCSS
  - Concurrently

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add necessary environment variables like
   ```bash
   DATABASE_URL=
   PORT=3001
   VITE_CLERK_PUBLISHABLE_KEY=

5. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ``

## 🚀 Running the Application

1. Start the development server:
   ```bash
   pnpm dev:all
   ```
   This will start both the frontend and backend servers concurrently.

2. For frontend only:
   ```bash
   pnpm dev
   ```

3. For backend only:
   ```bash
   pnpm server
   ```
