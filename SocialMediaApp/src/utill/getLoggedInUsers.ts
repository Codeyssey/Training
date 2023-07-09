import { io } from '../config/server';

const getLoggedInUsers = () => {
    let clients = io.sockets.sockets;
    let users = Array.from(clients.values());
    return users;
}
const emitvisitors = () => {
    io.emit("visitors", getLoggedInUsers());
};

export { getLoggedInUsers, emitvisitors };