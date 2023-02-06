import { EventEmitter } from 'events';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Lang } from '../../constans/constans';

type EmitsName = 'authorized' | 'changeLang' | 'updateData' | 'setLimit' | 'createdNews';

export default abstract class Model extends EventEmitter {
  isLogin = false;
  lang: Lang;
  user: User | null;

  emit(event: EmitsName, data?: number) {
    return super.emit(event, data);
  }

  on(event: EmitsName, callback: (data?: number) => void) {
    return super.on(event, callback);
  }

  constructor(lang: Lang) {
    super();
    const auth = getAuth();
    this.setMaxListeners(0);
    this.user = null;
    this.lang = lang;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        this.isLogin = true;
        this.user = user;
      } else {
        // User is signed out
        this.isLogin = false;
        this.user = null;
      }
      this.emit('authorized');
    });
  }

  changeLang = (lang: Lang) => {
    this.lang = lang;
    this.emit('changeLang');
  };
}
