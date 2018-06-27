class Users {
    constructor() {
        this.users = [];
    }

    addUser(data) {
        let user = {...data};
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        let user = this.getUser(id);

        if (user) {
            this.users = this.users.filter(thisUser => thisUser !== user);
        }

        return user;
    }

    getUser(id) {
        return this.users.filter(user => user.id === id)[0];
    }

    getRoomUsers(room) {
        let users = this.users.filter(user => user.room === room);
        let userNames = users.map(user => user.name);

        return userNames;
    }
}

module.exports = {Users};