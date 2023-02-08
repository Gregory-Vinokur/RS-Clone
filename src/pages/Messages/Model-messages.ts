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

import { Database, get, getDatabase, ref, update, onChildAdded, onChildRemoved, child, push } from 'firebase/database';

import { Sort, TypeUser } from '../../constans/types';
import { Lang } from '../../constans/constans';

type DialogMembersProp = {
  name: string;
  imgSrc: string;
};

export default class ModelMessages extends Model {
  db: Firestore;
  messages: QuerySnapshot<DocumentData> | undefined;
  limit: number;
  sort: Sort;
  isChat: boolean;
  isRooms: boolean;
  dialogRooms: string[];
  dialogMembers: string[];
  dialogMembersProp: [];
  constructor(lang: Lang, user: TypeUser) {
    super(lang, user);
    this.limit = 10;
    this.sort = 'desc';
    this.dialogRooms = [];
    this.dialogMembers = [];
    this.dialogMembersProp = [];
    this.isChat = true;
    this.isRooms = false;
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    onSnapshot(query(collection(this.db, 'messages'), orderBy('created', this.sort), limit(this.limit)), (querySnapshot) => {
      this.messages = querySnapshot;
      this.emit('updateData');
    });
    const dialogRef = ref(this.rtdb, `users/${this.user?.uid}/dialogRooms`);
    onChildAdded(dialogRef, (data) => {
      if (data && data.key) {
        this.dialogMembers.push(data.key);
        this.dialogRooms.push(data.val());
      }
      this.emit('updateDialog');
    });
  }

  deleteMessage = async (docum: string) => {
    await deleteDoc(doc(this.db, 'messages', docum));
  };

  sendMessage = (message: string) => {
    if (this.isChat) {
      this.sendMessageToChat(message);
    }
    if (this.isRooms) {
      this.sendMessageToRooms(message);
    }
  };

  private sendMessageToChat = async (message: string) => {
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

  private sendMessageToRooms = (message: string) => {
    console.log(message);
  };

  writeUser = async (uid: string) => {
    const currentUserUid = this.user?.uid;
    if (currentUserUid) {
      const currentUserRef = `users/${currentUserUid}/dialogRooms`;
      const userRef = `users/${uid}/dialogRooms`;
      if (!this.dialogMembers.includes(uid)) {
        const newDialog = push(child(ref(this.rtdb), 'dialogRooms')).key;
        const updates: { [index: string]: string } = {};
        if (newDialog) {
          updates[`${currentUserRef}/${uid}`] = newDialog;
          updates[`${userRef}/${currentUserUid}`] = newDialog;
          update(ref(this.rtdb), updates);
        }
        console.log('createRoom');
      } else {
        console.log('room already exist');
      }
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
