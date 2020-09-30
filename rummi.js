const arrayColores = ["black", "red", "blue", "magenta"];
var filaMesa;
var arrayMesa;
var fm; 
var traza = true;
var num_traza = 0;
var textoJ;
// var cancelable = false;
var fichaJugada = false;

/*****************************************************************************/
/*****************************************************************************/
/*****************************************************************************/
/**************************                        ***************************/
/************************** PROGRAMACIÓN DE LA IU  ***************************/
/**************************                        ***************************/
/*****************************************************************************/
/*****************************************************************************/
/*****************************************************************************/

// function allowDrop(ev) { 
//   ev.preventDefault();
//   ev.target.classList.add('permiso');
// }

function dragStart(ev) { 
  ev.dataTransfer.setData("text", ev.target.id);
  fm=ev.target.id; // la ficha móvil (la que se arrastra). Se guarda porque el dataTransfer-getData() solo se puede conocer en el "drop"
}

// function dragStartMesa(ev) { 
//   ev.dataTransfer.setData("text", ev.target.id);
//   ev.target.setAttribute("previousRow", ev.target.parentElement().id);
//   fm=ev.target.id; // la ficha móvil (la que se arrastra). Se guarda porque el dataTransfer-getData() solo se puede conocer en el "drop"
// }

//////////////////////////////////////////////////////////////////
//función asociada al evento dragover
function allowDrop(ev) { 
  var arr = [];
  if (ev.target.tagName == "TD") {  // el jugador amplia un grupo prexistente 
    arr = filaFichasAArrayCodigos(ev.target.parentElement);
    arr = arr.concat(document.getElementById(fm).id.substr(1)); 
  }
  if (validaSim(arr) != -1) {
    ev.preventDefault();
    ev.target.classList.add('permiso');
  } else {
    ev.target.classList.add('error');
  }
}

  
/////////////////////////////////////////////////////////////////////

function dragDrop(ev) { 
  var data = ev.dataTransfer.getData("text");
  var fichaMovil = document.getElementById(data);
  ev.preventDefault(); 
  fichaMovil.id = "M" + data.substr(1);
  if (ev.target.tagName == "TD") {  // el jugador amplia un grupo prexistente 
    //Si solo había una ficha en la fila las pongo ordenadas
    filaMesa = ev.target.parentElement;
    if (filaMesa.cells.length == 1) { 
      if ((data.substr(1) - ev.target.id.substr(1)) < 0) {
        filaMesa.insertBefore(fichaMovil, ev.target);
      } else {
        filaMesa.appendChild(fichaMovil); 
      }
    // si en la fila había 2 o más fichas
    } else if (parseInt(fichaMovil.innerHTML) < parseInt(filaMesa.firstElementChild.innerHTML)) {
        filaMesa.insertBefore(fichaMovil, filaMesa.firstElementChild);
    } else {
         filaMesa.appendChild(fichaMovil);
    }     
    ev.target.classList.remove('error', 'marcada', 'permiso', 'marcasuave');
    hazNoDropable(ev.target);
    removeStyle(ev);
  } // no suelta en una filas ecxistente
  // if (previousRowId = fichaMovil.getAttribute("previousRow")) {
  //   marcarFilaMesa(document.getElementById(previousRowId));
  // }
  marcarFilaMesa(filaMesa);
  removeDragParams(ev, fichaMovil);
}

function hazDropable(ficha) {
  ficha.setAttribute("ondrop","dragDrop(event)");
  ficha.setAttribute("ondragover","allowDrop(event)");
  ficha.setAttribute("ondragleave","removeStyle(event)");
  //ficha.setAttribute("ondragenter","allowDrop(event)");
  return ficha;
}

function hazNoDropable(ficha) {
  ficha.removeAttribute("ondrop");
  ficha.removeAttribute("ondragover");
  ficha.removeAttribute("ondragleave");
  return ficha;
}

function validaGrupo(filaMesa) {
  var arr = [];
  if (filaMesa.cells.length < 3) {
    textoJ.innerHTML = "Siga arrastrando fichas para componer un grupo";
    return 0;
  } else {
    arr =filaFichasAArrayCodigos(filaMesa);
    if (esSerie(arr)){ 
      filaMesa.id=obtenerCodigo(arr);
      textoJ.innerHTML = "SERIE VÁLIDA";
      ordenarFila(arr,filaMesa);
      return 1;
    }  
    else if (esEscalera(arr)) { 
      filaMesa.id = obtenerCodigo(arr);
      textoJ.innerHTML = "ESCALERA VÁLIDA";
      ordenarFila(arr,filaMesa);
      return 2;
    }
    else {
      textoJ.innerHTML = "GRUPO NO VÁLIDO (doble-click para devolver la ficha)";
      beep2();  beep2();  beep2();  beep2();
      return -1;
    }
  }  
} 


function validaGrupo2(filaMesa) {
  var arr = [];
  var divMesa = document.getElementById("zonaMesa");
  if (filaMesa.cells.length < 3) {
    divMesa.innerHTML = "Siga arrastrando fichas para componer un grupo";
  } else {
    arr =filaFichasAArrayCodigos(filaMesa);
    if (esSerie(arr)){ 
      filaMesa.id=obtenerCodigo(arr);
      divMesa.innerHTML = "GRUPO VÁLIDO. Siga arrastrando fichas para componer otrp grupo";
      ordenarFila(arr,filaMesa);
    }  
    else if (esEscalera(arr)) { 
      filaMesa.id = obtenerCodigo(arr);
      divMesa.innerHTML = "GRUPO VÁLIDO.Siga arrastrando fichas para componer otr0 grupo";
      ordenarFila(arr,filaMesa);
    }
    else {
      divMesa.innerHTML = "GRUPO NO VÁLIDO (doble-clcik para devolver la ficha)";
      beep2();  beep2();  beep2();  beep2();
      return -1;
    }
  }  
} 

////////////////////////////////////////////////////////////////

function validaSim(arr) {
  var len = arr.length;
  if (len >= 3 && !esSerie(arr) && !esEscalera(arr)) {  
     return -1;
  }
  if (len == 2) {
    if ((arr[0] % 100) == (arr[1] % 100)) {  // 2 fichas del mismo número
      if (arr[0] == arr[1]) {return -1;}     // si son duplicados no valen para serie ni para escaleras
    }
    else if (Math.abs((arr[0] % 100) - (arr[1] % 100)) == 1) {  // 2 con numeración consecutiva crec. o decrec.
      if (Math.floor(arr[0]  / 100) != Math.floor(arr[1] / 100)) {return -1;}  // si el color es diferente no valen para escalera
    } else {return -1;}
  }
}
  


//////////////////////////////////////////////////////////////////////////////
// funcion asociada al evento "ondrop" sobre el final de las fichas de la mesa
function dragDropFin(ev) { 
    ev.preventDefault(); 
    var data = ev.dataTransfer.getData("text");
    var fichaMovil = document.getElementById(data);
    var ultimaFila = document.createElement("tr");
    var tablaMesa = document.getElementById("tablaMesa");
    tablaMesa.appendChild(ultimaFila);
    ultimaFila.appendChild(hazDropable(document.getElementById(data)));
    ev.target.removeAttribute("style");
    removeDragParams(ev, fichaMovil);
    filaMesa = ultimaFila;
    filaMesa.id = "X-filaMesa";
    fichaMovil.id = "M" + data.substr(1);
    fichaJugada =true;
    document.getElementById("Cambio").innerHTML="Cambio turno";
}


function removeStyle(ev) {
  if (ev.target.tagName == "TD"){
     ev.target.classList.remove('permiso', 'error');  
  }
  else if (ev.target.tagName == "DIV") {}    
}


