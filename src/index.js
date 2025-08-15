
// var Peer = require("peerjs")
import { Peer } from "peerjs";

var myPeer = null
var destinoPeer = null

function appendLog(message, isError = false) {
    const logDiv = document.getElementById("log");
    if (logDiv) {
        const line = document.createElement("div");
        line.textContent = JSON.stringify(message, null, 2);
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
            appendLog(`Data recibido: ${JSON.stringify(data)}`);
            if (data && typeof data === 'object' && Object.hasOwn(data, "dom")) {
                mostrarEnSoporte(data);
            }
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


function enviarACliente(data) {
    const mensaje = data
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

    // Esperar a que el contenido del iframe esté listo
    iframeContenedor.onload = function () {
        const iframeDoc = iframeContenedor.contentDocument || iframeContenedor.contentWindow.document;
        if (!iframeDoc) return;

        // Mouse move dentro del iframe
        iframeDoc.addEventListener('mousemove', function (e) {
            var data = { x: e.clientX, y: e.clientY, type: 'mousemove' };
            console.log('Mouse dentro del iframe:', data);
            enviarACliente(data)
        });

        // Clicks dentro del iframe
        iframeDoc.addEventListener('click', function (e) {
            var data = { x: e.clientX, y: e.clientY, button: e.button, type: 'click' };
            console.log('Click dentro del iframe:', data);
            enviarACliente(data);
        });

        // Teclas presionadas dentro del iframe
        iframeDoc.addEventListener('keydown', function (e) {
            // var data = { key: e.key, code: e.code, ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey, type: 'keydown' };
            // console.log('Tecla presionada en el iframe:', data);
            // enviarACliente(data)
        });
        // Listener para capturar focus en inputs, botones y selects
        iframeDoc.addEventListener('focusin', function(e) {
            const target = e.target;
            if (!target) return;
            if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.tagName === 'SELECT') {
                const info = {
                    type: 'focus',
                    tag: target.tagName,
                    id: target.id || null,
                    name: target.name || null,
                    value: target.value || null
                };
                enviarACliente(info);
            }
        });

        // Listener para capturar cambios en inputs y selects
        iframeDoc.addEventListener('change', function(e) {
            const target = e.target;
            if (!target) return;
            if (target.tagName === 'INPUT' || target.tagName === 'SELECT') {
                const info = {
                    type: 'change',
                    tag: target.tagName,
                    id: target.id || null,
                    name: target.name || null,
                    value: target.value || null
                };
                enviarACliente(info);
            }
        });
        iframeDoc.addEventListener('input', function(e) {
            const target = e.target;
            if (!target) return;
            if (target.tagName === 'INPUT' || target.tagName === 'SELECT') {
                const info = {
                    type: 'input',
                    tag: target.tagName,
                    id: target.id || null,
                    name: target.name || null,
                    value: target.value || null
                };
                enviarACliente(info);
            }
        });
        // Listener global para capturar clicks en inputs, botones y selects
        iframeDoc.addEventListener('click', function(e) {
            const target = e.target;
            if (!target) return;
            if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.tagName === 'SELECT') {
                const rect = target.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;
                const info = {
                    type: 'click',
                    tag: target.tagName,
                    id: target.id || null,
                    name: target.name || null,
                    value: target.value || null,
                    x,
                    y
                };
                enviarACliente(info);
            }
        });

        iframeDoc.addEventListener('scroll', function (e) {
            const scrollInfo = {
                type: 'scroll',
                scrollTop: iframeDoc.documentElement.scrollTop || iframeDoc.body.scrollTop,
                scrollLeft: iframeDoc.documentElement.scrollLeft || iframeDoc.body.scrollLeft
            };
            console.log('Scroll dentro del iframe:', scrollInfo);
            enviarACliente(scrollInfo);
        }, true);
    };
}