const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();

// let dirname = __dirname.substring(0, __dirname.lastIndexOf('\\'));
// app.set('views', path.join(dirname, 'public'));
// app.set('view engine', 'ejs');
// app.use(express.static(dirname + '/public'));

let server = http.createServer(app);
let io = socketIO(server);

let users = new Users();

app.use(express.static(publicPath));

io.on('connection', socket => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if (typeof params === 'object' && (!isRealString(params.name) || !isRealString(params.room))) { 
            return callback('Name and room are required.'); 
        }

        socket.join(params.room);

        users.removeUser(socket.id);
        users.addUser({id: socket.id, ...params});

        io.to(params.room).emit('updateUserList', users.getRoomUsers(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        callback();
    });

    socket.on('createLocationMessage', coords => {
        let user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
        //io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getRoomUsers(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }

        //console.log('User was disconnected');
    });
});

// app.get('/chat', (request, response) => {
//     console.log(request);
//     response.render('chat');
// });

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});