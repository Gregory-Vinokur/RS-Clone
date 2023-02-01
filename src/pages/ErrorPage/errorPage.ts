import './errorPage.css';
import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';

export default class ErrorPage extends Page {
    constructor(id: string) {
        super(id);
        this.mainWrapper.className = 'error__wrap';
    }
    render(): HTMLElement {
        createHtmlElement('h1', 'error__text', 'PAGE NOT FOUND (404)', this.mainWrapper);
        return this.mainWrapper;
    }
}