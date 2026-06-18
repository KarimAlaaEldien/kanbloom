# Kanbloom 🌿

> "Watch your workflow bloom."

Kanbloom is a real-time collaborative task board (similar to Trello) built using Next.js 15, TypeScript, Tailwind CSS, and Firebase. 

Each board is designed like a digital garden: columns represent stages of progressive growth (e.g., "To Do 🌱", "In Progress 🌿", "Blooming 🌸"), and task cards move toward blooming as they are dragged and dropped. Any modifications sync instantly to all collaborators in real time without refreshing.

---

## 🌟 Features

- **Instant Real-Time Sync**: Driven by Firestore `onSnapshot` listeners. Tasks and columns update on all active screens instantly.
- **Drag-and-Drop Workflow**: Powered by `@dnd-kit/core` and `@dnd-kit/sortable` with smooth animations and touch/pointer support.
- **Multiplayer Collaboration**: Invite teammates to boards by email. Once invited, boards appear on their dashboard automatically.
- **Complete Auth System**: Secure Email/Password registration/login + Google Sign-In OAuth via Firebase Auth.
- **SEO Ready**: Configured with Next.js Metadata API, sitemap, robots files, and dynamic OG Image generation. Private routes automatically declare `noindex` rules.
- **Dark Mode Support**: Aesthetic dark theme that respects user preferences and saves choices in `localStorage`.
- **Lightweight Notifications**: Beautiful, contextual alerts via `react-hot-toast` aligning with the garden motif.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS v4
- **Backend & Database**: Firebase Client SDK (Authentication + Cloud Firestore)
- **Drag-and-Drop**: `@dnd-kit` (Core + Sortable + Utilities)

---

## 🚀 Setup & Installation

Follow these steps to run Kanbloom locally:

### 1. Clone & Install Dependencies
First, check out the repository and install the npm packages:
```bash
npm install
```

### 2. Configure Firebase
To run Kanbloom, you need to create a project in the Firebase Console:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it `Kanbloom` (or any name you prefer).
3. Set up **Authentication**:
   - In the Firebase sidebar, click **Build > Authentication**.
   - Click **Get Started**.
   - Enable **Email/Password** sign-in.
   - Enable **Google** sign-in (configure consent screen if prompted).
4. Set up **Firestore Database**:
   - In the sidebar, click **Build > Firestore Database**.
   - Click **Create Database**.
   - Select a location closest to you and start in **Production Mode** or **Test Mode**.
   - Go to the **Rules** tab in Firestore and replace the rules with the content of `firestore.rules` from this repository, then click **Publish**.
5. Get your Client Credentials:
   - Go to **Project Settings** (gear icon next to Project Overview).
   - In the "Your apps" section, click the **Web icon (</>)** to register a web application.
   - Copy the `firebaseConfig` object values.

### 3. Setup Environment Variables
Create a file named `.env.local` in the root of the project (you can copy `.env.local.example` as a template) and add your Firebase credentials:

```ini
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Locally
Run the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Firestore Data Model

The database is structured using the following Cloud Firestore collections:

### `users/{userId}`
Stores user profiles for mapping email invitations:
- `uid`: `string`
- `displayName`: `string`
- `email`: `string`
- `photoURL`: `string`

### `boards/{boardId}`
Contains task boards metadata:
- `title`: `string`
- `description`: `string` (appended with metadata for themes `description||color`)
- `ownerId`: `string`
- `memberIds`: `array [userId, ...]`
- `createdAt`: `timestamp`

### `boards/{boardId}/columns/{columnId}`
Holds board columns:
- `title`: `string`
- `order`: `number` (used to order columns left-to-right)

### `boards/{boardId}/columns/{columnId}/cards/{cardId}`
Holds columns' tasks:
- `title`: `string`
- `description`: `string`
- `order`: `number` (used to order cards vertically)
- `createdAt`: `timestamp`
- `createdBy`: `string`

---

## 🔒 Security Rules

Security rules are declared in the `firestore.rules` file:
- User records can only be written by the authenticated owner (`request.auth.uid == userId`).
- Boards, columns, and cards are only readable and writable by users whose `uid` is in the board's `memberIds` array or who are the board's `ownerId`.
- Unauthenticated access is blocked.

---

## ⚡ Deployment to Vercel

Kanbloom is fully optimized for Vercel with zero extra server configuration:

1. Install the Vercel CLI (`npm i -g vercel`) or connect your GitHub repository to Vercel.
2. In the Vercel dashboard, click **Add New > Project** and select this repository.
3. In the **Environment Variables** configuration section, add all six variables from `.env.local`.
4. Click **Deploy**. Vercel will build and deploy the app statically and server-render where appropriate.
