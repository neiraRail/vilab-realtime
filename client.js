import io from "socket.io-client";
const socket = io.connect("http://localhost:4000");
socket.on("connect", () => {
    console.log("Socket conectado");
    socket.emit("feature", { node: 1 });
});

socket.on("newfeature", (data) => {
    console.log("new feature: ", data)
    console.log(data)
});
