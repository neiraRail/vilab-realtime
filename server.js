//server.js

const express = require("express");
const app = express();
const port = 4000;

const server = app.listen(`${port}`, function () {
    console.log(`Server started on port ${port}`);
});

const io = require("socket.io")(server, {
    cors: {
        origin: '*',
    }
});

function getRandomValue() {
    return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
}
//La vista vue envía un socker, dependiendo de qué nodo
io.on("connection", socket => {
    //El servidor conecta con mongo y comienza a enviar los datos tan rápido como es posible
    setInterval(() => {
        socket.broadcast.emit("newdata", getRandomValue())
        console.log("enviado")
    }, 5000)
});