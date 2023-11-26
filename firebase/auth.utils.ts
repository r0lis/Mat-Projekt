/* eslint-disable no-useless-catch */
/* eslint-disable no-empty */
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import firebase_app from './config';

const auth = getAuth(firebase_app);
export const authUtils = {
  login: async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  },
  logout: async () => {
    await auth.signOut();
  },
  sendEmailVerification: async () => {
    try {
      const user = auth.currentUser;

      if (user) {
      }
    } catch (error) {
      throw error;
    }
  },
  register: async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      if (user) {
        // Send email verification
        await sendEmailVerification(user);

        
        
      }
    } catch (error) {
      // Handle any registration errors
      throw error;
    }
  },
  getCurrentUser: () => auth.currentUser,

  
  deleteUser: async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        await deleteUser(user);
      }
    } catch (error) {
      throw error;
    }
  },
};
