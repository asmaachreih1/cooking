import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function dumpCollection(colName) {
    console.log(`Dumping ${colName}...`);
    const querySnapshot = await getDocs(collection(db, colName));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

async function main() {
    try {
        const data = {
            recipes: await dumpCollection("recipes"),
            blogs: await dumpCollection("blogs"),
            news: await dumpCollection("news")
        };

        const outDir = path.join(process.cwd(), "scripts", "data");
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        fs.writeFileSync(
            path.join(outDir, "seed-data.json"),
            JSON.stringify(data, null, 2)
        );

        console.log("Data dumped successfully to scripts/data/seed-data.json");
        process.exit(0);
    } catch (error) {
        console.error("Dump failed:", error);
        process.exit(1);
    }
}

main();