function removeDragParams(ev,ficha) {  
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to remove the drag data
      ev.dataTransfer.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      ev.dataTransfer.clearData();
    }
    ficha.draggable = false;
}

function beep2()
{ var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
  snd.play();
}



/*****************************************************************************/
/*****************************************************************************/
/*****************************************************************************/
/**************************                        ***************************/
/************************** PROGRAMACIÓN DEL JUEGO ***************************/
/**************************                        ***************************/
/*****************************************************************************/
/*****************************************************************************/
/*****************************************************************************/
var fichasSaco = [];
var misFichas = [];
var maqFichas = [];
var seleccion = [];

var tablaDest;

var numGrupo = 0;

var tablaJugador;
var tablaComp;
var tablaSaco;

var filaJugador;
var filaMaquina;
var filaComp;

var arraySaco;

// Variables que definen el estado
var modoDebug = false;
var sacoVisible = true;

function nuevoJuego() {
  location.reload();
}

function iniciar(prueba) {
  filaMesa = document.getElementById("rummy");
  textoJ = document.getElementById("textoJugador");
  var arraySaco = [];
  var ficha;
  tablaSaco = document.getElementById("tablaSaco");
  if (prueba == 0) {
    for (let a = 1, i=0; a < 3; a++) {   // hay 2 juegos de cada
      for (let v = 1; v < 14; v++) {     // 13 valores del 1 al 13
        for (let c = 0; c < 4; c++) {    // y 4 colores del 0 al 3
          arraySaco[i] = c * 100 + v;    // Codif. por color. Ejemplo la ficha 108 es de color 1 y valor 8
          i++;
        }
      } 
    }
    arraySaco.sort((a, b) => 0.5 - Math.random());
 // The Fisher Yates Method
  // if (tipus == 0) {
  //   for (let i = arraySaco.length -1,j,k; i > 0; i--) {
  //       j = Math.floor(Math.random() * i)
  //       k = arraySaco[i]
  //       arraySaco[i] = arraySaco[j]
  //       arraySaco[j] = k
  //     }
  } else if (prueba <= 1) {
    arraySaco = [101,108,203,202,201,207,9,10,
      103,303,106,306,006,109,203,6,206,204,107,205,206,13,
      103,106,302,110,105,103,112,5,203,303,107,213,213,308];
    arrayMesa =[
            [110, 210, 310],           // una serie de 3 dieces
            [1, 2, 3, 4, 5, 6, 7, 8],  // una esc de negros
            [203, 204, 205]            // escalera azul
      ]
     
  } else {  // prueba > 1
    arraySaco = [101,108,203,202,201,207,5,10,
      103,303,6,306,311,203,206,304,107,205,206,13,
      103,106,302,110,105,103,203,203,303,107,213,213,308];
      arrayMesa =[
        [110, 210, 310],           // una serie de 3 dieces
        [1, 2, 3, 4, 5,6,7,8],           // una esc de negros
        [203, 204, 205]            // escalera azul
      ]
  }
    //conversión de números a fichas
  for (let c = 0, i=0; c < 8; c++) {// 8 filas
    if (i == arraySaco.length) break;
    filaSaco = this.document.createElement("tr");
    tablaSaco.appendChild(filaSaco);
    for (let f = 0; f < 13; f++) {
      // 13 filas 8*13 = 104 fichas
      if (i == arraySaco.length) break;
      ficha = this.document.createElement("td");
      ficha.className = "figuraFicha";
      ficha.addEventListener("dblclick",  seleccionarGrupo);
      ficha.innerHTML = arraySaco[i] % 100;
      ficha.id = 'S' + arraySaco[i];
      ficha.style.color = arrayColores[Math.floor(arraySaco[i] / 100)];
      filaSaco.appendChild(ficha);
      i++;
    }  
    fichasSaco = fichasSaco.concat([...filaSaco.cells]);
    tablaSaco.style.display =  "none";
  }  
  repartirFichas();
  // Si hay fichas prefijadas en la mesa, ponlas. Esto solo ocurre en fase de DESARROLLO
  // para reproducir determinados escenarios de PRUEBA
  var tablaMesa = document.getElementById("tablaMesa").firstElementChild;
  if (arrayMesa)  {      // si está definido en inicio()
    for (let i = 0; i < arrayMesa.length; i++){
      filaMesa = document.createElement("tr");
      filaMesa.id = obtenerCodigo(arrayMesa[i]);
      tablaMesa.appendChild(filaMesa);
       for (let j = 0; j < arrayMesa[i].length; j++){
        ficha = this.document.createElement("td");
        ficha.className = "figuraFicha";
        ficha.innerHTML = arrayMesa[i][j] % 100;
        ficha.id = 'M' + arrayMesa[i][j];
        ficha.style.color = arrayColores[Math.floor(arrayMesa[i][j] / 100)];
        //ficha.draggable = "true";
        filaMesa.appendChild(ficha);
      }
      marcarFilaMesa(filaMesa,'I');
    }
  }
 // solo se reparte una vez. Así que escondo los botones de reparto
  document.getElementById("botonRepartir" ).style.display = "none";  
  document.getElementById("botonRepartir1").style.display = "none"; 
  textoJ.innerHTML = "TURNO JUGADOR: Arrastra fichas de la mano del jugador a la mesa o pide una sugererencia de juego";
 
}



/* ***************************************************************************** */
function repartirFichas() {
  filaJugador = document.getElementById("filaJugador");
  filaMaquina = document.getElementById("filaMaquina");
 
  for (let i = 0; i < 14; i++) { // se reparten 14 fichas
    figuraMaquina = fichasSaco.pop()
    figuraMaquina.id = 'C' + figuraMaquina.id.substr(1)
    filaMaquina.appendChild(figuraMaquina);
  }
  for (let i = 0; i < 14; i++) {
    ficha = fichasSaco.pop()
    ficha.id = 'F' + ficha.id.substr(1); 
    ficha.draggable = "true";
    ficha.setAttribute("ondragstart", "dragStart(event)");
    filaJugador.appendChild(ficha);
  }
 // document.getElementById("letreroComputador").style.display = "none";
  //tablaMaquina.style.display = "none";
  document.getElementById("MMC").style.display = "inline";
 }


