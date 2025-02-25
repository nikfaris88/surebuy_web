declare module '@/firebase/firebaseConfig' {
    import { Auth } from 'firebase/auth';
    import { Firestore } from 'firebase/firestore';
    import { Storage } from 'firebase/storage';
  
    export const auth: Auth;
    export const db: Firestore;
    export const storage: Storage;
  }