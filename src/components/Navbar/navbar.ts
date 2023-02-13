import './navbar.css';
import { EventEmitter } from 'events';
import { createHtmlElement } from '../../utils/createElement';
import { PATH } from '../../app/app';
import { handleLogout } from '../../server/firebaseAuth';
import ModelApp from '../../app/Model-app';
import { LANGTEXT } from '../../constans/constans';
import { loadCatsPosts } from './../../data/news_api/cats_api';
import { loadMemePosts } from './../../data/news_api/memes_api';

export default class Navbar extends EventEmitter {
  element: HTMLElement;
  model: ModelApp;
  myProfile: HTMLElement;
  news: HTMLElement;
  messenger: HTMLElement;
  Logout: HTMLElement;
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
      // loadCatsPosts();
      // loadMemePosts();
    });

    this.Logout.addEventListener('click', () => {
      handleLogout();
    });
  }

  changeLang = () => {
    this.myProfile.innerText = LANGTEXT['myProfile'][this.model.lang];
    this.news.innerText = LANGTEXT['news'][this.model.lang];
    this.messenger.innerText = LANGTEXT['messenger'][this.model.lang];
    this.Logout.innerText = LANGTEXT['Logout'][this.model.lang];
  };
  render(): HTMLElement {
    return this.element;
  }
}