/******************************************************************************** */
function seleccionarGrupo() {
  if (traza) console.log("         grupo Seleccionado");

  var codGrupo; // Código del grupo
  var colorEsc; // la Escalera es monocolor, luego esto es un entero de 0 a 3
  var colorSer; // la serie de 3 le falta un color (de 0 a 3), a la de 4 ninguno (-1)
  var valorIni = -1; //valor inicial de la escalera
  var tam = 0; // tamaño del grupo
  var groupType = this.getAttribute ("gType"); // Tipo = 'S'|'E'-núm.de grupo-"F"num
  var numGrupo =  this.getAttribute ("numGrupo");
  var grupoMesa = this.getAttribute ("grupoMesa");
  var colorExcl = [0, 1, 2, 3];
  var fichas = [];

  if (groupType != 'S' && groupType != 'E' && groupType != 'A' && groupType !='s' && groupType !='e' && groupType != 'C') { 
    return;
  }
  
  fichas = [...this.parentElement.cells];
  // fichas = [...filaJugador.cells];

  if (groupType == 'A') { 
    var filaMesa =  document.getElementById(grupoMesa);
    var primero = filaMesa.firstChild;
    this.setAttribute("numGrupo", primero.getAttribute("numGrupo"));
    if (this.getAttribute('lado') == 'izda') {   // solo en las escaleras importa el lado de inserción?????
      filaMesa.insertBefore(this, primero);
    // } else if (this.getAttribute("lado") == "dcha") {
    //   filaMesa.appendChild(this);
    } else {
      filaMesa.appendChild(this);
    }
    this.id = 'M' + this.id.substr(1);
    marcarFilaMesa(filaMesa);
    this.removeAttribute("lado");
    this.removeAttribute("gType");
    this.removeAttribute("numGrupo");
    this.removeAttribute("grupoMesa");

  } else { //groupTypes != A
    var tablaMesa = document.getElementById("tablaMesa");
    var filaMesaDest = document.createElement("tr");
    tablaMesa.appendChild(filaMesaDest);

  // recorro la fichas del panel del jugador-comp para ver las que forman parte de mi grupo
    for (let i = 0; i < fichas.length; i++) {
      if (fichas[i].getAttribute("numGrupo") == numGrupo) {
        filaMesaDest.appendChild(fichas[i]);
        fichas[i].classList.remove('marcada');
        fichas[i].removeAttribute("gType");
        fichas[i].removeAttribute("numGrupo");
        fichas[i].id ='M' + fichas[i].id.substr(1);
      } 
    }
    if (groupType == 's'|| groupType == 'e')  {
      fichaMesa = [...document.getElementsByClassName('marcasuave')]; 
      fichaMesa = fichaMesa.filter(el => el.getAttribute('numGrupo') == numGrupo );// solo PUEDE haber 1
      filaVella = fichaMesa[0].parentElement;
      if (fichaMesa[0].getAttribute('lado') == 'izda') {  // es 'e'
      filaMesaDest.insertBefore(fichaMesa[0], filaMesaDest.firstChild);
    } else {
      filaMesaDest.appendChild(fichaMesa[0]);
    }
    marcarFilaMesa(filaVella);
    // fichaMesa[0].grup = "S";
  }
  if (groupType == 'C')  {
    filaMesa =  document.getElementById(grupoMesa);
    fichasMesa2 =  [...filaMesa.cells];
    if (this.getAttribute('lado') == 'izda') {
      for (let i = this.getAttribute('cortes')-1; i>=0; i--) {
        filaMesaDest.insertBefore(fichasMesa2[i], filaMesaDest.firstChild);
      }
    } else if (this.getAttribute('lado') == 'dcha') {
      for (let i = this.getAttribute('cortes'); i < fichasMesa2.length; i++) {
        filaMesaDest.appendChild(fichasMesa2[i]);
      }
    }
    // marcarFilaMesa(filaMesaDest);
    // marcarFilaMesa(filaMesa);
  }
//   document.getElementById("robarFicha").innerHTML = "Cambio";
}
if (filaMesaDest) marcarFilaMesa(filaMesaDest);
if (filaMesa) marcarFilaMesa(filaMesa);
  if (traza) trazaMesa();
}

// ************************************************************************
// esta función busca series cuyos componentes sean del mismo valor y distinto color
function buscarSeries(jugador) {
  if (traza) console.log(num_traza++ + " Busco Ser");

  var grupoValor = [];
  var grupoValorSinDups = [];
  var valorS = [];
  var valorS2 = [];
  
  var tamSer = [];
  var fichasPost = [];
  var series = []; // series de 3 o 4 fichas
  var s2 = []; // proto series de 2 fichas
  var nuevaserie = [];
  var ret = "0";

  var fichasJugador = [...filaJugador.cells];
  var fichasMaquina = [...filaMaquina.cells];
  // primero, hacemos limpieza
  limpiaFila(fichasJugador);
  limpiaFila(fichasMaquina);
  misFichas = fichasJugador.map(el => el.id.substr(1));
  maqFichas = fichasMaquina.map(el => el.id.substr(1));
  // cambio la codif. dandole prioridad al valor
  var fichas = codifValor(jugador?misFichas:maqFichas);
  ordenar(fichas);
  //separo las fichas en grupos del mismo valor "grupoValor[n]"
  var cuentaS3 = 0;
  var cuentaS2 = 0;
  for (let n = 0; n < 13; n++) {
    var cuentaDups = 0;
    grupoValor[n] = fichas.filter(el => Math.floor(el / 100) == n + 1);
    //se pone una marca los dups (Suma 20 al color)
    // ejemplo: la 322 una fichas de valor 3 y color 2 que está duplicada (está tb. la 302)
    for (let i = 1; i < grupoValor[n].length; i++) {
      if (grupoValor[n][i] === grupoValor[n][i - 1]) {
        // el elemento i es un dup
        grupoValor[n][i] += 20; // los dups van del 20 al 23
        cuentaDups++; // numero de dups en cada grupo de valor n
      }
    }
    ordenar(grupoValor[n]); // ordeno los grupos para que los dups se vayan al final
    // y reconstruyo el array fichas
    fichasPost = fichasPost.concat(grupoValor[n]);
    tamSer[n] = grupoValor[n].length - cuentaDups;
    grupoValorSinDups[n] = grupoValor[n].slice(0, tamSer[n]);
    // si el grupo de valor n (sin dups) es de 3 o 4 fichas? ==> es una serie
    if (tamSer[n] >= 3) {
      valorS[cuentaS3] = n;
      cuentaS3++;
      series[n] = codifColor(grupoValorSinDups[n]);
    // un duo podria convertirse en serie de 3 con ayuda de una ficha de la mesa
    // exploramos esta posibilidad cuando no hay series en la mano
    } else if (tamSer[n] == 2) {
      valorS2[n] = n;
      cuentaS2++;
      s2[n]= codifColor(grupoValorSinDups[n]);
    } else {
      series[n] =[];
      valorS[n]  = -1;
      valorS2[n] = -1;
  } 
  }
  var tablaMesa = document.getElementById("tablaMesa");
  var s4Mesa = [...tablaMesa.rows].filter(el => el.id.startsWith("S-4")); //selecciono los S4
  var cont = 0;
  var meVoy = false;
  for (var contS4 = 0; contS4 < s4Mesa.length; contS4++) { 
    if (meVoy == true) break;
    for (var num of valorS2) {
      if (meVoy == true) break;
      if ((valorS2[num] + 1)== s4Mesa[contS4].id.split('-')[2]) {
        for (var c=0; c < 4; c++) {
          if ((s2[num].find(el => el == Number(c * 100 + num + 1))) == undefined)  { //un color que me interesa
            nuevaserie[cont] = s2[num].slice();
            nuevaserie[cont].push(c * 100 + (num + 1)); 
            cont++;            
            meVoy = true; 
            fichasel = c * 100 + (num + 1);
            break;
          }
        }
      }
    }
  }
 
 // representar las fichas ordenadas 
  var arr  = codifColor(fichasPost,true);
  for (let i = 0; i < fichasPost.length; i++) {
    //
    if (jugador) {
      ficha= document.getElementById('F' + arr[i]);
      filaJugador.appendChild(ficha);
    } else {
      ficha= document.getElementById('C' + arr[i]);
      filaMaquina.appendChild(ficha);
    }
  } 
  // códigos de retorno de buscarSerie (para toma de decisiones):
  // "S-4": lo + grande que hay son una o varias series de 4
  // "S-3": lo + grande que hay son una o varias series de 3
  // "S-2": lo + grande que hay son una o varias series de 2 que se pueden completar con una ficha del la mesa

  
 // var textoJ = document.getElementById("textoJugador");
  if (cuentaS3 > 0) {

    var aux1=series.map(el => el.length);
    var serLenMax = aux1.sort((a, b) => b - a)[0];
    for (let k = 0; k < series.length; k++) {
      if (series[k]) {
        if (series[k].length == serLenMax) {
          serIdxMax = k
        }
      }
   }
   //   var serIdxMax = series.map(el => el.length).findIndex(el => (el.length == serLenMax));
      marcarFichas("S", series[serIdxMax], jugador);
        textoJ.innerHTML = "TURNO JUGADOR: Haz doble click la serie marcada";
        ret = "S-" + serLenMax;
  } else if (cont > 0) { // serie de 2 completada con una ficha de la mesa
    for (let i =0; i < nuevaserie.length; i++) {
      var nuevoCodigoS3Mesa = "S-3-" + num + "-" + c;
      var lado;
      marcarFichas("s", nuevaserie[i], jugador, nuevoCodigoS3Mesa, lado, s4Mesa[contS4-1].cells[c]);
      textoJ.innerHTML = "TURNO JUGADOR: Haz doble click sobre la(s) serie(s) marcada(s) y una ficha de la mesa";
    } 
    ret = "S-2";
  }    
  if (traza) console.log(" devuelve un " + ret);
  return ret;
}


