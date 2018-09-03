const electron = require('electron')
const path = require('path')
const url = require('url');
const ipc = electron.ipcRenderer
const remote = electron.remote

let signOutButn = document.getElementById('sign-out-button')

signOutButn.addEventListener('click', () => {
    // Time to tell the main process to return to login screen
    ipc.send('sign-out-requested', 'user wants to sign out')

    let currentWindow = remote.getCurrentWindow()
    currentWindow.close()
})