// socket.js

const { Server } = require('socket.io');
const chatModel=require("./models/Model");
const roomModel=require("./models/ModelCreateRoom");
let io; // Variable to store the io object
const socketIO = require('./')
function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log("user connected", socket.id);
        socket.emit('msg', { message: `you are Connected ${socket.id}` });

        socket.on("join-room", (data) => {
            if (socket.room) {
                socket.leave(socket.room);
                console.log(`User ${socket.id} left room: ${socket.room}`);
            }
            socket.join(data);
            socket.room = data;
            console.log(`User ${socket.id} joined room: ${data}`);
        });

        socket.on('clientMessage', async (data) => {
            console.log("Message from client:", data);
            const room = data.room;
            const user = data.user;
            const msg = data.message;
            const replyingto = data.replyingto;
            const replyingmsg = data.replyingmsg;
            const chatID = Date.now() + user;
            const chat = {
                msgtype: data.msgtype,
                user: user,
                message: msg,
                room: room,
                replyingto: replyingto,
                replyingmsg: replyingmsg,
                chatID: chatID
            }
            const newmodel = new chatModel(chat);
            const response = await newmodel.save();

            io.to(room).emit("message", chat);
        });
        socket.on("videogenerated",(msg)=>{
            console.log("videogenerated",msg)
            
            io.to(msg.studentId).emit("hello",{url:msg.roomId})
        })
        

        socket.on('disconnect', () => {
            console.log("socket id disconnected", socket.id);
        });
    });
}

function emitMessage(room, message) {
    io.to(room).emit("askdoubt", message);
}

module.exports = {
    initSocket,
    emitMessage
};