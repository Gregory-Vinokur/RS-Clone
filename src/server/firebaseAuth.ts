import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { createHtmlElement } from '../utils/createElement';
import { firebaseConfig } from './firebase.config';
import { app } from './../index';
import { PATH } from '../app/app';
import 'firebase/compat/database';
import { Lang, LANGTEXT, PATCH_TO_DB } from '../constans/constans';
import { getDatabase, ref, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';

firebase.initializeApp(firebaseConfig);

export const database = firebase.database();

// Login function
export function signIn(
  usernameInput: HTMLInputElement,
  passwordInput: HTMLInputElement,
  ErrorMessageUser: HTMLElement,
  ErrorMessagePassword: HTMLElement,
  lang: Lang
) {
  firebase
    .auth()
    .signInWithEmailAndPassword(usernameInput.value, passwordInput.value)
    .then(function () {
      console.log('Sign in successful!');
      app.navigate(PATH.profilePage);
    })
    .catch(function (error) {
      if (error.code === 'auth/wrong-password') {
        passwordInput.classList.toggle('invalid');
        ErrorMessagePassword.textContent = `${LANGTEXT['errorMessagePassword'][lang]}`;
        ErrorMessagePassword.classList.toggle('active');
        console.log('Wrong password entered!');
      }
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        usernameInput.classList.toggle('invalid');
        ErrorMessageUser.textContent = `${LANGTEXT['errorMessageMail'][lang]}`;
        ErrorMessageUser.classList.toggle('active');
        console.log('Wrong user!');
      }
      if (error.code === 'auth/too-many-requests') {
        passwordInput.classList.toggle('invalid');
        ErrorMessagePassword.textContent = `${LANGTEXT['tooManyRequests'][lang]}`;
        ErrorMessagePassword.classList.toggle('active');
      } else {
        console.error(error.code);
      }
    });
}

// Logout function
export function handleLogout() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      console.log('Sign out successful!');
      app.navigate(PATH.login);
    })
    .catch(function (error) {
      console.error('Sign out error:', error);
    });
}

// Check authentication status
export function checkAuthStatus(loginForm: HTMLElement, buttonsWrap: HTMLElement, lang: Lang) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      loginForm.innerHTML = '';
      const authQuestion = createHtmlElement('div', 'auth__q', `${LANGTEXT['authQuestion'][lang]} ${user.displayName}?`, loginForm);
      loginForm.append(buttonsWrap);
      console.log('User is signed in:', user);
    } else {
      console.log('User is signed out');
    }
  });
}

// Function to sign up a new user
export function signUp(email: string, username: string, password: string, passwordInput: HTMLInputElement, ErrorMessagePassword: HTMLElement, lang: Lang) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      const user = userCredential.user;
      if (user) {
        const newName = username ? username : PATCH_TO_DB.DEFAULT_NAME;
        user
          .updateProfile({
            displayName: newName,
            photoURL: PATCH_TO_DB.PHOTO_URL,
          })
          .then(function () {
            console.log('User name saved to Firebase!');
          })
          .catch(function (error) {
            console.error('Error saving user name to Firebase:', error);
          });
        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);
        update(ref(db, `${PATCH_TO_DB.USERS}/${user.uid}`), {
          userName: newName,
          userId: user?.uid,
          userAvatar: PATCH_TO_DB.PHOTO_URL,
        });
      }
    })
    .then(function () {
      console.log('Sign up successful!');
      app.navigate(PATH.profilePage);
    })
    .catch(function (error) {
      if (error.code === 'auth/weak-password') {
        passwordInput.classList.toggle('invalid');
        ErrorMessagePassword.textContent = LANGTEXT['ErrorMessagePassword'][lang];
        ErrorMessagePassword.classList.toggle('active');
        console.log('Weak password entered!');
      } else {
        console.error('Error signing up:', error);
      }
    });
}

export function resetPassword(email: string, usernameInput: HTMLInputElement, resetPasswordMessage: HTMLElement, resetPasswordLink: HTMLElement) {
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(function () {
      resetPasswordMessage.textContent = 'Password reset email sent!\n Check your email.';
      resetPasswordLink.classList.toggle('invisible');
      resetPasswordMessage.classList.toggle('active');
      console.log('Password reset email sent!');
    })
    .catch(function (error) {
      usernameInput.classList.toggle('invalid');
      resetPasswordMessage.textContent = 'Wrong e-mail';
      resetPasswordLink.classList.toggle('invisible');
      resetPasswordMessage.classList.toggle('active');
      console.error('Error sending password reset email:', error);
    });
}
