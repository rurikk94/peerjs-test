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

console.log("qweasd");
const mostrarBtn = document.getElementById("mostrarBtn");


function enviarASoporte(data) {
    const mensaje = data
    const destinoId = document.getElementById("destinoId").value

    destinoPeer = myPeer.connect(destinoId);
    destinoPeer.on("open", () => {
        appendLog(`Enviando mensaje a ${destinoId}: ${mensaje}`);
        destinoPeer.send(mensaje)
    });
}

function mostrarEnSoporte(datos) {
  console.log("mostrarEnSoporte");
  console.log(datos);
  const iframeContenedor = document.getElementById("vistaIframe");

  // ¡NUEVO! Aplicamos las dimensiones al iframe
  iframeContenedor.style.width = `${datos.width}px`;
  iframeContenedor.style.height = `${datos.height}px`;

  // Para que un iframe grande quepa en un contenedor pequeño, podemos usar CSS transform: scale
  const contenedorAncho = iframeContenedor.parentElement.offsetWidth;
  const escala = contenedorAncho / datos.width;
  iframeContenedor.style.transform = `scale(${escala})`;

  // Inyectamos el DOM como antes
  iframeContenedor.srcdoc = datos.dom;
}

mostrarBtn.addEventListener("click", () => {
    actualizarValoresParaCapturaDOM()
  // Capturamos el DOM de la misma forma
  const domCompletoHTML = document.documentElement.outerHTML;
  console.log("DOM capturado. Mostrando en DIV e Iframe...");
  console.log(domCompletoHTML);

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  console.log(`Dimensiones del cliente: ${viewportWidth}x${viewportHeight}`);

  // Ahora enviaríamos un objeto con toda la información
  const datosDeAsistencia = {
    dom: domCompletoHTML,
    width: viewportWidth,
    height: viewportHeight,
  };

  // Para este ejemplo, pasamos los datos directamente a una función
  // En un caso real, esto se enviaría por WebSocket
//   mostrarEnSoporte(datosDeAsistencia);
  enviarASoporte(datosDeAsistencia)
});


function actualizarValoresParaCapturaDOM() {
    // (Aquí va el código de la función que te mostré arriba)
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], input[type="number"], input[type="search"], input[type="tel"], input[type="url"], input[type="date"], textarea');
    inputs.forEach(input => input.setAttribute('value', input.value));

    const checksRadios = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    checksRadios.forEach(input => {
        if (input.checked) input.setAttribute('checked', 'checked');
        else input.removeAttribute('checked');
    });

    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.querySelectorAll('option').forEach(option => {
            if (option.selected) option.setAttribute('selected', 'selected');
            else option.removeAttribute('selected');
        });
    });
}
