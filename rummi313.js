
const arrayColores = ["black", "red", "blue", "magenta"];

var arraySaco = [];
var misFichas = [];
var maqFichas = [];

var numGrupo = 0;
var filaMesa;
var filaJugador;
var filaComp;

var tablaJugador;
var tablaComp;

// Variables que definen el estado
var depuracion = false;
var sacoNoVisible = true;

function nuevoJuego() {
  location.reload();
}

function debug() { 
    depuracion = !depuracion;
    document.getElementById("botonDebug").innerText = depuracion ?
     "Change to NORMAL mode":"Change to DEBUG mode";
    document.getElementById("botonSaco").style.visibility =  depuracion ?
      "visible":"hidden";
}

function iniciar(tipus) {
 
  for (let a = 1, i=0; a < 3; a++) {   // hay 2 juegos de cada
    for (let v = 1; v < 14; v++) {     // 13 valores del 1 al 13
      for (let c = 0; c < 4; c++) {    // y 4 colores del 0 al 3
        arraySaco[i] = c * 100 + v;    // Codif. por color. Ejemplo la ficha 108 es de color 1 y valor 8
        i++;
      }
    }
  }
  //remuevo el saco
  //if (tipus == 0) { arraySaco.sort((a, b) => 0.5 - Math.random()); }
  // The Fisher Yates Method
  if (tipus == 0) {
    for (let i = arraySaco.length -1,j,k; i > 0; i--) {
        j = Math.floor(Math.random() * i)
        k = arraySaco[i]
        arraySaco[i] = arraySaco[j]
        arraySaco[j] = k
      }
    repartirFichas()
  } else {
    arraySaco = [101, 208, 203, 202, 201, 207, 103, 3];
    repartirFichasPrueba(tipus);
  }
 // document.getElementById("botonRepartir").disabled = true;
  document.getElementById("botonRepartir").style.visibility = "hidden";  
}
// ********************************************************************************************

function verSaco() {
  var botonSaco = document.getElementById("botonSaco");
  if (sacoNoVisible) {
    pintarSaco();
    botonSaco.innerText = "Hide Saco";
  } else {
    zonaSaco.removeChild(tabla1);
    botonSaco.innerText = "Show Saco";
  }
  sacoNoVisible = !sacoNoVisible;
}

// ********************************************************************************************

