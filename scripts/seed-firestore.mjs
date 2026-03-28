import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import bilingual seed data
const dataPath = path.join(__dirname, 'data', 'seed-data-bilingual.json');
if (!fs.existsSync(dataPath)) {
  console.error('Error: seed-data-bilingual.json not found. Run dump.mjs and translate-data.mjs first.');
  process.exit(1);
}

const seedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Initialize Firebase Admin
// Preference order: 
// 1. Service account file at scripts/service-account.json
// 2. FIREBASE_SERVICE_ACCOUNT_KEY env var (JSON string)
const serviceAccountPath = path.join(__dirname, 'service-account.json');

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  console.error('\nMissing Firebase Admin Credentials!');
  console.error('Please either:');
  console.error('1. Place your service account JSON at: scripts/service-account.json');
  console.error('2. Set FIREBASE_SERVICE_ACCOUNT_KEY environment variable with the JSON content.');
  process.exit(1);
}

const db = admin.firestore();

async function clearCollection(collectionPath) {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.get();
  
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log(`Cleared collection: ${collectionPath}`);
}

async function seedCollection(collectionPath, data) {
  if (!data || data.length === 0) return;
  
  const batch = db.batch();
  data.forEach((item) => {
    const docRef = db.collection(collectionPath).doc(item.id || undefined);
    const { id, ...rest } = item;
    batch.set(docRef, rest);
  });
  
  await batch.commit();
  console.log(`Seeded ${data.length} items into : ${collectionPath}`);
}

async function main() {
  console.log('--- Starting Firestore Seeding ---');
  
  try {
    // Optional: Clear existing data
    await clearCollection('recipes');
    await clearCollection('blogs');
    await clearCollection('news');
    
    // Seed new data
    await seedCollection('recipes', seedData.recipes);
    await seedCollection('blogs', seedData.blogs);
    await seedCollection('news', seedData.news);
    
    console.log('--- Seeding Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main();
