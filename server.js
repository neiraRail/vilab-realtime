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
io.on("connection", socket => {
    console.log("Socket conectado")
    socket.on('disconnect', function () {
        // socket.disconnect()
        console.log('Socket desconectado');
    });
    socket.on('realtime', async (data) => {
        console.log("pidiendo nodo: %d", data.node)
        console.log(data.node)
        try {
            const database = client.db("vibration_db");
            const eventos = database.collection("event");

            // Open a Change Stream on the "event" collection
            const pipeline = [{ $match: { "fullDocument.node": Number(data.node) } }, { $match: { "operationType": "insert" } }]
            changeStream = eventos.watch(pipeline);
            console.log("eventos being watched using pipeline:")
            console.log(pipeline)
            // Print change events
            for await (const change of changeStream) {
                console.log("Received change:\n");
                socket.emit("newdata", change.fullDocument)
            }
            console.log("closing stream...")

            await changeStream.close();
            console.log("Stream closed")

        } finally {
            //await client.close();
        }
    })
});