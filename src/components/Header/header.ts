import './header.css';
import { EventEmitter } from 'events';
import { createHtmlElement } from '../../utils/createElement';
import { PATH } from '../../app/app';

export default class Header extends EventEmitter {
    element: HTMLElement;
    logo: HTMLElement;
    constructor() {
        super();
        this.element = createHtmlElement('header', 'header');
        document.body.prepend(this.element);
        const wrapper = createHtmlElement('div', 'header__wrapper', '', this.element);
        this.logo = createHtmlElement('div', 'logo__img', '', wrapper);

        this.logo.addEventListener('click', () => {
            this.emit('navigate', PATH.login);
        });
    }
}