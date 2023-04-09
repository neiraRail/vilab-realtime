//server.js
import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let changeStream;

import express from "express"
const app = express();
const port = 4000;

const server = app.listen(`${port}`, function () {
    console.log(`Server started on port ${port}`);
});

import { Server } from "socket.io";
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

//La vista vue envía un socker, dependiendo de qué nodo
io.on("connection", async socket => {
    console.log("Socket conectado")
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    try {
        const database = client.db("vibration_db");
        const haikus = database.collection("node");

        // Open a Change Stream on the "haikus" collection
        changeStream = haikus.watch();

        // Print change events
        for await (const change of changeStream) {
            console.log("Received change:\n", change);
            socket.broadcast.emit("newdata", change.fullDocument)
        }

        await changeStream.close();

    } finally {
        await client.close();
    }
});