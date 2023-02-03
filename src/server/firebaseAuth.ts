import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { createHtmlElement } from '../utils/createElement';
import { firebaseConfig } from './firebase.config';
import { app } from './../index';
import { PATH } from '../app/app';
import { IError } from './../interfaces/IError';

firebase.initializeApp(firebaseConfig);

// Login function
export async function signIn(usernameInput: HTMLInputElement, passwordInput: HTMLInputElement, ErrorMessageUser: HTMLElement, ErrorMessagePassword: HTMLElement) {

    firebase.auth().signInWithEmailAndPassword(usernameInput.value, passwordInput.value)
        .then(function () {
            console.log("Sign in successful!");
            app.navigate(PATH.profilePage);
        })
        .catch(function (error) {
            if (error.code === "auth/wrong-password") {
                passwordInput.classList.toggle('invalid');
                ErrorMessagePassword.textContent = 'Wrong password';
                ErrorMessagePassword.classList.toggle('active');
                console.log("Wrong password entered!");

            }
            if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
                usernameInput.classList.toggle('invalid');
                ErrorMessageUser.textContent = 'Wrong e-mail';
                ErrorMessageUser.classList.toggle('active');
                console.log("Wrong user!");

            } else {
                console.error(error.code);
            }
        });
}

// Logout function
export function handleLogout() {
    firebase.auth().signOut().then(function () {
        console.log("Sign out successful!");
        app.navigate(PATH.login);
    }).catch(function (error) {
        console.error("Sign out error:", error);
    });
}

// Check authentication status
export async function checkAuthStatus(loginForm: HTMLElement, buttonsWrap: HTMLElement) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loginForm.innerHTML = '';
            const authQuestion = createHtmlElement('div', 'auth__q', `Want to continue as ${user.email}?`, loginForm);
            loginForm.append(buttonsWrap);
            console.log("User is signed in:", user);
        } else {
            console.log("User is signed out");
        }
    });
}

// const auth = firebase.auth();

// Function to sign up a new user
export async function signUp(email: string, password: string, passwordInput: HTMLInputElement, ErrorMessagePassword: HTMLElement) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function () {
            console.log("Sign up successful!");
            app.navigate(PATH.profilePage);
        })
        .catch(function (error) {
            if (error.code === "auth/weak-password") {
                passwordInput.classList.toggle('invalid');
                ErrorMessagePassword.textContent = 'Password should be at least 6 characters.';
                ErrorMessagePassword.classList.toggle('active');
                console.log("Weak password entered!");

            } else {
                console.error("Error signing up:", error);
            }
        });
}


export function resetPassword(email: string, usernameInput: HTMLInputElement, resetPasswordMessage: HTMLElement, resetPasswordLink: HTMLElement) {
    firebase.auth().sendPasswordResetEmail(email)
        .then(function () {
            resetPasswordMessage.textContent = 'Password reset email sent!\n Check your email.';
            resetPasswordLink.classList.toggle('invisible');
            resetPasswordMessage.classList.toggle('active');
            console.log("Password reset email sent!");
        })
        .catch(function (error) {
            usernameInput.classList.toggle('invalid');
            resetPasswordMessage.textContent = 'Wrong e-mail';
            resetPasswordLink.classList.toggle('invisible');
            resetPasswordMessage.classList.toggle('active');
            console.error("Error sending password reset email:", error);
        });
}

