const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'chat-app'
        }, {
            id: '2',
            name: 'Jen',
            room: 'sockets'
        }, {
            id: '3',
            name: 'Julie',
            room: 'chat-app'
        }];
    });

    it('should add new user', () => {
        users = new Users();
        let user = {
            id: '123',
            name: 'Andre',
            room: 'The Office'
        };
        let resUser = users.addUser(user);

        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        let id = '1';
        let usersLength = users.users.length;
        let user = users.removeUser(id);

        expect(user.id).toBe(id);
        expect(users.users.length).toBe(usersLength-1);
    });

    it('should not remove a user', () => {
        let id = '7';
        let usersLength = users.users.length;
        let user = users.removeUser(id);

        expect(user).toNotExist();
        expect(users.users.length).toBe(usersLength);
    });

    it('should find user', () => {
        let id = '3';
        let user = users.getUser(id);

        expect(user.id).toBe(id);
    });

    it('should not find a user', () => {
        let id = '5';
        let user = users.getUser(id);

        expect(user).toNotExist();
    });

    it('should return names for chat-app', () => {
        let userNames = users.getRoomUsers('chat-app');

        expect(userNames).toEqual(['Mike', 'Julie']);
    });
});