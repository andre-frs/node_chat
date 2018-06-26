let socket = io();
            
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('newMessage', message => {
    console.log('New message', message);

    let li = document.createElement('li');
    li.innerText = `${message.from}: ${message.text}`;
    document.getElementById('messages').appendChild(li);
});

socket.on('newLocationMessage', message => {
    let a = document.createElement('a');
    a.innerText= 'My Current Location';
    a.target = '_blank';
    a.href = message.url;

    let li = document.createElement('li');
    li.innerText = `${message.from}: `;

    li.appendChild(a);
    document.getElementById('messages').appendChild(li);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

document.getElementById('message-form').addEventListener('submit', function(evt){
    evt.preventDefault();
    let messageTextBox = document.querySelector('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.value
    }, function(){
        messageTextBox.value = '';
    }); 
});

let locationButton = document.getElementById('send-location');
locationButton.addEventListener('click', function(evt){

    if (!navigator.geolocation) return alert('Geolocation not supported');

    locationButton.setAttribute('disabled', 'disabled');
    locationButton.innerText = 'Sending location...';

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        locationButton.removeAttribute('disabled');
        locationButton.innerText = 'Send Location';
    }, function(){
        alert('Unnable to fetch position.');
        locationButton.removeAttribute('disabled');
        locationButton.innerText = 'Send Location';
    });
});

// $('#message-form').on('submit', evt => {

// });