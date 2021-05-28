/*****************************************************************************/
/*****************************************************************************/
/********* Programa para jugar al Rummi.                               *******/
/********* Un jugador de carne y hueso contra el computador            *******/
/********* Version 0.1 Incompleta. Tiene muchas fallos y lagunas       *******/
/********* Por ejemplo: maneja mal o no maneja los _comodines_         *******/
/********* Programado por V. Santonja                                  *******/
/*****************************************************************************/
/*****************************************************************************/


const arrayColores = ["black", "red", "blue", "green"];
const juegosFichas = 2;
const comodines = 0;
var filaMesa;
var arrayMesa;
var fm; 
var traza = true;
var num_traza = 0;
var textoJ;
var fichaJugada = false;
var numFichasJ0;
var modoCancelable = false;
var eventoHecho = false;

/*****************************************************************************/
/**************************                        ***************************/
/************************** PROGRAMACIÓN DE LA IU  ***************************/
/**************************                        ***************************/
/*****************************************************************************/

function dragStart(ev) { 
  eventoHecho = false;
  ev.dataTransfer.setData("text", ev.target.id);
  if (!modoCancelable) {  // guardamos el estado de la mesa y fila deljugador para poder reconstruirlas
    modoCancelable = true;
    numFichasJ0 = filaJugador.cells.length;
    copiarTabla();
    document.getElementById("aceptarJugada").style.display = "inline";
    document.getElementById("cancelarJugada").style.display = "inline";
    document.getElementById("Cambio").style.display = "none";
    document.getElementById("Jugada").style.display = "none";
    document.getElementById("Sugerir").style.display = "none";
    document.getElementById("botonSeries").style.display = "none";
    document.getElementById("botonEscaleras").style.display = "none";
    document.getElementById("botonAmpS").style.display = "none";
    document.getElementById("botonAmpE").style.display = "none";        
    document.getElementById("buscarCortes").style.display = "none" ;
    textoJ.innerHTML = "JUGADOR: operación cancelable. Al terminar con el movimiento de fichas debe Aceptar o Cancelar";
    if (traza) console.log("Inicio arrrastre de ficha" + ev.target.id);
  }
  fm=ev.target; // la ficha móvil (la que se arrastra). Se guarda porque el dataTransfer.getData() solo se puede conocer en el "drop"
}


//*****************************************************************************
//función asociada al evento dragover
function allowDrop(ev) { 
  var arr = [];
  if (ev.target.tagName == "TD") {  // el destino es una celda. 
                                    // El jugador amplia un grupo prexistente 
    arr = filaFichasAArrayCodigos(ev.target.parentElement);
    arr = arr.concat(fm.id.substr(1));
  }
  if (validaSim(arr) != -1) {
    ev.preventDefault();
    ev.target.classList.add('permiso');
  } else {
    ev.target.classList.add('error');
  }
}


