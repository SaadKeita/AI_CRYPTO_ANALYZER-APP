import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Sign up error:', error);
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        return { user: null, error: 'Email already in use' };
      case 'auth/weak-password':
        return { user: null, error: 'Password should be at least 6 characters' };
      case 'auth/invalid-email':
        return { user: null, error: 'Invalid email address' };
      default:
        return { user: null, error: 'Failed to create account. Please try again.' };
    }
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Sign in error:', error);
    
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return { user: null, error: 'Invalid email or password' };
      case 'auth/too-many-requests':
        return { user: null, error: 'Too many failed attempts. Please try again later' };
      default:
        return { user: null, error: 'Failed to sign in. Please try again.' };
    }
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Google sign in error:', error);
    
    if (error.code === 'auth/popup-closed-by-user') {
      return { user: null, error: 'Sign in cancelled' };
    }
    return { user: null, error: 'Failed to sign in with Google' };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: 'Failed to sign out' };
  }
};