// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, initializeFirestore, setLogLevel as setFirestoreLogLevel } from "firebase/firestore";
// Import getStorage for Firebase Storage
import { getStorage } from "firebase/storage"; 

import { setLogLevel } from "firebase/app";
// setLogLevel("debug"); // Enable debug level logging for Firebase


// Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyDyYIgmy9Vt_z6ydTfzq-Y4M0A9ygEtBC4",

  authDomain: "ollie-ride-7abb8.firebaseapp.com",

  projectId: "ollie-ride-7abb8",

  storageBucket: "ollie-ride-7abb8.appspot.com",

  messagingSenderId: "460810931103",

  appId: "1:460810931103:web:3ba78182dadce210598baa",

  measurementId: "G-QTVFPQTSYQ"

};

// const firebaseConfig = {

//   apiKey: "AIzaSyAq-1C5ccMT1H8FZJQdmYvG9RFPJ8VUF0g",

//   authDomain: "ollie-test-a8923.firebaseapp.com",

//   projectId: "ollie-test-a8923",

//   storageBucket: "ollie-test-a8923.appspot.com",

//   messagingSenderId: "728995073964",

//   appId: "1:728995073964:web:eb1b89fd2221ba77f83409",

//   measurementId: "G-B306JQW8H3"

// };



// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore with custom options (if needed)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Useful in environments where WebSockets are blocked
});

// Initialize Firebase Storage (if needed)
export const storage = getStorage(app);

// Set Firestore Log Level for debugging (development use only)
setFirestoreLogLevel('debug');






// Initialize Firebase Storage



// // Function to set up dummy data for Users collection
// async function setupUsers() {
//   await addDoc(collection(db, "Users"), {
//     total_balance: 1000,
//     is_admin: true,
//     payment_methods: [], // To be added
//     trades: [], // To be added
//     wallet: "", // To be added if admin
//   });

 

// // Function to set up dummy data for Payment Methods collection
// async function setupPaymentMethods() {
//   await addDoc(collection(db, "PaymentMethods"), {
//     bank_name: "Bank of America",
//     account_number: "123456789",
//     account_name: "John Doe",
//     user: "", // Reference to a user (to be linked later)
//   });
// }

// // Function to set up dummy data for Wallets collection (Admins only)
// async function setupWallets() {
//   await addDoc(collection(db, "Wallets"), {
//     erc20_address: "0x1234567890abcdef",
//     binance_email: "admin@binance.com",
//     bep20_address: "0xabcdef1234567890",
//     trc20_address: "T1234567890abcdef",
//     admin: "", // Reference to an admin user (to be linked later)
//   });
// }

// // Function to set up dummy data for Transactions collection
// async function setupTransactions() {
//   await addDoc(collection(db, "Transactions"), {
//     transaction_status: "pending",
//     transaction_message: "Waiting for confirmation",
//     trade: "", // Reference to a Trade (to be linked later)
//   });
// }

// // Function to set up dummy data for Chats collection
// async function setupChats() {
//   await addDoc(collection(db, "Chats"), {
//     message: "Hello, I need help with the trade.",
//     image: "https://example.com/image.jpg",
//     date_sent: "2024-09-17T14:30:00Z",
//     sender: "", // Reference to sender user
//     receiver: "", // Reference to receiver (admin)
//   });
// }

// // Call all the setup functions
// async function setupDatabase() {
//   // await setupUsers();
//   await setupTrades();
//   console.log("Trades Database has been set up with dummy data!");
//   // await setupPaymentMethods();
//   // await setupWallets()
//   // await setupTransactions();
//   // await setupChats();

// }

// Initialize the database with dummy data
// setupDatabase().catch(console.error);
