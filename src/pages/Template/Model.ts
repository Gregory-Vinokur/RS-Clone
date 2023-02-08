import { EventEmitter } from 'events';
import { Lang } from '../../constans/constans';
import { TypeUser } from '../../constans/types';
import { firebaseConfig } from '../../server/firebase.config';
import { initializeApp } from 'firebase/app';
import { Database, getDatabase, ref, update, onChildAdded, onChildRemoved, child, push } from 'firebase/database';

type EmitsName =
  | 'authorized'
  | 'changeLang'
  | 'updateData'
  | 'setLimit'
  | 'createdNews'
  | 'loadPostImg'
  | 'postImgLoaded'
  | 'uploadAvatar'
  | 'uploadCover'
  | 'updateDialog';

export default abstract class Model extends EventEmitter {
  lang: Lang;
  user: TypeUser;
  rtdb: Database;
  subscripts: string[];

  emit(event: EmitsName, data?: number) {
    return super.emit(event, data);
  }

  on(event: EmitsName, callback: (data?: number) => void) {
    return super.on(event, callback);
  }

  constructor(lang: Lang, user: TypeUser) {
    super();
    this.user = user;
    this.lang = lang;
    const app = initializeApp(firebaseConfig);
    this.rtdb = getDatabase(app);
    this.subscripts = [];

    const Ref = ref(this.rtdb, `users/${this.user?.uid}/subscripts`);
    onChildAdded(Ref, (data) => {
      if (data && data.key) {
        this.subscripts.push(data.key);
      }
    });
    onChildRemoved(Ref, (data) => {
      this.subscripts = this.subscripts.filter((user) => user !== data.key);
    });
  }

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

  changeLang = (lang: Lang) => {
    this.lang = lang;
    this.emit('changeLang');
  };
}
