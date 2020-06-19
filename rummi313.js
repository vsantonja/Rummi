
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
var modoDebug = false;
var sacoVisible = true;

function nuevoJuego() {
  location.reload();
}
// ********************************************************************************************
// Obtiene el código del grupo que hay en la Mesa. Se supone que el aarray que se pasa
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
          colorExcl = i;
        }
      }
      codigo = codigo + colorExcl;
    }
  }
   return codigo; 
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
    arraySaco = [101,108,203,202,201,207,9,10,
      103,303,106,306,106,109,203,6,206,204,107,205,206,13,
      103,006,302,110,105,103,112,203,203,303,107,213,213,308];
    arrayMesa =[
            [10, 110, 210, 310],
            [1, 2, 3, 4, 5, 6, 7, 8],
      ]
     
  } else {
    arraySaco = [101,108,203,2,201,302,103,
      8,101,102,302,105,106,103,4,202,204,204,2,205,206,
      103,006,302,110,105,103,112,203,203,303,107,213,213,308];
  }
    //conversión a fichas
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
    tablaSaco.style.display =  "none";
  }  
  repartirFichas();
  
 // Si hay fichas en la mesa, ponlas. Esto solo ocurre en fase de desarrollo
 // para reproducir determinados escenarios
  tablaMesa = document.getElementById("tablaMesa");
  if (arrayMesa)  {
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
        filaMesa.appendChild(figuraFicha);
      }
    }
  }
 // solo se reparte una vez. Así que escondo los botones de reparto
  document.getElementById("botonRepartir").style.visibility =  "hidden";  
  document.getElementById("botonRepartir1").style.visibility = "hidden";  
  document.getElementById("botonRepartir2").style.visibility = "hidden";
}

// ********************************************************************************************
function debug() {
  botonDebug = document.getElementById("botonDebug");
  tablaSaco = document.getElementById("tablaSaco");
  tablaMaquina = document.getElementById("tablaMaquina");

  if (modoDebug) {
    tablaSaco.style.display = "none"; 
    botonDebug.innerText = "modo debug";
    document.getElementById("letreroComputador").style.display = "none";
    tablaMaquina.style.display = "none";
   } else {
   tablaSaco.style.display = "inline"; 
   botonDebug.innerText = "modo normal";
   document.getElementById("letreroComputador").style.display = "initial";
   tablaMaquina.style.display = "inline";

  }
  modoDebug = !modoDebug;
}

   // ********************************************************************************************

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
    figuraFicha.ondragstart="drag(event)";
    filaJugador.appendChild(figuraFicha);
  }
  document.getElementById("letreroComputador").style.display = "none";
  tablaMaquina.style.display = "none";
 }

 function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
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

