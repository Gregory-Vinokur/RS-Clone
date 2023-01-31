import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { firebaseConfig } from './firebase.config';

firebase.initializeApp(firebaseConfig);

// Login function
export function handleLogin(username: HTMLInputElement, password: HTMLInputElement) {

    firebase.auth().signInWithEmailAndPassword(username.value, password.value)
        .then(function () {
            console.log("Sign in successful!");
        })
        .catch(function (error) {
            console.error("Sign in error:", error);
        });
}

// Logout function
function handleLogout() {
    firebase.auth().signOut().then(function () {
        console.log("Sign out successful!");
    }).catch(function (error) {
        console.error("Sign out error:", error);
    });
}

// Check authentication status
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("User is signed in:", user);
    } else {
        console.log("User is signed out");
    }
});

const auth = firebase.auth();

// Function to sign up a new user
export async function signUp(email: string, password: string) {
    try {
        const response = await auth.createUserWithEmailAndPassword(email, password);
        console.log("Sign up successful!", response);
    } catch (error) {
        console.error("Error signing up:", error);
    }
}

