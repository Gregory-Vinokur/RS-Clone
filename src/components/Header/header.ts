import './header.css';
import ModelApp from '../../app/Model-app';
import { EventEmitter } from 'events';
import { createHtmlElement } from '../../utils/createElement';
import { PATH } from '../../app/app';
import Button from '../../base/button/Button';
import { CLASSTHEME, THEME } from '../../constans/constans';

type EmitsName = 'changeLang' | 'navigate';

export default class Header extends EventEmitter {
  element: HTMLElement;
  logo: HTMLElement;
  model: ModelApp;

  emit(event: EmitsName, data?: string) {
    return super.emit(event, data);
  }

  on(event: EmitsName, callback: ((data?: string) => void) | ((data: string) => void)) {
    return super.on(event, callback);
  }

  constructor(model: ModelApp) {
    super();
    this.model = model;
    this.element = createHtmlElement('header', 'header');
    document.body.prepend(this.element);
    const wrapper = createHtmlElement('div', 'header__wrapper', '', this.element);
    this.logo = createHtmlElement('div', 'logo__img', '', wrapper);

    const buttonContainer = createHtmlElement('div', 'containerButtons__header', '', wrapper);
    const buttonLang = new Button('langButton', this.model, () => this.emit('changeLang'));
    buttonContainer.append(buttonLang.render());
    const buttonTheme = createHtmlElement('div', 'theme-button', '', buttonContainer);
    buttonTheme.addEventListener('click', this.changeTheme);

    this.logo.addEventListener('click', () => {
      this.emit('navigate', PATH.login);
    });
  }

  private changeTheme = () => {
    document.body.classList.toggle(CLASSTHEME);
    const theme = document.body.classList.contains(CLASSTHEME) ? CLASSTHEME : '';
    localStorage.setItem(THEME, theme);
  };
}