// ********************************************************************************************
// Esta función busca escaleras cuyos compenentes sean del mismo color
function buscarEscaleras(jugador) {
  if (traza) console.log(num_traza++ + " Busco Esc");
  var du = [];
  var fichasPost = [];
  var escalera = [];
  var grupoColor = [];
  var esc2 = [];
  var col2 = [];
  var cuentaE3 = 0;
  var cuentaE2 = 0;
  var ret = "0";

  // Limpieza: desmarca, borra el tipo de grupo y el numero de grupo
  var fichasJugador = [...filaJugador.cells];
  var fichasMaquina = [...filaMaquina.cells];
  limpiaFila(fichasJugador);
  limpiaFila(fichasMaquina);
  misFichas = [...filaJugador.cells].map(el => parseInt(el.id.substr(1)));
  maqFichas = [...filaMaquina.cells].map(el => parseInt(el.id.substr(1)));
  if (jugador) fichas = misFichas; else fichas = maqFichas;
  ordenar(fichas);
 
  // separo las fichas en grupos del mismo color c para buscar escaleras de color
   for (let c = 0; c <= 3; c++) {
    var cont = 0;
    grupoColor[c] = fichas.filter(el => Math.floor(el / 100) == c);
    //se  pone una marca los dups +20 en el valor
    for (let i = 1, cont = 0; i < grupoColor[c].length; i++) {
      if (grupoColor[c][i] === grupoColor[c][i - 1]) {
        // el elemento i es un dup
        grupoColor[c][i] = Number(grupoColor[c][i]) + 20; // los dups van del 21 al 33
        cont++;
      }
    }
    du[c] = cont;
    ordenar(grupoColor[c]);   // los grupos de color c ya etaban ordenados
                              // esto es para enviar los dups al final del grupo

    // voy recomponiendo el array fichas del jugador o el computador
    fichasPost = fichasPost.concat(grupoColor[c]);
    
    var ini = 0;
    var tam = 1;
    var lim = grupoColor[c].length - du[c];

    // recorro el arr grupoColor[c] (sin dups) buscando escaleras
    // una especie de parser que localiza escaleras
    for (let i = 1; i <= lim; i++) {
      if (grupoColor[c][i] != grupoColor[c][i - 1] + 1 || i == lim) {
        if (tam == 2) {
          col2[cuentaE2] = c;
          esc2[cuentaE2++] = grupoColor[c].slice(ini, ini+2);
        }
        if (tam >= 3) {
          escalera[cuentaE3++] = grupoColor[c].slice(ini, ini+tam);
        }
        ini = i;
        tam = 1;
      } else { tam++; }
    
    } 
  }
 // var textoJ = document.getElementById("textoJugador");
  var arr  = desDuplicador(fichasPost); // quita el +20 en los dups (ya no hace falta)
  // redibujo las fichas de Jugador o computador
  for (let i = 0; i < fichasPost.length; i++) {
      if (jugador) {
      ficha= document.getElementById('F' + arr[i]);
      filaJugador.appendChild(ficha);
    } else {
      ficha= document.getElementById('C' + arr[i]);
      filaMaquina.appendChild(ficha);
    }
  }

  

// códigos de retorno de buscarEscaleras (para toma de decisiones):
  // "E-n": lo + grande que hay son una o varias esc de n
  // "E-2": lo + grande que hay son una o varias esc de 2 
  // que se pueden completar con una ficha del la mesa

  var escLenMax = escalera.map(el => el.length).sort((a, b) => b - a)[0];
  var escIdxMax = escalera.findIndex(el => (el.length == escLenMax));
  if (cuentaE3 > 0) {
    //for (let i = 0; i < cuentaE3; i++) {
     // marcarFichas("E", escalera[i], jugador);
      marcarFichas("E", escalera[escIdxMax], jugador);
      textoJ.innerHTML = "TURNO JUGADOR: Haz doble click sobre la escalera marcada";
      ret = "E-" + escLenMax;
    
  } else if (cuentaE2 > 0) {
    var gruposMesa = [...document.getElementById("tablaMesa").rows];
    for (let i = 0; i < cuentaE2; i++) {
      // para las esc de 2 elementos busco en la mesa una serie de 4 on una escalera de 
      // 4 o 5 o 6 ...al que el pueda quitar la ficha que me falta: por la izda o 
      // por la dcha. Las fichas que busco son las siguientes:
      var fichaIzda;
      var fichaDcha;
      if (esc2[i][0] % 100 == 1) {fichaIzda = -1;}  // no hay ficha a la izda
      else {fichaIzda = esc2[i][0] - 1;}

      if (esc2[i][1] % 100 == 13) fichaDcha = -1; // no hay ficha a la dcha
      else fichaDcha =parseInt(esc2[i][1]) + parseInt(1);
      // intento de ver si la fichaIzda está en la mesa
      posibleFichaIzda = document.getElementById("M" + fichaIzda);
      posibleFichaDcha = document.getElementById("M" + fichaDcha);
      var fichaAMover;
      var porIzda = false;
      var porDcha = false;
      if (posibleFichaIzda || posibleFichaDcha) {
        // si que esta, vamos a ver si esta en un lugar aprovechable
        for (let f = 0; f < gruposMesa.length; f++) {
          var fichasMesa = [...gruposMesa[f].cells];
          if (fichasMesa[0].id.substr(1) == fichaIzda) {
            fichaAMover = fichasMesa[0];
            porIzda = true;
          } else if (fichasMesa[fichasMesa.length-1].id.substr(1) == fichaIzda) {
            fichaAMover = fichasMesa[fichasMesa.length-1];
            porIzda = true
          } else if (fichasMesa[0].id.substr(1) == fichaDcha) {
            fichaAMover = fichasMesa[0];
            porDcha = true;
          } else if (fichasMesa[fichasMesa.length-1].id.substr(1) == fichaDcha) {
            fichaAMover = fichasMesa[fichasMesa.length-1];
            porDcha = true
          } else {
            fichaAMover = null;
            porDcha = false;
            porIzda = false
          }
          if (gruposMesa[f].id.startsWith('S') && (fichaAMover == null)) {
    
          if (fichaAMover = document.getElementById('M' + fichaIzda)) {
            porIzda = true
          } else if (fichaAMover = document.getElementById('M' + fichaDcha)) {
            porDcha = true
          }
          if (fichaAMover) {
            var cgm;
            var esS4 = gruposMesa[f].id.startsWith("S-4-");
            var esE = gruposMesa[f].id.startsWith("E-");
            var mayorQue3 = (gruposMesa[f].id.split("-")[1] > 3);
            if ( esS4 || (esE && mayorQue3)) {
              esc2[i][2] =  fichaAMover.id.substr(1);
              if (esE) cgm = "E-" + (gruposMesa[f].id.split("-")[1]-1) + "-";
              marcarFichas("e", esc2[i], jugador, cgm, (porIzda?"izda":"dcha"),fichaAMover);
              textoJ.innerHTML = "TURNO JUGADOR: Haz doble click sobre la escalera marcada (2 fichas) junto a una ficha de la mesa";
              ret = "E-2"
            }
          }
        }
      }
      } else  {ret = "-1";}
    }
  }
  if (traza) console.log(" devuelve un " + ret);
  return ret;
}
  

