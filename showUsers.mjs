import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6iqVDxXM9d7P2BmEFFSECyrrh_aUYXr4",
  authDomain: "bodymap-6daa4.firebaseapp.com",
  projectId: "bodymap-6daa4",
  storageBucket: "bodymap-6daa4.firebasestorage.app",
  messagingSenderId: "913479152357",
  appId: "1:913479152357:web:f9da6e61dca0ddf7589a0c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function showUsers() {
  const usersSnapshot = await getDocs(collection(db, "users"));

  const rows = [];

  for (const user of usersSnapshot.docs) {
    const dataRef = doc(db, "users", user.id, "bodymapData", "main");
    const dataSnap = await getDoc(dataRef);

    if (dataSnap.exists()) {
      const data = dataSnap.data();

      rows.push({
        UID: user.id,
        Name: data.user?.name,
        Alter: data.user?.age,
        Ziel: data.user?.goal,
        Trainingstage: data.user?.days,
        Verletzungen: data.user?.injuries?.join(", "),
      });
    }
  }

  console.table(rows);
}

showUsers();