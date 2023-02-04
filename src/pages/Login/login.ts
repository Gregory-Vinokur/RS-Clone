import './login.css';
import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import { checkAuthStatus, handleLogout, resetPassword, signIn, signUp } from './../../server/firebaseAuth';
import qs from 'query-string';
import { PATH } from '../../app/app';

export default class LoginPage extends Page {
    constructor(id: string) {
        super(id);
        this.mainWrapper.className = 'error__wrap';
        const form = createHtmlElement('form', 'login__form', '', this.mainWrapper);
        const buttonsWrap = createHtmlElement('div', 'btns__wrap', '');
        const continueBtn = createHtmlElement('div', 'continue__btn', 'Continue', buttonsWrap);
        const changeUserBtn = createHtmlElement('div', 'change__user-btn', 'Change user', buttonsWrap);

        const userNamePasswordWrap = createHtmlElement('div', 'user__mail-wrap', '', form);
        const usernameLabel = createHtmlElement('label', '', 'E-mail:', userNamePasswordWrap);
        const usernameInput = createHtmlElement('input', 'username', '', usernameLabel) as HTMLInputElement;
        usernameInput.setAttribute('type', 'text');
        usernameInput.setAttribute('required', '');
        usernameInput.setAttribute('pattern', `[a-zA-Z0-9._-]+@[a-zA-Z]+\\.[a-zA-Z]{2,3}`);
        const ErrorMessageUser = createHtmlElement('span', 'error__message', 'Invalid e-mail', usernameLabel);

        usernameInput.addEventListener('invalid', function (e: Event) {
            e.preventDefault();
            if (!usernameInput.validity.valid) {
                ErrorMessageUser.classList.toggle('active');
                usernameInput.classList.toggle('invalid');
            }
        });
        usernameInput.addEventListener('input', function () {
            if (ErrorMessageUser.classList.contains('active')) {
                ErrorMessageUser.classList.toggle('active');
                usernameInput.classList.toggle('invalid');
            }
            if (usernameInput.classList.contains('invalid')) {
                usernameInput.classList.toggle('invalid');
            }
            if (resetPasswordMessage.classList.contains('active')) {
                resetPasswordLink.classList.remove('invisible');
                resetPasswordLink.classList.add('active');
                resetPasswordMessage.classList.toggle('active');
            }
        });
        usernameInput.addEventListener('blur', function () {
            if (!usernameInput.validity.valid) {
                ErrorMessageUser.classList.toggle('active');
                usernameInput.classList.toggle('invalid');
            }
        });

        const passwordLabel = createHtmlElement('label', '', 'Password:', userNamePasswordWrap);
        const passwordWrap = createHtmlElement('div', 'password__wrap', '', passwordLabel);
        const passwordInput = createHtmlElement('input', 'password', '', passwordWrap) as HTMLInputElement;
        const resetPasswordLink = createHtmlElement('a', 'reset__link', 'Forgot your password?', userNamePasswordWrap);
        const resetPasswordMessage = createHtmlElement('div', 'reset__text', '', userNamePasswordWrap);
        passwordInput.setAttribute('type', 'password');
        passwordInput.setAttribute('required', '');
        passwordInput.setAttribute('pattern', `[A-Za-zА-Яа-яЁё0-9-]{6,}`);
        const hidePasswordSvg = createHtmlElement('i', 'show__svg', '', passwordWrap);
        const ErrorMessagePassword = createHtmlElement('span', 'error__message', 'Invalid password', passwordLabel);

        passwordInput.addEventListener('invalid', function (e: Event) {
            e.preventDefault();
            if (!passwordInput.validity.valid) {
                ErrorMessagePassword.classList.toggle('active');
                passwordInput.classList.toggle('invalid');
            }
        });
        passwordInput.addEventListener('input', function () {
            if (ErrorMessagePassword.classList.contains('active')) {
                ErrorMessagePassword.classList.toggle('active');
                passwordInput.classList.toggle('invalid');
            }
        });

        hidePasswordSvg.addEventListener('click', (e: Event) => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            hidePasswordSvg.classList.toggle('hide__svg');
        })

        const signInButton = createHtmlElement('button', 'sign__in', 'Sign in', form);

        const signUpButton = createHtmlElement('button', 'sign__up', 'Sign up', form);

        const submitButtonForSigIn = createHtmlElement('button', 'submit', 'Submit', form);
        const submitButtonForSigUp = createHtmlElement('button', 'submit', 'Submit', form);


        signInButton.addEventListener('click', (e: Event) => {
            e.preventDefault();
            userNamePasswordWrap.classList.toggle('visible');
            signInButton.classList.toggle('invisible');
            signUpButton.classList.toggle('invisible');
            submitButtonForSigIn.classList.toggle('submit__visible');
            const params = qs.parse(window.location.search);
            params.auth = 'sign_in'
            const search = qs.stringify(params);
            window.history.pushState({}, 'path', window.location.origin + window.location.pathname + `${search ? '?' + search : ''}`);
            resetPasswordLink.classList.toggle('active');
        });

        signUpButton.addEventListener('click', (e: Event) => {
            e.preventDefault();
            userNamePasswordWrap.classList.toggle('visible');
            signInButton.classList.toggle('invisible');
            signUpButton.classList.toggle('invisible');
            submitButtonForSigUp.classList.toggle('submit__visible');
            const params = qs.parse(window.location.search);
            params.auth = 'sign_up'
            const search = qs.stringify(params);
            window.history.pushState({}, 'path', window.location.origin + window.location.pathname + `${search ? '?' + search : ''}`);
        });

        submitButtonForSigIn.addEventListener('click', (e: Event) => {
            e.preventDefault();
            signIn(usernameInput, passwordInput, ErrorMessageUser, ErrorMessagePassword)
        })

        submitButtonForSigUp.addEventListener('click', (e: Event) => {
            e.preventDefault();
            signUp(usernameInput.value, passwordInput.value, passwordInput, ErrorMessagePassword);
        })

        checkAuthStatus(form, buttonsWrap)

        continueBtn.addEventListener('click', () => this.emit('navigate', PATH.profilePage))

        changeUserBtn.addEventListener('click', () => {
            handleLogout();
        });

        resetPasswordLink.addEventListener('click', () => {
            resetPassword(usernameInput.value, usernameInput, resetPasswordMessage, resetPasswordLink);
        })

    }
    render(): HTMLElement {
        return this.mainWrapper;
    }
}