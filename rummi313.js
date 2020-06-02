
const arrayColores = ["black", "red", "blue", "magenta"];
var fichasSaco = [];
var misFichas = [];
var maqFichas = [];
var numGrupo = 0;
var filaMesa;
var filaJugador;
var filaMaquina;
var filaComp;

var tablaJugador;
var tablaComp;

// Variables que definen el estado
var depuracion = false;
var sacoVisible = true;

function nuevoJuego() {
  location.reload();
}
// ********************************************************************************************

function debug() { 
    depuracion = !depuracion;
    document.getElementById("botonDebug").innerText = depuracion ?
     "Change to NORMAL mode":"Change to DEBUG mode";
    document.getElementById("botonSaco").style.visibility =  depuracion ?
      "visible":"hidden";
}

// ********************************************************************************************

function iniciar(prueba) {
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
    arraySaco = [101,108,203,202,201,207,3,
      103,303,106,306,106,109,203,6,206,204,107,205,206,13,
      104,6,302,110,105,103,402,203,203,303,107,213,213,308];
  } else {
    arraySaco = [101,108,203,202,201,302,103,
      8,101,102,302,105,106,103,4,202,204,204,2,205,206,
      103,006,302,110,105,103,402,203,203,303,107,213,213,308];
  }
    //representación gráfica
  for (let c = 0, i=0; c < 8; c++) {// 8 filas
    if (i == arraySaco.length) break;
    filaSaco = this.document.createElement("tr");
    tablaSaco.appendChild(filaSaco);
    for (let f = 0; f < 13; f++) {
      // 13 filas 8*13 = 104 fichas
      if (i == arraySaco.length) break;
      figuraFicha = this.document.createElement("td");
      figuraFicha.className = "figuraFicha";
      figuraFicha.addEventListener("click",  seleccionarGrupo);
      figuraFicha.innerHTML = arraySaco[i] % 100;
      figuraFicha.id = 'S' + arraySaco[i];
      figuraFicha.style.color = arrayColores[Math.floor(arraySaco[i] / 100)];
      filaSaco.appendChild(figuraFicha);
      i++;
    }  
    fichasSaco = fichasSaco.concat([...filaSaco.children]);
  }  
  repartirFichas()
 // document.getElementById("botonRepartir").disabled = true;
  document.getElementById("botonRepartir").style.visibility = "hidden";  
}

// ********************************************************************************************
function verSaco() {
  var botonSaco = document.getElementById("botonSaco");
  if (sacoVisible) {
    document.getElementById("botonRepartir").style.visibility = "hidden";  
    botonSaco.innerText = "Show Saco";
  } else {
    document.getElementById("botonRepartir").style.visibility = "show";  
    botonSaco.innerText = "Hide Saco";
  }
  sacoVisible = !sacoVisible;
}

// ********************************************************************************************

