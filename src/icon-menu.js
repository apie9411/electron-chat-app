const electron = require('electron')
const path = require('path')
const ipc = electron.ipcRenderer
const remote = electron.remote

const chooseUserProfile = document.getElementById('profile-option')
const chooseFriendList = document.getElementById('friends-option')

chooseUserProfile.addEventListener('click', () => {
    ipc.send('profile-chosen', 'user profile is selected option');

    // close window after choosing an option
    let window = remote.getCurrentWindow()
    window.close()
})

chooseFriendList.addEventListener('click', () => {
    ipc.send('friend-list-chosen', 'friend list is selected option');
   
    // close window after choosing an option
    let window = remote.getCurrentWindow()
    window.close()
})