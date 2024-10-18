import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, doc } from "firebase/firestore";
import { writeFile } from 'fs';

async function getAllCollectionsData() {
  const dbData = {};

  const collectionsSnapshot = await getDocs(collection(db, '/'));
  collectionsSnapshot.forEach((collectionRef) => {
    const collectionName = collectionRef.id;
    dbData[collectionName] = {};
  });

  for (const collectionName in dbData) {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);

    snapshot.forEach((docRef) => {
      dbData[collectionName][docRef.id] = docRef.data();
    });
  }

  // Save the output to a JSON file
  writeFile('firebaseData.json', JSON.stringify(dbData, null, 2), (err) => {
    if (err) throw err;
    console.log('Data has been saved to firebaseData.json');
  });
}

getAllCollectionsData().catch((error) => {
  console.error('Error retrieving collections:', error);
});
