import {app} from './app.js';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './database/databaseConnect.js';


dotenv.config()



const server = http.createServer(app);
const io = new Server(server);


// io.on('connection', (socket) => {
//     console.log('User connected:', socket);

//     socket.on('join', (username) => {
//         users[socket.id] = username;
//         io.emit('userList', Object.values(users)); // Send updated user list to everyone
//         io.emit('message', { user: 'System', text: `${username} has joined the chat!` });
//     });

//     socket.on('message', (message) => {
//         io.emit('message', message); // Broadcast the message to all connected users
//     });

//     socket.on('disconnect', () => {
//         const username = users[socket.id];
//         delete users[socket.id];
//         io.emit('userList', Object.values(users));
//         io.emit('message', { user: 'System', text: `${username} has left the chat.` });
//     });
// });
connectDB()
.then(()=>
    server.listen(process.env.PORT, ()=>{
        console.log(`Back End Server is running in port ${process.env.PORT}`);
    }))
.catch(err => console.log("Error :", err))



