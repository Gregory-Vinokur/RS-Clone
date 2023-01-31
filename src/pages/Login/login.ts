import './login.css';
import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';

export default class LoginPage extends Page {
    constructor(id: string) {
        super(id);
        this.mainWrapper.className = 'error__wrap';
        const form = createHtmlElement('form', 'login__form', '', this.mainWrapper);

        const usernameLabel = createHtmlElement('label', '', 'Username:', form);
        const usernameInput = createHtmlElement('input', 'username', '', form);
        usernameInput.setAttribute('type', 'text');

        const passwordLabel = createHtmlElement('label', '', 'Password:', form);
        const passwordInput = createHtmlElement('input', 'password', '', form);
        passwordInput.setAttribute('type', 'password');

        const submitButton = createHtmlElement('button', '', 'Submit', form);
        submitButton.setAttribute('type', 'submit');


    }
    render(): HTMLElement {
        return this.mainWrapper;
    }
}