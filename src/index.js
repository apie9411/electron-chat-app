const electron = require('electron')
const path = require('path')
const url = require('url');
const ipc = electron.ipcRenderer
const BrowserWindow = electron.remote.BrowserWindow

// Initialize Firebase
let config = {
    apiKey: "AIzaSyCDOObph2yGRDWx1Cz6-Cc4wdBmKgeigQw",
    authDomain: "chat-app-b4d95.firebaseapp.com",
    databaseURL: "https://chat-app-b4d95.firebaseio.com",
    projectId: "chat-app-b4d95",
    storageBucket: "chat-app-b4d95.appspot.com",
    messagingSenderId: "43393277468"
}
firebase.initializeApp(config)


let loginBtn = document.getElementById('login-button')
let signUpBtn = document.getElementById('signup-button')

loginBtn.addEventListener('click', enterChatroom)
signUpBtn.addEventListener('click', createAccount)

/**
 * If the username and password are entered correctly, enter 
 * the chatroom view
 * @param {MouseEvent} event 
 *  Event fired from a button click
 */
function enterChatroom(event) {
    event.preventDefault() //stops form from being submitted too early

    let userEmail = document.getElementById('user-email').value
    let password = document.getElementById('password').value

    firebase.auth().signInWithEmailAndPassword(userEmail, password).then(() => {
        ipc.send('load-chatroom-data', userEmail);
    }).catch((error) => {
        console.log(error)
    })
}

/**
 * Create a user with firebase.
 */
function createAccount() {
    event.preventDefault();

    let userEmail = document.getElementById('user-email').value
    let password = document.getElementById('password').value

    firebase.auth().createUserWithEmailAndPassword(userEmail, password).then(() => {
        alert('New user created.')
    }).catch((error) => {
        console.log(error)
        alert('There was an error');
    })
}