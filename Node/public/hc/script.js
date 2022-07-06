// Sistema oseo 
const paths= document.querySelectorAll("#sistema_oseo path");

const cambiarColor=(e)=>{
    console.log(e.target.id);
    if(e.target.getAttribute('class')=="blanco-oscuro"){
        if(e.target.getAttribute('fill')=='#B0B296'){

            e.target.setAttribute('fill', '#d33b27')
        }
        else{

            e.target.setAttribute('fill', '#B0B296')
        }
    }
    else if(e.target.getAttribute('class')=="blanco-blanco"){
        if(e.target.getAttribute('fill')=='#FFFFFF'){

            e.target.setAttribute('fill', '#d33b27')
        }
        else{

            e.target.setAttribute('fill', '#FFFFFF')
        }
    }
    else if(e.target.getAttribute('class')=="blanco-mediano"){
        if(e.target.getAttribute('fill')=='#F4EFE2'){

            e.target.setAttribute('fill', '#d33b27')
        }
        else{

            e.target.setAttribute('fill', '#F4EFE2')
        }
    }
    else{
        if(e.target.getAttribute('fill')=='#FFF9EC'){

            e.target.setAttribute('fill', '#d33b27')
        }
        else{

            e.target.setAttribute('fill', '#FFF9EC')
        }
    }
}

for (let i = 0; i < paths.length; ++i){
    if(paths[i].getAttribute('fill')=='#FFF9EC'){
        paths[i].addEventListener("click", cambiarColor, false);
    }
    else if(paths[i].getAttribute('fill')=='#B0B296'){
        paths[i].setAttribute("class", "blanco-oscuro")
        paths[i].addEventListener("click", cambiarColor, false);
    }
    else if (paths[i].getAttribute('fill')=='#FFFFFF'){
        paths[i].setAttribute("class", "blanco-blanco")
        paths[i].addEventListener("click", cambiarColor, false);
    }
    else if (paths[i].getAttribute('fill')=='#F4EFE2'){
        paths[i].setAttribute("class", "blanco-mediano")
        paths[i].addEventListener("click", cambiarColor, false);
    }
}

// Sistema muscular 

let miCanvas = document.querySelector('#musculos');
let lineas = [];
let correccionX = 0;
let correccionY = 0;
let pintarLinea = false;
// Marca el nuevo punto
let nuevaPosicionX = 0;
let nuevaPosicionY = 0;

let posicion = miCanvas.getBoundingClientRect()
correccionX = posicion.x;
correccionY = posicion.y;

miCanvas.width = 350;
miCanvas.height = 500;

//Funcion que empieza a dibujar la linea
function empezarDibujo () {
    pintarLinea = true;
    lineas.push([]);
};

//Funcion que guarda la posicion de la nueva línea
function guardarLinea() {
    lineas[lineas.length - 1].push({
        x: nuevaPosicionX,
        y: nuevaPosicionY
    });
}


//Funcion dibuja la linea
function dibujarLinea (event) {
    event.preventDefault();
    if (pintarLinea) {
        let ctx = miCanvas.getContext('2d')
        // Estilos de linea
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.lineWidth = 2;
        // Color de la linea
        ctx.strokeStyle = '#000';
        // Marca el nuevo punto
        if (event.changedTouches == undefined) {
            // Versión ratón
            nuevaPosicionX = event.layerX;
            nuevaPosicionY = event.layerY;
        } else {
            // Versión touch, pantalla tactil
            nuevaPosicionX = event.changedTouches[0].pageX - correccionX;
            nuevaPosicionY = event.changedTouches[0].pageY - correccionY;
        }
        // Guarda la linea
        guardarLinea();
        // Redibuja todas las lineas guardadas
        ctx.beginPath();
        lineas.forEach(function (segmento) {
            ctx.moveTo(segmento[0].x, segmento[0].y);
            segmento.forEach(function (punto, index) {
                ctx.lineTo(punto.x, punto.y);
            });
        });
        ctx.stroke();
    }
}

//Funcion que deja de dibujar la linea
function pararDibujar () {
    pintarLinea = false;
    guardarLinea();
}


// Eventos raton
miCanvas.addEventListener('mousedown', empezarDibujo, false);
miCanvas.addEventListener('mousemove', dibujarLinea, false);
miCanvas.addEventListener('mouseup', pararDibujar, false);

// Eventos pantallas táctiles
miCanvas.addEventListener('touchstart', empezarDibujo, false);
miCanvas.addEventListener('touchmove', dibujarLinea, false);