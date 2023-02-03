import './navbar.css';
import { EventEmitter } from 'events';
import { createHtmlElement } from '../../utils/createElement';
import { PATH } from '../../app/app';

export default class Navbar extends EventEmitter {
    element: HTMLElement;
    constructor() {
        super();
        this.element = createHtmlElement('aside', 'side__bar');
        // document.body.append(this.element);
        const wrapper = createHtmlElement('div', 'side__bar-nav', '', this.element);
        const sideBarOl = createHtmlElement('ol', 'side__bar-ol', '', wrapper);
        const myProfile = createHtmlElement('li', 'side__bar-item my__pr', 'My Profile', sideBarOl);
        const news = createHtmlElement('li', 'side__bar-item my__pr', 'News', sideBarOl);
        const messenger = createHtmlElement('li', 'side__bar-item my__pr', 'Messenger', sideBarOl);

        myProfile.addEventListener('click', () => {
            this.emit('navigate', PATH.profilePage);
        });
    }
    render(): HTMLElement {
        return this.element;
    }
}