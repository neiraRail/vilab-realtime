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
        node: Number(process.argv[2]),
        value: getRandomNumber(time),
        acc_x: getRandomNumber(time * 2),
        acc_y: getRandomNumber(time * 0.5),
        acc_z: getRandomNumber(time * 5),
        gyr_x: getRandomNumber(time - time / 3),
        gyr_y: getRandomNumber(time - 20),
        gyr_z: getRandomNumber((time * 2) + 10),
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

let times = [1000, 1000, 1000, 1000]
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
var global_time = 0;

//while (true) {
for (let time of times) {
    await delay(time)
    global_time += time
    insertDocument(global_time)
}
//}

console.log("Listo")