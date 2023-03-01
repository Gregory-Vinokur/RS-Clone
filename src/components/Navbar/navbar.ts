import './navbar.css';
import { EventEmitter } from 'events';
import { createHtmlElement } from '../../utils/createElement';
import { PATH } from '../../app/app';
import { handleLogout } from '../../server/firebaseAuth';
import ModelApp from '../../app/Model-app';
import { LANGTEXT } from '../../constans/constans';

type EmitsName = 'navigate' | 'closeMenu';

export default class Navbar extends EventEmitter {
  element: HTMLElement;
  model: ModelApp;
  myProfile: HTMLElement;
  news: HTMLElement;
  messenger: HTMLElement;
  Logout: HTMLElement;
  music: HTMLElement;
  communities: HTMLElement;

  emit(event: EmitsName, data?: string) {
    return super.emit(event, data);
  }

  on(event: EmitsName, callback: ((data?: string) => void) | ((data: string) => void)) {
    return super.on(event, callback);
  }

  constructor(model: ModelApp) {
    super();
    this.model = model;
    this.model.on('changeLang', this.changeLang);
    this.element = createHtmlElement('aside', 'side__bar');
    const wrapper = createHtmlElement('div', 'side__bar-nav', '', this.element);
    const sideBarOl = createHtmlElement('ol', 'side__bar-ol', '', wrapper);
    this.myProfile = createHtmlElement('li', 'side__bar-item my__pr', '', sideBarOl);
    this.news = createHtmlElement('li', 'side__bar-item my__pr', '', sideBarOl);
    this.messenger = createHtmlElement('li', 'side__bar-item my__pr', '', sideBarOl);
    this.communities = createHtmlElement('li', 'side__bar-item my__pr', '', sideBarOl);
    this.music = createHtmlElement('li', 'side__bar-item my__pr', '', sideBarOl);
    this.Logout = createHtmlElement('li', 'side__bar-item my__pr', '', sideBarOl);
    this.changeLang();

    this.myProfile.addEventListener('click', () => {
      this.emit('navigate', PATH.profilePage);
    });

    this.messenger.addEventListener('click', () => {
      this.emit('navigate', PATH.messagesPage);
    });

    this.news.addEventListener('click', () => {
      this.emit('navigate', PATH.newsPage);
    });

    this.Logout.addEventListener('click', () => {
      handleLogout();
    });

    this.music.addEventListener('click', () => {
      this.emit('navigate', PATH.musicPage);
    });

    this.communities.addEventListener('click', () => {
      this.emit('navigate', PATH.communitiesPage);
    });

    this.element.addEventListener('click', () => this.emit('closeMenu'));
  }

  changeLang = () => {
    this.myProfile.innerText = LANGTEXT['myProfile'][this.model.lang];
    this.news.innerText = LANGTEXT['news'][this.model.lang];
    this.messenger.innerText = LANGTEXT['messenger'][this.model.lang];
    this.Logout.innerText = LANGTEXT['Logout'][this.model.lang];
    this.music.innerText = LANGTEXT['musicPage'][this.model.lang];
    this.communities.innerText = LANGTEXT['CommunitiesPage'][this.model.lang];
  };
  render(): HTMLElement {
    return this.element;
  }
}