/* ****************************************************************************** */
function robarFicha(jugador) {

    var gruposMesa = [...document.getElementById("tablaMesa").rows];
   var grupo =[];
    if (jugador) {
      var longRows = gruposMesa.length;
      for (let i = longRows - 1; i > 0 ; i--) {
        if (gruposMesa[i].cells.length < 3) {
         grupo[i] = gruposMesa[i].cells;
         var longCells =  grupo[i].length;
          for (let j=0; j < longCells; j++) {
            grupo[i][0].id = 'F' + grupo[i][0].id.substr(1); 
           filaJugador.appendChild(grupo[i][0]); 
          }
          document.getElementById("tablaMesa").deleteRow(-1);
        }
      }
      limpiaFila(filaJugador);
   // ************************* si no ha jugado ficha ===>   fichaJugada = false
    }

  if (!fichaJugada) { // no se jugado ninguna ficha de la mano. Por tanto ates de cambiar de turno hay que robar 
    if (fichasSaco.length > 0) {
     var ficha = fichasSaco.pop();
     if (jugador) ficha.id = 'F' + ficha.id.substr(1); 
     else ficha.id = 'C' + ficha.id.substr(1);
      if (traza) console.log("robo ficha" + ficha.id);
      ficha.draggable = "true";
      ficha.setAttribute("ondragstart", "dragStart(event)");
      if (jugador) {
      filaJugador.appendChild(ficha);
      } else {
      filaMaquina.appendChild(ficha);
     }
    } else {alert ("El saco está vacío");}
} else { //empieza unas nueva jugada 
  fichaJugada = false;
  document.getElementById("Cambio").innerHTML="Robar ficha";
  document.getElementById("Cambio").classList.remove("btn-primarry");
  document.getElementById("Cambio").classList.add("btn-danger");
}

if (jugador) {
  jugadaComp();
  document.getElementById("Jugada").style.visibility="hidden"; 
  robarFicha(false);
  setTimeout(aviso, 2000);
  function aviso() {
    alert("TURNO COMPUTADOR: jugada concluída: Cambio a TURNO JUGADOR");
  }
} else {
  textoJ.innerHTML = "TURNO JUGADOR: arrastre fichas de la mano del jugador o pida sugerencia de juego";
  document.getElementById("Jugada").style.visibility="visible"; 
}
}

/******************************************************************************/

function ampliarSerie(jugador){
  var fichasJugador = [...filaJugador.cells];
  var fichasMaquina = [...filaMaquina.cells];
  limpiaFila(fichasJugador);
  limpiaFila(fichasMaquina);
  var fichas;
  if (jugador) fichas = fichasJugador; else fichas = fichasMaquina;
  if (traza) console.log(num_traza++ + " Busco AmS");
  var hayAmpliacion = false;
  const tablaMesa = document.getElementById("tablaMesa");
  var s3Mesa = [...tablaMesa.rows].filter(el => el.id.startsWith("S-3"));
  var arrCodigos = [];
  if (s3Mesa.length > 0) {
    var colores =  s3Mesa.map(el => el.id.split('-')[3]);
    var valores =  s3Mesa.map(el => el.id.split('-')[2]);
    for (let i = 0; i < s3Mesa.length; i++) {
      if (hayAmpliacion) break;
      for (var j = 0; j < fichas.length; j++) {
        if ((fichas[j].innerHTML == valores[i]) &&
            (fichas[j].style.color === arrayColores[colores[i]])) {
          // la ficha que amplía una S3 que ya está en la mesa se almacena en un array 
          // de codigos por color pq así lo exige "marcarFicha"
          arrCodigos[0] = fichas[j].id.substr(1);
          var codigoGrupoMesa = "S-3-" + valores[i]+ "-" + colores[i]
          marcarFichas("A", arrCodigos, jugador, codigoGrupoMesa);
          hayAmpliacion = true;
          break;
          }
      }
    }
  }
  if (hayAmpliacion && jugador) {
    textoJ.innerHTML = "TURNO JUGADOR: Amplia la serie de la mesa haciendo doble click sobre la ficha en tu mano"
  }
  return hayAmpliacion;
}
 
/************************************************************************************ */
function ampliarEscalera(jugador){
  if (traza) console.log(num_traza++ + " Busco AmE");
  var fichasJugador = [...filaJugador.cells];
  var fichasMaquina = [...filaMaquina.cells];
  limpiaFila(fichasJugador);
  limpiaFila(fichasMaquina);
  if (jugador) fichas = fichasJugador; else fichas = fichasMaquina;
  var hayAmpliacionEsc = false;
  var tablaMesa = document.getElementById("tablaMesa");
  var e3Mesa = [...tablaMesa.rows].filter(el => el.id.startsWith("E")); // si empiezan por E son escaleras >= 3
  var arrVal = [];
  if (e3Mesa.length > 0) {
    var tamanyos =    e3Mesa.map(el => el.id.split('-')[1]);
    var valoresIni =  e3Mesa.map(el => el.id.split('-')[2]);
    var colores =     e3Mesa.map(el => el.id.split('-')[3]); 
    for (let i = 0; i < e3Mesa.length; i++) {
      if (hayAmpliacionEsc) break;
      var izda= false; 
      var dcha = false;
      for (var j = 0; j < fichas.length; j++) {
        izda = (fichas[j].innerHTML == (Number(valoresIni[i]) - 1));
        dcha = (fichas[j].innerHTML == (Number(valoresIni[i]) + Number(tamanyos[i])))
        if ((izda || dcha ) && (fichas[j].style.color === arrayColores[colores[i]])) {
          arrVal[0] = fichas[j].id.substr(1); // marcarFichas() necesita un array
          var codigoGrupoMesa = e3Mesa[i].id;
          var lado = izda?"izda":"dcha";
          marcarFichas("A", arrVal, jugador, codigoGrupoMesa, lado);
          hayAmpliacionEsc = true;
          break;
        }
      }
    }
  }
  if (hayAmpliacionEsc && jugador) {
    // var textoJ = document.getElementById("textoJugador");
    textoJ.innerHTML = "TURNO JUGADOR: Amplia la escalera de la mesa haciendo doble click sobre la ficha en tu mano"
  }
  return hayAmpliacionEsc;
}


