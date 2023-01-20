const $botonReiniciar = document.querySelector("#boton-reiniciar");
const $botonAspectoJugador = document.querySelector("#boton-elegir-aspecto");

const $seccionElegirAspecto = document.querySelector("#seleccion-aspecto");
const $tarjetas = document.querySelector("#tarjetas");

const $seccionVerMapa = document.querySelector("#ver-mapa");
const $mapa = document.querySelector("#mapa");

let listaDeAspectos;
let facVel = 8;

let aspectos = [];
let opcionDeAspectosTemplate;

let aspectoJugador;

let aspectosEnemigos = [];
let aspectoEnemigo;

let intervalo;
let lienzo = $mapa.getContext("2d");
let mapaBackground = new Image();
mapaBackground.src = "./assets/background-specialForest.png";

$mapa.width = 800;
$mapa.height = 640;

class Aspecto {
    constructor (nombre, foto, fotoMapa, id = null) {
        this.id = id;
        this.nombre = nombre;
        this.foto = foto;
        this.ancho = 80;
        this.alto = 80;
        this.x = getRandomNumber(0, $mapa.width - this.ancho);
        this.y = getRandomNumber(0, $mapa.height - (this.alto * 2));
        this.mapaFoto = new Image();
        this.mapaFoto.src = fotoMapa;
        this.velocidadX = 0;
        this.velocidadY = 0;
        this.gravedad = (facVel / 4);
    }

    moverRight() {
        this.velocidadX = (facVel * 2);
    }
    moverDown() {
        this.velocidadY = facVel;
    }
    moverUp(){
    if (aspectoJugador.y + aspectoJugador.alto === $mapa.height) {
        aspectoJugador.velocidadY = -facVel;
    }}
    moverLeft() {
        this.velocidadX = -(facVel * 2);
    }

    pintarAspecto() {
    lienzo.drawImage(
        this.mapaFoto,
        this.x,
        this.y,
        this.ancho,
        this.alto
    )};
}

const fulgus = new Aspecto (`Fulgus`, `./assets/sprites-splash-fulgus.png`, `./assets/sprites-mapa-fulgus.png`);
const goldeon = new Aspecto (`Goldeon`, `./assets/sprites-splash-goldeon.png`, `./assets/sprites-mapa-goldeon.png`);
const plantus = new Aspecto (`Plantus`, `./assets/sprites-splash-plantus.png`, `./assets/sprites-mapa-plantus.png`);

aspectos.push(fulgus, goldeon, plantus)

function iniciarJuego() {
    $seccionVerMapa.style.display = "none";
    $botonReiniciar.style.display = "none";

    aspectos.forEach((aspecto) => {
        opcionDeAspectosTemplate = `
            <input type="radio" name="aspecto" id=${aspecto.nombre} />
            <label class="aspecto-tarjeta" for=${aspecto.nombre}>
                <p>${aspecto.nombre}</p>
                <img src=${aspecto.foto} alt=${aspecto.nombre}>
            </label>
        `;
        $tarjetas.innerHTML += opcionDeAspectosTemplate;  
    })
    listaDeAspectos = document.querySelectorAll("input[name=aspecto]");

    $botonAspectoJugador.addEventListener("click", seleccionarAspectoJugador);
    $botonReiniciar.addEventListener("click", reiniciarJuego);
}

function seleccionarAspectoJugador() {
    for (let i = 0; i < listaDeAspectos.length; i++) {
        if (listaDeAspectos[i].checked) {
            aspectoJugador = aspectos[i];
            $seccionElegirAspecto.style.display = "none";

            $seccionVerMapa.style.display = "flex";
            seleccionarAspectoEnemigo();
            return iniciarMapa();
        }
    }
    return alert(`Elige tu Mascota`);
}
function seleccionarAspectoEnemigo() {
    aspectosEnemigos = aspectos.filter((jugador) => jugador !== aspectoJugador);
    let enemigoAleatorio = getRandomNumber(0, aspectosEnemigos.length - 1);
    aspectoEnemigo = aspectosEnemigos[enemigoAleatorio];
}

function crearMensaje(texto, clase, numBloque, destino) {
    //1=Jugador 2=Enemigo 3=Resultado
    let $parrafo = document.createElement("p");
    let mensajeAtaque = [
        `Tu ${aspectoJugador.nombre} utilizó ${ataqueJugadorTurno}`,
        `El ${aspectoEnemigo.nombre} enemigo utilizó ${ataqueEnemigoTurno}`
    ];

    if (numBloque === 1) {
        $parrafo.innerHTML = mensajeAtaque[numBloque - 1];
        $parrafo.className = clase;
        return $divMensajesJugador.insertAdjacentElement("afterbegin" ,$parrafo);
    } else if (numBloque === 2) {
        $parrafo.innerHTML = mensajeAtaque[numBloque - 1];
        $parrafo.className = clase;
        return $divMensajesEnemigo.insertAdjacentElement("afterbegin" ,$parrafo);
    } else if (numBloque === 3) {
        $pMensajesResultado.innerHTML = texto;
    } else {
        $parrafo.innerHTML = texto;
        $parrafo.className = `${clase}`;
        destino.appendChild($parrafo)
    }
}

