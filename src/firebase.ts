import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV8lLA6SA35Gxle2vUzBxW1B6z0mXt4Wg",
  authDomain: "skillxchange-a5d98.firebaseapp.com",
  projectId: "skillxchange-a5d98",
  storageBucket: "skillxchange-a5d98.firebasestorage.app",
  messagingSenderId: "1079355468391",
  appId: "1:1079355468391:web:c938c4dfcafa6bd2bec2c2",
  measurementId: "G-7XYH59FVL7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      email: user.email,
      name: user.displayName,
      profilePhoto: user.photoURL,
    };
  } catch (error) {
    throw error;
  }
};

const signInWithApple = async () => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    const user = result.user;
    return {
      email: user.email,
      name: user.displayName,
      profilePhoto: user.photoURL,
    };
  } catch (error) {
    throw error;
  }
};

export { signInWithGoogle, signInWithApple };
