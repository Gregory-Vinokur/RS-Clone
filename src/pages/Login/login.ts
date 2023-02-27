import './login.css';
import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import { checkAuthStatus, handleLogout, resetPassword, signIn, signUp } from './../../server/firebaseAuth';
import qs from 'query-string';
import { PATH } from '../../app/app';
import { Lang, LANGTEXT } from '../../constans/constans';

export default class LoginPage extends Page {
  userNamePasswordWrap: HTMLElement;
  signInButton: HTMLButtonElement;
  signUpButton: HTMLButtonElement;
  submitButtonForSigIn: HTMLButtonElement;
  submitButtonForSigUp: HTMLButtonElement;
  resetPasswordLink: HTMLElement;
  userNameLabel: HTMLElement;
  continueBtn: HTMLElement;
  changeUserBtn: HTMLElement;
  userMailTitle: HTMLElement;
  userNameTitle: HTMLElement;
  userPasswordTitle: HTMLElement;
  errorMessageMail: HTMLElement;
  errorMessageName: HTMLElement;
  errorMessagePassword: HTMLElement;
  constructor(id: string, lang: Lang) {
    super(id);
    this.mainWrapper.className = 'error__wrap';
    const form = createHtmlElement('form', 'login__form', '', this.mainWrapper);
    const buttonsWrap = createHtmlElement('div', 'btns__wrap', '');
    this.continueBtn = createHtmlElement('div', 'continue__btn', '', buttonsWrap);
    this.changeUserBtn = createHtmlElement('div', 'change__user-btn', '', buttonsWrap);

    this.userNamePasswordWrap = createHtmlElement('div', 'user__mail-wrap', '', form);
    const userMailLabel = createHtmlElement('label', 'label__item', '', this.userNamePasswordWrap);
    this.userMailTitle = createHtmlElement('span', 'user__label-title', '', userMailLabel);
    const userMailInput = createHtmlElement('input', 'username', '', userMailLabel) as HTMLInputElement;
    userMailInput.setAttribute('type', 'text');
    userMailInput.setAttribute('required', '');
    userMailInput.setAttribute('pattern', `[a-zA-Z0-9._-]+@[a-zA-Z]+\\.[a-zA-Z]{2,3}`);
    this.errorMessageMail = createHtmlElement('span', 'error__message error__message-mail', '', userMailLabel);
    this.userNameLabel = createHtmlElement('label', 'user__name-label', '', this.userNamePasswordWrap);
    this.userNameTitle = createHtmlElement('span', 'user__label-title', '', this.userNameLabel);
    const userNameInput = createHtmlElement('input', 'username', '', this.userNameLabel) as HTMLInputElement;
    userNameInput.setAttribute('type', 'text');
    userNameInput.setAttribute('required', '');
    this.errorMessageName = createHtmlElement('span', 'error__message error__message-name', '', this.userNameLabel);

    userNameInput.addEventListener('invalid', function (e: Event) {
      e.preventDefault();
      const errorMessageName = document.querySelector('.error__message-name') as HTMLElement;
      if (!userNameInput.validity.valid) {
        errorMessageName.classList.toggle('active');
        userNameInput.classList.toggle('invalid');
      }
    });
    userNameInput.addEventListener('input', function () {
      const errorMessageName = document.querySelector('.error__message-name') as HTMLElement;
      if (errorMessageName.classList.contains('active')) {
        errorMessageName.classList.toggle('active');
        userNameInput.classList.toggle('invalid');
      }
      if (userNameInput.classList.contains('invalid')) {
        userNameInput.classList.toggle('invalid');
      }
    });
    userNameInput.addEventListener('blur', function () {
      const errorMessageName = document.querySelector('.error__message-name') as HTMLElement;
      if (!userNameInput.validity.valid) {
        errorMessageName.classList.toggle('active');
        userNameInput.classList.toggle('invalid');
      }
    });

    userMailInput.addEventListener('invalid', function (e: Event) {
      e.preventDefault();
      if (!userMailInput.validity.valid) {
        this.classList.toggle('active');
        userMailInput.classList.toggle('invalid');
      }
    });
    userMailInput.addEventListener('input', function () {
      const resetPasswordLink = document.querySelector('.reset__link') as HTMLElement;
      const errorMessageMail = document.querySelector('.error__message-mail') as HTMLElement;
      if (errorMessageMail.classList.contains('active')) {
        errorMessageMail.classList.toggle('active');
        userMailInput.classList.toggle('invalid');
      }
      if (userMailInput.classList.contains('invalid')) {
        userMailInput.classList.toggle('invalid');
      }
      if (resetPasswordMessage.classList.contains('active')) {
        resetPasswordLink.classList.remove('invisible');
        resetPasswordLink.classList.add('active');
        resetPasswordMessage.classList.toggle('active');
      }
    });
    userMailInput.addEventListener('blur', function () {
      const errorMessageMail = document.querySelector('.error__message-mail') as HTMLElement;
      if (!userMailInput.validity.valid) {
        errorMessageMail.classList.toggle('active');
        userMailInput.classList.toggle('invalid');
      }
    });

    const passwordLabel = createHtmlElement('label', 'label__item', '', this.userNamePasswordWrap);
    this.userPasswordTitle = createHtmlElement('span', 'user__label-title', '', passwordLabel);
    const passwordWrap = createHtmlElement('div', 'password__wrap', '', passwordLabel);
    const passwordInput = createHtmlElement('input', 'password', '', passwordWrap) as HTMLInputElement;
    this.resetPasswordLink = createHtmlElement('a', 'reset__link', '', this.userNamePasswordWrap);
    const resetPasswordMessage = createHtmlElement('div', 'reset__text', '', this.userNamePasswordWrap);
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('required', '');
    passwordInput.setAttribute('pattern', `[A-Za-zА-Яа-яЁё0-9-]{6,}`);
    const hidePasswordSvg = createHtmlElement('i', 'show__svg', '', passwordWrap);
    this.errorMessagePassword = createHtmlElement('span', 'error__message error__message-password', '', passwordLabel);

    passwordInput.addEventListener('invalid', function (e: Event) {
      const errorMessagePassword = document.querySelector('.error__message-password') as HTMLElement;
      e.preventDefault();
      if (!passwordInput.validity.valid) {
        errorMessagePassword.classList.toggle('active');
        passwordInput.classList.toggle('invalid');
      }
    });
    passwordInput.addEventListener('input', function () {
      const errorMessagePassword = document.querySelector('.error__message-password') as HTMLElement;
      if (errorMessagePassword.classList.contains('active')) {
        errorMessagePassword.classList.toggle('active');
        passwordInput.classList.toggle('invalid');
      }
    });

    hidePasswordSvg.addEventListener('click', (e: Event) => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      hidePasswordSvg.classList.toggle('hide__svg');
    });

