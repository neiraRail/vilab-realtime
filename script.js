import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const database = client.db("vibration_db");
const eventos = database.collection("event");

// Función para generar un número aleatorio
const getRandomNumber = (time) => {
    return Math.sin(time / 500) * 50 + 100;
};



// Función para insertar un documento con los atributos solicitados
const insertDocument = (time) => {
    console.log("Insertando documento")
    const document = {
        node: 0,
        value: getRandomNumber(time),
        time_lap: time
    };

    eventos.insertOne(document, (err, result) => {
        if (err) {
            console.error("Error al insertar documento:", err);
        } else {
            console.log("Documento insertado correctamente:", result.ops[0]);
        }
    });
};

// Insertar un documento cada 2 segundos

//setInterval(insertDocument, 100);

let times = [100, 100, 100, 100]
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
var global_time = 0;

while (true) {
    for (let time of times) {
        await delay(time)
        global_time += time
        insertDocument(global_time)
    }
}