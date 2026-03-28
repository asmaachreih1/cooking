# Taste of Home | Palestinian & Lebanese Recipes 🥘

## 🚀 How to run it on your computer

### 1. What you need
- You need **Node.js** installed.
- You'll need your own **Firebase Project** (it's free!). Since it's a cloud database, you need your own spot to save the data.

### 2. Setting up Firebase & Firestore
1.  Go to the [Firebase Console](https://console.firebase.google.com/) and start a new project.
2.  Click on **Firestore Database** and create one.
3.  Go to the **Rules** tab in Firestore and copy-paste everything from my `firestore.rules` file there. This makes sure people can read the recipes but only you can edit them.
4.  Go to **Authentication** > **Sign-in method** and turn on **Email/Password**.

### 3. Setting up your keys
Create a file named `.env.local` in the main folder and add your Firebase keys like this:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-app.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### 4. Getting the recipes (The "Seed" part)
To get the same recipes and news I have in my database:
1.  Go to **Project Settings** > **Service accounts** in Firebase.
2.  Click **Generate new private key**.
3.  Save that file as `scripts/service-account.json`.
4.  Run this command:
    ```bash
    npm run seed:firestore
    ```
    *Now your new database will be full of my heritage recipes!*

### 5. Final Step
```bash
npm install
npm run dev
```
Now open [http://localhost:3000](http://localhost:3000) and you're good to go!