// *******************************************************************************************
// Cuando se encuentra un grupo: S3, S4, E3, E4, etc. Se marca visualmente para que
// el jugador (o comp) remate haciendo doble click en el grupo marcado
// groupType: s: Serie de 2; e: Esc de 2; S: serie > 2; E: esc > 2; A:amplia grupo en mesa; C: Corte en mesa
// group: número de grupo global
// jugador (booleano): marca las fichas del jugador o de la máquina
// codigoGrupoMesa: nuevo código del grupo de la mesa que aporta fichas después de la jugada
function marcarFichas(groupType, group, jugador, codigoGrupoMesa, lado, fichaDeLaMesa) {
  if (traza) console.log("         marcadas " + group);

  var ficha;
  var unomenos = 0
  // en los duos, el tercer elemento es de la mesa
  if ((groupType == 's') || (groupType == 'e') || (groupType == 'C')) {unomenos = 1;}

  for (let i = 0; i < (group.length - unomenos); i++) {
    if (jugador) {ficha = document.getElementById('F' + group[i]);}
    else  {ficha = document.getElementById('C' + group[i]);}
    ficha.classList.add('marcada');  //marcado visual
    ficha.setAttribute("gType", groupType); // s,e,S,E,A
    ficha.setAttribute("numGrupo", numGrupo); // id único de grupo
    ficha.setAttribute("grupoMesa", codigoGrupoMesa); // amplía un grupo en la mesa
    if ((groupType == 'A') || (groupType == 'C') || (groupType =='e')) {
      ficha.setAttribute("lado", lado);
    }      
  }
  if ((groupType == 'A') || (groupType =='C') ) {
    var fichasMesa = [...document.getElementById(codigoGrupoMesa).cells]; 
    for (let j = 0; j < fichasMesa.length; j++) {
      fichasMesa[j].classList.add("marcasuave");
    }
  }
  if ((groupType == 's') || (groupType == 'e')) {
    // en este caso se ha pasado como parámetro la ficha de la mesa implicada
    fichaDeLaMesa.classList.add('marcasuave');  
    fichaDeLaMesa.setAttribute("gType", groupType);
    fichaDeLaMesa.setAttribute("numGrupo", numGrupo);
  }
  numGrupo++;
}


/*********************************************************************************** */
  function sugerirJugada() {
    var bs = buscarSeries(true);
    var ns = bs.split("-")[0] == "S"? bs.split("-")[1]:0;
    var be = buscarEscaleras(true);
    var ne = be.split("-")[0] == "E"? be.split("-")[1]:0;
    
    if (ne > ns) buscarEscaleras(true);
    else buscarSeries(true);

    if ((ne == 0) && (ns == 0)) {
      if (!ampliarEscalera(true)) 
        if (!ampliarSerie(true))
          if (!buscarCortes(true)) {
            //var textoJ = document.getElementById("textoJugador");
            textoJ.innerHTML = "TURNO JUGADOR: No hay ninguna jugada con las fichas de tu mano"
          }
    }
}
    

/*********************************************************************************** */
/*********   El computador calcula su jugada *************************************** */
/*********************************************************************************** */
function jugadaComp() {
  var stop;
  var directo = true;// hay que robar

  for (let stop = 8; stop; stop--) { // 8 es una salvaguarda para que no se hagan inf iteraciones
    var bs = buscarSeries(false);
    var ns = bs.split("-")[0] == "S"? bs.split("-")[1]:0;
    var be = buscarEscaleras(false);
    var ne = be.split("-")[0] == "E"? be.split("-")[1]:0;
    if (ne > ns) {
      buscarEscaleras(false);
    } else {
      buscarSeries(false);
    }
    if (ne == 0 && ns == 0) {
      console.log("no Ser y Esc");
      if (!ampliarEscalera(false)) {
        console.log("no AmEsc");
        if (!ampliarSerie(false))  {
          console.log("no AmSer");
          if (!buscarCortes(false)) {
            console.log("no Cortes");
            textoJ.innerHTML = "TURNO COMPUTADOR: pulse en CAMBIO para pasar el turno al jugador";
            // if (directo) {robarFicha();}
           return;
          } else textoJ.innerHTML = "TURNO COMPUTADOR: amplío serie";
        } else textoJ.innerHTML = "TURNO COMPUTADOR: amplío escalera<<";
      } else textoJ.innerHTML = "TURNO COMPUTADOR: corte";
    }
    directo = false;
    //alert("jugada encontrada");
    seleccionarGrupo.call(buscaMarca());
    // retrasaSeleccion();
    // function retrasaSeleccion() {setTimeout(hazClick,1000);}
    // function hazClick(){seleccionarGrupo.call(buscaMarca())}
  } // for
}


//*************************************************************************** */
function  buscaMarca() {
  var fichas = [...filaMaquina.cells];
  var fichaMarcada = fichas.find(f => f.className == 'figuraFicha marcada');
  return fichaMarcada;
}

//************************************************************************** */
// Busca en los grupos de la mesa que lo permiten puntos de corte para jugar
function buscarCortes(jugador) {
  var tablaMesa = document.getElementById("tablaMesa");
  var EMesa = [...tablaMesa.rows].filter(el => el.id.startsWith("E"));
  var cortesI;
  var cortesD;
  var ci = 0;
  var cd = 0;
  var cortadoIzda = false;
  var cortadoDcha = false;
  var codJ;
  if (traza) console.log(num_traza++ + " Busco Cortes");

  filaJugador = document.getElementById("filaJugador");
  filaMaquina = document.getElementById("filaMaquina");

  EMesa = EMesa.filter(el => !el.id.startsWith("E-3"));
  var arrJ;
 if (jugador) arrJ = filaFichasAArrayCodigos(filaJugador);
 else arrJ = filaFichasAArrayCodigos(filaMaquina);
  ordenar(arrJ);
  for (let i = 0; i < arrJ.length; i++) {
    for (var ff = 0; ff < EMesa.length; ff++) {
      var arrGM =filaFichasAArrayCodigos(EMesa[ff]);

      for (let k = 1; k <= Math.floor((arrGM.length-1)/2); k++) {// cortes por la izda
        if (!cortadoIzda) {
          if (k == 1) {
            if ((arrJ[i] == (arrGM[1]))  && (arrJ[i+1] == arrGM[2])) { 
              cortesI= 1;
              codJ = i;
              cortadoIzda = true;
              break;
            }
          } else {
            if (arrJ[i] == (arrGM[k])) {
              cortesI = k;
              codJ = i;
              cortadoIzda = true;
              break;
            }
          }
        }
      }

      if (!cortadoIzda) {
        for (let k = 1; k <= Math.floor((arrGM.length-1)/2); k++) { // cortes por la dcha
          if (k == 1) {
            if ((arrJ[i] == (arrGM[arrGM.length - 3]))  && (arrJ[i+1] == arrGM[arrGM.length -2])) {
              cortesD = arrGM.length - 1;
              codJ = i;
              cortadoDcha = true;
              break;
            }
          } else {
            if (arrJ[i] == (arrGM[arrGM.length - k-1])) {
              cortesD = arrGM.length - k;
              codJ = i;
              cortadoDcha = true;
              break;
            }
          }
        }
      }

      if (!cortadoIzda && !cortadoDcha) {
        if (((arrGM.length % 2) == 0) && (arrGM.length > 5)) {  // corte mitad y mitad, ampl dcha
          if ((arrJ[i] == (arrGM[(arrGM.length / 2) - 1]))) {
            cortesD = arrGM.length / 2;
            codJ = i;
            cortadoDcha = true;
            break;
          } else if ((arrJ[i] == (arrGM[arrGM.length / 2]))) { // corte mitad y mitad, ampl izda
            cortesI = arrGM.length / 2;
            codJ  = i;
            cortadoIzda = true;
            break;
          }  
        }
      }
      
        var ficha1, ficha2;
        var unomenos = 0;
        // en los duos, el tercer elemento es de la mesa
       
        if  (cortadoIzda || cortadoDcha) {
          ficha1 = document.getElementById((jugador?'F':'C') + arrJ[codJ]);
          ficha1.classList.add('marcada');  //marcado visual
          ficha1.setAttribute("gType", 'C');
          ficha1.setAttribute("numGrupo", numGrupo); // id único de grupo
          ficha1.setAttribute("grupoMesa", EMesa[ff].id); // amplía un corte en la fila der la mesa
          ficha1.setAttribute("lado", (cortesI?'izda':'dcha'));
          ficha1.setAttribute("cortes", cortesI?cortesI:cortesD);
          if (cortesD == 1 || cortesI == 1){
            ficha2 = document.getElementById('F' + arrJ[codJ + 1]);
            ficha2.classList.add('marcada');  //marcado visual
            ficha2.setAttribute("gType", 'C');
            ficha2.setAttribute("numGrupo", numGrupo); // id único de grupo
            ficha2.setAttribute("grupoMesa", EMesa[ff].id); // amplía un corte en la fila de la mesa
            ficha2.setAttribute("lado", (cortesI?'izda':'dcha'));
            ficha1.setAttribute("cortes", (cortesI?cortesI:cortesD));
          }
        }
        if  (cortadoIzda || cortadoDcha) break;
      }  
      if  (cortadoIzda || cortadoDcha) break;
      // if (cortadoIzda) console.log("Elemento " + i +" del jug con las escalera " + ff + " de la mesa hay " + cortesI + " cortes Izda.");
      // if (cortadoDcha) console.log("Elemento " + i +" del jug con las escalera " + ff + " de la mesa hay " + cortesD + " cortes Dcha.");
      // cortesI = 0; ci=0; cortadoIzda = false;
      // cortesD = 0; cd=0; cortadoDcha = false;
  }  
  if (cortesI) {
    for (let j = 0; j < cortesI; j++) {
      EMesa[ff].cells[j].classList.add("marcasuave");
    }
  } else if (cortesD) {
    for (let j = cortesD; j < EMesa[ff].cells.length; j++) {
      EMesa[ff].cells[j].classList.add("marcasuave");
    } 
  }
  numGrupo++;
  if (cortesD || cortesI) {
    if (jugador) {textoJ.innerHTML = "TURNO JUGADOR: Modifica el grupo de la mesa haciendo doble click sobre la ficha en tu mano";}
    return true;
  } else return false;
}
   
