const express = require('express')
const socketio = require('socket.io')

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')  
})

const server = app.listen(process.env.PORT || 3000, () => {
    console.log('server is running')
})

//initialize socket io
const io = socketio(server, {'transports': ['websocket', 'polling'], allowEIO3: true})
io.on('connection', socket => {
    console.log("new user connected")

    socket.username = 'Anonymous'

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('change username', (data) => {
        socket.username = data;
        // console.log('welcome ' + socket.username)
    });

    socket.on('chat message', (msg) => {
        // console.log('message: ' + msg);
        io.sockets.emit('receive message', {message: msg, username: socket.username})
        socket.broadcast.emit('typing done')        
    });

    socket.on('typing', () => {
        socket.broadcast.emit('typing', {username: socket.username})        
    })

    
})