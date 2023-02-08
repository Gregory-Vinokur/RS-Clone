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

import { Database, get, getDatabase, ref, update } from 'firebase/database';

import { Sort, TypeUser } from '../../constans/types';
import { Lang } from '../../constans/constans';

export default class ModelMessages extends Model {
  db: Firestore;
  messages: QuerySnapshot<DocumentData> | undefined;
  limit: number;
  sort: Sort;
  rtdb: Database;
  constructor(lang: Lang, user: TypeUser) {
    super(lang, user);
    this.limit = 10;
    this.sort = 'desc';
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.rtdb = getDatabase(app);
    onSnapshot(query(collection(this.db, 'messages'), orderBy('created', this.sort), limit(this.limit)), (querySnapshot) => {
      this.messages = querySnapshot;
      this.emit('updateData');
    });
  }

  showUser = async (uid: string) => {
    const Ref = ref(this.rtdb, `users/${uid}`);
    const user = await get(Ref);
    console.log(user.val() ? user.val().userName : 'undefined');
  };

  subscripteUser = async (userId: string) => {
    const Ref = ref(this.rtdb, `users/${this.user?.uid}/subscripts`);
    update(Ref, {
      [userId]: true,
    });
  };

  unSubscripteUser = async (uid: string) => {
    const Ref = ref(this.rtdb, `users/${this.user?.uid}/subscripts`);
    update(Ref, {
      [uid]: null,
    });
  };

  deleteMessage = async (docum: string) => {
    await deleteDoc(doc(this.db, 'messages', docum));
  };

  sendMessage = async (message: string) => {
    try {
      const docRef = await addDoc(collection(this.db, 'messages'), {
        uid: this.user?.uid,
        name: this.user?.displayName ? this.user.displayName : 'unknown',
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
    this.messages = await getDocs(query(collection(this.db, 'messages'), orderBy('created', this.sort), limit(this.limit)));
    this.emit('updateData');
  };

  setLimit = (limit = '') => {
    this.limit = Number(limit) < 1 ? 1 : Number(limit) > 100 ? 100 : Number(limit);
    this.getMessage();
  };

  setSort = (sort: Sort) => {
    this.sort = sort;
    this.getMessage();
  };
}
