import './myProfile.css';
import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';

export default class myProfile extends Page {
    constructor(id: string) {
        super(id);
        this.mainWrapper.className = 'my__page';
    }
    render(): HTMLElement {
        createHtmlElement('h1', 'profile__text', 'My Profile Page', this.mainWrapper);
        return this.mainWrapper;
    }
}