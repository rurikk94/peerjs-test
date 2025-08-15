// var Peer = require("peerjs")
import { Peer } from "peerjs";

var myPeer = null
var destinoPeer = null

function appendLog(message, isError = false) {
    const logDiv = document.getElementById("log");
    if (logDiv) {
        const line = document.createElement("div");
        line.textContent = message;
        if (isError) line.style.color = "red";
        logDiv.appendChild(line);
        logDiv.scrollTop = logDiv.scrollHeight;
    }
}

function crear() {
    const myId = document.getElementById("myId").value
    appendLog(`Creando ${myId}`)

    myPeer = new Peer(myId);
    appendLog(`Mi id es ${myPeer.id}`)
    myPeer.on("connection", (conn) => {
        appendLog(`Conexion recibida con ${conn.peer}`);
        conn.on("data", (data) => {
            appendLog(`Data recibido: ${data}`);
        });
        conn.on("open", () => {
            appendLog("Conexión abierta");
        });
    });
}

function conectar() {
    const destinoId = document.getElementById("destinoId").value
    appendLog(`Conectando a  ${destinoId}`)

    destinoPeer = myPeer.connect(destinoId);
    destinoPeer.on("connection", (conn) => {
        appendLog(`Conexión establecida con ${conn.peer}`);
    });
    destinoPeer.on("open", () => {
        appendLog(`Conectado a destino ${destinoId}`);
    });
    destinoPeer.on("close", () => {
        appendLog(`Conexión cerrada con ${destinoId}`);
    });
    destinoPeer.on("disconnected", () => {
        appendLog(`Conexión perdida con ${destinoId}`);
    });
    destinoPeer.on("error", (err) => {
        appendLog(`Error en la conexión con ${destinoId}: ${err}`, true);
    });
}

function enviar() {
    const mensaje = document.getElementById("message").value
    const destinoId = document.getElementById("destinoId").value

    destinoPeer = myPeer.connect(destinoId);
    destinoPeer.on("open", () => {
        appendLog(`Enviando mensaje a ${destinoId}: ${mensaje}`);
        destinoPeer.send(mensaje)
    });
}

const btnCrear = document.getElementById("btnCrear")
btnCrear.addEventListener("click", crear)

const btnConectar = document.getElementById("btnConectar")
btnConectar.addEventListener("click", conectar)

const btnEnviar = document.getElementById("btnEnviar")
btnEnviar.addEventListener("click", enviar)
