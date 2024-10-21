import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage"; // Firebase Storage for upload
import { db, storage } from "@/firebaseConfig"; // Your Firebase config


// Function to handle setting up user-related Firestore collections
export const setupDatabaseCollections = async (userId, firstName, lastName) => {
    try {
        // Set up bankAccount collection -> user.uid -> bank1 -> autogen id -> {bankName, bankAccount, bankHolderName}
        await setDoc(doc(db, "bankAccount", userId, "bank1", doc().id), {
            bankName: "",  // Replace with actual data
            bankAccount: "", // Replace with actual data
            bankHolderName: `${firstName} ${lastName}`, // Example holder name
        });
        console.log("Set up bankAccount collection");

        // Set up notifications collection -> user.uid -> allNotifications -> autogen id -> {message, dateSent, hasSeenMessage}
        await setDoc(doc(db, "notifications", userId, "allNotifications", doc().id), {
            message: "Welcome to the app",  // Example message
            dateSent: new Date(),
            hasSeenMessage: false,
        });
        console.log("Set up notifications collection");

        // Set up withdraws collection -> userId -> allWithdrawals -> autogen id -> {amount, timeWithdrawn, status}
        await setDoc(doc(db, "withdraws", userId, "allWithdrawals", doc().id), {
            amount: 0,  // Example amount
            timeWithdrawn: new Date(),
            status: "pending",
        });
        console.log("Set up withdraws collection");

        // Set up tripHistory collection -> userId -> allTripHistory -> autogen id -> {riderId, riderName, riderRating, tripId, tripAmount}
        await setDoc(doc(db, "tripHistory", userId, "allTripHistory", doc().id), {
            riderId: "",  // Example rider data
            riderName: "",
            riderRating: 0,
            tripId: "",
            tripAmount: 0,
        });
        console.log("Set up tripHistory collection");

        // Set up driverParticulars -> userId -> driverLicense, vehicleInsurance, NIN -> autogen id -> {isApproved, frontImage, backImage, dateSubmitted, status}
        const particularsData = {
            isApproved: false,
            frontImage: "",  // Path to image (if any)
            backImage: "",
            dateSubmitted: new Date(),
            status: "pending",
        };

        // Set up driverLicense
        await setDoc(doc(db, "driverParticulars", userId, "driverLicense", doc().id), particularsData);
        console.log("Set up driverLicense collection");

        // Set up vehicleInsurance
        await setDoc(doc(db, "driverParticulars", userId, "vehicleInsurance", doc().id), particularsData);
        console.log("Set up vehicleInsurance collection");

        // Set up NIN
        await setDoc(doc(db, "driverParticulars", userId, "NIN", doc().id), particularsData);
        console.log("Set up NIN collection");

    } catch (error) {
        console.error("Error setting up user collections:", error);
        throw error;  // Rethrow error to handle in the calling function
    }
};


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



