//server.js
import { MongoClient } from "mongodb";
import fs from 'fs';

const uri = "mongodb://mongodb:27017";

const client = new MongoClient(uri);

let changeStream;

import express from "express"
const app = express();
const port = 4000;

const logToFile = (message) => {
    const formattedMessage = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFile('vilab_realtime.log', formattedMessage, (err) => {
        if (err) throw err;
    });
};

const server = app.listen(`${port}`, '0.0.0.0', function () {
    console.log(`Server started on port ${port}`);
    logToFile(`Server started on port ${port}`);
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
    logToFile("Socket conectado");
    socket.on('disconnect', function () {
        // socket.disconnect()
        console.log('Socket desconectado');
        logToFile('Socket desconectado');
    });
    socket.on('feature', async (data) => {
        console.log("pidiendo features de nodo: %d", data.node)
        logToFile(`pidiendo features de nodo: ${data.node}`);
        try {
            const database = client.db("vibration_db");
            const measures = database.collection("feature");

            // Open a Change Stream on the "feature" collection
            const pipeline = [{ $match: { "fullDocument.node": Number(data.node) } }, { $match: { "operationType": "insert" } }]
            changeStream = measures.watch(pipeline);
            console.log(`measures being watched using pipeline: ${pipeline}`)
            logToFile(`measures being watched using pipeline: ${pipeline}`);
            for await (const change of changeStream) {
                console.log("Received change:\n");
                logToFile("Received change:\n");
                socket.emit("newfeature", change.fullDocument)
            }
            console.log("closing stream...")
            logToFile("closing stream...");

            await changeStream.close();
            console.log("Stream closed")
            logToFile("Stream closed");
        }
        catch (err) {
            console.log(err);
            logToFile(err);
        }

    })

    socket.on('realtime', async (data) => {
        console.log("pidiendo nodo: %d", data.node)
        logToFile(`pidiendo nodo: ${data.node}`);
        try {
            const database = client.db("vibration_db");
            const eventos = database.collection("lectura");
            

            // Open a Change Stream on the "event" collection
            const pipeline = [{ $match: { "fullDocument.node": Number(data.node) } }, { $match: { "operationType": "insert" } }]
            changeStream = eventos.watch(pipeline);
            console.log(`eventos being watched using pipeline: ${pipeline}`)
            logToFile(`eventos being watched using pipeline: ${pipeline}`);
            // Print change events
            for await (const change of changeStream) {
                console.log("Received change:\n");
                logToFile("Received change:\n");
                socket.emit("newdata", change.fullDocument)
            }
            console.log("closing stream...")
            logToFile("closing stream...");

            await changeStream.close();
            console.log("Stream closed")
            logToFile("Stream closed");

        }
        catch (err) {
            console.log(err);
            logToFile(err);
        }
        finally {
            //await client.close();
        }
    })
});