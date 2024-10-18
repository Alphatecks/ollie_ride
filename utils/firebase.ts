import { collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage"; // Firebase Storage for upload
import { db, storage } from "@/firebaseConfig"; // Your Firebase config

export async function getAllCollectionsData() {
  console.log("Started retrieving data...");

  const dbData = {};

  // Manually specify collection names
  const collectionNames = ['users', 'conversations', 'rides', "cars"]; // Add your collection names here

  // Iterate through each collection and get the documents
  for (const collectionName of collectionNames) {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);

    dbData[collectionName] = {};
    snapshot.forEach((docRef) => {
      dbData[collectionName][docRef.id] = docRef.data();
    });
  }

  // Convert dbData to JSON
  const jsonData = JSON.stringify(dbData, null, 2);

  // Create a reference to store the JSON file in Firebase Storage
  const fileRef = ref(storage, 'firebaseData.json');

  // Convert JSON string to Blob (required for Firebase Storage)
  const blob = new Blob([jsonData], { type: 'application/json' });

  // Upload the JSON file to Firebase Storage
  await uploadBytes(fileRef, blob);

  console.log('Data has been uploaded to Firebase Storage.');
}

// getAllCollectionsData().catch((error) => {
//   console.error('Error retrieving collections:', error);
// });
