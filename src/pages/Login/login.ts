import './login.css';
import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import { handleLogin, signUp } from './../../server/firebaseAuth';

export default class LoginPage extends Page {
    constructor(id: string) {
        super(id);
        this.mainWrapper.className = 'error__wrap';
        const form = createHtmlElement('form', 'login__form', '', this.mainWrapper);

        const usernameLabel = createHtmlElement('label', '', 'E-mail:', form);
        const usernameInput = createHtmlElement('input', 'username', '', form) as HTMLInputElement;
        usernameInput.setAttribute('type', 'text');

        const passwordLabel = createHtmlElement('label', '', 'Password:', form);
        const passwordInput = createHtmlElement('input', 'password', '', form) as HTMLInputElement;
        passwordInput.setAttribute('type', 'password');

        const submitButton = createHtmlElement('button', 'submit', 'Submit', form);
        submitButton.setAttribute('type', 'submit');

        submitButton.addEventListener('click', (e: Event) => {
            e.preventDefault();
            signUp(usernameInput.value, passwordInput.value);
        });


    }
    render(): HTMLElement {
        return this.mainWrapper;
    }
}