//*****************************************************************************
function dragDrop(ev) { 
 
  ev.preventDefault(); 
  var fichaMovil = fm;
  var fichasOrig = fichaMovil.parentElement;
  var fromMesa = false; 
  if (fichaMovil.id.startsWith('M')) {
    fromMesa = true; 
  }
  fichaMovil.id = "M" + fm.id.substr(1);
  if (ev.target.tagName == "TD") {  // el jugador amplia un grupo prexistente 
    //Si solo había una ficha en la fila las pongo ordenadas
    filaMesa = ev.target.parentElement;
    if (filaMesa.cells.length == 1) { 
      if (fm.id.substr(1) - ev.target.id.substr(1) < 0) {
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
  } // no suelta en una filas existente
  if (fromMesa) {
    if (fichasOrig.cells.length == 0) {
      fichasOrig.parentNode.removeChild(fichasOrig);
    } else {
      marcarFilaMesa(fichasOrig, false);
    }
  }
    marcarFilaMesa(filaMesa, false);
    eventoHecho = true;
    if (traza) console.log("Ficha depositada junto a" + ev.target.id);
}


//*****************************************************************************
function hazDropable(ficha) {
  ficha.setAttribute("ondrop","dragDrop(event)");
  ficha.setAttribute("ondragover","allowDrop(event)");
  ficha.setAttribute("ondragleave","removeStyle(event)");
  ficha.draggable = true;
  ficha.setAttribute("ondragstart", "dragStart(event)");
  return ficha;
}


//*****************************************************************************
function hazNoDropable(ficha) {
  ficha.removeAttribute("ondrop");
  ficha.removeAttribute("ondragover");
  ficha.removeAttribute("ondragleave");
  ficha.draggable = false;
  ficha.removeAttribute("ondragstart");
  return ficha;
  ;
}


//*****************************************************************************
// devuelve NADA si arr está bien formado o -1 si no
function validaSim(arr) { 
  var len = arr.length;
  if (len >= 3 && !esSerie(arr) && !esEscalera(arr)) {   // las filas de tres en la mesa deben ser escalera o series
     return -1;
  }
  if (len == 2) { // si hay dos en la fila es que se está montando la esc o la serie, Hay que ser más permisivo
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
  if (eventoHecho) return;
  ev.preventDefault(); 
  var fichasOrig =fm.parentElement;
  var fromMesa = false; 
  if (fm.id.startsWith('M')) {
    fromMesa = true; 
  }
  var ultimaFila = document.createElement("tr");
  ultimaFila.classList.add="fill-auto";

  var tablaMesa = document.getElementById("tablaMesa");
  var le = tablaMesa.rows.length;
  

  tablaMesa.appendChild(ultimaFila);
  ultimaFila.appendChild(hazDropable(fm));
  ev.target.removeAttribute("style");
  filaMesa = ultimaFila;
  filaMesa.id = "X-filaMesa";
  fm.id = "M" + fm.id.substr(1);   
  if (fromMesa) {
    if (fichasOrig.cells.length == 0) {  // si la fila de donde ha salido la ficha movil está vacía, la borro. Si no, la arreglo
      fichasOrig.parentNode.removeChild(fichasOrig);
    } else {
      marcarFilaMesa(fichasOrig, false);
    }
  }

  if (traza) console.log("Se crea un nuevo grupo en la mesa"); 
}


function removeStyle(ev) {
  if (ev.target.tagName == "TD"){
     ev.target.classList.remove('permiso', 'error');  
  }
  else if (ev.target.tagName == "DIV") {}    
}


//******************************************************************************
// Selecciona valor del Comodín
function defineJoker(){
  textoJ.innerHTML = "Fija el valor del Comodín";
  document.getElementById("fvalores").style.display = "inline";
  document.removeEventListener(click);
}

//******************************************************************************
/* Cuando el usuario hace click en el botón,
  csambia entre mostrar y ocultar el contenido desplegable */
function choseValor() {
   for (var i=0;i<document.fvalores.valores.length;i++){ 
     if (document.fvalores.valores[i].checked) break; 
    } 
    var comodin=(document.getElementById("F415")) ? document.getElementById("F415")
                                                  : document.getElementById("F416");
    comodin.innerHTML= document.fvalores.valores[i].value;
    document.getElementById("fvalores").style.display = "none";
    document.getElementById("fcolores").style.display = "inline";
    textoJ.innerHTML = "Selecciona color del Comodín";
}
  

//******************************************************************************  
function choseColor(){ 
  for (var i=0;i<document.fcolores.colores.length;i++){ 
    if (document.fcolores.colores[i].checked) break; 
  } 
  var comodin=(document.getElementById("F415")) ? document.getElementById("F415")
                                                : document.getElementById("F416");
  comodin.style.color= arrayColores[document.fcolores.colores[i].value];
  comodin.id="F" + ((document.fcolores.colores[i].value)*100 + parseInt(comodin.innerHTML));
  document.getElementById("fcolores").style.display = "none";
  textoJ.innerHTML = "Arrastra una ficha a la mesa o solicita sugerencia";
} 

/*****************************************************************************/
/*****************************************************************************/
/**************************                        ***************************/
/************************** PROGRAMACIÓN DEL JUEGO ***************************/
/**************************                        ***************************/
/*****************************************************************************/
/*****************************************************************************/
var fichasSaco = [];
var misFichas = [];
var maqFichas = [];
var seleccion = [];

var tablaDest;

var numGrupo = 0;

var tablaJugador;
var tablaSaco;

var filaJugador;
var filaMaquina;

var arraySaco = [];

// Variables que definen el estado
var modoDebug = false;
var sacoVisible = true;

 function nuevoJuego() {
  location.reload();
}

function inicio() {
  alert( "Rumiant versió 0.1- V. Santonja (20/3/2021). Programa  que permite que un jugador de carne y hueso compita al Rummikub contra el computador. ATCHUNG!: No maneja los _comodines_");
  iniciar(0);
}

function iniciar(prueba) {
  var ficha;
  textoJ = document.getElementById("textoJugador"); 
  tablaSaco = document.getElementById("tablaSaco");
  if (prueba == 0) {   // 0 reparto normal, 1 carga de prueba 1
    for (let a = 1, i = 0; a <= juegosFichas; a++) {   // HAY 1 O 2 JUEGOS DE FICHAS
      for (let v = 1; v < 14; v++) {     // 13 valores del 1 al 13
        for (let c = 0; c < 4; c++) {    // y 4 colores del 0 al 3
          arraySaco[i] = codigoColor(c,v);  // Codif. por color. Ejemplo la ficha 108 es de color c=1 y valor v=8
          i++;
        }
      } 
    }
    if (comodines == 1) arraySaco[52*juegosFichas] = 415;  // codigoColor de los dos _comodines_
    if (comodines == 2) arraySaco[52*juegosFichas+1] = 416;
    // baraja
    arraySaco.sort((a, b) => 0.5 - Math.random());
        // The Fisher Yates Method
        // if (tipus == 0) {
        //   for (let i = arraySaco.length -1,j,k; i > 0; i--) {
        //       j = Math.floor(Math.random() * i)
        //       k = arraySaco[i]
        //       arraySaco[i] = arraySaco[j]
        //       arraySaco[j] = k
        //     }
  } else {   //usamos una carga aftificial
    arraySaco = [101, 108,  10, 203, 202, 201, 207,                             // se quedan en el saco
          103, 303, 106, 306, 007, 203,   6, 206, 204, 107, 205, 206, 13, 212,  // 14 fichas al jugador
          103, 106, 302, 110, 105, 103, 112,   5, 203, 303, 107, 213, 308,  9]; // 14 fichas al computador
    arrayMesa =[
          [110, 210, 310],           // una serie de 3 dieces
          [1, 2, 3, 4, 5, 6, 7, 8],  // una esc de negros
          [203, 204, 205]            // escalera azul      
    ]  
  } 
  //conversión de números a fichas
  for (let row = 0, i=0; row < 8; row++) { // 8 filas
    if (i == arraySaco.length) break;
    filaSaco = this.document.createElement("tr");
    tablaSaco.appendChild(filaSaco);
    for (let col = 0; col < 14; col++) {  // como max hay 106 fichas (52*2 +2). con 14 filas caben 14*8=112 fichas 
      // 8 Filas y 13 columnas son 8*13 = 104 fichas
      if (i == arraySaco.length) break;
      ficha = document.createElement("td");
      ficha.className = "figuraFicha";
      ficha.id = 'S' + arraySaco[i];
      if (ficha.id == "S415" || ficha.id == "S416") {
        ficha.classList.add("joker");
        ficha.innerHTML = "J";
        ficha.addEventListener("click",  avisoComodin);
        ficha.addEventListener("dblclick",  defineJoker);
      } else {
        ficha.addEventListener("dblclick",  seleccionarGrupo);
        ficha.innerHTML = arraySaco[i] % 100;
        ficha.style.color = arrayColores[Math.floor(arraySaco[i] / 100)];
      }
      filaSaco.appendChild(ficha);
      i++;
    }  
    fichasSaco = fichasSaco.concat([...filaSaco.cells]);
    tablaSaco.style.display =  "none";
  }  
  repartirFichas();
  // Si hay fichas prefijadas en la mesa, ponlas. Esto solo ocurre en fase de DESARROLLO
  // para reproducir determinados escenarios de PRUEBA
  // filaMesa = document.getElementById("rummy");
  var tablaMesa = document.getElementById("tablaMesa").firstElementChild;
  if (arrayMesa)  {      // si está definido en inicio()
    for (let i = 0; i < arrayMesa.length; i++){
      filaMesa = document.createElement("tr");
      filaMesa.id = obtenerCodigo(arrayMesa[i]);
      tablaMesa.appendChild(filaMesa);
      for (let j = 0; j < arrayMesa[i].length; j++) {
        ficha = this.document.createElement("td");
        ficha.className = "figuraFicha";
        ficha.innerHTML = arrayMesa[i][j] % 100;
        ficha.id = 'M' + arrayMesa[i][j];
        ficha.style.color = arrayColores[Math.floor(arrayMesa[i][j] / 100)];
        filaMesa.appendChild(ficha);
      }
      marcarFilaMesa(filaMesa, false);
    }
  }  
  // solo se reparte una vez. Así que escondo los botones de reparto
  document.getElementById("botonRepartir" ).style.display = "none";  
  textoJ.innerHTML = "JUGADOR: Arrastra fichas del jugador a la mesa o pide una sugererencia";
//document.getElementById("MMC").innerHTML = document.getElementById("MMC").innerHTML.substr(8) + " 14 fichas";
  document.getElementById("MMC").innerHTML = "Ver       14 fichas";
}


/* ***************************************************************************** */
function repartirFichas() {
  filaJugador = document.getElementById("filaJugador");
  filaMaquina = document.getElementById("filaMaquina");
   var ficha;
  for (let i = 0; i < 14; i++) { // se reparten 14 fichas del computador ...
    ficha = fichasSaco.pop();
    ficha.id = 'C' + ficha.id.substr(1);
    filaMaquina.appendChild(ficha);
  }
  for (let i = 0; i < 14; i++) {  //... y las 14 fichas del jugador
    ficha = fichasSaco.pop();
    ficha.id = 'F' + ficha.id.substr(1); 
    if (ficha.innerHTML != 'J') {
      ficha.draggable = "true";
      ficha.setAttribute("ondragstart", "dragStart(event)");
    }
    filaJugador.appendChild(ficha);
  }

  document.getElementById("MMC").style.display = "inline";
 }


/******************************************************************************** */

function seleccionarGrupo() {
  if (traza) console.log("         grupo Seleccionado");

  var codGrupo; // Código del grupo
  var colorEsc; // la Escalera es monocolor, luego esto es un entero de 0 a 3
  var colorSer; // la serie de 3 le falta un color (de 0 a 3), a la de 4 ninguno (-1)
  var valorIni = -1; //valor inicial de la escalera. Ejemplo: esc 3-4-5-6 --> 3
  var tam = 0; // tamaño del grupo
  var groupType = this.getAttribute ("gType"); // Tipo = 'S'|'E'|'s'|'e'|'A'|'C'
  var numGrupo =  this.getAttribute ("numGrupo");
  var grupoMesa = this.getAttribute ("grupoMesa");
  var colorExcl = [0, 1, 2, 3];
  var fichas = [];

  if (groupType != 'S' && groupType != 'E' && groupType != 'A' && groupType !='s' && groupType !='e' && groupType != 'C') { 
    return;
  }
  
  fichas = [...this.parentElement.cells];

  if (groupType == 'A') { 
    filaMesa =  document.getElementById(grupoMesa);
    var primero = filaMesa.firstChild;
    this.setAttribute("numGrupo", primero.getAttribute("numGrupo"));
    if (this.getAttribute('lado') == 'izda') {   // solo en las escaleras importa el lado de inserción?????
      filaMesa.insertBefore(this, primero);
    } else {
      filaMesa.appendChild(this);
    }
    this.id = 'M' + this.id.substr(1);
    marcarFilaMesa(filaMesa, true);
    this.removeAttribute("lado");
    this.removeAttribute("gType");
    this.removeAttribute("numGrupo");
    this.removeAttribute("grupoMesa");

  } else { //groupType != A
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
    marcarFilaMesa(filaVella, true);
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
  }
}
  if (filaMesaDest) marcarFilaMesa(filaMesaDest,true);
  if (filaMesa) marcarFilaMesa(filaMesa, true);
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
  var series = []; // series auténticas de 3 o 4 fichas
  var s2 = [];     // proto series de 2 fichas
  var nuevaserie = [];
  var ret = "0";

  var fichasJugador = [...filaJugador.cells];
  var fichasMaquina = [...filaMaquina.cells];
  // primero, hacemos limpieza
  limpiaFila(filaJugador);
  hazDraggable(filaJugador);
  limpiaFila(filaMaquina);
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
      valorS2[cuentaS2] = n + 1;
      s2[cuentaS2]= codifColor(grupoValorSinDups[n]);
      cuentaS2++;
    } else {
      series[n] =[];
      valorS[n]  = -1;
    //  valorS2[cuentaS2] = -1;
  } 
  }
  var tablaMesa = document.getElementById("tablaMesa");
  var s4Mesa = [...tablaMesa.rows].filter(el => el.id.startsWith("S-4")); //selecciono los S4
  var cont = 0;
  var meVoy = false;
  for (var contS4 = 0; contS4 < s4Mesa.length; contS4++) { 
    if (meVoy) break;
 //   for (var num of valorS2) {
    for (var num = 0; num <= cuentaS2; num++) {
      if (meVoy) break;
      var v =valorS2[num];
      if (v == s4Mesa[contS4].id.split('-')[2]) {
        for (var c=0; c < 4; c++) {
          if ((s2[num].find(el => el == Number(c * 100 + v))) == undefined)  { //un color (de los 2 posibles) que me interesa
            nuevaserie[cont] = s2[num].slice();
            nuevaserie[cont].push(c * 100 + v); 
            cont++;            
            meVoy = true; 
            fichasel = c * 100 + v;
            break;
          }
        }
      }
    }
  }
 


  if (cont == 0) {
//********************************************  NOU NOU NOU */
// completar series de 2 fichas en la mano con una ficha de 
// escalera de 4 o más en la mesa
  var e4Mesa = [...tablaMesa.rows].filter(el => el.id.startsWith("E")).filter(el => !el.id.startsWith("E-3")); //selecciono las En (n>3)
  var conte4omas = 0;
  meVoy = false;
  for (var contE4 = 0; contE4 < e4Mesa.length; contE4++) { 
    if (meVoy) break;
    for (var num = 0; num <= cuentaS2; num++) {
      if (meVoy) break;
      v =valorS2[num];
      var posic;
      if ((v == e4Mesa[contE4].id.split('-')[2]) ||
          (v == parseInt(e4Mesa[contE4].id.split('-')[2]) + parseInt(e4Mesa[contE4].id.split('-')[1]) -1) ) {
        if (v == e4Mesa[contE4].id.split('-')[2]) posic = 0;
         else posic= parseInt(e4Mesa[contE4].id.split('-')[1]) -1;
        for (c=0; c < 4; c++) {
          if ((s2[num].find((el => el == Number(c * 100 + v))) == undefined ) &&
                            (c ==  e4Mesa[contE4].id.split('-')[3]))  { //un color (de los 2 posibles) que me interesa
            nuevaserie[conte4omas] = s2[num].slice();
            nuevaserie[conte4omas].push(c * 100 + v); 
            conte4omas++;            
            meVoy = true; 
            fichasel = c * 100 + v;
            break;
          }
        }
      }
    }
  }
}
//************************************************** NOU NOU NOU */

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
        textoJ.innerHTML = "JUGADOR: Haz doble click la serie marcada";
        ret = "S-" + serLenMax;
  } else if (cont > 0) { // serie de 2 completada con una ficha de la mesa
    for (let i =0; i < nuevaserie.length; i++) {
      var nuevoCodigoS3Mesa = "S-3-" + num + "-" + c;
      var lado;
      marcarFichas("s", nuevaserie[i], jugador, nuevoCodigoS3Mesa, lado, s4Mesa[contS4-1].cells[c]);
      textoJ.innerHTML = "JUGADOR: Haz doble click sobre la(s) serie(s) marcada(s) y una ficha de la mesa";
    } 
    ret = "S-2";
  } else if (conte4omas >0)   {
    for (let i =0; i < nuevaserie.length; i++) {
      var nuevoCodigoEMesa = "E-" + "  " + num + "-" + c;
      var lado;
      marcarFichas("s", nuevaserie[i], jugador, nuevoCodigoEMesa, lado, e4Mesa[contE4-1].cells[posic]);
      textoJ.innerHTML = "JUGADOR: Haz doble click sobre la(s) serie(s) marcada(s) y una ficha de la mesa";
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
  limpiaFila(filaJugador);
  hazDraggable(filaJugador);
  limpiaFila(filaMaquina);
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
      textoJ.innerHTML = "JUGADOR: Haz doble click sobre la escalera marcada";
      ret = "E-" + escLenMax;
    
  } else if (cuentaE2 > 0) {
    var gruposMesa = [...document.getElementById("tablaMesa").rows];
    for (let i = 0; i < cuentaE2; i++) {
      // para las esc de 2 elementos busco en la mesa una serie de 4 on una escalera de 
      // 4 o 5 o 6 ... al que le pueda quitar la ficha que me falta: por la izda o 
      // por la dcha. Las fichas que busco son las siguientes:
      var fichaIzda;
      var fichaDcha;
      if (esc2[i][0] % 100 == 1) {fichaIzda = -1;}  // no hay ficha a la izda (la escalera de 2 empieza con un 1)
      else {fichaIzda = esc2[i][0] - 1;}

      if (esc2[i][1] % 100 == 13) fichaDcha = -1; // no hay ficha a la dcha (la escalera de 2 acaba con un 13)
      else fichaDcha =parseInt(esc2[i][1]) + 1;
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
          if (fichasMesa[f] > 3) {
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
            var esS4 = gruposMesa[f].id.startsWith("S-4-"); // verdadero si es serie de 4
            var esE = gruposMesa[f].id.startsWith("E-");    // verdadero si es escalera
            var mayorQue3 = (gruposMesa[f].id.split("-")[1] > 3); // verdadero  si el grupo es mayor de 3
            //if ( esS4 || (esE && mayorQue3)) {
            if (mayorQue3) {
              esc2[i][2] =  fichaAMover.id.substr(1);
              if (esE) cgm = "E-" + (gruposMesa[f].id.split("-")[1]-1) + "-";
              marcarFichas("e", esc2[i], jugador, cgm, (porIzda?"izda":"dcha"),fichaAMover);
              textoJ.innerHTML = "JUGADOR: Haz doble click sobre la escalera marcada (2 fichas) junto a una ficha de la mesa";
              ret = "E-2"
            }
          }
        }
      } 
      }
      } //else  {ret = "-1";}
    }
  }
  if (traza) console.log(" devuelve un " + ret);
  return ret;
}
  