function marcarFichas(groupType, group, jugador, codigoGrupoMesa, lado) {
   var figuraFicha;
   var s2 = 0
  if (groupType == 's' || groupType == 'e') {s2 = 1;}  // en los duos, el tercer elemento es de la mesa
  for (let i = 0; i < (group.length - s2); i++) {
    if (jugador) figuraFicha = document.getElementById('F' + group[i]);
    else figuraFicha = document.getElementById('C' + group[i]);
    figuraFicha.className = "figuraFichaMarcada";
    figuraFicha.setAttribute("gType", groupType);
    figuraFicha.setAttribute("numGrupo", numGrupo);
    if (groupType == "A") {
      figuraFicha.setAttribute("grupoMesa", codigoGrupoMesa); 
      figuraFicha.setAttribute("lado", lado);
      var filaMesa = document.getElementById(codigoGrupoMesa);
    }
    if (groupType == 's' || groupType == 'e') {
      // en este caso es el nuevo código de la fila de la mesa implicada
      figuraFicha.setAttribute("grupoMesa", codigoGrupoMesa); 
      figuraFicha = document.getElementById('M' + group[group.length-1]);
      figuraFicha.className = "fichaMesaSelec";
      figuraFicha.setAttribute("gType", groupType);
      figuraFicha.setAttribute("numGrupo", numGrupo);
      if (groupType == 'e') figuraFicha.setAttribute("lado", lado);
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
  var tam = 0; // tamaño del grupo
  var groupType = this.getAttribute ("gType"); // Tipo = 'S'|'E'-núm.de grupo-"F"num
  var numGrupo = this.getAttribute ("numGrupo");
  var colorExcl = [0, 1, 2, 3];
  var fichas = [];
 

  if (groupType != 'S' && groupType != 'E' && groupType != 'A' && groupType !='s' && groupType !='e') { //no se ha clicado en una serie o un grupo o ampli
    return;
  }
  
  fichas = [...filaJugador.children];

  if (groupType == 'A') { 
    var grupoMesa = this.getAttribute("grupoMesa");
    var filaMesa = document.getElementById(grupoMesa);
    this.className = "figuraFicha";
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
    document.getElementById("TablaMesa");
    filaMesa = document.createElement("tr");
    tablaMesa.appendChild(filaMesa);

  // recorro la fichas del panel del jugadorcomputador para ver las que forman parte de mi grupo
  for (let i = 0; i < fichas.length; i++) {
    if (fichas[i].getAttribute("numGrupo") == numGrupo) {
      var color = arrayColores.indexOf(fichas[i].style.color);
      delete colorExcl[colorExcl.indexOf(color)];
      if (valorIni == -1) {valorIni = fichas[i].innerHTML;}
      tam++;
      filaMesa.appendChild(fichas[i]);
      fichas[i].className ="figuraFicha";
      fichas[i].removeAttribute("gType");
      fichas[i].removeAttribute("numGrupo");
      fichas[i].id ='M' + fichas[i].id.substr(1);
      //nuevoCodigoS3Mesa = 
      filaMesa.id = "S-3-"
    } 
  }
    if (groupType == 's'|| groupType == 'e')  {
      var primero2 = filaMesa.firstChild;
      fichaMesa = [...document.getElementsByClassName('fichaMesaSelec')]; // solo PUEDE haber 1
      if (fichaMesa[0].getAttribute('lado') == 'izda') {
        filaMesa.insertBefore(fichaMesa[0], primero2);
      } else {
      //fichaMesa[0].parentElement.id 
      
      
      filaMesa.appendChild(fichaMesa[0]);
      }
      
      fichaMesa[0].className = "figuraFicha";
      fichaMesa[0].grup = "S";
      //filAMesa.id ="S-3-" + valorIni + "-" color

    }

    if (groupType == "S") {
        colorSer = colorExcl.filter(e => typeof e == "number");
        codGrupo = "S-" + tam + "-" + valorIni + "-" + colorSer;
    } else if (groupType == 'E') {
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
  var nuevaserie = [];
   
  var fichasJugador = [...filaJugador.children];
  // primero, hacemos limpieza
  for(let i = 0; i < fichasJugador.length; i++ ) {
      fichasJugador[i].className = "figuraFicha";
      fichasJugador[i].removeAttribute("gType");
      fichasJugador[i].removeAttribute("numGrupo");
  }     
  misFichas = [...filaJugador.children].map(el => el.id.substr(1));
  maqFichas = [...filaMaquina.children].map(el => el.id.substr(1));
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
    fichas2 = fichas2.concat(grupoValor[n]);
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
  var s4Mesa = [...tablaMesa.children].filter(el => el.id.startsWith("S-4"));
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
  var arr  = codifColor(fichas2,true);
  for (let i = 0; i < fichas2.length; i++) {
    figuraFicha= document.getElementById('F' + arr[i]);
   if (jugador) filaJugador.appendChild(figuraFicha);
   else filaMaquina.appendChild(figuraFicha);
  } 

  var textoJ = document.getElementById("textoJugador");
  if (cuentaS3 > 0) {
    for (let i of valorS) {
      marcarFichas("S", series[i], jugador);
      if (cuentaS3 == 1) {
        textoJ.innerHTML = "Juega la serie marcada";
      } else {
        textoJ.innerHTML = "Juega una de las series marcadas";
      }
    }
    return true;
  } else if (cont > 0) {
    for (let i =0; i < nuevaserie.length; i++) {
      var nuevoCodigoS3Mesa = "S-3-" + num + "-" + c;
      marcarFichas("s", nuevaserie[i], jugador, nuevoCodigoS3Mesa);
      textoJ.innerHTML = "Juega la(s) serie(s) marcada(s) co n una ficha de la mesa";
    } 
  } else {
    textoJ.innerHTML = "No hay ninguna serie en tu mano";
    return false;
  }
}


// ********************************************************************************************
// Esta función busca escaleras cuyos compenentes sean del mismo color
function buscarEscaleras(jugador) {
  var du = [];
  var fichas2 = [];
  var escalera = [];
  var grupoColor = [];
  var esc2 = [];
  var col2 = [];
  var cuentaE3 = 0;
  var cuentaE2 = 0;

  // Limpieza: desmarca, borra el tipo de grupo y el numero de grupo
  fichasJugador = [...filaJugador.children];
  for (let i =0; i< fichasJugador.length; i++) {
    fichasJugador[i].className = "figuraFicha";
    fichasJugador[i].removeAttribute("gType");
    fichasJugador[i].removeAttribute("numGrupo");
  }

  misFichas = [...filaJugador.children].map(el => parseInt(el.id.substr(1)));
  maqFichas = Number([...filaMaquina.children].map(el => el.id.substr(1)));
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

    // cvoy recomponiendo el array fichas del jugador o el computador
    fichas2 = fichas2.concat(grupoColor[c]);
    
    var ini = 0;
    var tam = 1;
    var limite = grupoColor[c].length - du[c];

    // recorro el arr grupoColor[c] (sin dups) buscando escaleras
    // una especie de parser que localiza escaleras
    for (let i = 1; i <= limite; i++) {
      if (grupoColor[c][i] != grupoColor[c][i - 1] + 1 || i == limite) {
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
  
  //if (jugador || modoDebug) pintarFichas(fichas2, jugador);
  var textoJ = document.getElementById("textoJugador");
  var arr  = desDuplicador(fichas2); // quita el +20 en los dups (ya no hace falta)
  // redibujo las fichas de Jugador o computador
  for (let i = 0; i < fichas2.length; i++) {
    figuraFicha= document.getElementById('F' + arr[i]);
    filaJugador.appendChild(figuraFicha);
  }

  if (cuentaE3 > 0) {
    for (let i = 0; i < cuentaE3; i++) {
      marcarFichas("E", escalera[i], jugador);
      if (cuentaE3 == 1) { textoJ.innerHTML = "Juega la escalera marcada";
      } else { textoJ.innerHTML = "Juega una de las esaleras marcadas";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 }
    }


  } else if (cuentaE2 > 0) {
    for (let i = 0; i < cuentaE2; i++) {
      // para las esc de 2 elementos busco en la mesa una serie de 4 on una escalera de 
      // 4 o 5 o 6 ...al que el pueda quitar la ficha que me falta: por la izda o 
      // por la dcha. Las fichas que busco son las siguientes:
      var fichaIzda;
      var fichaDcha;
      if (esc2[i][0] % 100 == 1) fichaIzda = -1;  // no hay ficha a la izda
      else fichaIzda = esc2[i][0] - 1;

      if (esc2[i][1] % 100 == 13) fichaDcha = -1; // no hay ficha a la dcha
      else fichaDcha =parseInt(esc2[i][1]) + parseInt(1);
      // intento de ver si la fichaIzda está en la mesa
      posibleFichaIzda = document.getElementById("M" + fichaIzda);
      if (posibleFichaIzda) {
        // si que esta, vamos a ver si esta en un lugar aprovechable
        var cgm;
        var filaId = posibleFichaIzda.parentElement.id;
        var esS4 = filaId.startsWith("S-4-");
        var esE = filaId.startsWith("E-");
        var mayorQue3 = (filaId.split("-")[1] > 3);
        var porIzda =(filaId.split("-")[2] - 1 ==  fichaIzda%100);
        var porDcha = ((parseInt(filaId.split("-")[2])+parseInt(filaId.split("-")[1])-1)  == fichaIzda%100);
      if ( esS4 || (esE && mayorQue3 && (porIzda || porDcha))) {
      //if (esE) {
        esc2[i][2] = fichaIzda;
        if (esE) cgm = "E-" + (filaId.split("-")[1]-1) + "-";
        marcarFichas("e", esc2[i], jugador, cgm,"izda");

    
      //alert ("escalera de 2 completable por la izda.");
      textoJ.innerHTML = "Juega la escalera marcada (2 fichas) junto a una ficha de la mesa";
    } else {
   // si que esta, vamos a ver si esta en un lugar aprovechable
    var cgm;
    posibleFichaDcha = document.getElementById("M" + fichaDcha);
    if (posibleFichaDcha) {
      var filaId = posibleFichaDcha.parentElement.id;
      var esS4 = filaId.startsWith("S-4-");
      var esE = filaId.startsWith("E-");
      var mayorQue3 = (filaId.split("-")[1] > 3);
      var porIzda =(filaId.split("-")[2] - 1 ==  fichaIzda%100);
      var porDcha = ((parseInt(filaId.split("-")[2])+parseInt(filaId.split("-")[1])-1)  == fichaIzda%100);
      if ( esS4 || (esE && mayorQue3 && (porIzda || porDcha))) {
        //if (esE) {
          esc2[i][2] = fichaDcha;
          if (esE) cgm = "E-" + (filaId.split("-")[1]-1) + "-";
          marcarFichas("e", esc2[i], jugador, cgm, "dcha");
  
    }
    textoJ.innerHTML = "Juega la escalera marcada (2 fichas) junto a una ficha de la mesa";
  } else  {
    textoJ.innerHTML = "No hay ninguna escalera en tu mano";
    return false;
  } 

}}}}}

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
   

while (buscarEscaleras(true)){}
while (ampliarSerie(true)){}

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
  var tam = 0; // tamaño del grupo
  var groupType = this.getAttribute ("gType"); // Tipo = 'S'|'E'-núm.de grupo-"F"num
  var numGrupo = this.getAttribute ("numGrupo");
  var colorExcl = [0, 1, 2, 3];
  var fichas = [];
 

  if (groupType != 'S' && groupType != 'E' && groupType != 'A') { //no se ha clicado en una serie o un grupo o ampli
    return;
  }
  
 fichas = [...filaMaquina.children].map(el => el.id.substr(1));
  
  if (groupType == 'A') {
    var grupoMesa = this.getAttribute("grupoMesa");
    var filaMesa = document.getElementById(grupoMesa);
    this.className = "figuraFicha";
    var primero = filaMesa.firstChild;
    this.setAttribute("numGrupo", primero.getAttribute("numGrupo"));
r
    if (this.getAttribute('lado') == 'izda') {   // solo en las escaleras importa el lado de inserción
      filaMesa.insertBefore(this, primero);
      this.id = 'M' + this.id.substr(1);
      this.setAttribute("gType", 'E');

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

  } else { //groupTypes S y E
    document.getElementById("TablaMesa");
    filaMesa = document.createElement("tr");
    tablaMesa.appendChild(filaMesa);

  // recorro la fichas del panel del jugadorcomputador para ver las que forman parte de mi grupo
  for (let i = 0; i < fichas.length; i++) {
   if (fichas[i].getAttribute("numGrupo") == numGrupo) {
      color = arrayColores.indexOf(fichas[i].style.color);
      delete colorExcl[colorExcl.indexOf(color)];
      if (valorIni == -1) {valorIni = fichas[i].innerHTML;}
      tam++;
      filaMesa.appendChild(fichas[i]);
      fichas[i].className ="figuraFicha";
    } 
  }
//  misFichas = misFichas.filter((e) => typeof e == "number");
  if (groupType == "S") {
    colorSer = colorExcl.filter((e) => typeof e == "number");
    codGrupo = "S-" + tam + "-" + valorIni + "-" + colorSer;
  } else {
    colorEsc = color;
    codGrupo = "E-" + tam + "-" + valorIni + "-" + colorEsc;
  }
  filaMesa.id = codGrupo;
  // document.getElementById("textoJugador").innerHTML = "Propuesta de juego";
  document.getElementById("robarFicha").innerHTML = "Cambiar Turno";
}}
