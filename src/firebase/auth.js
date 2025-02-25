import { auth, db } from "./firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Admin Login Function
export const adminLogin = async (email, password) => {
  try {
    // Authenticate the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user is an admin in Firestore
    const adminRef = doc(db, "admins", user.email);
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists() && adminSnap.data().role === "admin") {
      return { user, isAdmin: true };
    } else {
      await signOut(auth); // Logout non-admin users
      throw new Error("Access Denied: You are not an admin.");
    }
  } catch (error) {
    throw error.message;
  }
};

// Logout Function
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error.message;
  }
};