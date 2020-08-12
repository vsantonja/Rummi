const arrayColores = ["black", "red", "blue", "magenta"];
var filaMesa;
var arrayMesa;
var fm;

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
//   ev.target.classList.add('over');
// }

function dragStart(ev) { 
  ev.dataTransfer.setData("text", ev.target.id);
  fm=ev.target.id;
}


///////////////////////////////////////////////////////////////////

//Asociado al evento dragover
function allowDrop(ev) { 
  var fichaMovil = document.getElementById(fm);
  var filaMesa = ev.target.parentElement;
  var arr = [];
  if (ev.target.tagName == "TD") {  // el jugador amplia un grupo prexistente 
    arr = filaFichasAArrayCodigos(filaMesa);
    arr = arr.concat(fichaMovil.id.substr(1)); 
  }
  if (validaSim(arr) != -1) {
    ev.preventDefault();
    ev.target.classList.add('over');
  } else {
    ev.target.classList.add('error');
  }
}

  
/////////////////////////////////////////////////////////////////////

function dragDrop(ev) { 
  var data = ev.dataTransfer.getData("text");
  var fichaMovil = document.getElementById(data);
  ev.preventDefault(); 
  //fichaMovil = hazDropable(fichaMovil);
  fichaMovil.id = "M" + data.substr(1);
  if (ev.target.tagName == "TD") {  // el jugador amplia un grupo prexistente 
    //Si solo había una ficha en la fila las pongo ordenadas
    var filaMesa = ev.target.parentElement;
    if (filaMesa.cells.length == 1) { 
      if ((data.substr(1) - ev.target.id.substr(1)) < 0) {
        filaMesa.insertBefore(fichaMovil, ev.target);
      } else {
        filaMesa.appendChild(fichaMovil); 
      }
    // si en la fila había 2 o más fichas
    } //else if (ev.target === (filaMesa.firstElementChild)) {
    else if (ev.target.innerHTML < filaMesa.firstElementChild.innerHTML) {
        filaMesa.insertBefore(fichaMovil, ev.target);
      } else {
         filaMesa.appendChild(fichaMovil);
      }     
    ev.target.classList.remove('error', 'marcada', 'over', 'marcasuave');
    hazNoDropable(ev.target);
    removeStyle(ev);
  }
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
  var divMesa = document.getElementById("zonaMesa");
  if (filaMesa.cells.length < 3) {
    divMesa.innerHTML = "Siga arrastrando fichas para componer un grupo";
  } else {
    arr =filaFichasAArrayCodigos(filaMesa);
    if (esSerie(arr)){ 
      filaMesa.id=obtenerCodigo(arr);
      divMesa.innerHTML = "GRUPO VÁLIDO.Siga arrastrando fichas para componer otra grupo";
      ordenarFila(arr,filaMesa);
    }  
    else if (esEscalera(arr)) { 
      filaMesa.id = obtenerCodigo(arr);
      divMesa.innerHTML = "GRUPO VÁLIDO.Siga arrastrando fichas para componer otra grupo";
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
    if ((arr[0] % 100) == (arr[1] % 100)) {
      if (arr[0] == arr[1]) {return -1;}
    }
    else if (Math.abs((arr[0] % 100) - (arr[1] % 100)) == 1) {
      if (Math.floor(arr[0]  / 100) != Math.floor(arr[1] / 100)) {return -1;}
    } else {return -1;}
  }
}
  


/////////////////////////////////////////////////////////////////

function dragDropFin(ev) { 
    ev.preventDefault(); 
    var data = ev.dataTransfer.getData("text");
    var fichaMovil = document.getElementById(data);
    var ultimaFila = document.createElement("tr");
    var tablaMesa = document.getElementById("tablaMesa").lastElementChild;
    tablaMesa.appendChild(ultimaFila);
    ultimaFila.appendChild(hazDropable(document.getElementById(data)));
    ev.target.removeAttribute("style");
    removeDragParams(ev, fichaMovil);
    filaMesa = ultimaFila;
    filaMesa.id = "X-filaMesa";
    fichaMovil.id = "M" + data.substr(1);
}


function removeStyle(ev) {
  if (ev.target.tagName == "TD"){
     ev.target.classList.remove('over', 'error');  
  }
  else if (ev.target.tagName == "DIV") {}    
}


function removeDragParams(ev,ficha) {
    console.log('Removing drag data')
  
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
{ var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
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
  var arraySaco = [];
  var figuraFicha;
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
  } else if (prueba == 1) {
    arraySaco = [101,108,203,202,201,207,9,10,
      103,303,106,306,106,109,203,6,206,204,107,205,206,13,
      103,006,302,110,105,103,112,203,203,303,107,213,213,308];
    arrayMesa =[
            [110, 210, 310],           // una serie de 3 dieces
            [1, 2, 3, 4, 5, 6, 7, 8],  // una esc de negros
            [203, 204, 205]            // escalera azul
      ]
     
  } else {  // prueba > 1
    arraySaco = [101,108,203,2,201,302,103,
      8,101,102,302,105,106,103,4,202,204,204,2,205,206,
      103,006,302,110,105,103,112,203,203,303,107,213,213,308];
  }
    //conversión de números a fichas
  for (let c = 0, i=0; c < 8; c++) {// 8 filas
    if (i == arraySaco.length) break;
    filaSaco = this.document.createElement("tr");
    tablaSaco.appendChild(filaSaco);
    for (let f = 0; f < 13; f++) {
      // 13 filas 8*13 = 104 fichas
      if (i == arraySaco.length) break;
      figuraFicha = this.document.createElement("td");
      figuraFicha.className = "figuraFicha";
      figuraFicha.addEventListener("dblclick",  seleccionarGrupo);
      figuraFicha.innerHTML = arraySaco[i] % 100;
      figuraFicha.id = 'S' + arraySaco[i];
      figuraFicha.style.color = arrayColores[Math.floor(arraySaco[i] / 100)];
      filaSaco.appendChild(figuraFicha);
      i++;
    }  
    fichasSaco = fichasSaco.concat([...filaSaco.cells]);
    tablaSaco.style.display =  "none";
  }  
  repartirFichas();
  // Si hay fichas en la mesa, ponlas. Esto solo ocurre en fase de DESARROLLO
  // para reproducir determinados escenarios
  var tablaMesa = document.getElementById("tablaMesa").firstElementChild;
  if (arrayMesa)  {      // si está definido en inicio()
    for (let i = 0; i < arrayMesa.length; i++){
      filaMesa = document.createElement("tr");
      filaMesa.id = obtenerCodigo(arrayMesa[i]);
      tablaMesa.appendChild(filaMesa);
       for (let j = 0; j < arrayMesa[i].length; j++){
        figuraFicha = this.document.createElement("td");
        figuraFicha.className = "figuraFicha";
        figuraFicha.innerHTML = arrayMesa[i][j] % 100;
        figuraFicha.id = 'M' + arrayMesa[i][j];
        figuraFicha.style.color = arrayColores[Math.floor(arrayMesa[i][j] / 100)];
        //la primera y última ficha de cada fila son dropables
        // if (j==0 || j == (arrayMesa[i].length-1)) { 
        //   figuraFicha = hazDropable(figuraFicha);
        // }
        filaMesa.appendChild(figuraFicha);
      }
      marcarFilaMesa(filaMesa);
    }
  }
 // solo se reparte una vez. Así que escondo los botones de reparto
  document.getElementById("botonRepartir" ).style.visibility = "hidden";  
  document.getElementById("botonRepartir1").style.visibility = "hidden";  
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
    figuraFicha = fichasSaco.pop()
    figuraFicha.id = 'F' + figuraFicha.id.substr(1); 
    figuraFicha.draggable = "true";
    figuraFicha.setAttribute("ondragstart", "dragStart(event)");
    filaJugador.appendChild(figuraFicha);
  }
  document.getElementById("letreroComputador").style.display = "none";
  tablaMaquina.style.display = "none";
 }


 /******************************************************************************/
 function filaFichasAArrayCodigos(fila) {
  return [...fila.cells].map(el => el.id.substr(1));
 }