function repartirFichas() {
  tablaJugador = document.getElementById("tablaJugador");
  filaJugador = this.document.createElement("tr");
  tablaJugador.appendChild(filaJugador);
  filaJugador.id = "filaJugador";

  tablaMaquina = document.getElementById("tablaMaquina");
  filaMaquina= this.document.createElement("tr");
  tablaMaquina.appendChild(filaMaquina);
  filaMaquina.id = "filaMaquina";

  for (let i = 0; i < 14; i++) { // se reparten 14 fichas
    figuraFicha = fichasSaco.pop()
    figuraFicha.id = 'C' + figuraFicha.id.substr(1)
    filaMaquina.appendChild(figuraFicha);
  }
  for (let i = 0; i < 14; i++) {
    figuraFicha = fichasSaco.pop()
    figuraFicha.id = 'F' + figuraFicha.id.substr(1); 
    filaJugador.appendChild(figuraFicha);
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

// function ordenarFichas(arreglo) {  
// arreglo.sort(function (a, b) {
//     return a.id - b.id;
//   });
// }

function ordenar(arreglo) {  
  arreglo.sort(function (a, b) {
      return a - b;
    });
  }

// *******************************************************************************************
// solo se marcan als fichas del jugador ?????

function marcarFichas(tipo, ides, jugador, codigoGrupoMesa, lado) {
 var figuraFicha;
  for (let i = 0; i < ides.length; i++) {
    if (jugador) figuraFicha = document.getElementById('F' + ides[i]);
    else figuraFicha = document.getElementById('C' + ides[i]);
    figuraFicha.className = "figuraFichaMarcada";
    figuraFicha.setAttribute("grup", tipo);
    figuraFicha.setAttribute("numGrupo", numGrupo);
    if (tipo == "A"){
      figuraFicha.setAttribute("grupoMesa", codigoGrupoMesa); 
      figuraFicha.setAttribute("lado", lado);
      var filaMesa = document.getElementById(codigoGrupoMesa);
    }
  }
    numGrupo++;
}

// ********************************************************************************************

function seleccionarGrupo(a,b) {
  var codGrupo; // Código del grupo
  var colorEsc; // la Escalera es monocolor, luego esto es un entero de 0 a 3
  var colorSer; // la serie de 3 le falta un color (de 0 a 3), a la de 4 ninguno (-1)
  var valorIni = -1; //valor inicial de la escalera
  var inicG = -1; // podición inicial en misFichas del grupo
  var tam = 0; // tamaño del grupo
  var tipo = this.getAttribute ("grup"); // Tipo = 'S'|'E'-núm.de grupo-"F"num
  var numGrupo = this.getAttribute ("numGrupo");
  var colorExcl = [0, 1, 2, 3];
  var fichas = [];
 

  if (tipo != 'S' && tipo != 'E' && tipo != 'A') { //no se ha clicado en una serie o un grupo o ampli
    return;
  }
  
  fichas = [...filaJugador.children];

  if (tipo == 'A') {
    var grupoMesa = this.getAttribute("grupoMesa");
    var filaMesa = document.getElementById(grupoMesa);
    this.className = "figuraFicha";
    var primero = filaMesa.firstChild;
    this.setAttribute("numGrupo", primero.getAttribute("numGrupo"));

    if (this.getAttribute('lado') == 'izda') {   // solo en las escaleras importa el lado de inserción
      filaMesa.insertBefore(this, primero);
      this.id = 'M' + this.id.substr(1);
      this.setAttribute('grup', 'E');

      filaMesa.id = 'E-'+ (Number(grupoMesa.split('-')[1]) + 1) + "-" 
                        + (Number(grupoMesa.split('-')[2]) - 1) + "-" 
                        + grupoMesa.split('-')[3];
    } else if (this.getAttribute("lado") == "dcha") {
        filaMesa.appendChild(this);
      this.id = 'M' + this.id.substr(1);
      this.setAttribute('grup', 'E');
      filaMesa.id = 'E-'+ (Number(grupoMesa.split('-')[1]) + 1)  + "-" 
                          + grupoMesa.split('-')[2] + "-" 
                          + grupoMesa.split('-')[3];
   } else {
        filaMesa.appendChild(this);
        this.id = 'M' + this.id.substr(1);
        this.setAttribute('grup', 'S');
        filaMesa.id=  'S-4-' + grupoMesa.split('-')[2];
     }

  } else { //tipos S y E
    document.getElementById("TablaMesa");
    filaMesa = document.createElement("tr");
    tablaMesa.appendChild(filaMesa);

  // recorro la fichas del panel del jugadorcomputador para ver las que forman parte de mi grupo
  for (let i = 0; i < fichas.length; i++) {
    if (fichas[i].getAttribute("numGrupo") == numGrupo) {
      if (inicG == -1) inicG = i;
      color = arrayColores.indexOf(fichas[i].style.color);
      delete colorExcl[colorExcl.indexOf(color)];
      if (valorIni == -1) {valorIni = fichas[i].innerHTML;}
      tam++;
      filaMesa.appendChild(fichas[i]);
      fichas[i].className ="figuraFicha";
    } 
  }
//  misFichas = misFichas.filter((e) => typeof e == "number");
  if (tipo == "S") {
    colorSer = colorExcl.filter((e) => typeof e == "number");
    codGrupo = "S-" + tam + "-" + valorIni + "-" + colorSer;
  } else {
    colorEsc = color;
    codGrupo = "E-" + tam + "-" + valorIni + "-" + colorEsc;
  }
  filaMesa.id = codGrupo;
  document.getElementById("textoJugador").innerHTML = "Propuesta de juego";
  document.getElementById("robarFicha").innerHTML = "Cambiar Turno";
}
}


// ************************************************************************
// esta función busca series cuyos componentes sean del mismo valor y distinto color
function buscarSeries(jugador) {
  var grupoValor = [];
  var grupoValorSinDups = [];
  var valorS = [];
  var valorS2 = [];
  
  var tamSer = [];
  var fichas2 = [];
  var series = []; // seriers de 3 o 4 fi fichas
  var s2 = []; // proto series de 2 fichas

   
  var fichasJugador = [...filaJugador.children];
  for(let i =0; i<fichasJugador.length; i++ ) {
      fichasJugador[i].className = "figuraFicha";
  }
      misFichas = [...filaJugador.children].map(el => el.id.substr(1));
     maqFichas = [...filaMaquina.children].map(el => el.id.substr(1));
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         var fichas = codifValor(jugador?misFichas:maqFichas);
  ordenar(fichas);
   //separo las fichas en grupos del mismo valor "grupoValor[n]"
     var cuentaS = 0;
     var cuentaS2 = 0;
     
   for (let n = 0; n < 13; n++) {
    var cuentaDups = 0;
    grupoValor[n] = fichas.filter((el) => Math.floor(el / 100) == n + 1);
    //se pone una marca los dups (Suma 20 al color)
    // ejemplo: la 322 una fichas de valor 3 y color 2 que está duplicada (está tb. la 302)
    for (let i = 1; i < grupoValor[n].length; i++) {
      if (grupoValor[n][i] === grupoValor[n][i - 1]) {
        // el elemento i es un dup
        grupoValor[n][i] += 20; // los dups van del 20 al 23
        cuentaDups++; // numero de dups  en cada grupo de valor n
      }
    }
    ordenar(grupoValor[n]); // ordeno los grupos para que los dups se vayan al final
    // y reconstruyo el array fichas
    fichas2 = fichas2.concat(grupoValor[n]);
    tamSer[n] = grupoValor[n].length - cuentaDups;
    grupoValorSinDups[n] = grupoValor[n].slice(0, tamSer[n]);
    // el grupo de valor n (sin dups) es de 3 o 4 fichas? ==> es una serie
    if (tamSer[n] >= 3) {
      valorS[cuentaS] = n;
      cuentaS++;
      series[n] = codifColor(grupoValorSinDups[n]);
    } else if (tamSer[n] == 2) {
      valorS2[n] = n;
      cuentaS2++
      s2[n]= codifColor(grupoValorSinDups[n]);
    }
  }
  var tablaMesa = document.getElementById("tablaMesa");
  var s4Mesa = [...tablaMesa.children].filter(el => el.id.startsWith("S-4"));
  var fichaS4;
  var meVoy = false;
  for (let i = 0; i < s4Mesa.length; i++) { 
    if (meVoy == true) break
    for (let n of valorS2) {
      if (meVoy == true) break
      if ((valorS2[n] + 1)== s4Mesa[i].id.split('-')[2]) {
        for (let c=0; c < 4; c++) {
          if (!(s2[n].find(el => el == Number(c*100 + n + 1))))  {
             fichaS4 = (s2[n].find(el => el == Number(c*100 + n + 1)));
           alert("La ficha de un serie de 4 completa una serie de dos " + Number(c*100 + n + 1));
           meVoy = true; 
           break;
          }
        }
      }
    }
  }

 // representar las fichas ordenadas 
  var arr  = codifColor(fichas2,true);
  for (let i = 0; i < fichas2.length; i++) {
    figuraFicha= document.getElementById('F' + arr[i]);
   if (jugador) filaJugador.appendChild(figuraFicha);
   else filaMaquina.appendChild(figuraFicha);
  } 

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
// Esta función busca escaleras cuyos compenentes sean del mismo color
function buscarEscaleras(jugador) {
  var du = [];
  var p = [];
  var fichas2 = [];
  var escalera = [];
  var grupoColor = [];
  
  //if (jugador || depuracion) pintarFichas(fichas, jugador);
  // separo las fichas en grupos del mismo color c
  
  fichasJugador = [...filaJugador.children];
  for (let i =0; i< fichasJugador.length; i++) {
    fichasJugador[i].className = "figuraFicha";
  }
  misFichas = [...filaJugador.children].map(el => parseInt(el.id.substr(1)));
  maqFichas = Number([...filaMaquina.children].map(el => el.id.substr(1)));
  var fichas = jugador?misFichas:maqFichas;
  ordenar(fichas);

  var cuentaE = 0;
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
      du[c] = cont;
      ordenar(grupoColor[c]);   // los grupos de color c ya etaban ordenados
                                // esto es para enviarlos dups al final del grupo
    }
    // recompongo el array fichas
    fichas2 = fichas2.concat(grupoColor[c]);
    
    var ini = 0;
    var tam = 1;
    var limite = grupoColor[c].length - du[c];
    // recorro el arr grupoColor[c] (sin dups) buscando escaleras
    for (let i = 1; i <= limite; i++) {
      if (grupoColor[c][i] != grupoColor[c][i - 1] + 1 || i == limite) {
        if (tam >= 3) {
          escalera[cuentaE] = grupoColor[c].slice(ini, ini+tam)
          cuentaE++;
        }
        ini = i;
        tam = 1;
      } else {
        tam++;
      }
    } 
  }
  
  //if (jugador || depuracion) pintarFichas(fichas2, jugador);
  var textoJ = document.getElementById("textoJugador");
  
  var arr  = desDuplicador(fichas2);
  for (let i = 0; i < fichas2.length; i++) {
    figuraFicha= document.getElementById('F' + arr[i]);
    filaJugador.appendChild(figuraFicha);
  }


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
    if (fichasSaco.length > 0) {
     var figuraFicha = fichasSaco.pop();
     figuraFicha.id = 'F' + figuraFicha.id.substr(1);
     filaJugador.appendChild(figuraFicha);

      //pintarFichas(misFichas, true);
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
 // fichasJugador[i].addEventListener('cl, false);
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
          arr[0] = fichasJugador[j].id.substr(1);
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
    //  function clickEnAmpliaE.call(fichasJugador[j].call(fichasJugador[j])
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
            arr[0] = fichasJugador[j].id.substr(1); // marcarFichas() necesita un array
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
      seleccionarGrupo.call(fichasJugador[j]);
      // retrasaSeleccion();
      // function retrasaSeleccion() {setTimeout(clickEnAmpliaEsc, 2000);}
      // function clickEnAmpliaEsc(){seleccionarGrupo.call(fichasJugador[j])}
    }
  }
}