//*****************************************************************************
var modoCorte = false;
function seleccionarCorte() {
  textoJ.innerHTML = "TURNO JUGADOR: modo MESA salga de este modo con ACEPTAR o CANCELAR";
  if (!modoCorte) {
    modoCorte = true;
    copiarTabla();
    document.getElementById("aceptarCorte").style.display = "inline";
    document.getElementById("cancelarCorte").style.display = "inline";
    document.getElementById("Cambio").style.display = "none";
    document.getElementById("Jugada").style.display = "none";
  }

  seleccion.push(this); 
  this.classList.add("marcasuave");
  
  this.addEventListener("dblclick",  moverCorte);
  hermano =  this.nextElementSibling;
  while (hermano) {
    hermano.classList.add("marcasuave");
    seleccion.push(hermano);
    hermano.addEventListener("dblclick",  moverCorte);
    hermano =  hermano.nextElementSibling;
  }
}


//*****************************************************************************
function moverCorte(){
  var filaMesaOrig = this.parentElement; 
  var tablaMesa = document.getElementById("tablaMesa");
  var filaMesaDest = tablaMesa.insertRow(tablaMesa.length);
  var filaMesaDest = document.createElement("tr");
  tablaMesa.appendChild(filaMesaDest);
  
  f = seleccion.shift();
  while(f) {
    filaMesaDest.appendChild(f);
    f = seleccion.shift();
  }
  marcarFilaMesa(filaMesaOrig, 'X');
  marcarFilaMesa(filaMesaDest, 'X');
}


//*****************************************************************************
function aceptarCorte() {
  modoCorte = false;
  document.getElementById("aceptarCorte").style.display = "none";
  document.getElementById("cancelarCorte").style.display = "none";
  document.getElementById("Cambio").style.display = "inline";
  document.getElementById("Jugada").style.display = "inline";

}


function cancelarCorte() {
  modoCorte = false;
  document.getElementById("aceptarCorte").style.display = "none";
  document.getElementById("cancelarCorte").style.display = "none";
  document.getElementById("Cambio").style.display = "inline";
  document.getElementById("Jugada").style.display = "inline";
  reponerTabla();
}

//************************************************************************** */
//************************************************************************** */
//******************        FUNCIONES AUXILIARES        ******************** */
//************************************************************************** */
//************************************************************************* */

// ***************************************************************************
// Convierte codificación por color en codif por valor
// Codificación por valor para buscar series
// Ejemplo: 1103 es una ficha del número 11 y color 3
// los duplicados se codifican de forma especial
function codifValor(arrCo) {
  let val;
  let col;
  let arrVa = arrCo.slice();
  for (let i = 0; i < arrVa.length; i++) {
 
    col = Math.floor(arrCo[i] / 100);
    val = arrCo[i] % 100;
    if (val >= 20) {
      arrVa[i] = (val - 20) * 100 + col + 20;
    } else {
      arrVa[i] = val * 100 + col;
    }
 }
  return arrVa;
}


// ********************************************************************************************
// Convierte codificación por valor en codif por color (xColor)
// Ejemplo: 311 es una ficha del valor 11 y color 3
// los duplicados se codifican de forma especial
// Si DesDup se quita esta codifificacion especial
function codifColor(arrVa, desDup) {
  let val;
  let col;
  let arrCo = arrVa.slice();
  for (let i = 0; i < arrVa.length; i++) {
    val = Math.floor(arrVa[i] / 100);
    col = arrVa[i] % 100;
    if (col >= 20) {
      if (desDup)
       arrCo[i] = (col - 20) * 100 + val;
      else 
      arrCo[i] = (col - 20) * 100 + val + 20;
    } else {
      arrCo[i] = col * 100 + val;
    }
  }
  return arrCo;
}


// ****************************************************************************
// Obtiene el código del grupo que hay en la MESA. Se supone que el array que se pasa
// contiene una Serie o una Escalera en codifificacion "xColor" y ordenada  
function obtenerCodigo(arr) {
  var colorExcl = 3;
  if ((arr[1] % 100) != (arr[0] % 100)) {  // es una escalera
    codigo = "E-" + arr.length + "-" + arr[0] % 100 + "-" +  Math.floor(arr[0] / 100);
  } else {  // es una serie
    codigo = "S-" + arr.length + "-" + arr[0] % 100 + "-";
    if (arr.length == 3){ // si es una S-3 hay que calcular el color excluido
      for (let i = 0; i < 3; i++) {
        if ( Math.floor(arr[i] / 100) != i) {
          colorExcl = i; break;
        }
      }
      codigo = codigo + colorExcl;
    } 
  }
  return codigo; 
}

//************************************************************************** */
// Genera una traza de los cambios en la mesa y los imprime en la consola
function trazaMesa() {
  var tablaMesa = document.getElementById("tablaMesa");
  var gruposMesa = [...tablaMesa.rows];
  for (let i = 1; i < gruposMesa.length; i++) {
    console.log(gruposMesa[i].id);
    console.log(filaFichasAArrayCodigos(gruposMesa[i]));
  }
}

//******************************************************************************/
// convierte una fila de fichas (fila de una tabla HTML) en un array de enteros
// codificada xcolor
 function filaFichasAArrayCodigos(fila) {
  return [...fila.cells].map(el => el.id.substr(1));
 }

