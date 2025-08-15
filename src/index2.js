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
            appendLog(`Data recibido: ${JSON.stringify(data)}`);
            if (data && typeof data === 'object' && Object.hasOwn(data, "dom")) {
                mostrarEnSoporte(data);
            }
            if (data && typeof data === 'object' && Object.hasOwn(data, "type")) {
                if (data.type === 'mousemove') {
                    mostrarMouseVirtual(data.x, data.y);
                } else if (data.type === 'click') {
                    animarClickMouseVirtual(data.x, data.y);
                    simularClickEnPosicion(data.x, data.y);
                } else if (data.type === 'keydown') {
                   // simularKeydownEnElementoActivo(data);

                } else if (data.type === 'focus') {
                    enfocarElementoRemoto(data);
                } else if (data.type === 'change') {
                    cambiarValorElementoRemoto(data);
                } else if (data.type === 'input') {
                    cambiarValorElementoRemoto(data);
                } else if (data.type === "scroll") {
                    hacerScroll(data)
                }

function hacerScroll(data) {
    if (typeof data.scrollTop === "number" && typeof data.scrollLeft === "number") {
        // document.documentElement.scrollTop = data.scrollTop;
        // document.body.scrollTop = data.scrollTop;
        // document.documentElement.scrollLeft = data.scrollLeft;
        // document.body.scrollLeft = data.scrollLeft;

        scrollTo(data.scrollLeft, data.scrollTop);
    }

}
// Enfocar el elemento remoto según id, name o tag
function enfocarElementoRemoto(data) {
    let el = null;
    if (data.id) {
        el = document.getElementById(data.id);
    }
    if (!el && data.name) {
        el = document.querySelector(`[name="${data.name}"]`);
    }
    if (!el && data.tag) {
        el = document.querySelector(data.tag.toLowerCase());
    }
    if (el && el.focus) {
        el.focus();
    }
}

// Cambiar el valor del elemento remoto según id, name o tag
function cambiarValorElementoRemoto(data) {
    let el = null;
    if (data.id) {
        el = document.getElementById(data.id);
    }
    if (!el && data.name) {
        el = document.querySelector(`[name="${data.name}"]`);
    }
    if (!el && data.tag) {
        el = document.querySelector(data.tag.toLowerCase());
    }
    if (el) {
        el.value = data.value;
        // Disparar evento input y change para que la UI reaccione
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }
}
// Simular evento keydown en el elemento enfocado
function simularKeydownEnElementoActivo(data) {
    const el = document.activeElement;
    if (!el) return;
    // Crear un evento KeyboardEvent con los datos recibidos
    const evt = new KeyboardEvent('keydown', {
        key: data.key || '',
        code: data.code || '',
        ctrlKey: !!data.ctrl,
        shiftKey: !!data.shift,
        altKey: !!data.alt,
        bubbles: true,
        cancelable: true
    });
    el.dispatchEvent(evt);
    // Si es un input o textarea y es una tecla de texto, modificar el valor
    if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && typeof data.key === 'string' && data.key.length === 1) {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const value = el.value;
        el.value = value.slice(0, start) + data.key + value.slice(end);
        el.selectionStart = el.selectionEnd = start + 1;
    }
}
// Animación de clic en el mouse virtual
function animarClickMouseVirtual(x, y) {
    let mouse = document.getElementById('mouse-virtual');
    if (!mouse) return;
    mouse.style.boxShadow = '0 0 0 8px rgba(52,152,219,0.3)';
    setTimeout(() => {
        mouse.style.boxShadow = '';
    }, 150);
}

// Simular click real en el elemento bajo el mouse virtual
function simularClickEnPosicion(x, y) {
    // Ajustar por el scroll de la página
    const realX = x;
    const realY = y;
    const elem = document.elementFromPoint(realX, realY);
    if (elem) {
        elem.focus && elem.focus();
        elem.click && elem.click();
    }
}
            }
        });
        conn.on("open", () => {
            appendLog("Conexión abierta");
        });
    });
}
// Mouse virtual
function mostrarMouseVirtual(x, y) {
    let mouse = document.getElementById('mouse-virtual');
    if (!mouse) {
        mouse = document.createElement('div');
        mouse.id = 'mouse-virtual';
        mouse.style.position = 'fixed';
        mouse.style.width = '20px';
        mouse.style.height = '20px';
        mouse.style.background = 'rgba(52,152,219,0.7)';
        mouse.style.border = '2px solid #fff';
        mouse.style.borderRadius = '50%';
        mouse.style.pointerEvents = 'none';
        mouse.style.zIndex = '9999';
        mouse.style.transition = 'left 0.05s linear, top 0.05s linear';
        document.body.appendChild(mouse);
    }
    mouse.style.left = (x - 10) + 'px';
    mouse.style.top = (y - 10) + 'px';
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