function pintarSaco() {
  var figuraFicha;
  tablaSaco = document.getElementById("tablaSaco");
  let i = 0;
  for (let c = 0; c < 8; c++) {// 8 filas
    if (i == arraySaco.length) break;
    filaSaco = this.document.createElement("tr");
    tablaSaco.appendChild(filaSaco);
    for (let f = 0; f < 13; f++) {
      // 13 filas 8*13 = 104 fichas
      if (i == arraySaco.length) break;
      figuraFicha = this.document.createElement("td");
      figuraFicha.className = "figuraFichaSaco";
      figuraFicha.innerHTML = arraySaco[i] % 100;
      figuraFicha.id = arraySaco[i];
      figuraFicha.style.color = arrayColores[Math.floor(arraySaco[i] / 100)];
      filaSaco.appendChild(figuraFicha);
      i++;
    }
  }
}
// ********************************************************************************************
function repartirFichas() {
  for (let i = 0; i < 14; i++) {
    // se reparten 14 fichas
    misFichas.push(arraySaco.pop());
    maqFichas.push(arraySaco.pop());
  }
  pintarFichas(misFichas, true); // jugador == true;
  if (depuracion) pintarFichas(maqFichas, false); // jugador == false;
}
// ********************************************************************************************
function repartirFichasPrueba(tipus) {
  // reparto de prueba 1: tiene uns a escalera de 4 azul(2) y dos rojas (1) 
  // reparto de prueba 2: tiene una a serie de 3 azul(2) y dos rojas (1)
  if (tipus == 1) misFichas = [103, 303, 106, 306, 106, 103, 203, 6, 206, 204, 107, 205, 206, 13];
  else misFichas = [8,101,102,302,105,106,103,4,203,204,204,107,205,206,];
  // reparto de prueba 1 para el computador
//   maqFichas = [103,006,302,100,105,103,402,203,203,303,107,213,213,1308,];
  pintarFichas(misFichas, true); // jugador == true;
 // if (depuracion) pintarFichas(maqFichas, false); // jugador == false;
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
function codifColor(arrVa) {
  let val;
  let col;
  let arrCo = arrVa.slice();
  for (let i = 0; i < arrVa.length; i++) {
    val = Math.floor(arrVa[i] / 100);
    col = arrVa[i] % 100;
    if (col >= 20) {
      arrCo[i] = (col - 20) * 100 + val + 20;
    } else {
      arrCo[i] = col * 100 + val;
    }
  }
  return arrCo;
}
// ********************************************************************************************

function ordenar(arreglo) {
  arreglo.sort(function (a, b) {
    return a - b;
  });
}

// *******************************************************************************************

function pintarFichas(arr, jugador) {
  var figuraFicha;
  var valor;
  var color;
  function rellenarFichas(jugador) {
    for (let i = 0; i < arr.length; i++) {
      figuraFicha = this.document.createElement("td");
      if (jugador) {
        figuraFicha.addEventListener("click", seleccionarGrupoJugador);
      }
      figuraFicha.className = "figuraFicha";
      //figuraFicha.id =  arr[i];
      figuraFicha.setAttribute("tipo", jugador ? "F" : "M");
      color = Math.floor(arr[i] / 100);
      figuraFicha.style.color = arrayColores[color];
      valor = arr[i] % 100;
      if (valor >= 20) {  valor -= 20; }   // es un dup        
      figuraFicha.innerHTML = valor;
      figuraFicha.id = color * 100 + valor ;
      //figuraFicha.setAttribute("valorFicha", (color * 100 + valor).toString() );
     
      if (jugador) filaJugador.appendChild(figuraFicha);
      else filaComp.appendChild(figuraFicha);
    }
  } // de function  rellenarFichas()

  //Fichas del jugador
  if (jugador) {
    if (document.getElementById("filaJugador")) {
      tablaJugador.removeChild(filaJugador);
    } // si existe la elimino y creo una nueva
    tablaJugador = document.getElementById("tablaJugador");
    filaJugador = this.document.createElement("tr");
    tablaJugador.appendChild(filaJugador);
    filaJugador.id = "filaJugador";
    
    rellenarFichas(jugador);

    if (document.getElementById("filaJugadorIn")) {
      tablaJugador.removeChild(filaJugadorIn);
    } // si existe la elimino y creo una nueva
    
    // filaJugadorIn = this.document.createElement("tr"); // escribo los índices
    // filaJugadorIn.id = "filaJugadorIn"
    // tablaJugador.appendChild(filaJugadorIn);
    // for (let i = 0; i < arr.length; i++) {
    //   numFicha = this.document.createElement("td");
    //   numFicha.innerHTML = i.toString();
    //   numFicha.className = "indice"
    //   filaJugadorIn.appendChild(numFicha);
    // }
  } else { //juega el COMPUTADOR
    if (document.getElementById("filaComp")) {
      document.removeChild(filaComp);
    } // si existe la tabla la elimino y creo una nueva
    tablaComp = document.getElementById("tablaComp");
    filaComp = this.document.createElement("tr");
    tablaComp.appendChild(filaComp);
    filaComp.id = "filaComp";
    rellenarFichas(jugador);
  }
}

// solo se marcan als fichas del jugador
function marcarFichas(tipo, ides, jugador, codigoGrupoMesa, lado) {
 var figuraFicha;
  // Para que los "Id" de las fichas sean correctos PREVIAMENTE hay que pintarFichas
  for (let i = 0; i < ides.length; i++) {
    figuraFicha = document.getElementById(ides[i]);
    figuraFicha.className = "figuraFichaMarcada";
    figuraFicha.setAttribute("tipo", tipo);
    figuraFicha.setAttribute("numGrupo", numGrupo);
    if (tipo == "A"){
      figuraFicha.setAttribute("grupoMesa", codigoGrupoMesa); 
      figuraFicha.setAttribute("lado", lado);
      var filaMesa = document.getElementById(codigoGrupoMesa);
      filaMesa.style.className = "filaMesaSeleccionada";
    }
  }
    numGrupo++;
}

// ********************************************************************************************

function seleccionarGrupoJugador() {
  var codGrupo; // Código del grupo
  var colorEsc; // la Escalera es monocolor, luego esto es un entero de 0 a 3
  var colorSer; // la serie de 3 le falta un color (de 0 a 3), a la de 4 ninguno (-1)
  var valorIni = -1; //valor inicial de la escalera
  var inicG = -1; // podición inicial en misFichas del grupo
  var tam = 0; // tamaño del grupo
  var tipo = this.getAttribute ("tipo"); // Tipo = "S"|"E"-núm.de grupo-"F"num
  var numGrupo = this.getAttribute ("numGrupo");
  var fichasJug = [...filaJugador.children]; // conjunto de fichas en al mano del jugador

  var colorExcl = [0, 1, 2, 3];
  var aux2;

  if (tipo != "S" && tipo != "E" && tipo != "A") { //no se ha clicado en una serie o un grupo o ampli
    return;
  }
    
  if (tipo == "A") {
    var grupoMesa = this.getAttribute("grupoMesa");
    var filaMesa = document.getElementById(grupoMesa);
    this.className = "figuraFicha";
    var primero = filaMesa.firstChild;
    this.setAttribute("numGrupo", primero.getAttribute("numGrupo"));

    if (this.getAttribute('lado') == 'izda') {   // solo en las escaleras importa el lado de inserción
      filaMesa.insertBefore(this, primero);
      this.setAttribute('tipo', 'E');
      filaMesa.id = 'E-'+ (Number(grupoMesa.split('-')[1]) + 1) + "-" 
                        + (Number(grupoMesa.split('-')[2]) - 1) + "-" 
                        + grupoMesa.split('-')[3];
    } else if (this.getAttribute("lado") == "dcha") {
        filaMesa.appendChild(this);
        this.setAttribute('tipo', 'E');
        filaMesa.id = 'E-'+ (Number(grupoMesa.split('-')[1]) + 1)  + "-" 
                          + grupoMesa.split('-')[2] + "-" 
                          + grupoMesa.split('-')[3];
   } else {
        filaMesa.appendChild(this);
        this.setAttribute('tipo', 'S');
        filaMesa.id=  'S-4-' + grupoMesa.split('-')[2];
     }

  } else { //tipos S y E
    document.getElementById("TablaMesa");
    filaMesa = document.createElement("tr");
    tablaMesa.appendChild(filaMesa);

  // recorro la fichas del panel del jugador para ver las que forman parte de mi grupo
  for (let i = 0; i < fichasJug.length; i++) {
    if (fichasJug[i].getAttribute("numGrupo") == numGrupo) {
      if (inicG == -1) inicG = i;
      color = arrayColores.indexOf(fichasJug[i].style.color);
      delete colorExcl[colorExcl.indexOf(color)];
      if (valorIni == -1) {valorIni = fichasJug[i].innerHTML;}
      //aux2 = parseInt(fichasJug[i].getAttribute("valorFicha"));
      aux2 = parseInt(fichasJug[i].id);
      delete misFichas[misFichas.indexOf(aux2)];
      tam++;
      filaMesa.appendChild(fichasJug[i]);
      fichasJug[i].className ="figuraFicha";
    } 
  }
  misFichas = misFichas.filter((e) => typeof e == "number");
  if (tipo == "S") {
    colorSer = colorExcl.filter((e) => typeof e == "number");
    codGrupo = "S-" + tam + "-" + valorIni + "-" + colorSer;
  } else {
    colorEsc = color;
    codGrupo = "E-" + tam + "-" + valorIni + "-" + colorEsc;
  }
  filaMesa.id = codGrupo;
  pintarFichas(misFichas, true);
  document.getElementById("textoJugador").innerHTML = "Propuesta de juego";
  document.getElementById("robarFicha").innerHTML = "Cambiar Turno";
}
}


// ************************************************************************
// esta función busca series cuyos componentes sean del mismo valor y distinto color
function buscarSeries(jugador) {
  var p = [];
  var grupoValor = [];
  var grupoValorSinDups = [];
  var valorS = [];
  var cuentaS = 0;
  var tamSer = [];
  var fichas2 = [];
  var series = [];

  var fichas = codifValor(jugador?misFichas:maqFichas);
  ordenar(fichas);
//  if (jugador || depuracion) pintarFichas(fichas, jugador);

  //separo las fichas en grupos del mismo valor "grupoValor[n]"
  for (let n = 0; n < 13; n++) {
    var cuentaDups = 0;
   grupoValor[n] = fichas.filter((el) => Math.floor(el / 100) == n + 1);
    //se pone una marca los dups (Suma 20 al color)
    // ejemplo: la 322 una fichas de valor 3 y color 2 que está duplicada (está tb. la 302)
    let cont = 0;
    for (let i = 1; i < grupoValor[n].length; i++) {
      if (grupoValor[n][i] === grupoValor[n][i - 1]) {
        // el elemento i es un dup
        grupoValor[n][i] += 20; // los dups van del 20 al 23
        cuentaDups++; // numero de dups  en cada grupo de valor n
      }
    }
    ordenar(grupoValor[n]); // ordeno los grupos para que los dups se vayan al final
    // y reconstruyo el array fichas
    //p[n] = fichas2.length;
    fichas2 = fichas2.concat(grupoValor[n]);
    tamSer[n] = grupoValor[n].length - cuentaDups;
    grupoValorSinDups[n] = grupoValor[n].slice(0, tamSer[n]);
    // el grupo de valor n (sin dups) es de 3 o 4 fichas? ==> es una serie
    if (tamSer[n] >= 3) {
      valorS[cuentaS] = n;
      cuentaS++;
      series[n] = codifColor(grupoValorSinDups[n]);
    }
  }
  if (jugador || depuracion) pintarFichas(codifColor(fichas2), jugador);

  var textoJ = document.getElementById("textoJugador");

  if (cuentaS > 0) {
    for (let i of valorS) {
      marcarFichas("S", series[i], jugador);
      if (cuentaS == 1) {
        textoJ.innerHTML = "Juega la serie marcada";
      } else {
        textoJ.innerHTML = "Juega una de las series marcadas";
      }
    }
    return true;
  } else {
    textoJ.innerHTML = "No hay ninguna serie en tu mano";
    return false;
  }
}
// ********************************************************************************************
function buscarEscaleras(jugador) {
  var du = [];
  var p = [];
  var fichas = jugador?misFichas.slice():maqFichas.slice();
  var fichas2 = [];
  var escalera = [];
  // esta función busca escaleras cuyos compenentes sean del mismo color
  var grupoColor = [];
  ordenar(fichas);
  //if (jugador || depuracion) pintarFichas(fichas, jugador);
  // separo las fichas en grupos del mismo color c

  // var posicE = [];
  // var tamanyoE = [];
  var cuentaE = 0;
  for (let c = 0; c <= 3; c++) {
    grupoColor[c] = fichas.filter(el => Math.floor(el / 100) == c);
    //se  pone una marca los dups +20 en el valor
    for (let i = 1, cont = 0; i < grupoColor[c].length; i++) {
      if (grupoColor[c][i] === grupoColor[c][i - 1]) {
        // el elemento i es un dup
        grupoColor[c][i] += 20; // los dups van del 21 al 33
        cont++;
      }
      du[c] = cont;
      ordenar(grupoColor[c]);   // los grupos de color c ya etaban ordenados
                                // esto es para enviarlos dups al final del grupo
    }
    // recompongo el array fichas
    p[c] = fichas2.length;
    fichas2 = fichas2.concat(grupoColor[c]);
    
    var ini = 0;
    var tam = 1;
    var limite = grupoColor[c].length - du[c];
    // recorro el arr grupoColor[c] (sin dups) buscando escaleras
    for (let i = 1; i <= limite; i++) {
      if (grupoColor[c][i] != grupoColor[c][i - 1] + 1 || i == limite) {
        if (tam >= 3) {
          escalera[cuentaE] = grupoColor[c].slice(ini, ini+tam)
          // posicE[cuentaE] = ini  + p[c];
          // tamanyoE[cuentaE] = tam;
          cuentaE++;
        }
        ini = i;
        tam = 1;
      } else {
        tam++;
      }
    }
    
  }
  
  if (jugador || depuracion) pintarFichas(fichas2, jugador);
  var textoJ = document.getElementById("textoJugador");
  
  if (cuentaE > 0) {
    for (let i = 0; i < cuentaE; i++) {
      marcarFichas("E", escalera[i], jugador);
      if (cuentaE == 1) {
        textoJ.innerHTML = "Juega la escalera marcada";
      } else {
        textoJ.innerHTML = "Juega una de las esaleras marcadas";
      }
    }
  } else {
    textoJ.innerHTML = "No hay ninguna escalera en tu mano";
    return false;
  } 
  }


// cambia el turno a computador
//function cambioTurno(jugador) {
//jugarComp();
//  jugador = !jugador;
//}

function robarFicha(jugador) {
    if (arraySaco.length > 0) {
      misFichas.push(arraySaco.pop());
      pintarFichas(misFichas, true);
    }
    else alert ("El saco está vacío");
    //cambioTurno(jugador);
  }
  

  function jugarComp() {
    buscarSeries(false);  //Jugador es false
  }

  /******************************************************************************/
  function sugerirJugada() {

    while (buscarSeries(true))  {
       var filaJugador = document.getElementById("filaJugador");
       var fichasJugador =filaJugador.childNodes;
   

for(var i=0 ; i<fichasJugador.length ; i++){
  fichasJugador[i].addEventListener('click', seleccionarGrupoComputador, false);
}

    // }
    // while (buscarEscaleras(true)){elemento.click());}
    // while (ampliarSerie(true)){elemento.click();}

   }
  }
  /******************************************************************************/

function ampliarSerie(jugador){
  var hayAmpliacion = true;
  var iter = 8;
 while (hayAmpliacion && iter) {
    iter--;
    var hayAmpliacion = false;
  var tablaMesa = document.getElementById("tablaMesa");
  var seriesMesa = [...tablaMesa.children].filter(el => el.id.startsWith("S"));
  var s3Mesa = seriesMesa.filter(el => el.id.split('-')[1] ==3);
  var hayAmpliacion = false;
  var filaJugador = document.getElementById("filaJugador");
  var fichasJugador = [...filaJugador.children];
  var arr = [];
  if (s3Mesa.length > 0) {
    var colores =  s3Mesa.map(el => el.id.split('-')[3]);
    var valores =  s3Mesa.map(el => el.id.split('-')[2]);
    for (let i = 0; i < s3Mesa.length; i++) {
      if (hayAmpliacion) break;
      for (var j = 0; j < fichasJugador.length; j++) {
        if ((fichasJugador[j].innerHTML == valores[i]) &&
           (fichasJugador[j].style.color === arrayColores[colores[i]])) {
          arr[0] = fichasJugador[j].id;
          var codigoGrupoMesa = "S-3-" + valores[i]+ "-" + colores[i]
          marcarFichas("A", arr, true, codigoGrupoMesa);
          hayAmpliacion = true;
          break;
        }
      }
    }
  }
  
}
 if (hayAmpliacion) { 
    //  retrasaSeleccion();
    //  function retrasaSeleccion() {setTimeout(clickEnAmpliaEsc, 2000);}
    //  function clickEnAmpliaEsc() {seleccionarGrupoJugador.call(fichasJugador[j])};
    seleccionarGrupoJugador.call(fichasJugador[j])
  }
  // if (hayAmpliacion) {ampliarSerie(jugador)}
} 


function ampliarEscalera(jugador){
  var hayAmpliacion = true;
  var iter = 8;
 while (hayAmpliacion && iter) {
    iter--;
    var hayAmpliacion = false;
    var tablaMesa = document.getElementById("tablaMesa");
    var e3Mesa = [...tablaMesa.children].filter(el => el.id.startsWith("E"));
    var filaJugador = document.getElementById("filaJugador");
    var fichasJugador = [...filaJugador.children];
    var arr = [];
    if (e3Mesa.length > 0) {
      var tamanyos =    e3Mesa.map(el => el.id.split('-')[1]);
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
            arr[0] = fichasJugador[j].id; // marcarFichas() necesita un array
            var codigoGrupoMesa = e3Mesa[i].id;
            var lado = izda?"izda":"dcha";
            marcarFichas("A", arr, true, codigoGrupoMesa, lado);
            hayAmpliacion = true;
            break;
          }
        }
      }
    }
    if (hayAmpliacion) { 
      //  retrasaSeleccion();
      //  function retrasaSeleccion() {setTimeout(clickEnAmpliaEsc, 2000);}
      //  function clickEnAmpliaEsc() {seleccionarGrupoJugador.call(fichasJugador[j])};
      seleccionarGrupoJugador.call(fichasJugador[j])
    }
  }
}





 