/* ****************************************************************************** */
function robarFicha(jugador) {

  //  var gruposMesa = [...document.getElementById("tablaMesa").rows];
  //  var grupo =[];
  //   if (jugador) {
  //     // si hay grupos de 1 o de 2 los elimina y devuelve la fichas a la mano del jugador
  //     const longRows = gruposMesa.length;
  //     for (let i = longRows - 1; i > 0 ; i--) { //recuerda que i=0 es rummy
  //       if (gruposMesa[i].cells.length < 3) {
  //        grupo[i] = gruposMesa[i].cells;
  //        const longCells =  grupo[i].length;
  //         for (let j=0; j < longCells; j++) {
  //           grupo[i][0].id = 'F' + grupo[i][0].id.substr(1); 
  //          filaJugador.appendChild(grupo[i][0]); 
  //         }
  //         document.getElementById("tablaMesa").deleteRow(-1);
  //       }
  //     }
  //     limpiaFila(filaJugador);
   // ************************* si no ha jugado ficha ===>   fichaJugada = false
   // }

  if (!fichaJugada) { // no se jugado ninguna ficha de la mano. Por tanto ates de cambiar de turno hay que robar 
    if (fichasSaco.length > 0) {
     var ficha = fichasSaco.pop();
     if (jugador) ficha.id = 'F' + ficha.id.substr(1);  else ficha.id = 'C' + ficha.id.substr(1);
      if (traza) console.log("robo ficha " + ficha.id);
      if (jugador) {
        ficha.draggable = "true";
        ficha.setAttribute("ondragstart", "dragStart(event)");
        filaJugador.appendChild(ficha);
      } else {
        filaMaquina.appendChild(ficha);
     }
    } else {alert ("El saco está vacío");}
} else { //empieza una nueva jugada 
  fichaJugada = false;
  document.getElementById("Cambio").innerHTML="Robar ficha";
  document.getElementById("Cambio").classList.remove("btn-primarry");
  document.getElementById("Cambio").classList.add("btn-danger");
}

if (jugador) {
  if (traza) console.log("************* Turno COMPUTADOR **************");
  jugadaComp();
 // document.getElementById("Sugerir").style.display="none"; 
  robarFicha(false);
  document.getElementById("MMC").innerHTML = document.getElementById("MMC").innerHTML.substring(0,8) + (document.getElementById("filaMaquina").cells.length) + " fichas";
  setTimeout(aviso, 1000);
  function aviso() {
    alert("COMPUTADOR: jugada concluída: " + mensaje + " - Cambio a TURNO JUGADOR");
    mensaje ="";
  }
} else {
  if (traza) console.log("************** Turno JUGADOR ****************");
  textoJ.innerHTML = "JUGADOR: arrastre fichas del jugador, de la mesa o pida sugerencia";
  document.getElementById("Jugada").style.display="inline"; 
}
}