// ********************************************************************************************

function seleccionarGrupoComp() {
  var codGrupo; // Código del grupo
  var colorEsc; // la Escalera es monocolor, luego esto es un entero de 0 a 3
  var colorSer; // la serie de 3 le falta un color (de 0 a 3), a la de 4 ninguno (-1)
  var valorIni = -1; //valor inicial de la escalera
  var inicG = -1; // podición inicial en misFichas del grupo
  var tam = 0; // tamaño del grupo
  var tipo = this.getAttribute ("grup"); // Tipo = 'S'|'E'-núm.de grupo-"F"num
  var numGrupo = this.getAttribute ("numGrupo");
  var colorExcl = [0, 1, 2, 3];
  var fichas = [];
 

  if (tipo != 'S' && tipo != 'E' && tipo != 'A') { //no se ha clicado en una serie o un grupo o ampli
    return;
  }
  
 fichas = [...filaMaquina.children].map(el => el.id.substr(1));
  
  if (tipo == 'A') {
    var grupoMesa = this.getAttribute("grupoMesa");
    var filaMesa = document.getElementById(grupoMesa);
    this.className = "figuraFicha";
    var primero = filaMesa.firstChild;
    this.setAttribute("numGrupo", primero.getAttribute("numGrupo"));

    if (this.getAttribute('lado') == 'izda') {   // solo en las escaleras importa el lado de inserción
      filaMesa.insertBefore(this, primero);
      this.id = 'M' + this.id.substr(1);
      this.setAttribute('grup', 'E');

      filaMesa.id = 'E-'+ (Number(grupoMesa.split('-')[1]) + 1) + "-" 
                        + (Number(grupoMesa.split('-')[2]) - 1) + "-" 
                        + grupoMesa.split('-')[3];
    } else if (this.getAttribute("lado") == "dcha") {
        filaMesa.appendChild(this);
      this.id = 'M' + this.id.substr(1);
      this.setAttribute('grup', 'E');
      filaMesa.id = 'E-'+ (Number(grupoMesa.split('-')[1]) + 1)  + "-" 
                          + grupoMesa.split('-')[2] + "-" 
                          + grupoMesa.split('-')[3];
   } else {
        filaMesa.appendChild(this);
        this.id = 'M' + this.id.substr(1);
        this.setAttribute('grup', 'S');
        filaMesa.id=  'S-4-' + grupoMesa.split('-')[2];
     }

  } else { //tipos S y E
    document.getElementById("TablaMesa");
    filaMesa = document.createElement("tr");
    tablaMesa.appendChild(filaMesa);

  // recorro la fichas del panel del jugadorcomputador para ver las que forman parte de mi grupo
  for (let i = 0; i < fichas.length; i++) {
   if (fichas[i].getAttribute("numGrupo") == numGrupo) {
      if (inicG == -1) inicG = i;
      color = arrayColores.indexOf(fichas[i].style.color);
      delete colorExcl[colorExcl.indexOf(color)];
      if (valorIni == -1) {valorIni = fichas[i].innerHTML;}
      tam++;
      filaMesa.appendChild(fichas[i]);
      fichas[i].className ="figuraFicha";
    } 
  }
//  misFichas = misFichas.filter((e) => typeof e == "number");
  if (tipo == "S") {
    colorSer = colorExcl.filter((e) => typeof e == "number");
    codGrupo = "S-" + tam + "-" + valorIni + "-" + colorSer;
  } else {
    colorEsc = color;
    codGrupo = "E-" + tam + "-" + valorIni + "-" + colorEsc;
  }
  filaMesa.id = codGrupo;
  // document.getElementById("textoJugador").innerHTML = "Propuesta de juego";
  document.getElementById("robarFicha").innerHTML = "Cambiar Turno";
}
}

// 