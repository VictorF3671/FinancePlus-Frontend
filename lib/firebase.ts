import { initializeApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAM6Tdf5lqZBnAT6iecm2ek2daH_QxwK30",
  authDomain: "finance-ielune.firebaseapp.com",
  projectId: "finance-ielune",
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);


setPersistence(auth, browserLocalPersistence);