//******************************************************************************/
 // reinicializa el formato de una fila de la MESA 
 // y le añade su id correcto
 function marcarFilaMesa(fila, tipo) {
  var fichas = fila.cells;
  if (fichas.length < 3 ) textoJ.innerHTML = "complete el grupo " + fichas;
  for (let i=0; i < fichas.length; i++) {
    fichas[i].classList.remove('error', 'marcada', 'permiso', 'marcasuave');
    hazNoDropable(fichas[i]);
    //fichas[i].draggable = "true";
    fichas[i].setAttribute("ondragstart", "dragStartMesa(event)");
    fichas[i].addEventListener("click",  seleccionarCorte);
  }
  hazDropable(fichas[0]);
  hazDropable(fichas[fichas.length-1]);
  fila.id = obtenerCodigo(filaFichasAArrayCodigos(fila));
  if (tipo == 'X') {
    fila.id = 'X' + fila.id;
  } else if (tipo != 'I') {
    fichaJugada = true;
    document.getElementById("Cambio").innerHTML="Cambio turno";
    document.getElementById("Cambio").classList.remove("btn-danger");
    document.getElementById("Cambio").classList.add("btn-primary");
    textoJ.innerHTML = "TURNO JUGADOR: arrastre fichas de la mano del jugador o pida sugerencia de juego";
}
 }
 /* ****************************************************************************** */
function limpiaFila(fichas) {
  for (let i = 0; i < fichas.length; i++ ) {
      fichas[i].classList.remove('error', 'marcada', 'permiso', 'marcasuave');
      fichas[i].removeAttribute("gType");
      fichas[i].removeAttribute("numGrupo");
      fichas[i].draggable = "true";
      fichas[i].setAttribute("ondragstart", "dragStart(event)");
      hazNoDropable(fichas[i]);
  } 
}   


// ****************************************************************************
// quita la codificacion +20 de los duplicados
function desDuplicador(arr){
  var arrDes = arr.slice();
  for (let i = 0; i < arr.length; i++) {
    val = arr[i] % 100;
    col = Math.floor(arr[i] / 100);
    if (val >= 20) {val -= 20;}
    arrDes[i] = col*100 + val;
  }  
  return arrDes;
}

/******************************************************************************/
function ordenar(arr) {  
  arr.sort(function (a, b) {
      return a - b;
    });
  }

/******************************************************************************/
function esSerie(arr) {
  if (arr.length > 4) return false;
   var serie = true;
   ordenar(arr);
   var color = arr.map(el => Math.floor(el / 100));
   var valor = arr.map(el => el % 100);
  
  for (let i = 0; i < arr.length-1; i++) {
    if (valor[i] != valor[i+1]) {return false;}
    else if (color[i] == color[i+1]) {return false;}
  }
  return true
}

/******************************************************************************/
// ordenar una fila de la mesa segun la ordenación de una array
// no tiene en cuenta los demás atributos
function ordenarFila(arr, fila) {
  var filaArr = [...fila.cells];
  for (let i =0 ; i < arr.length; i++) {
    filaArr[i].id = "M" + arr[i];
    filaArr[i].innerHTML = arr[i] % 100;
    filaArr[i].style.color = arrayColores[Math.floor(arr[i] / 100)];
  }
}


 /******************************************************************************/
 function esEscalera(arr) {
   ordenar(arr);
   var color= arr.map(el => Math.floor(el / 100));
   var valor = arr.map(el => el % 100);
   for (let i = 0; i < arr.length-1; i++) {
     if (valor[i] != valor[i+1] - 1) {return false;}
     if (color[i] != color[i+1]) {return false;}
    }
    return true;
  }
  

//*****************************************************************************
function copiarTabla() {
 
  // if (!modoCorte) {
    var tablaDest = document.getElementById('tablaDest');
    var tablaMesa = document.getElementById('tablaMesa');
    var filaJugador = document.getElementById('filaJugador');

   // cancelable = true;
    numrows = tablaDest.rows.length;
    for (let i = 0; i < numrows; i++) {
      tablaDest.deleteRow(0);
    }
    for (let i = 0; i < tablaMesa.rows.length; i++) {
      var row = tablaDest.insertRow(-1);
      row.id = tablaMesa.rows[i].id;
      for (let j = 0; j < tablaMesa.rows[i].cells.length; j++ ) {
        var cell = row.insertCell(-1);
        cell.id = tablaMesa.rows[i].cells[j].id;
        cell.innerHTML = tablaMesa.rows[i].cells[j].innerHTML;
        cell.style.color = tablaMesa.rows[i].cells[j].style.color;
      }
    }

    // copio tb la fila del Jugador
 
    filaJ = document.createElement("tr");
    document.getElementById("tablaJugador").appendChild(filaJ);
    filaJ.style.display = "inline";
    filaJ.id = "filaJugadorBis";
    for (let j = 0; j < filaJugador.cells.length; j++ ) {
        var cell = filaJ.insertCell(-1);
        cell.id = filaJugador.cells[j].id;
        cell.innerHTML = filaJugador.cells[j].innerHTML;
        cell.style.color = filaJugador.cells[j].style.color;
    }     
  }



function reponerTabla() {

  // if (!cancelable) {
  //   textoJ.innerHTML = "TURNO JUGADOR: operación no cancelable";
  //   return;
  // }
  // cancelable = false;
  var tablaDest = document.getElementById('tablaDest');
  var tablaMesa = document.getElementById('tablaMesa');
  
  var numrows = tablaMesa.rows.length;
  var numrowsDest = tablaDest.rows.length;
  for (let i = 0; i < numrows; i++) {
    tablaMesa.deleteRow(0);
  }
  for (let i = 0; i < numrowsDest; i++) {
    var row = tablaMesa.insertRow(-1);
    row.id = tablaDest.rows[i].id;
    if (i==0) row.style.display = 'none'
    for (let j = 0; j < tablaDest.rows[i].cells.length; j++) {
      var cell = tablaMesa.rows[i].insertCell(-1);
      cell.id = tablaDest.rows[i].cells[j].id;
      cell.innerHTML = tablaDest.rows[i].cells[j].innerHTML;
    cell.style.color = tablaDest.rows[i].cells[j].style.color;
    cell.className = "figuraFicha";
    }
    marcarFilaMesa(row);
  }

  var filaJugador = document.getElementById('filaJugador');
  var filaJugadorBis = document.getElementById('filaJugadorBis');
  

  var long = filaJugador.cells.length;
  for (let i = 0; i < long; i++)
    filaJugador.deleteCell(0);


    for (let j = 0; j < filaJugadorBis.cells.length; j++) {
      var cell = filaJugador.insertCell(-1);
      cell.id = filaJugadorBis.cells[j].id;
      cell.innerHTML = filaJugadorBis.cells[j].innerHTML;
    cell.style.color = filaJugadorBis.cells[j].style.color;
    cell.className = "figuraFicha";
    }

    limpiaFila(filaJugador.cells);
    textoJ.innerHTML = "TURNO JUGADOR: operación cancelada";
  }




// ****************************************************************************
var compVisible=false;
function mostrarManoComutador() {
  if (compVisible) {
    document.getElementById("tablaMaquina").style.display = "none";
    document.getElementById("MMC").innerHTML = "Ver mano computador";
  }
  else {
    document.getElementById("tablaMaquina").style.display = "inline";
    document.getElementById("MMC").innerHTML = "Ocultar";
  }
  compVisible = !compVisible;
}

// ****************************************************************************
var botonesJugadasVisibles = false;
function verBotonesJugadas() {
  if (botonesJugadasVisibles) {
    document.getElementById("botonSeries").style.display = "none";
    document.getElementById("botonEscaleras").style.display = "none";
    document.getElementById("botonAmpS").style.display = "none";
    document.getElementById("botonAmpE").style.display = "none";        
    document.getElementById("buscarCortes").style.display = "none" ;  
  }
  else {
    document.getElementById("botonSeries").style.display = "inline";
    document.getElementById("botonEscaleras").style.display = "inline";
    document.getElementById("botonAmpS").style.display = "inline";
    document.getElementById("botonAmpE").style.display = "inline";        
    document.getElementById("buscarCortes").style.display = "inline"; 
  }
  botonesJugadasVisibles = !botonesJugadasVisibles;
}