/******************************************************************************/
function ordenarFila(arr, fila) {
 
  var filaArr = [...fila.cells];
  for (let i =0 ; i < arr.length; i++) {
    filaArr[i].id = "M"+arr[i];
    filaArr[i].innerHTML = arr[i] % 100;
    filaArr[i].style.color = arrayColores[Math.floor(arr[i] / 100)];
  }
}

/******************************************************************************/
  function ordenar(arreglo) {  
  arreglo.sort(function (a, b) {
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

// ********************************************************************************************
// Obtiene el código del grupo que hay en la Mesa. Se supone que el array que se pasa
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

/******************************************************************************** */
function seleccionarGrupo() {
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

  if (groupType != 'S' && groupType != 'E' && groupType != 'A' && groupType !='s' && groupType !='e') { //no se ha clicado en una serie o un grupo o ampli
    return;
  }
  
  fichas = [...filaJugador.cells];

  if (groupType == 'A') { 
  //  var grupoMesa = this.getAttribute("grupoMesa");
  var filaMesa =  document.getElementById(grupoMesa);

    ////this.classList.remove('marcada');

    var primero = filaMesa.firstChild;
    this.setAttribute("numGrupo", primero.getAttribute("numGrupo"));

    if (this.getAttribute('lado') == 'izda') {   // solo en las escaleras importa el lado de inserción
      filaMesa.insertBefore(this, primero);
      this.id = 'M' + this.id.substr(1);

      filaMesa.id = 'E-'+ (Number(grupoMesa.split('-')[1]) + 1) + "-" 
                        + (Number(grupoMesa.split('-')[2]) - 1) + "-" 
                        + grupoMesa.split('-')[3];
    } else if (this.getAttribute("lado") == "dcha") {
        filaMesa.appendChild(this);
      this.id = 'M' + this.id.substr(1);
      this.setAttribute("gType", 'E');
      filaMesa.id = 'E-'+ (Number(grupoMesa.split('-')[1]) + 1)  + "-" 
                          + grupoMesa.split('-')[2] + "-" 
                          + grupoMesa.split('-')[3];
    } else {
        filaMesa.appendChild(this);
        this.id = 'M' + this.id.substr(1);
        this.setAttribute("gType", 'S');
        filaMesa.id=  'S-4-' + grupoMesa.split('-')[2];
    }
    this.removeAttribute("lado");
    this.removeAttribute("gType");
    this.removeAttribute("numGrupo");
    this.removeAttribute("grupoMesa");
  } else { //groupTypes S y E
    var tablaMesa = document.getElementById("tablaMesa");
    filaM = document.createElement("tr");
    tablaMesa.appendChild(filaM);

  // recorro la fichas del panel del jugador-comp para ver las que forman parte de mi grupo
  for (let i = 0; i < fichas.length; i++) {
    if (fichas[i].getAttribute("numGrupo") == numGrupo) {
      var color = arrayColores.indexOf(fichas[i].style.color);
      delete colorExcl[colorExcl.indexOf(color)];
      if (valorIni == -1) {valorIni = fichas[i].innerHTML;}
      tam++;
      filaM.appendChild(fichas[i]);
      fichas[i].classList.remove('marcada');
      fichas[i].removeAttribute("gType");
      fichas[i].removeAttribute("numGrupo");
      fichas[i].id ='M' + fichas[i].id.substr(1);
      // las series de 4 no se pueden ampliar
      //nuevoCodigoS3Mesa = 
      filaM.id = "S-3-"
    } 
  }
    if (groupType == 's'|| groupType == 'e')  {
      fichaMesa = [...document.getElementsByClassName('marcasuave')]; 
      fichaMesa = fichaMesa.filter(el => el.getAttribute('numGrupo') == numGrupo );// solo PUEDE haber 1
      filaVella = fichaMesa[0].parentElement;
      if (fichaMesa[0].getAttribute('lado') == 'izda') {  // es 'e'
        filaM.insertBefore(fichaMesa[0], filaM.firstChild);
      } else {
        filaM.appendChild(fichaMesa[0]);
      }
      //fichaMesa[0].parentElement.id = obtenerCodigo(filaFichasAArrayCodigos(fichaMesa[0].parentElement));
      marcarFilaMesa(filaVella);
      //fichaMesa[0].classList.remove("marcasuave");
      fichaMesa[0].grup = "S";
      //filaM.id ="S-3-" + valorIni + "-" + color;
    }

    if (groupType == "S") {
        colorSer = colorExcl.filter(e => typeof e == "number");
        codGrupo = "S-" + tam + "-" + valorIni + "-" + colorSer;
    } else if (groupType == 'E') {
      colorEsc = color;
      codGrupo = "E-" + tam + "-" + valorIni + "-" + colorEsc;
    }
    filaM.id = codGrupo;
    document.getElementById("textoJugador").innerHTML = "Propuesta de juego";
    document.getElementById("robarFicha").innerHTML = "Cambiar Turno";
  }
  marcarFilaMesa(filaM);
 }

// ************************************************************************
// esta función busca series cuyos componentes sean del mismo valor y distinto color
function buscarSeries(jugador) {
  var grupoValor = [];
  var grupoValorSinDups = [];
  var valorS = [];
  var valorS2 = [];
  
  var tamSer = [];
  var fichasPost = [];
  var series = []; // seriers de 3 o 4 fichas
  var s2 = []; // proto series de 2 fichas
  var nuevaserie = [];
  var ret = "0";

  var fichasJugador = [...filaJugador.cells];
  // primero, hacemos limpieza
  limpiaFila(fichasJugador);
  misFichas = fichasJugador.map(el => el.id.substr(1));
  maqFichas = [...filaMaquina.cells].map(el => el.id.substr(1));
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
    }
  } 

  var tablaMesa = document.getElementById("tablaMesa");
  var s4Mesa = [...tablaMesa.rows].filter(el => el.id.startsWith("S-4"));
  var cont = 0;
  var meVoy = false;
  for (var contS4 = 0; contS4 < s4Mesa.length; contS4++) { 
    if (meVoy == true) break
    for (var num of valorS2) {
      if (meVoy == true) break
      if ((valorS2[num] + 1)== s4Mesa[contS4].id.split('-')[2]) {
        for (var c=0; c < 4; c++) {
          if ((s2[num].find(el => el == Number(c * 100 + num + 1))) == undefined)  {
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
    figuraFicha= document.getElementById('F' + arr[i]);
   if (jugador) filaJugador.appendChild(figuraFicha);
   else filaMaquina.appendChild(figuraFicha);
  } 
  // códigos de retorno de buscarSerie (para toma de decisiones):
  // "S-4": lo + grande que hay son una o varias series de 4
  // "S-3": lo + grande que hay son una o varias series de 3
  // "S-2": lo + grande que hay son una o varias series de 2 que se pueden completar con una ficha del la mesa

  
  var textoJ = document.getElementById("textoJugador");
  if (cuentaS3 > 0) {
    var serMax = series.map(el => el.length).sort((a, b) => b - a)[0];
    for (let i of valorS) {
      marcarFichas("S", series[i], jugador);
      if (cuentaS3 == 1) {
        textoJ.innerHTML = "Juega la serie marcada";
        ret = "S-" + serMax;
      } else {
        textoJ.innerHTML = "Juega una de las series marcadas";
        ret = "S-" + serMax;
      }
    }
  } else if (cont > 0) {
    for (let i =0; i < nuevaserie.length; i++) {
      var nuevoCodigoS3Mesa = "S-3-" + num + "-" + c;
      marcarFichas("s", nuevaserie[i], jugador, nuevoCodigoS3Mesa);
      textoJ.innerHTML = "Juega la(s) serie(s) marcada(s) con una ficha de la mesa";
    } 
    ret = "S-2";
  } else {
    textoJ.innerHTML = "No hay ninguna serie en tu mano";
    //return ret;
  }
  return ret;
}


// ********************************************************************************************
// Esta función busca escaleras cuyos compenentes sean del mismo color
function buscarEscaleras(jugador) {
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
  fichasJugador = [...filaJugador.cells];
  limpiaFila(fichasJugador);
  
  misFichas = [...filaJugador.cells].map(el => parseInt(el.id.substr(1)));
  maqFichas = Number([...filaMaquina.cells].map(el => el.id.substr(1)));
  var fichas = jugador?misFichas:maqFichas;
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
  var textoJ = document.getElementById("textoJugador");
  var arr  = desDuplicador(fichasPost); // quita el +20 en los dups (ya no hace falta)
  // redibujo las fichas de Jugador o computador
  for (let i = 0; i < fichasPost.length; i++) {
    figuraFicha= document.getElementById('F' + arr[i]);
    filaJugador.appendChild(figuraFicha);
  }
// códigos de retorno de buscarEscaleras (para toma de decisiones):
  // "E-n": lo + grande que hay son una o varias esc de n
  // "E-2": lo + grande que hay son una o varias esc de 2 
  // que se pueden completar con una ficha del la mesa

  var escMax = escalera.map(el => el.length).sort((a, b) => b - a)[0];
  if (cuentaE3 > 0) {
    for (let i = 0; i < cuentaE3; i++) {
      marcarFichas("E", escalera[i], jugador);
      if (cuentaE3 == 1) { textoJ.innerHTML = "Juega la escalera marcada";
      ret = "E-" + escMax;
      } else { textoJ.innerHTML = "Juega una de las esaleras marcadas"; 
      }
    }
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
      var fichaAmover;
      var porIzda = false;
      var porDcha = false;
      if (posibleFichaIzda || posibleFichaDcha) {
        // si que esta, vamos a ver si esta en un lugar aprovechable
        for (let f = 0; f < gruposMesa.length; f++) {
          var fichasMesa = [...gruposMesa[f].cells];

          if (fichasMesa[0].id.substr(1) == fichaIzda) {
            fichaAmover = fichasMesa[0];
            porIzda = true;
          } else if (fichasMesa[fichasMesa.length-1].id.substr(1) == fichaIzda) {
            fichaAmover = fichasMesa[fichasMesa.length-1];
            porIzda = true
          } else if (fichasMesa[0].id.substr(1) == fichaDcha) {
            fichaAmover = fichasMesa[0];
            porDcha = true;
          } else if (fichasMesa[fichasMesa.length-1].id.substr(1) == fichaDcha) {
            fichaAmover = fichasMesa[fichasMesa.length-1];
            porDcha = true
          } else {
            fichaAmover = null;
            porDcha = false;
            porIzda = false
          }
          if (fichaAmover) {
            var cgm;
            var esS4 = gruposMesa[f].id.startsWith("S-4-");
            var esE = gruposMesa[f].id.startsWith("E-");
            var mayorQue3 = (gruposMesa[f].id.split("-")[1] > 3);
            if ( esS4 || (esE && mayorQue3)) {
              esc2[i][2] =  fichaAmover.id.substr(1);
              if (esE) cgm = "E-" + (gruposMesa[f].id.split("-")[1]-1) + "-";
              marcarFichas("e", esc2[i], jugador, cgm, (porIzda)?"izda":"dcha",fichaAmover);
            }
          }
        }
      
        textoJ.innerHTML = "Juega la escalera marcada (2 fichas) junto a una ficha de la mesa";
        ret = "E-2"
      } else  {ret = "-1";} 
    }
  } else {textoJ.innerHTML = "No hay ninguna escalera en tu mano";}
  return ret;
}


/* ****************************************************************************** */
function limpiaFila(fichas) {
  for (let i = 0; i < fichas.length; i++ ) {
      fichas[i].classList.remove('error', 'marcada', 'over', 'marcasuave');
      fichas[i].removeAttribute("gType");
      fichas[i].removeAttribute("numGrupo");
  } 
}    

/* ****************************************************************************** */
function robarFicha(jugador) {
    if (fichasSaco.length > 0) {
     var figuraFicha = fichasSaco.pop();
     figuraFicha.id = 'F' + figuraFicha.id.substr(1);
     figuraFicha.draggable = "true";
     figuraFicha.setAttribute("ondragstart", "dragStart(event)");
     filaJugador.appendChild(figuraFicha);
    }
    else alert ("El saco está vacío");
    var gruposMesa = [...document.getElementById("tablaMesa").rows];
    for (let i = 0; i < gruposMesa.length; i++) {
      if (gruposMesa[i].id.startsWith('X')) {
        var grupo = gruposMesa[i].cells;
        for (j=0; j < grupo.length; j++) {
          filaJugador.appendChild(grupo[j])
          if (grupo.length == 0) gruposMesa.deleteRow(i);
        }
      }
    }
  }
  
/******************************************************************************/

function ampliarSerie(jugador){
  var hayAmpliacion = true;
  var iter = 8;
  while (hayAmpliacion && iter) {
    iter--;
    const tablaMesa = document.getElementById("tablaMesa");
    var seriesMesa = [...tablaMesa.rows].filter(el => el.id.startsWith("S"));
    var s3Mesa = seriesMesa.filter(el => el.id.split('-')[1] ==3);
    hayAmpliacion = false;
    const filaJugador = document.getElementById("filaJugador");
    var fichasJugador = filaJugador.cells;
    var arr = [];
    if (s3Mesa.length > 0) {
      var colores =  s3Mesa.map(el => el.id.split('-')[3]);
      var valores =  s3Mesa.map(el => el.id.split('-')[2]);
      for (let i = 0; i < s3Mesa.length; i++) {
        if (hayAmpliacion) break;
        for (var j = 0; j < fichasJugador.length; j++) {
          if ((fichasJugador[j].innerHTML == valores[i]) &&
              (fichasJugador[j].style.color === arrayColores[colores[i]])) {
                // la ficha que amplía una S3 que ya está en la mesa se almacena en un array 
                // de codigos x color pq así lo exige "marcarFicha"
            arr[0] = fichasJugador[j].id.substr(1);
            var codigoGrupoMesa = "S-3-" + valores[i]+ "-" + colores[i]
            marcarFichas("A", arr, "true", codigoGrupoMesa);
            hayAmpliacion = true;
            break;
          }
        }
      }
    }
  }
  if (hayAmpliacion) { 
  retrasaSeleccionSer();
  function retrasaSeleccionSer() {setTimeout(clickEnAmpliaSer, 2000);}
  function clickEnAmpliaSer(){seleccionarGrupo.call(fichasJugador[j])}
  }
}
 
/************************************************************************************ */
function ampliarEscalera(jugador){
  var hayAmpliacion = true;
  var iter = 8;
  while (hayAmpliacion && iter) {
    iter--;
    var hayAmpliacion = false;
    var tablaMesa = document.getElementById("tablaMesa");
    var e3Mesa = [...tablaMesa.rows].filter(el => el.id.startsWith("E"));
    var filaJugador = document.getElementById("filaJugador");
    var fichasJugador = filaJugador.cells;
    var arrVal = [];
    if (e3Mesa.length > 0) {
      var tamanyos =    e3Mesa.map(el => el.id.split('-')[1]); // el tamaño >= 3
      var valoresIni =  e3Mesa.map(el => el.id.split('-')[2]);
      var colores =     e3Mesa.map(el => el.id.split('-')[3]); 
      for (let i = 0; i < e3Mesa.length; i++) {
        if (hayAmpliacion) break;
        var izda= false; 
        var dcha = false;
        for (var j = 0; j < fichasJugador.length; j++) {
          izda = (fichasJugador[j].innerHTML == (Number(valoresIni[i]) - 1));
          dcha = (fichasJugador[j].innerHTML == (Number(valoresIni[i]) + Number(tamanyos[i])))
          if ((izda || dcha ) && (fichasJugador[j].style.color === arrayColores[colores[i]])) {
            arrVal[0] = fichasJugador[j].id.substr(1); // marcarFichas() necesita un array
            var codigoGrupoMesa = e3Mesa[i].id;
            var lado = izda?"izda":"dcha";
            marcarFichas("A", arrVal, "true", codigoGrupoMesa, lado);
            hayAmpliacion = true;
            break;
          }
        }
      }
    }
    if (hayAmpliacion) { 
      //seleccionarGrupo.call(fichasJugador[j]);
      retrasaSeleccionEsc();
      function retrasaSeleccionEsc() {setTimeout(clickEnAmpliaEsc, 2000);}
      function clickEnAmpliaEsc()
      {seleccionarGrupo.call(fichasJugador[j])}
    }
  }
}

// ********************************************************************************************
// para buscar series conviene esta codificación de las fichas
// Ejemplo: 1103 es una ficha del número 11 y color 3
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
// para buscar escaleras conviene esta codificación de las fichas
// Ejemplo: 311 es una ficha del número 11 y color 3
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

// ********************************************************************************************
function desDuplicador(arr){
  var arrDes = arr.slice();
  for (let i = 0; i < arr.length; i++) {
  val = arr[i] % 100;
  col = Math.floor(arr[i] / 100);
  if (val >= 20) {val = val -20;}
  arrDes[i] = col*100 + val;
  }  
  return arrDes;
}

// *******************************************************************************************
// solo se marcan als fichas del jugador ?????
// CUANDO se encuentra un grupo: S3, S4, E3, E4, etc. Se marca visualmente para que
// el jugador remate haciendo doble click en el grupo marcado
// groupType: s:serie de 2; e: esc de 2; S: serie > 3; E: esc > 3; A:amplia grupo en mesa
function marcarFichas(groupType, group, jugador, codigoGrupoMesa, lado, fichaDeLaMesa) {
  var figuraFicha;
  var unomenos = 0
  // en los duos, el tercer elemento es de la mesa
  if (groupType == 's' || groupType == 'e') {unomenos = 1;}
  for (let i = 0; i < (group.length - unomenos); i++) {
    figuraFicha = document.getElementById((jugador?'F':'C') + group[i]);
    figuraFicha.classList.add('marcada');  //marcado visual
    figuraFicha.setAttribute("gType", groupType); // s,e,S,E,A
    figuraFicha.setAttribute("numGrupo", numGrupo); // id único de grupo
    if (groupType == "A") {
      figuraFicha.setAttribute("grupoMesa", codigoGrupoMesa); // amplía un grupo en la mesa
      figuraFicha.setAttribute("lado", lado);
      var fichasMesa = document.getElementById(codigoGrupoMesa).cells;
      for (let j = 0; j < fichasMesa.length; j++) {
        fichasMesa[j].classList.add("marcasuave");
      }
    }
    if (groupType == 's' || groupType == 'e') {
      // en este caso es el nuevo código de la fila de la mesa implicada
      figuraFicha.setAttribute("grupoMesa", codigoGrupoMesa); 
      figuraFicha=fichaDeLaMesa;
      //figuraFicha = document.getElementById('M' + group[group.length-1]);
      figuraFicha.classList.add('marcasuave');
      figuraFicha.setAttribute("gType", groupType);
      figuraFicha.setAttribute("numGrupo", numGrupo);
      if (groupType == 'e') figuraFicha.setAttribute("lado", lado);
    }
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
  //if (ne == 0 && ns == 0)
}

function marcarFilaMesa(fila) {
  var fichas = fila.cells;
  for (let i=0; i < fichas.length; i++) {
    fichas[i].classList.remove('error', 'marcada', 'over', 'marcasuave');
    hazNoDropable(fichas[i]);
  }
  hazDropable(fichas[0]);
  hazDropable(fichas[fichas.length-1]);
}

  
  function desmarcar() {
    fichas = [...document.getElementById("filaJugador").cells];
    for (let i=0; i< fichas.length; i++) {
      fichas[i].classList.remove('error', 'marcada', 'over', 'marcasuave');
      fichas[i].removeAttribute("lado");
      fichas[i].removeAttribute("gType");
      fichas[i].removeAttribute("numGrupo");
      fichas[i].removeAttribute("grupoMesa");
    }
    [...document.getElementsByClassName('marcasuave')].forEach(el => el.classList.remove('marcasuave'));
  }
         


function barreja(jugador){

 ficha = [...document.getElementById(FilaJugador)].cells;
  // series =  buscarSeries(true);
  // escaleras = buscarEscaleras(true);
  for (let i=0; i < Filajugador.length; i++) {
    


  }
  

}

