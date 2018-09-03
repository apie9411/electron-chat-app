const electron = require('electron')
const path = require('path')
const url = require('url');
const ipc = electron.ipcRenderer

// Initialize firebase
let config = {
    apiKey: "AIzaSyCDOObph2yGRDWx1Cz6-Cc4wdBmKgeigQw",
    authDomain: "chat-app-b4d95.firebaseapp.com",
    databaseURL: "https://chat-app-b4d95.firebaseio.com",
    projectId: "chat-app-b4d95",
    storageBucket: "chat-app-b4d95.appspot.com",
    messagingSenderId: "43393277468"
  }
  firebase.initializeApp(config)

let database = firebase.database()

// Hardcoded for now, but fix this in the future
database.ref('/chats/test-chat/').child('current_user').set("apie9411@gmail.com")
let currentUser = "apie9411@gmail.com"

let userIcon = document.getElementsByClassName('user-icon')[0]
let inputField = document.getElementById('message-input-field')
let messageBox = document.getElementById('message-box')

/**
 * Callback function to remove a message from the view and the database if prompted
 * @param {} message
 * HTML target element containing the message to be deleted
 */
function removeMessage(message) {
    if(message.classList.contains('deleteBtn')) {
        database.ref('/chats/test-chat/').once('value', (snapshot) => {
            let testChat = snapshot.val()
            let currentUser = testChat["current_user"]
        })

        setTimeout(() => {
            // div element with class 'sent-message'
            let sentMessage = message.parentElement

            let sentMessageTextElem = message.previousSibling
            let sentMessageText = sentMessageTextElem.innerText

            let dbInfo = database.ref('/chats/test-chat/')
            dbInfo.once('value', (dataSnapshot) => {
                let testInfo = dataSnapshot.val()
                let messages = testInfo['messages']
                let currentUser = testInfo['current_user']
                // go through each of the messages in the database until you get a match
                Object.entries(messages).forEach(([key, value]) => {
                    let messageText = value["message"]
                    let messageAuthor = value["author"]
                    // if the message text matches and the author is the current user prompting for delete
                    if(messageText == sentMessageText && messageAuthor == currentUser) {
                        database.ref('/chats/test-chat/messages').child(key).remove()
                        messageBox.removeChild(sentMessage)
                        return
                    }
                })
            })
        }, 1000)
    }
}

// takes message text and turns it to html text on the current web page
function turnMessageToHtml(messageText, userAvatar) {
    let sentMessageContainer = document.createElement('div')
    let messageTextElement = document.createElement('p')
    let userIconElement = document.createElement('img')
    let deleteBtn = document.createElement('button')

    sentMessageContainer.className = 'sent-message'
    messageTextElement.className = 'message'
    userIconElement.className = 'message-sender'
    userIconElement.setAttribute('src', userAvatar)
    deleteBtn.className = 'deleteBtn'

    // deleteBtn.textContent = 'X'
    messageTextElement.textContent = messageText
    sentMessageContainer.appendChild(userIconElement)
    sentMessageContainer.appendChild(messageTextElement)
    sentMessageContainer.appendChild(deleteBtn)

    return sentMessageContainer
}

function addHtmlToDom(htmlSnippet) {
    messageBox.appendChild(htmlSnippet)

    //add the new message to the database
    let newDBKey = database.ref().child('chats').child('test-chat').child('messages').push().key
    let newDBMessage = {}
    newDBMessage[newDBKey + '/message'] = htmlSnippet.innerText
    newDBMessage[newDBKey + '/author'] = currentUser
    database.ref('/chats/test-chat/messages/').update(newDBMessage)
}

/**
 * Load the 100 most recent messages (stored in the database)
 */
function loadChatroomData() {
    let top100Messages = database.ref('/chats/test-chat/messages/').limitToLast(100)
    top100Messages.once('value', (dataSnapshot) => {
        let messages = dataSnapshot.val()
        let userAvatar = 'images/default-icon.png'
        // go through each of the messages in the database
        Object.entries(messages).forEach(([key, value]) => {
            let messageText = value["message"]
            let messageHtmlSnippet = turnMessageToHtml(messageText, userAvatar)
            messageBox.appendChild(messageHtmlSnippet)
        })
    })

}

userIcon.addEventListener('click', () => {
    // Communicate to the index window that the user icon was clicked
    ipc.send('icon-clicked', 'clicked!')
})

// Press enter to send a chat message from the input field
inputField.addEventListener('keyup', (event) => {
   
    let messageText = event.target.value
    let numMessages = messageBox.children.length

    // Only proceed if the key pressed is 'enter'
    if(event.keyCode === 13) {
        // Always keep message box to only 100 messages
        if(numMessages > 100) {
            let oldestMessage = messageBox.firstChild.lastChild
            removeMessage(oldestMessage)
        }

        let newMessage = turnMessageToHtml(messageText, 'images/default-icon.png')
        addHtmlToDom(newMessage)
    }
    else {
        return;
    }
})

// if anyone clicks inside of message box, check if they're requesting to remove a message

messageBox.addEventListener('click', (event) => {
    removeMessage(event.target)
})

ipc.on('sign-out', (event, message) => {
    firebase.auth().signOut().then(() => {
        return;
    }).catch((error) => {
        alert('Sign out unsuccessful.')
    })
})

// let top100Messages = database.ref('/messages').limitToLast(100)
// //reading from the db only one time. use 'on' for every time db changes
// top100Messages.once('value', (snap) => {
//     let messages = snap.val()
//     let message_arr = []
//     Object.entries(messages).forEach(([key, value]) => {
//         message_arr.push([key, value])
//     })
//     ipc.send('data-here', message_arr[0][0])
//     //writing to the db, key name is determined for you
//     let newPostKey = database.ref().child('messages').push().key
//     let newMessage = {}
//     newMessage['/messages/' + newPostKey] = 'does this appear in the db'
//     database.ref().update(newMessage)
//     //writing to the db, you name the new key
//     database.ref('/messages').child('three').set("Another message, here we go")
// })