/******************************************************************************/

function ampliarSerie(jugador){
  var fichasJugador = filaJugador.cells;
  var fichasMaquina = filaMaquina.cells;
  limpiaFila(filaJugador);
  hazDraggable(filaJugador);
  limpiaFila(filaMaquina);
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
          var codigoGrupoMesa = "S-3-" + valores[i] + "-" + colores[i]
          marcarFichas("A", arrCodigos, jugador, codigoGrupoMesa);
          hayAmpliacion = true;
          break;
          }
      }
    }
  }
  if (hayAmpliacion && jugador) {
    textoJ.innerHTML = "JUGADOR: Amplia la serie de la mesa haciendo doble click sobre la ficha en tu mano"
  }
  return hayAmpliacion;
}
 
/************************************************************************************ */
function ampliarEscalera(jugador){
  if (traza) console.log(num_traza++ + " Busco AmE");
  var fichasJugador = filaJugador.cells;
  var fichasMaquina = filaMaquina.cells;
  if (jugador) {
    limpiaFila(filaJugador);
    hazDraggable(filaJugador);
    fichas = fichasJugador; 
  } else {
    limpiaFila(filaMaquina);
    fichas = fichasMaquina;
  }
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
    textoJ.innerHTML = "JUGADOR: Amplia la escalera de la mesa haciendo doble click sobre la ficha en tu mano"
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
    var be = buscarEscaleras(true);
    var ne = (be.split("-")[0] == "E")? be.split("-")[1]:0;
    var bs = buscarSeries(true);
    var ns = (bs.split("-")[0] == "S")? bs.split("-")[1]:0;

    if (ns > ne) buscarSeries(true);
    else buscarEscaleras(true);

    if ((ne == 0) && (ns == 0)) {
      if (!ampliarEscalera(true)) 
        if (!ampliarSerie(true))
          if (!buscarCortes(true)) {
            textoJ.innerHTML = "JUGADOR: No hay ninguna jugada con las fichas de tu mano"
          }
    }
}
    