    this.signInButton = createHtmlElement('button', 'sign__in', '', form) as HTMLButtonElement;

    this.signUpButton = createHtmlElement('button', 'sign__up', '', form) as HTMLButtonElement;

    this.submitButtonForSigIn = createHtmlElement('button', 'submit', '', form) as HTMLButtonElement;
    this.submitButtonForSigUp = createHtmlElement('button', 'submit', '', form) as HTMLButtonElement;

    this.signInButton.addEventListener('click', (e: Event) => {
      e.preventDefault();
      this.setSignInLayout();
    });

    this.signUpButton.addEventListener('click', (e: Event) => {
      e.preventDefault();
      this.setSignUpLayout();
    });

    this.submitButtonForSigIn.addEventListener('click', (e: Event) => {
      e.preventDefault();
      signIn(userMailInput, passwordInput, this.errorMessageMail, this.errorMessagePassword, lang);
    });

    this.submitButtonForSigUp.addEventListener('click', (e: Event) => {
      e.preventDefault();
      signUp(userMailInput.value, userNameInput.value, passwordInput.value, passwordInput, this.errorMessagePassword, lang);
    });

    checkAuthStatus(form, buttonsWrap, lang);

    this.continueBtn.addEventListener('click', () => this.emit('navigate', PATH.profilePage));

    this.changeUserBtn.addEventListener('click', () => {
      handleLogout();
    });

    this.resetPasswordLink.addEventListener('click', () => {
      resetPassword(userMailInput.value, userMailInput, resetPasswordMessage, this.resetPasswordLink);
    });

    this.changeLang(lang);
  }

  changeLang = (lang: Lang) => {
    this.continueBtn.innerText = LANGTEXT['continueButton'][lang];
    this.changeUserBtn.innerText = LANGTEXT['changeUserBtn'][lang];
    this.signInButton.innerText = LANGTEXT['signInButton'][lang];
    this.signUpButton.innerText = LANGTEXT['signUpButton'][lang];
    this.userMailTitle.innerText = LANGTEXT['userMailTitle'][lang];
    this.userNameTitle.innerText = LANGTEXT['userNameTitle'][lang];
    this.userPasswordTitle.innerText = LANGTEXT['userPasswordTitle'][lang];
    this.resetPasswordLink.innerText = LANGTEXT['resetPasswordLink'][lang];
    this.submitButtonForSigIn.innerText = LANGTEXT['submitButton'][lang];
    this.submitButtonForSigUp.innerText = LANGTEXT['submitButton'][lang];
    this.errorMessageMail.innerText = LANGTEXT['errorMessageMail'][lang];
    this.errorMessageName.innerText = LANGTEXT['errorMessageName'][lang];
    this.errorMessagePassword.innerText = LANGTEXT['errorMessagePassword'][lang];
  };

  render(): HTMLElement {
    const params = qs.parse(window.location.search).auth;
    if (params === 'sign_in') {
      this.setSignInLayout();
    }
    if (params === 'sign_up') {
      this.setSignUpLayout();
    }
    return this.mainWrapper;
  }

  setSignInLayout() {
    this.userNamePasswordWrap.classList.toggle('visible');
    this.signInButton.classList.toggle('invisible');
    this.signUpButton.classList.toggle('invisible');
    this.submitButtonForSigIn.classList.toggle('submit__visible');
    const params = qs.parse(window.location.search);
    params.auth = 'sign_in';
    const search = qs.stringify(params);
    window.history.pushState({}, 'path', window.location.origin + window.location.pathname + `${search ? '?' + search : ''}`);
    this.resetPasswordLink.classList.toggle('active');
  }

  setSignUpLayout() {
    this.userNameLabel.classList.toggle('user__name-label-visible');
    this.userNamePasswordWrap.classList.toggle('visible');
    this.signInButton.classList.toggle('invisible');
    this.signUpButton.classList.toggle('invisible');
    this.submitButtonForSigUp.classList.toggle('submit__visible');
    const params = qs.parse(window.location.search);
    params.auth = 'sign_up';
    const search = qs.stringify(params);
    window.history.pushState({}, 'path', window.location.origin + window.location.pathname + `${search ? '?' + search : ''}`);
  }
}
