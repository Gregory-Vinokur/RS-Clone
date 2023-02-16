import Model from '../Template/Model';
import avatar from '../../../assets/img/ava.jpg';
import debounce from '../../utils/debounce';
import { firebaseConfig } from '../../server/firebase.config';
import { initializeApp } from 'firebase/app';
import { UserProp, GroupProps, DialogMessages } from '../../constans/types';
import { PATCH_TO_DB } from '../../constans/constans';
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

import { get, ref, update, onChildAdded, child, push, onValue, remove } from 'firebase/database';

import { Sort, TypeUser } from '../../constans/types';
import { Lang } from '../../constans/constans';

export default class ModelMessages extends Model {
  db: Firestore;
  messages: QuerySnapshot<DocumentData> | undefined;
  limit: number;
  sort: Sort;
  isChat: boolean;
  isRooms: boolean;
  isGroupRooms: boolean;
  dialogRooms: string[];
  dialogMembers: string[];
  dialogMembersProp: Promise<UserProp>[];
  dialogsMessages: DialogMessages[][];
  currentDialog: string;
  lastChangeUserDialog: number[];
  lastChangeDialog: number[];
  groupRooms: string[];
  groupsProp: GroupProps[];
  currentGroup: string;
  groupsMessages: DialogMessages[][];
  groupRoomsLastChange: number[];
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
    this.isGroupRooms = false;
    this.groupRooms = [];
    this.groupsProp = [];
    this.groupsMessages = [];
    this.groupRoomsLastChange = [];
    this.currentGroup = '';
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    onSnapshot(query(collection(this.db, 'messages'), orderBy('created', this.sort), limit(this.limit)), (querySnapshot) => {
      this.messages = querySnapshot;
      this.emit('updateData');
    });
    const debonceGetDialogs = debounce(this.getDialogs, 200);
    const dialogRef = ref(this.rtdb, `${PATCH_TO_DB.USERS}/${this.user?.uid}/${PATCH_TO_DB.DIALOGS_ROOMS}`);

    onChildAdded(dialogRef, (data) => {
      if (data && data.val() !== 'lastChange' && data.key) {
        this.dialogMembers.push(data.key); //users
        this.dialogRooms.push(data.val().uid); //chats
        this.dialogMembersProp.push(this.getUserInfo(data.key));
      }
      debonceGetDialogs();
      this.emit('updateDialogs');
    });