function reiniciarJuego() {
    location.reload();
}

function getRandomNumber(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function pintarCanvas() {
    aspectoJugador.x = aspectoJugador.x + aspectoJugador.velocidadX;
    aspectoJugador.y = aspectoJugador.y + aspectoJugador.velocidadY;
    lienzo.clearRect(0, 0, $mapa.clientWidth, $mapa.clientHeight);
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        $mapa.width,
        $mapa.height
    )
    comprobarColision(aspectoEnemigo);
    aplicarGravedad();
    aspectoJugador.pintarAspecto();
    aspectoEnemigo.pintarAspecto();
}
function comprobarColision(enemigo) {
    const arribaEnemigo = enemigo.y;
    const abajoEnemigo = enemigo.y + enemigo.alto;
    const izquierdaEnemigo = enemigo.x;
    const derechaEnemigo = enemigo.x + enemigo.ancho;
    
    const arribaAspecto = aspectoJugador.y;
    const abajoAspecto = aspectoJugador.y + aspectoJugador.alto;
    const izquierdaAspecto = aspectoJugador.x;
    const derechaAspecto = aspectoJugador.x + aspectoJugador.ancho;

    if (arribaAspecto <= 0 && aspectoJugador.velocidadY === -facVel) {
        aspectoJugador.y = 0;
    } else if (abajoAspecto >= $mapa.height && aspectoJugador.velocidadY === facVel) {
        aspectoJugador.y = $mapa.height - aspectoJugador.alto;
    } else if (izquierdaAspecto <= 0 && aspectoJugador.velocidadX === -(facVel * 2)) {
        aspectoJugador.x = 0;
    } else if (derechaAspecto >= $mapa.width && aspectoJugador.velocidadX === (facVel * 2)) {
        aspectoJugador.x = $mapa.width - aspectoJugador.ancho;
    }

    if (
        abajoAspecto <= arribaEnemigo ||
        arribaAspecto >= abajoEnemigo ||
        derechaAspecto <= izquierdaEnemigo ||
        izquierdaAspecto >= derechaEnemigo
    ) {
        return;
    } else {
        console.log("colision");
    }
}

function detenerMovimiento() {
    aspectoJugador.velocidadX = 0;
    if (aspectoJugador.velocidadY < 0) {
        aspectoJugador.velocidadY = 0;
    }
}
function aplicarGravedad() {
    const abajoAspecto = aspectoJugador.y + aspectoJugador.alto;
    if (abajoAspecto >= $mapa.height - 16 && aspectoJugador.velocidadY >= 0) {
        aspectoJugador.y = $mapa.height - aspectoJugador.alto;
        aspectoJugador.velocidadY = 0;
    }
    else if (aspectoJugador.velocidadY >= 0 && aspectoJugador.velocidadY <= facVel * 2) {
        aspectoJugador.velocidadY += aspectoJugador.gravedad;
        aspectoJugador.y += aspectoJugador.velocidadY;    
    }
    else {
        aspectoJugador.y += aspectoJugador.velocidadY;
    }
}

function tocasteUnaTecla(e) {
    switch (e.key) {
        case "w":
            aspectoJugador.moverUp();
            break;
        case "s":
            aspectoJugador.moverDown();
            break;
        case "a":
            aspectoJugador.moverLeft();
            break;
        case "d":
            aspectoJugador.moverRight();
            break;
        default:
            break;
    }
}

function iniciarMapa() {
    intervalo = setInterval(pintarCanvas, 50);
    window.addEventListener("keydown", tocasteUnaTecla);
    window.addEventListener("keyup", detenerMovimiento);
}

window.addEventListener("load", iniciarJuego);

// function dibujar(){
//     var elemento = document.getElementById('lienzo');
//     lienzo = elemento.getContext('2d');
    
//     var velocidad=5;
//     var p1={x:0, y:500};
//     var tiempo=0;

//     var bola={x:p1.x, y:p1.y};

//     setInterval(pintar,10);
    
//     function pintar(){
        //Dibujar el rectángulo
//         lienzo.fillStyle='#ffffff';
//         lienzo.fillRect(0,0,elemento.width,elemento.height);
        
        //DIbujar el marco
//         lienzo.strokeStyle='#000000';
//         lienzo.strokeRect(1,1,elemento.width-2,elemento.height-2);
       
//             bola.x =0+28*tiempo;
//             bola.y =500-85*tiempo+.5*9.8*tiempo*tiempo;
        
//         lienzo.fillStyle='#000000';
//         lienzo.beginPath();
//         lienzo.arc(bola.x,bola.y,15,0,Math.PI*2,true);
//         lienzo.closePath();
//         lienzo.fill();
      
//       tiempo+=0.06;
      
//      if(bola.x>500){
//        tiempo=0;
//      } 

//     }
    
// };