/*********************************************************************************** */
/*********   El computador calcula su jugada *************************************** */
/*********************************************************************************** */
var mensaje = "";
function jugadaComp() {
    for (let stop = 8; stop; stop--) { // 8 es una salvaguarda para que no se hagan inf iteraciones
    var bs = buscarSeries(false);
    var ns = bs.split("-")[0] == "S"? bs.split("-")[1]:0;
    var be = buscarEscaleras(false);
    var ne = be.split("-")[0] == "E"? be.split("-")[1]:0;
   
    if (ns > ne) {
      buscarSeries(false);
      mensaje = mensaje + " - serie de " + ns + " fichas";
    } else if (ne > 0) {  // ns <= ne, luego ns != 0 ==> ne != 0 
      buscarEscaleras(false);
      mensaje = mensaje + " - escalera de " + ne + " fichas";
    }
    if (ne == 0 && ns == 0) {
      console.log("no Serie ni Escalera");
      if (!ampliarEscalera(false)) {
        console.log("no AmpliaEsc");
        if (!ampliarSerie(false))  {
          console.log("no AmpliaSer");
          if (!buscarCortes(false)) {
            console.log("no Cortes");
            textoJ.innerHTML = "COMPUTADOR:<br>" + "Jugadas computador: pulse CAMBIO para pasar el turno al jugador";
           return;
          } else mensaje  = mensaje + " - corte";
        } else mensaje = mensaje + "- amplío serie";
      } else mensaje = mensaje + " - amplío escalera";
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
// Busca en los grupos de la mesa que permiten puntos de corte para jugar
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

  // filaJugador = document.getElementById("filaJugador");
  if (jugador) arrJ = filaFichasAArrayCodigos(filaJugador);
  else arrJ = filaFichasAArrayCodigos(filaMaquina);
  //filaMaquina = document.getElementById("filaMaquina");

  EMesa = EMesa.filter(el => !el.id.startsWith("E-3"));
  var arrJ;
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

      if (!cortadoDcha) {
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
          ficha1.setAttribute("grupoMesa", EMesa[ff].id); // amplía un corte en la fila de la mesa
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
    if (jugador) {textoJ.innerHTML = "JUGADOR: Modifica el grupo de la mesa haciendo doble click sobre la ficha en tu mano";}
    return true;
  } else return false;
}
   
//*****************************************************************************

// function seleccionarCorte() {
//   textoJ.innerHTML = "JUGADOR: modo MESA salga de este modo con ACEPTAR o CANCELAR";
//   if (!modoCancelable) {
//     modoCancelable = true;
//     copiarTabla();
//     document.getElementById("aceptarJugada").style.display = "inline";
//     document.getElementById("cancelarJugada").style.display = "inline";
//     document.getElementById("Cambio").style.display = "none";
//     document.getElementById("Jugada").style.display = "none";
//   }
//   seleccion = [];
//   seleccion.push(this); 
//   this.classList.add("marcasuave");
  
//   // this.addEventListener("dblclick",  moverCorte);
//   hermano =  this.nextElementSibling;
//   while (hermano) {
//     hermano.classList.add("marcasuave");
//     seleccion.push(hermano);
// //    hermano.addEventListener("dblclick",  moverCorte);
//     hermano =  hermano.nextElementSibling;
//   }
// }


//*****************************************************************************
// function moverCorte(){
//   var filaMesaOrig = this.parentElement; 
//   var tablaMesa = document.getElementById("tablaMesa");
//   var filaMesaDest = tablaMesa.insertRow(tablaMesa.length);
//   var filaMesaDest = document.createElement("tr");
//   tablaMesa.appendChild(filaMesaDest);
  
//   f = seleccion.shift();
//   var arrO = filaFichasAArrayCodigos(filaMesaOrig);
//   while(f) {
//     filaMesaDest.appendChild(f);
//     f = seleccion.shift();
//   }
//   var arrD = filaFichasAArrayCodigos(filaMesaDest);
//   if (esSerie(arrO) || esEscalera(arrO)) {
//     filaMesaOrig.id = obtenerCodigo(arrO);
//   } else {
//     filaMesaOrig.id = "X-filaCorte";
//   }
  
//   if (esSerie(arrD) || esEscalera(arrD)) {
//     filaMesaDest.id = obtenerCodigo(arrD)
//   } else {
//     filaMesaOrig.id = "X-filaCorte";
//   }
  
//   marcarFilaMesa(filaMesaDest);
//   marcarFilaMesa(filaMesaOrig); 
// }


//*****************************************************************************
function aceptarJugada() {
  modoCancelable = false;
  var gruposMesa = [...document.getElementById("tablaMesa").rows];
  //  var grupo =[];
  // si hay grupos de 1 o de 2 los elimina y devuelve la fichas a la mano del jugador
  // IMPOSIBLE !!!
  // const longRows = gruposMesa.length;
  // for (let i = longRows - 1; i > 0 ; i--) { //recuerda que i=0 es rummy
  //   if (gruposMesa[i].cells.length < 3) {
  //   grupo[i] = gruposMesa[i].cells;
  //   const longCells =  grupo[i].length;
  //     for (let j=0; j < longCells; j++) {
  //       grupo[i][0].id = 'F' + grupo[i][0].id.substr(1); 
  //     filaJugador.appendChild(grupo[i][0]); 
  //     }
  //     document.getElementById("tablaMesa").deleteRow(-1);
  //   }
  // }
  // limpiaFila(filaJugador);
  // hazDraggable(filaJugador);
  for (let i = 1; i < gruposMesa.length; i++) { //recuerda que i=0 es rummy
    if (gruposMesa[i].cells.length < 3) {
      textoJ.innerHTML = "Esta jugada no se puede aceptar. Cancele y haga una nueva jugada";    
      return;
    }
  }
  document.getElementById("tablaJugador").deleteRow(1); // borro tablaJugadorDest
  document.getElementById("aceptarJugada").style.display = "none";
  document.getElementById("cancelarJugada").style.display = "none";
  document.getElementById("Cambio").style.display = "inline";
  document.getElementById("Jugada").style.display = "inline";
  var nfj = numFichasJ0 - filaJugador.cells.length; 
  if (nfj > 0) {
    fichaJugada = true
    document.getElementById("Cambio").innerHTML="Cambio turno";
    document.getElementById("Cambio").classList.remove("btn-rojo");
    document.getElementById("Cambio").classList.add("btn");
  }
  textoJ.innerHTML = "JUGADOR: Operación ACEPTADA. Arrastre fichas del jugador, de la mesa o pida una sugerencia";
}

function cancelarJugada() {
  modoCancelable = false;
  document.getElementById("aceptarJugada").style.display = "none";
  document.getElementById("cancelarJugada").style.display = "none";
  document.getElementById("Cambio").style.display = "inline";
  document.getElementById("Jugada").style.display = "inline";

  reponerTabla();
  document.getElementById("tablaJugador").deleteRow(1);

  // nfj = numFichasJ0 - filaJugador.cells.length;
  // if (nfj > 0) {
  //   fichaJugada = true;
  //   document.getElementById("Cambio").innerHTML="Cambio turno";
  //   document.getElementById("Cambio").classList.remove("btn-danger");
  //   document.getElementById("Cambio").classList.add("btn-primary");
  // } 
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
  let col;7
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
    ordenar(arr);
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


//**************************************************************************
// Obtiene el vector de codigos "xColor" de una fila de la mesa
// a partir de su código de grupo. Ej: E-5-3-1 --> (103,104,105,106,107)
// los elementos están ordenados
function obtenerVector(codigo) {
  var vector = [];
  var co = codigo.split('-');
  if (co[0] == 'E') {
    vector[0] = parseInt(co[3]) * 100 + parseInt(co[2]);
    if (co[1] >= 3) {
      for (let i=1; i < co[1]; i++) {
        vector[i] = vector[i-1] + 1
      }
    }
  }
  if (co[0] == 'S') {
    if (co[1] == '4') {
      vector[0] = parseInt(co[2]); 
      vector[1] = parseInt(vector[0]) + 100; 
      vector[2] = parseInt(vector[0]) + 200; 
      vector[3] = parseInt(vector[0]) + 300;
    } else if (co[1] == '3') {//serie de 3
      for (let i=0, j=0; i < 4; i++) {
        if (i != co[3]) {
          vector[j++] = parseInt(co[2]) + i * 100;
        }
      }
    }
  } 
  return vector;
}

//**************************************************************************
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
// codificada "xColor"

function filaFichasAArrayCodigos(fila) {
  return [...fila.cells].map(el => el.id.substr(1));
 }

//******************************************************************************/
 // reinicializa el formato de una fila de la MESA 
 // y le añade su id correcto
 function marcarFilaMesa(fila, consume) {
  var fichas = fila.cells;
  for (let i=0; i < fichas.length; i++) {
    fichas[i].classList.remove('error', 'marcada', 'permiso', 'marcasuave');
    hazNoDropable(fichas[i]);
  // //  fichas[i].addEventListener("dblclick",  seleccionarCorte);
  //   fichas[i].draggable = "true";
  fila.id = obtenerCodigo(filaFichasAArrayCodigos(fila));
  //   fichas[i].setAttribute("ondragstart", "dragStart(event)");
  }
  hazDropable(fichas[0]);
  hazDropable(fichas[fichas.length-1]);
  if (consume) {
    fichaJugada = true;
    document.getElementById("Cambio").innerHTML="Cambio turno";
    document.getElementById("Cambio").classList.remove("btn-rojo");
    document.getElementById("Cambio").classList.add("btn");
    textoJ.innerHTML = "JUGADOR: arrastre fichas del jugador, de la mesa o pida una sugerencia";
}
 }
 /* ****************************************************************************** */
function limpiaFila(fichas) {
  for (let i = 0; i < fichas.cells.length; i++ ) {
    fichas.cells[i].classList.remove('error', 'marcada', 'permiso', 'marcasuave');
    fichas.cells[i].removeAttribute("gType");
    fichas.cells[i].removeAttribute("numGrupo");
    fichas.cells[i].addEventListener("dblclick", seleccionarGrupo);
    fichas.cells[i].removeAttribute("ondrop");
    fichas.cells[i].removeAttribute("ondragover");
    fichas.cells[i].removeAttribute("ondragleave");
  } 
}   


function hazDraggable(fichas) {
  for (let i = 0; i < fichas.cells.length; i++ ) {
    if (fichas.cells[i].innerHTML != 'J') {
      fichas.cells[i].draggable = "true";
      fichas.cells[i].setAttribute("ondragstart", "dragStart(event)");
    }
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
  ordenar(arr);
  var color = arr.map(el => Math.floor(el / 100));
  var valor = arr.map(el => el % 100);
  if (color[arr.length-1] == 4) { // es un comodin
    var tope = arr.length - 2;
  } else {
    tope = arr.length - 1;
  }
  for (let i = 0; i < tope; i++) {
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
    if (fila.id === "filaJugador") {
      filaArr[i].id = "F" + arr[i];
    } else {
      filaArr[i].id = "M" + arr[i];
    }
    if  (arr[i] < 400) { 
      filaArr[i].innerHTML = arr[i] % 100;
      filaArr[i].style.color = arrayColores[Math.floor(arr[i] / 100)];
      filaArr[i].classList.remove("joker");
    } else { // es un comodin
      filaArr[i].innerHTML = "J";
      filaArr[i].classList.add("joker");
    }
  }
}


 /******************************************************************************/
 function esEscalera(arr) {
   ordenar(arr);
   var color= arr.map(el => Math.floor(el / 100));
   var valor = arr.map(el => el % 100);
   if (color[arr.length-1] == 4) { // es un comodin
    var tope = arr.length - 2;
   } else {
    tope = arr.length - 1;
   }
   for (let i = 0; i < tope; i++) {
     if (valor[i] != valor[i+1] - 1) {return false;}
     if (color[i] != color[i+1]) {return false;}
    }
    return true;
  }
  

//*****************************************************************************
//***********  Hace una copia de seguridad de las filas de la mesa         ****
//***********  y la del jugador para poder deshacer los arrastres erróneo  ****
//*****************************************************************************
function copiarTabla() {
 
 
    var tablaDest = document.getElementById('tablaDest');  // donde se hace la copia
    var tablaMesa = document.getElementById('tablaMesa');  // tabla a copiar

    numrows = tablaDest.rows.length;

    // borrar la tabla con la copia anterior
    for (let i = 0; i < numrows; i++) {
      tablaDest.deleteRow(0);
    }

    // copiar la tabla de la mesa

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
    filaJ.style.display = "none";
    filaJ.id = "filaJugadorBis";
    for (let j = 0; j < filaJugador.cells.length; j++ ) {
      var cell = filaJ.insertCell(-1);
      cell.id = filaJugador.cells[j].id;
      cell.innerHTML = filaJugador.cells[j].innerHTML;
      cell.style.color = filaJugador.cells[j].style.color;
      if (filaJugador.cells[j].classList.contains("joker")) {
        cell.classList.add("joker");
      }
    }     
  }



function reponerTabla() {

  var tablaDest = document.getElementById('tablaDest');
  var tablaMesa = document.getElementById('tablaMesa');
  
  var numrows = tablaMesa.rows.length;
  var numrowsDest = tablaDest.rows.length;
  for (let i = 0; i < numrows; i++) {
    tablaMesa.deleteRow(0);
  }
  for (let i = 0; i < numrowsDest; i++) {
    var row = tablaMesa.insertRow(-1);
    if (i == 0) row.id = "rummy"; 
    else row.id = tablaDest.rows[i].id;
    if (i==0) row.style.display = 'none'
    for (let j = 0; j < tablaDest.rows[i].cells.length; j++) {
      var cell = tablaMesa.rows[i].insertCell(-1);
      cell.id = tablaDest.rows[i].cells[j].id;
      cell.innerHTML = tablaDest.rows[i].cells[j].innerHTML;
      cell.style.color = tablaDest.rows[i].cells[j].style.color;
      cell.className = "figuraFicha";
      if (tablaDest.rows[i].cells[j].classList.contains("joker")) {
        cell.classList.add("joker");
      }
    }
    if (i!= 0) marcarFilaMesa(row,true);
  }
  var long = filaJugador.cells.length;
  for (let i = 0; i < long; i++) {  // borro la fila actual
    filaJugador.deleteCell(0);
  }
  var filaJugadorBis = document.getElementById('filaJugadorBis');
  for (let j = 0; j < filaJugadorBis.cells.length; j++) {
    var cell = filaJugador.insertCell(-1);
    cell.id = 'F' + filaJugadorBis.cells[j].id.substr(1);
    cell.innerHTML = filaJugadorBis.cells[j].innerHTML;
    cell.style.color = filaJugadorBis.cells[j].style.color;
    cell.className = "figuraFicha";
    if (filaJugadorBis.cells[j].classList.contains("joker")) {
      cell.classList.add("joker");
      cell.addEventListener("dblclick",  defineJoker);
    }
  }
  limpiaFila(filaJugador);
  hazDraggable(filaJugador);
  textoJ.innerHTML = "JUGADOR: operación cancelada. Arrastre fichas del jugador, de la mesa o pida una sugerencia";
}


// ****************************************************************************
var compVisible=false;
function mostrarManoComutador() {
  if (compVisible) {
   document.getElementById("tablaMaquina").style.display = "none";
   document.getElementById("MMC").innerHTML = "Ver     " + (document.getElementById("filaMaquina").cells.length) + " fichas";
  }
  else {
   document.getElementById("tablaMaquina").style.display = "inline";
   document.getElementById("MMC").innerHTML = "Ocultar " + (document.getElementById("filaMaquina").cells.length) + " fichas";
  }
  compVisible = !compVisible;
}

// ****************************************************************************
var botonesJugadasVisibles = false;
function verBotonesJugadas() {
  if (botonesJugadasVisibles) {

    document.getElementById("Jugada").innerHTML = "Jugadas >";
    document.getElementById("Sugerir").style.display = "none";
    document.getElementById("botonSeries").style.display = "none";
    document.getElementById("botonEscaleras").style.display = "none";
    document.getElementById("botonAmpS").style.display = "none";
    document.getElementById("botonAmpE").style.display = "none";        
    document.getElementById("buscarCortes").style.display = "none" ;  
  }
  else {
    document.getElementById("Jugada").innerHTML = "Jugadas <";
    document.getElementById("Sugerir").style.display = "inline";
    document.getElementById("botonSeries").style.display = "inline";
    document.getElementById("botonEscaleras").style.display = "inline";
    document.getElementById("botonAmpS").style.display = "inline";
    document.getElementById("botonAmpE").style.display = "inline";        
    document.getElementById("buscarCortes").style.display = "inline"; 
  }
  botonesJugadasVisibles = !botonesJugadasVisibles;
}


/******************************************************************************/
function proclamarGanador(jugador) {

  alert("El ganador es: el" + (jugador?" JUGADOR":" COMPUTADOR") + ". Terminó el juego");

}

var ordenXColor = true;
function ordenarValorOColor(){
  let arr =filaFichasAArrayCodigos(filaJugador);
  if (ordenXColor) {
    arr= codifValor(arr);
    ordenar(arr);
    arr= codifColor(arr);
    ordenarFila(arr,filaJugador);  
    document.getElementById("ordenarValorOColor").innerHTML = "Ord. x Color";
  } else {
    ordenar(arr);
    ordenarFila(arr,filaJugador);    
    document.getElementById("ordenarValorOColor").innerHTML = "Ord. x Valor";
  }
  ordenXColor = !ordenXColor;
}


function avisoComodin(){
  textoJ.innerHTML = "COMODIN. Antes de arrastarla debe asignarle un valor y color concreto. Haga doble click sobre la ficha"
}

function codigoColor(c,v) {

  return c * 100 + v;
}