    const groupRef = ref(this.rtdb, `${PATCH_TO_DB.USERS}/${this.user?.uid}/${PATCH_TO_DB.GROUP_ROOMS}`);
    onValue(groupRef, (snapshot) => {
      this.groupRooms = [];
      this.groupRoomsLastChange = [];
      snapshot.forEach((data) => {
        if (data && data.val() !== 'lastChange' && data.key) {
          this.groupRooms.push(data.key); //groups
          this.groupRoomsLastChange.push(data.val().lastChange);
          this.getGroupsInfo();
        }
      });
    });
  }

  getDialogs = () => {
    this.dialogsMessages = [];
    this.dialogRooms.forEach((room, index) => {
      const messages: DialogMessages[] = [];

      this.dialogsMessages.push(messages);
      const dialogRef = ref(this.rtdb, `${PATCH_TO_DB.DIALOGS_ROOMS}/${room}`);
      onValue(dialogRef, async (snapshot) => {
        this.lastChangeUserDialog[index] = (
          await get(
            ref(
              this.rtdb,
              `${PATCH_TO_DB.USERS}/${this.user?.uid}/${PATCH_TO_DB.DIALOGS_ROOMS}/${this.dialogMembers[index]}/${PATCH_TO_DB.LAST_CHANGE}`
            )
          )
        ).val();
        this.lastChangeDialog[index] = snapshot.val()?.lastChange;
        this.dialogsMessages[index] = [];
        snapshot.forEach((data) => {
          if (data.key !== PATCH_TO_DB.LAST_CHANGE) {
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
      const users = await get(ref(this.rtdb, PATCH_TO_DB.USERS));
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
      const snapshot = await get(child(dbRef, `${PATCH_TO_DB.USERS}/${userId}`));
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

  async getGroupsInfo() {
    const dbRef = ref(this.rtdb);
    this.groupsProp = [];
    this.groupRooms.forEach((group, index) => {
      try {
        onValue(child(dbRef, `${PATCH_TO_DB.GROUP_ROOMS}/${group}`), (snapshot) => {
          if (snapshot.exists()) {
            const { nameGroup, messages, uid, lastChange, members } = snapshot.val();
            const groupProp: GroupProps = {
              nameGroup: nameGroup,
              groupAvatar: this.user ? this.user.photoURL : avatar,
              messages: messages,
              uid: uid,
              [PATCH_TO_DB.LAST_CHANGE]: lastChange,
              members: members,
            };
            this.groupsProp[index] = groupProp;
            this.emit('updateGroups');
          } else {
            console.log('No data available');
          }
        });
      } catch (error) {
        console.error(error);
      }
    });
  }

  deleteMessage = async (docum: string) => {
    await deleteDoc(doc(this.db, 'messages', docum));
  };

  deleteDialogMessage = (key: string) => {
    const dialogRef = ref(this.rtdb, `${PATCH_TO_DB.DIALOGS_ROOMS}/${this.currentDialog}/${key}`);
    remove(dialogRef);
  };

  sendMessage = (message: string) => {
    if (this.isChat) {
      this.sendMessageToChat(message);
    }
    if (this.isRooms) {
      this.sendMessageToRooms(message);
    }
    if (this.isGroupRooms) {
      this.sendMessageToGroupRooms(message);
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
      const dialogRef = ref(this.rtdb, `${PATCH_TO_DB.DIALOGS_ROOMS}/${this.currentDialog}`);
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
        updates[`${PATCH_TO_DB.DIALOGS_ROOMS}/${this.currentDialog}/${newPostKey}`] = newPostData;
        updates[`${PATCH_TO_DB.DIALOGS_ROOMS}/${this.currentDialog}/${PATCH_TO_DB.LAST_CHANGE}`] = time;
        updates[`${PATCH_TO_DB.USERS}/${this.user?.uid}/${PATCH_TO_DB.DIALOGS_ROOMS}/${dialog}/${PATCH_TO_DB.LAST_CHANGE}`] = time;
        update(ref(this.rtdb), updates);
      } else {
        throw new Error("Don't get key post");
      }
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  private sendMessageToGroupRooms = (message: string) => {
    try {
      const dialogRef = ref(this.rtdb, `${PATCH_TO_DB.GROUP_ROOMS}/${this.currentGroup}`);
      const newPostKey = push(child(dialogRef, PATCH_TO_DB.MESSAGES)).key;
      const time = Date.now();
      if (newPostKey) {
        const newPostData = {
          uid: this.user?.uid,
          name: this.user?.displayName ? this.user.displayName : 'unknown',
          text: message,
          time: time,
        };
        const updates: { [index: string]: string | number | object } = {};
        updates[`${PATCH_TO_DB.GROUP_ROOMS}/${this.currentGroup}/${PATCH_TO_DB.MESSAGES}/${newPostKey}`] = newPostData;
        updates[`${PATCH_TO_DB.GROUP_ROOMS}/${this.currentGroup}/${PATCH_TO_DB.LAST_CHANGE}`] = time;
        updates[`${PATCH_TO_DB.USERS}/${this.user?.uid}/${PATCH_TO_DB.GROUP_ROOMS}/${this.currentGroup}/${PATCH_TO_DB.LAST_CHANGE}`] = time;
        update(ref(this.rtdb), updates);
      } else {
        throw new Error("Don't get key post");
      }
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    console.log(message);
  };

  writeUser = async (uid: string) => {
    const currentUserUid = this.user?.uid;
    if (currentUserUid) {
      const currentUserRef = `${PATCH_TO_DB.USERS}/${currentUserUid}/${PATCH_TO_DB.DIALOGS_ROOMS}`;
      const userRef = `${PATCH_TO_DB.USERS}/${uid}/${PATCH_TO_DB.DIALOGS_ROOMS}`;
      if (!this.dialogMembers.includes(uid)) {
        const newDialog = push(child(ref(this.rtdb), PATCH_TO_DB.DIALOGS_ROOMS)).key;
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

  createNewGroup = async (nameGroup: string) => {
    const currentUserUid = this.user?.uid;
    if (currentUserUid) {
      const currentUserRef = `${PATCH_TO_DB.USERS}/${currentUserUid}/${PATCH_TO_DB.GROUP_ROOMS}`;
      const newGroup = push(child(ref(this.rtdb), PATCH_TO_DB.GROUP_ROOMS)).key;
      const time = Date.now();
      const updates: { [index: string]: string | number | object } = {};
      if (newGroup) {
        const dataGroup = {
          nameGroup: nameGroup,
          uid: newGroup,
          [PATCH_TO_DB.LAST_CHANGE]: time,
          members: {
            [currentUserUid]: true,
          },
        };
        updates[`${currentUserRef}/${newGroup}/${PATCH_TO_DB.LAST_CHANGE}`] = time;
        updates[`${PATCH_TO_DB.GROUP_ROOMS}/${newGroup}`] = dataGroup;
        update(ref(this.rtdb), updates);
      }
    }
  };

  checkDialog = async (index: number) => {
    await Promise.all(this.dialogMembersProp);
    const currentDialog = this.dialogMembers[this.dialogRooms.findIndex((el) => el === this.currentDialog)];
    const nextDialog = this.dialogMembers[index];
    const time = Date.now();
    const updates: { [index: string]: string | number } = {};
    if (currentDialog) {
      updates[`${PATCH_TO_DB.USERS}/${this.user?.uid}/${PATCH_TO_DB.DIALOGS_ROOMS}/${currentDialog}/${PATCH_TO_DB.LAST_CHANGE}`] = time;
    }
    updates[`${PATCH_TO_DB.USERS}/${this.user?.uid}/${PATCH_TO_DB.DIALOGS_ROOMS}/${nextDialog}/${PATCH_TO_DB.LAST_CHANGE}`] = time;
    update(ref(this.rtdb), updates);
    this.currentDialog = this.dialogRooms[index];
    this.isRooms = true;
    this.emit('showDialog');
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  checkGroup = async (index: number) => {
    const currentGroup = this.currentGroup;
    const nextGroup = this.groupRooms[index];
    const time = Date.now();
    const updates: { [index: string]: string | number } = {};
    if (currentGroup) {
      updates[`${PATCH_TO_DB.USERS}/${this.user?.uid}/${PATCH_TO_DB.GROUP_ROOMS}/${currentGroup}/${PATCH_TO_DB.LAST_CHANGE}`] = time;
    }
    updates[`${PATCH_TO_DB.USERS}/${this.user?.uid}/${PATCH_TO_DB.GROUP_ROOMS}/${nextGroup}/${PATCH_TO_DB.LAST_CHANGE}`] = time;
    update(ref(this.rtdb), updates);
    this.currentGroup = nextGroup;
    this.emit('showGroup');

    console.log(index);
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
