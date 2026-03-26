# Taste of Home | Palestinian & Lebanese Heritage Recipes 🥘

Welcome to **Taste of Home**, a premium digital sanctuary dedicated to preserving and sharing the rich culinary heritage of Palestine and Lebanon. This platform serves as both a public recipe gallery and a powerful administrative portal for cultural storytelling.

## 🌟 Key Features

- **Heritage Recipe Gallery**: Explore authentic recipes with detailed stories, cultural context, and step-by-step instructions.
- **Admin Dashboard**: Comprehensive management system for Recipes, Blog Posts, and News Updates.
- **RBAC (Role-Based Access Control)**: Granular permissions for Super Admins and Editors to manage content and users.
- **Real-time Submissions**: Integrated contact form with administrative tracking and status management.
- **Dynamic Filtering**: Robust search and categorization across both public and administrative interfaces.

## 🚀 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Authentication)
- **Styling**: Vanilla CSS & Tailwind CSS for premium aesthetics
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: Framer Motion for smooth animations

## 🛠 Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- A Firebase project set up

### 2. Environment Setup
Create a `.env.local` file in the root directory and add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### 3. Installation
```bash
npm install
```

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the heritage collection.

## 🏛 Administrative Access
The dashboard is secured and accessible at `/admin`. Default roles are assigned via Firestore based on user email. The **Super Admin** role has full oversight of users, roles, and all content modules.

---
*Created with ❤️ to honor the flavors of home.*
