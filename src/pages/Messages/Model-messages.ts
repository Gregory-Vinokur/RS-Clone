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

import {
  Database,
  get,
  getDatabase,
  serverTimestamp as timeStamp,
  ref,
  update,
  onChildAdded,
  onChildRemoved,
  child,
  push,
  onValue,
  set,
  remove,
} from 'firebase/database';

import { Sort, TypeUser } from '../../constans/types';
import { Lang } from '../../constans/constans';

type DialogMembersProp = {
  userName: string;
  userStatus: string;
  userAvatar: string;
  userCover: string;
  userSubscripts: string;
  userId: string;
};

type DialogMessages = {
  uid: string;
  key: string;
  name: string;
  text: string;
  time: string;
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
  dialogMembersProp: Promise<DialogMembersProp>[];
  dialogsMessages: DialogMessages[][];
  currentDialog: string;
  constructor(lang: Lang, user: TypeUser) {
    super(lang, user);
    this.limit = 10;
    this.sort = 'desc';
    this.dialogRooms = [];
    this.dialogMembers = [];
    this.dialogMembersProp = [];
    this.dialogsMessages = [];
    this.isChat = true;
    this.isRooms = false;
    this.currentDialog = '';
    // this.currentDialogIndex = 0;
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    onSnapshot(query(collection(this.db, 'messages'), orderBy('created', this.sort), limit(this.limit)), (querySnapshot) => {
      this.messages = querySnapshot;
      this.emit('updateData');
    });
    const dialogRef = ref(this.rtdb, `users/${this.user?.uid}/dialogRooms`);
    onValue(dialogRef, (snapshot) => {
      this.dialogMembers = [];
      this.dialogRooms = [];
      this.dialogMembersProp = [];
      snapshot.forEach((data) => {
        if (data && data.key) {
          this.dialogMembers.push(data.key);
          this.dialogRooms.push(data.val());
          this.dialogMembersProp.push(this.getUserInfo(data.key));
        }
      });
      this.emit('updateDialog');
      this.getDialogs();
    });
  }

  getDialogs = () => {
    this.dialogsMessages = [];
    this.dialogRooms.forEach((room, index) => {
      const messages: DialogMessages[] = [];
      this.dialogsMessages.push(messages);
      const dialogRef = ref(this.rtdb, `dialogRooms/${room}`);
      onValue(dialogRef, (snapshot) => {
        this.dialogsMessages[index] = [];
        snapshot.forEach((data) => {
          const message: DialogMessages = data.val();
          message.key = data.key || '';
          this.dialogsMessages[index].push(message);
        });
        this.emit('updateDialog', index);
        console.log(`Download: ${room}`);
      });
    });
  };

  async getUserInfo(userId: string) {
    const dbRef = ref(this.rtdb);
    let userProp: DialogMembersProp = {
      userName: '',
      userStatus: '',
      userAvatar: '',
      userCover: '',
      userSubscripts: '',
      userId: userId,
    };
    try {
      const snapshot = await get(child(dbRef, `users/${userId}`));
      if (snapshot.exists()) {
        const { userName, userStatus, userAvatar, userCover, subscripts, userId } = snapshot.val();
        userProp = {
          userName: userName || 'Кот Петр',
          userStatus: userStatus || 'Обновите ваш статус :)',
          userAvatar: userAvatar,
          userCover: userCover,
          userSubscripts: subscripts,
          userId: userId,
        };
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error(error);
    }
    return userProp;
  }

  deleteMessage = async (docum: string) => {
    await deleteDoc(doc(this.db, 'messages', docum));
  };

  deleteDialogMessage = (key: string) => {
    const dialogRef = ref(this.rtdb, `dialogRooms/${this.currentDialog}/${key}`);
    remove(dialogRef);
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
    try {
      const dialogRef = ref(this.rtdb, `dialogRooms/${this.currentDialog}`);
      const newPostKey = push(dialogRef).key;
      if (newPostKey) {
        set(child(dialogRef, newPostKey), {
          uid: this.user?.uid,
          name: this.user?.displayName ? this.user.displayName : 'unknown',
          text: message,
          time: timeStamp(),
        });
      } else {
        throw new Error("Don't get key post");
      }
      console.log(message);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  writeUser = async (uid: string) => {
    const currentUserUid = this.user?.uid;
    if (currentUserUid) {
      const index = this.dialogMembers.findIndex((el) => el === uid);
      this.currentDialog = this.dialogRooms[index];
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
      this.emit('updateDialog', index);
    }
  };

  checkDialog = async (index: number) => {
    const userProp = await Promise.all(this.dialogMembersProp);
    this.currentDialog = this.dialogRooms[index];
    // this.currentDialogIndex = index;
    this.isRooms = true;
    this.emit('showDialog');
    console.log(`${userProp[index].userName}: ${this.currentDialog}: ${this.dialogMembers[index]}`);
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
