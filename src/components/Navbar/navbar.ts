import './navbar.css';
import { EventEmitter } from 'events';
import { createHtmlElement } from '../../utils/createElement';
import { PATH } from '../../app/app';
import { handleLogout } from '../../server/firebaseAuth';
export default class Navbar extends EventEmitter {
  element: HTMLElement;
  constructor() {
    super();
    this.element = createHtmlElement('aside', 'side__bar');
    const wrapper = createHtmlElement('div', 'side__bar-nav', '', this.element);
    const sideBarOl = createHtmlElement('ol', 'side__bar-ol', '', wrapper);
    const myProfile = createHtmlElement('li', 'side__bar-item my__pr', 'My Profile', sideBarOl);
    const news = createHtmlElement('li', 'side__bar-item my__pr', 'News', sideBarOl);
    const messenger = createHtmlElement('li', 'side__bar-item my__pr', 'Messenger', sideBarOl);
    const Logout = createHtmlElement('li', 'side__bar-item my__pr', 'Logout', sideBarOl);

    myProfile.addEventListener('click', () => {
      this.emit('navigate', PATH.profilePage);
    });

    messenger.addEventListener('click', () => {
      this.emit('navigate', PATH.messagesPage);
    });

    Logout.addEventListener('click', () => {
      handleLogout();
    })
  }
  render(): HTMLElement {
    return this.element;
  }
}
