let socket = io();
            
function scrollToBottom() {
    let messages = document.getElementById('messages');
    let newMessage = messages.lastElementChild;

    let clientHeight = messages.clientHeight;
    let scrollTop = messages.scrollTop;
    let scrollHeight = messages.scrollHeight;

    let newMessageHeight = newMessage.clientHeight;
    //let lastMessageHeight = newMessage.previousElementSibling ? newMessage.previousElementSibling.clientHeight : 0;

    if (clientHeight + scrollTop + newMessageHeight >= scrollHeight) {
        messages.scrollTo(0, scrollHeight);
    }
}

socket.on('connect', () => {
    let params = Utils.deparam(window.location.search);

    socket.emit('join', params, err => {
        if (err) {
            alert(err);
            window.location.href = '/';
        }
    });
});

socket.on('updateUserList', users => {
    let ul = document.createElement('ul');

    for(let user of users) {
        let li = document.createElement('li');
        li.innerText = user;
        ul.appendChild(li);
    }

    let userList = document.getElementById('users');
    while (userList.firstChild) { userList.removeChild(userList.firstChild); }
    userList.appendChild(ul);
});

socket.on('newMessage', message => {
    let template = document.getElementById('message-template').innerHTML;
    let formatedTime = moment(message.createdAt).format('H:mm');

    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formatedTime
    });

    document.getElementById('messages').innerHTML += html;
    scrollToBottom();
});

socket.on('newLocationMessage', message => {
    let template = document.getElementById('location-message-template').innerHTML;
    let formatedTime = moment(message.createdAt).format('H:mm');

    let html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formatedTime
    });

    document.getElementById('messages').innerHTML += html;

    // let a = document.createElement('a');
    // a.innerText= 'My Current Location';
    // a.target = '_blank';
    // a.href = message.url;

    // let li = document.createElement('li');
    // li.innerText = `${message.from}: ${formatedTime} `;

    // li.appendChild(a);
    // document.getElementById('messages').appendChild(li);
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