// function seleccionarGrupoComputador(fichas) {
//   var codG; // Código del grupo
//   var colorEsc; // la Escalera es monocolor, luego esto es un entero de 0 a 3
//   var colorSer; // la serie de 3 le falta un color (de 0 a 3), a la de 4 ninguno (-1)
//   var auxId;
//   var idFicha = this.id; // las fichas tienen un Id = "S"|"E"-núm.de grupo-"F"num
//   // si pertenecen a un grupo. Si no "F"num
//   var valorIni = -1; //valor inicial de la escalera
//   var inicG = -1; // podición inicial en misFichas del grupo
//   var tam = 0; // tamaño del grupo
//   var arr = idFicha.split("-");
//   var fichasCom = [...filaJugador.children]; // comjunto de fichas en al mano del jugador
//   var colorExcl = [0, 1, 2, 3];

//   if (arr[0] != "S" && arr[0] != "E") {
//     return;
//   }
//   idGrupo = arr[0] + "-" + arr[1];
//   // recorro la fichas del panel del jugador para ver las que estan marcadas
//   for (let i = 0; i < fichasCom.length; i++) {
//     auxId = fichasCom[i].numGrupo;
//     if (auxId.startsWith(numGrupo)) {
//       if (inicG == -1) inicG = i;
//         color = fichas[i] % 100;
//         if (color >= 20) color = color - 20;
//         delete colorExcl[colorExcl.indexOf(color)];
//         valorIni = Math.floor(fichas[i] / 100);
//       tam++;
  
//   }
//   if (arr[0] == "S") {
//     colorSer = colorExcl.filter((e) => typeof e == "number");
//     codGrupo = arr[0] + "-" + tam + "-" + valorIni + "-" + colorSer;
//   } else {
//     codGrupo = arr[0] + "-" + tam + "-" + valorIni + "-" + colorEsc;
//   }
//   var aux;
//   pintarGrupo(codGrupo);
//   for (let i = 0; i < tam; i++) {
//     aux = misFichas.findIndex((el) => Math.floor(el / 100) == valorIni);
//     delete misFichas[aux];
//   }

//   var limp = misFichas.filter((e) => typeof e == "number");
//   if (aux.lenth != tam) alert("algo va mal");

//   for (let i = 0; i < tam; i++) {
//     misFichas.splice(misFichas.indexOf(fichas[inicG + i]), 1);
//   }

//   if (jugador) {
//     misFichas = fichas.slice();
//   } else {
//     maqFichas = fichas.slice();
//   }
//   pintarFichas();
// }
// }
