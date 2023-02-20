import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { createHtmlElement } from '../utils/createElement';
import { firebaseConfig } from './firebase.config';
import { app } from './../index';
import { PATH } from '../app/app';
import "firebase/compat/database";

firebase.initializeApp(firebaseConfig);

export const database = firebase.database();

// Login function
export function signIn(
    usernameInput: HTMLInputElement,
    passwordInput: HTMLInputElement,
    ErrorMessageUser: HTMLElement,
    ErrorMessagePassword: HTMLElement
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
                ErrorMessagePassword.textContent = 'Wrong password';
                ErrorMessagePassword.classList.toggle('active');
                console.log('Wrong password entered!');
            }
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
                usernameInput.classList.toggle('invalid');
                ErrorMessageUser.textContent = 'Wrong e-mail';
                ErrorMessageUser.classList.toggle('active');
                console.log('Wrong user!');
            }
            if (error.code === "auth/too-many-requests") {
                passwordInput.classList.toggle('invalid');
                ErrorMessagePassword.textContent = 'Too many requests. Try again later.';
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
export function checkAuthStatus(loginForm: HTMLElement, buttonsWrap: HTMLElement) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loginForm.innerHTML = '';
            const authQuestion = createHtmlElement('div', 'auth__q', `Want to continue as ${user.displayName}?`, loginForm);
            loginForm.append(buttonsWrap);
            console.log('User is signed in:', user);
        } else {
            console.log('User is signed out');
        }
    });
}

// Function to sign up a new user
export function signUp(email: string, username: string, password: string, passwordInput: HTMLInputElement, ErrorMessagePassword: HTMLElement) {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            const user = userCredential.user;
            if (user) {
                user.updateProfile({
                    displayName: username,
                    photoURL: 'https://firebasestorage.googleapis.com/v0/b/rs-clone-ts.appspot.com/o/images%2Funknown_user.jpg?alt=media&token=5f1a7af2-0306-4fe4-a7aa-f03f8d2814b5'
                }).then(function () {
                    console.log('User name saved to Firebase!');
                }).catch(function (error) {
                    console.error('Error saving user name to Firebase:', error);
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
                ErrorMessagePassword.textContent = 'Password should be at least 6 characters.';
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
