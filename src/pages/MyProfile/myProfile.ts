import './myProfile.css';
import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import 'firebase/compat/storage';
import myProfileInfo from './myProfileInfo';
import myProfileCover from './myProfileCover';
export default class myProfile extends Page {
  constructor(id: string) {
    super(id);
    this.mainWrapper.className = 'my__page';
    const profileWrapper = createHtmlElement('div', 'profile__wrapper', '', this.mainWrapper);

    const uploadCoverLabel = createHtmlElement('label', 'profile__label-cover', '', profileWrapper);
    uploadCoverLabel.setAttribute('for', 'profile__input-cover');

    const profileAva = new myProfileInfo('profile__avatar');
    profileWrapper.append(profileAva.render());
    const profileCover = new myProfileCover('profile__cover');
    profileWrapper.append(profileCover.render());
  }

  render(): HTMLElement {
    return this.mainWrapper;
  }
}
