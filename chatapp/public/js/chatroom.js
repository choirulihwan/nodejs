var socket = io();
var info = document.getElementById('info')

function sendchat() {
    var input = document.getElementById('message');    
    // e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';        
    }
}

function changename() {
    var input = document.getElementById('username');    
    var curUsername =  document.getElementById('divUsername');          
    if (input.value) {
        socket.emit('change username', input.value);                
        curUsername.textContent = input.value;
        input.value = '';
    }
}        

socket.on('receive message', data => {       
    var messageList = document.getElementById('message-list');     
    // console.log(data)
    var listItem = document.createElement('li')
    listItem.textContent = data.username + ': ' + data.message
    listItem.classList.add('list-group-item')
    // console.log(listItem)
    messageList.appendChild(listItem);
});


function logtyping(e) {            
    socket.emit('typing');     
    if (e.code === 'Enter') {
        sendchat();
    }
}

socket.on('typing', data => {    
    info.textContent = (data.username + " is typing...")
    info.style.fontStyle = "italic";
    // setTimeout(() => {info.textContent=''}, 5000)
})

socket.on('typing done', () => {    
    info.textContent = ''    
})