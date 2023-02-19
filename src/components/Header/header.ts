import './header.css';
import ModelApp from '../../app/Model-app';
import { EventEmitter } from 'events';
import { createHtmlElement } from '../../utils/createElement';
import { PATH } from '../../app/app';
import Button from '../../base/button/Button';
import { CLASSTHEME, THEME } from '../../constans/constans';
import defaultAva from '../../../assets/img/default-ava.jpg';

type EmitsName = 'changeLang' | 'navigate' | 'openMenu';

export default class Header extends EventEmitter {
  element: HTMLElement;
  logo: HTMLElement;
  model: ModelApp;
  buttonLang: Button<ModelApp>;
  userAvatar: HTMLImageElement;
  humburger: HTMLElement;
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
    this.element = createHtmlElement('header', 'header');
    document.body.prepend(this.element);
    const wrapper = createHtmlElement('div', 'header__wrapper', '', this.element);
    const logoContainer = createHtmlElement('div', 'header__logo', '', wrapper);
    this.logo = createHtmlElement('div', 'logo__img', '', logoContainer);
    this.humburger = createHtmlElement('div', 'hamburger', '', logoContainer);
    createHtmlElement('span', '', '', this.humburger);
    createHtmlElement('span', '', '', this.humburger);
    createHtmlElement('span', '', '', this.humburger);
    this.humburger.addEventListener('click', () => this.emit('openMenu'));
    createHtmlElement('h1', 'logo__title', 'Вконтакте', logoContainer);
    const buttonContainer = createHtmlElement('div', 'containerButtons__header', '', wrapper);
    this.buttonLang = new Button('langButton', this.model, () => this.emit('changeLang'));
    buttonContainer.append(this.buttonLang.render());
    const buttonTheme = createHtmlElement('div', 'theme-button', '', buttonContainer);
    buttonTheme.addEventListener('click', this.changeTheme);
    this.userAvatar = createHtmlElement('img', 'header__user-ava', '', buttonContainer) as HTMLImageElement;

    this.logo.addEventListener('click', () => {
      this.emit('navigate', PATH.login);
    });
    this.model.on('setUser', () => {
      this.userAvatar.src = `${this.model.user?.photoURL || defaultAva}`;
    });
  }

  private changeTheme = () => {
    document.body.classList.toggle(CLASSTHEME);
    const theme = document.body.classList.contains(CLASSTHEME) ? CLASSTHEME : '';
    localStorage.setItem(THEME, theme);
  };

  private changeLang = () => {
    this.buttonLang.changeLang();
  };
}
