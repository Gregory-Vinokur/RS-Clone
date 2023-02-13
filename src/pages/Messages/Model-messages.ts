import Model from '../Template/Model';
import debounce from '../../utils/debounce';
import { firebaseConfig } from '../../server/firebase.config';
import { initializeApp } from 'firebase/app';
import { UserProp } from '../../constans/types';
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

import { get, serverTimestamp as timeStamp, ref, update, onChildAdded, child, push, onValue, remove } from 'firebase/database';

import { Sort, TypeUser } from '../../constans/types';
import { Lang } from '../../constans/constans';

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
  dialogMembersProp: Promise<UserProp>[];
  dialogsMessages: DialogMessages[][];
  currentDialog: string;
  lastChangeUserDialog: number[];
  lastChangeDialog: number[];
  constructor(lang: Lang, user: TypeUser) {
    super(lang, user);
    this.limit = 10;
    this.sort = 'desc';
    this.dialogRooms = [];
    this.dialogMembers = [];
    this.dialogMembersProp = [];
    this.dialogsMessages = [];
    this.lastChangeUserDialog = [];
    this.lastChangeDialog = [];
    this.isChat = true;
    this.isRooms = false;
    this.currentDialog = '';
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    onSnapshot(query(collection(this.db, 'messages'), orderBy('created', this.sort), limit(this.limit)), (querySnapshot) => {
      this.messages = querySnapshot;
      this.emit('updateData');
    });
    const debonceGetDialogs = debounce(this.getDialogs, 200);
    const dialogRef = ref(this.rtdb, `users/${this.user?.uid}/dialogRooms`);
    onChildAdded(dialogRef, (data) => {
      if (data && data.val() !== 'lastChange' && data.key) {
        this.dialogMembers.push(data.key); //users
        this.dialogRooms.push(data.val().uid); //chats
        this.dialogMembersProp.push(this.getUserInfo(data.key));
      }

      debonceGetDialogs();
      this.emit('updateDialogs');
    });
  }

  getDialogs = () => {
    this.dialogsMessages = [];
    this.dialogRooms.forEach((room, index) => {
      const messages: DialogMessages[] = [];

      this.dialogsMessages.push(messages);
      const dialogRef = ref(this.rtdb, `dialogRooms/${room}`);
      onValue(dialogRef, async (snapshot) => {
        this.lastChangeUserDialog[index] = (
          await get(ref(this.rtdb, `users/${this.user?.uid}/dialogRooms/${this.dialogMembers[index]}/lastChange`))
        ).val();
        this.lastChangeDialog[index] = snapshot.val()?.lastChange;
        this.dialogsMessages[index] = [];
        snapshot.forEach((data) => {
          if (data.key !== 'lastChange') {
            const message: DialogMessages = data.val();
            message.key = data.key || '';
            this.dialogsMessages[index].push(message);
          }
        });
        this.emit('updateDialog', index);
      });
    });
  };

  getAllUser = async () => {
    const allUserProp: UserProp[] = [];
    try {
      const users = await get(ref(this.rtdb, 'users'));
      if (users.exists()) {
        users.forEach((user) => {
          const { userName, userStatus, userAvatar, userCover, subscripts, userId } = user.val();
          const userProp: UserProp = {
            userName: userName || 'Кот Петр',
            userStatus: userStatus || 'Обновите ваш статус :)',
            userAvatar: userAvatar,
            userCover: userCover,
            userSubscripts: subscripts,
            userId: userId,
          };
          allUserProp.push(userProp);
        });
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error(error);
    }
    return allUserProp;
  };

  async getUserInfo(userId: string) {
    const dbRef = ref(this.rtdb);
    let userProp: UserProp = {
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
      await addDoc(collection(this.db, 'messages'), {
        uid: this.user?.uid,
        name: this.user?.displayName ? this.user.displayName : 'unknown',
        photo: this.user?.photoURL,
        text: message,
        created: serverTimestamp(),
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  private sendMessageToRooms = (message: string) => {
    try {
      const dialogRef = ref(this.rtdb, `dialogRooms/${this.currentDialog}`);
      const newPostKey = push(dialogRef).key;

      if (newPostKey) {
        const newPostData = {
          uid: this.user?.uid,
          name: this.user?.displayName ? this.user.displayName : 'unknown',
          text: message,
          time: Date.now(),
        };
        const dialog = this.dialogMembers[this.dialogRooms.findIndex((el) => el === this.currentDialog)];
        const time = Date.now();
        const updates: { [index: string]: string | number | object } = {};
        updates[`dialogRooms/${this.currentDialog}/${newPostKey}`] = newPostData;
        updates[`dialogRooms/${this.currentDialog}/lastChange`] = time;
        updates[`users/${this.user?.uid}/dialogRooms/${dialog}/lastChange`] = time;
        update(ref(this.rtdb), updates);
      } else {
        throw new Error("Don't get key post");
      }
    } catch (e) {
      console.error('Error adding document: ', e);
    }
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
          updates[`${currentUserRef}/${uid}/uid`] = newDialog;
          updates[`${userRef}/${currentUserUid}/uid`] = newDialog;
          update(ref(this.rtdb), updates);
        }
      }

      const index = this.dialogMembers.findIndex((el) => el === uid);
      this.currentDialog = this.dialogRooms[index];
      this.emit('updateDialog', index);
    }
  };

  checkDialog = async (index: number) => {
    await Promise.all(this.dialogMembersProp);
    const currentDialog = this.dialogMembers[this.dialogRooms.findIndex((el) => el === this.currentDialog)];
    const nextDialog = this.dialogMembers[index];
    const time = Date.now();
    const updates: { [index: string]: string | number } = {};
    if (currentDialog) {
      updates[`users/${this.user?.uid}/dialogRooms/${currentDialog}/lastChange`] = time;
    }
    updates[`users/${this.user?.uid}/dialogRooms/${nextDialog}/lastChange`] = time;
    update(ref(this.rtdb), updates);
    this.currentDialog = this.dialogRooms[index];
    this.isRooms = true;
    this.emit('showDialog');
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
