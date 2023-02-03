import Model from '../Template/Model';
import { firebaseConfig } from '../../server/firebase.config';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  serverTimestamp,
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  DocumentData,
  QuerySnapshot,
  Firestore,
} from 'firebase/firestore';

export default class ModelMessages extends Model {
  db: Firestore;
  messages: QuerySnapshot<DocumentData> | undefined;
  limit: number;
  constructor() {
    super();
    this.limit = 10;
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    onSnapshot(query(collection(this.db, 'messages'), orderBy('created', 'desc'), limit(this.limit)), (querySnapshot) => {
      this.messages = querySnapshot;
      this.emit('updateData');
    });
  }

  deleteMessage = async (docum: string) => {
    await deleteDoc(doc(this.db, 'messages', docum));
  };

  sendMessage = async (message: string) => {
    try {
      const docRef = await addDoc(collection(this.db, 'messages'), {
        uid: this.user?.uid,
        name: this.user?.displayName ? this.user.displayName : this.user?.email,
        photo: this.user?.photoURL,
        text: message,
        created: serverTimestamp(),
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  getMessage = async () => {
    this.messages = await getDocs(query(collection(this.db, 'messages'), orderBy('created', 'desc'), limit(this.limit)));
    this.emit('updateData');
  };

  setLimit = (limit = '') => {
    this.limit = Number(limit) > 0 && Number(limit) < 30 ? Number(limit) : 1;
    this.getMessage();
  };
}
