import { EventEmitter } from 'events';
import { Lang } from '../../constans/constans';
import { TypeUser } from '../../constans/types';

type EmitsName =
  | 'authorized'
  | 'changeLang'
  | 'updateData'
  | 'setLimit'
  | 'createdNews'
  | 'loadPostImg'
  | 'postImgLoaded'
  | 'uploadAvatar'
  | 'uploadCover';

export default abstract class Model extends EventEmitter {
  lang: Lang;
  user: TypeUser;

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
  }

  changeLang = (lang: Lang) => {
    this.lang = lang;
    this.emit('changeLang');
  };
}
