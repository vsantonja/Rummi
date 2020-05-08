const arrayColores = ["black", "red", "blue", "magenta"];

var arraySaco = [];
var misFichas = [];
var maqFichas = [];

var numGrupo = 0;
var filaMesa;
var filaJugador;
var filaComp;
var tablaMesa;
var tablaJugador;
var tablaComp;

// Variables que definen el estado
var xColor = true; // es al codif que se usa para manejar escakeras
var depuracion = true;
var sacoNoVisible = true;

function nuevoJuego() {
  location.reload();
}

function iniciar() {
  // hay 2 juegos de cada
  for (let a = 1, i=0; a < 3; a++) {
   // 13 valores del 1 al 13
    for (let v = 1; v < 14; v++) {
      // y 4 colores del 0 al 3
      for (let c = 0; c < 4; c++) {
        arraySaco[i] = c * 100 + v; // Codif. por color (xColor = true) 
        // Es al codificación por defecto.
        // Ejemplo la ficha 108 es de color 1 y valor 8
        i++;
      }
    }
  }
  //remuevo el saco
  arraySaco.sort((a, b) => 0.5 - Math.random()); 
  document.getElementById("botonRepartir").disabled = true;

  // preparamos las distintas zonas de juego

  
  // esto es estático: podría pasarse a html
  zonaMesa = document.getElementById("zonaMesa");
  tablaMesa = this.document.createElement("table");
  tablaMesa.id = "tablaMesa";
  zonaMesa.appendChild(tablaMesa);

  //repartirFichas();
  repartirFichasPrueba();
}

function verSaco() {
  var botonSaco = document.getElementById("botonSaco");
  if (sacoNoVisible) {
    pintarSaco();
    botonSaco.innerText = "Ocultar Saco";
  } else {
    zonaSaco.removeChild(tabla1);
    botonSaco.innerText = "VerSaco";
  }
  sacoNoVisible = !sacoNoVisible;
}

function pintarSaco() {
  var figuraFicha;
  zonaSaco = document.getElementById("zonaSaco");
  tabla1 = document.createElement("table");
  tabla1.id = "tablaSaco";
  zonaSaco.appendChild(tabla1);

  let i = 0;
  for (let c = 0; c < 8; c++) {
    // 8 filas
    if (i == arraySaco.length) break;
    fila1 = this.document.createElement("tr");
    tabla1.appendChild(fila1);
    for (let f = 0; f < 13; f++) {
      // 13 filas 8*13 = 104 fichas
      if (i == arraySaco.length) break;
      figuraFicha = this.document.createElement("td");
      figuraFicha.className = "figuraFichaSaco";
      figuraFicha.innerHTML = arraySaco[i] % 100;
      figuraFicha.id = arraySaco[i];
      figuraFicha.style.color = arrayColores[Math.floor(arraySaco[i] / 100)];
      fila1.appendChild(figuraFicha);
      i++;
    }
  }
}

function repartirFichas() {
  for (let i = 0; i < 14; i++) {
    // se reparten 14 fichas
    misFichas.push(arraySaco.pop());
    maqFichas.push(arraySaco.pop());
  }
  pintarFichas(misFichas, true); // jugador == true;
  if (depuracion) pintarFichas(maqFichas, false); // jugador == false;
}

function repartirFichasPrueba() {
  // reparto de prueba 1: tiene uns a escalera de 4 azul(2) y dos rojas (1)
  misFichas = [
    8,
    101,
    102,
    302,
    105,
    106,
    103,
    4,
    203,
    204,
    204,
    107,
    205,
    206,
  ];
  // reparto de prueba 2: tiene una a serie de 3 azul(2) y dos rojas (1)
  // misFichas = [103, 303, 106, 306, 106, 103, 203, 6, 206, 204, 107, 205, 206, 13];

  // reparto de prueba 1 para el computador
  maqFichas = [
    103,
    006,
    302,
    100,
    105,
    103,
    402,
    203,
    203,
    303,
    107,
    213,
    213,
    1308,
  ];
  pintarFichas(misFichas, true); // jugador == true;
  if (depuracion) pintarFichas(maqFichas, false); // jugador == false;
}

function robarFicha() {
  misFichas.push(arraySaco.pop());
  pintarFichas(misFichas, true);
  cambioTurno();
}

// ********************************************************************************************
function copiaDeTrabajo(jugador) {
  if (jugador) {
    return misFichas.slice();
  } else {
    return maqFichas.slice();
  }
}

// ********************************************************************************************
// para buscar series conviene esta codificación de las fichas
// Ejemplo: 1103 es una ficha del número 11 y color 3
function codifSer(arr) {
  let val;
  let col;
  for (let i = 0; i < arr.length; i++) {
    col = Math.floor(arr[i] / 100);
    val = arr[i] % 100;
    if (val >= 20) {
      arr[i] = (val - 20) * 100 + col + 20;
    } else {
      arr[i] = val * 100 + col;
    }
  }
}

// ********************************************************************************************

function ordenar(arreglo) {
  arreglo.sort(function (a, b) {
    return a - b;
  });
}

// ********************************a************************************************************

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
      figuraFicha.id = (jugador ? "F" : "M") + i;
      if (!xColor) {
        //para serie
        color = arr[i] % 100;
        if (color >= 20) {
          // es un dup
          figuraFicha.style.color = arrayColores[color - 20];
          figuraFicha.innerHTML = Math.floor(arr[i] / 100) + "D";
        } else {
          figuraFicha.style.color = arrayColores[color];
          valor = Math.floor(arr[i] / 100);
          figuraFicha.innerHTML = valor;
        }
        figuraFicha.setAttribute(
          "valorFicha",
          (color * 100 + valor).toString()
        );
      } else {
        //para escalera
        let valor = arr[i] % 100;
        if (valor >= 20) {
          // es un dup
          figuraFicha.innerHTML = valor - 20 + " D";
        } else {
          figuraFicha.innerHTML = valor;
        }
        figuraFicha.style.color = arrayColores[Math.floor(arr[i] / 100)];
        figuraFicha.setAttribute("valorFicha", arr[i].toString());
      }
      if (jugador) filaJugador.appendChild(figuraFicha);
      else filaComp.appendChild(figuraFicha);
    }
  } // de function  rellenarFichas()

  //Fichas del jugador
  if (jugador) {
    //  copiaDeTrabajo(jugador);
    if (document.getElementById("tablaJugador")) {
      zonaJugador.removeChild(tablaJugador);
    } // si existe la elimino y creo una nueva
    zonaJugador = document.getElementById("zonaJugador");
    tablaJugador = this.document.createElement("table");
    tablaJugador.id = "tablaJugador";
    zonaJugador.appendChild(tablaJugador);

    filaJugador = this.document.createElement("tr");
    tablaJugador.appendChild(filaJugador);
    filaJugador.id = "filaJugador";
    rellenarFichas(jugador);

    // enumerar las posiciones de las fichas
    // if (document.getElementById("filaJugadorIn")) {
    //   zonaJugador.removeChild(filaJugadorIn);
    // } // si existe la elimino
    filaJugadorIn = this.document.createElement("tr");
    tablaJugador.appendChild(filaJugadorIn);
    for (let i = 0; i < arr.length; i++) {
      numFicha = this.document.createElement("td");
      numFicha.innerHTML = i.toString();
      filaJugadorIn.appendChild(numFicha);
    }
  } else { //juega el COMPUTADOR
//  copiaDeTrabajo(jugador);
if (document.getElementById("tablaComp")) {
    zonaComp.removeChild(tablaComp);
  } // si existe la tabla la elimino y creo una nueva
  zonaComp = document.getElementById("zonaComp");
  tablaComp = this.document.createElement("table");
  tablaComp.id = "tablaComp";
  zonaComp.appendChild(tablaComp);

  filaComp = this.document.createElement("tr");
  tablaComp.appendChild(filaComp);
  filaComp.id = "filaComp";
  rellenarFichas(jugador);

  }
}

// solo se marcan als fichas del jugador
function marcaFichas(tipo, pos, tam) {
  var idFicha;
  var figuraFicha;
  // Para que los "Id" de las fichas sean correctos PREVIAMENTE hay que pintarFichas
  for (let i = 0; i < tam; i++) {
    figuraFicha = this.document.getElementById("F" + (pos + i));
    idFicha = figuraFicha.id;
    figuraFicha.id = tipo + "-" + numGrupo + "-" + idFicha;
    figuraFicha.className = "figuraFichaMarcada";
  }
  numGrupo++;
}

// ********************************************************************************************

function seleccionarGrupoJugador() {
  var codG; // Código del grupo
  var colorEsc; // la Escalera es monocolor, luego esto es un entero de 0 a 3
  var colorSer; // la serie de 3 le falta un color (de 0 a 3), a la de 4 ninguno (-1)
  var auxId;
  var idFicha = this.id; // las fichas tienen un Id = "S"|"E"-núm.de grupo-"F"num
  // si pertenecen a un grupo. Si no "F"num
  var valorIni = -1; //valor inicial de la escalera
  var inicG = -1; // podición inicial en misFichas del grupo
  var tam = 0; // tamaño del grupo
  var arr = idFicha.split("-");
  var arrayChildren = [...filaJugador.children]; // comjunto de fichas en al mano del jugador
  var colorExcl = [0, 1, 2, 3];
  var aux2;

  if (arr[0] != "S" && arr[0] != "E") {
    return;
  }

  idGrupo = arr[0] + "-" + arr[1];
  // recorro la fichas del panel del jugador para ver las que forman parte de mi grupo
  for (let i = 0; i < arrayChildren.length; i++) {
    auxId = arrayChildren[i].id;
    if (auxId.startsWith(idGrupo)) {
      if (inicG == -1) inicG = i;
      color = arrayColores.indexOf(arrayChildren[i].style.color);
      delete colorExcl[colorExcl.indexOf(color)];
      if (valorIni == -1) valorIni = arrayChildren[i].innerHTML;
      aux2 = parseInt(arrayChildren[i].getAttribute("valorFicha"));
      delete misFichas[misFichas.indexOf(aux2)];
      tam++;
    } else {
    }
  }
  misFichas = misFichas.filter((e) => typeof e == "number");
  if (arr[0] == "S") {
    colorSer = colorExcl.filter((e) => typeof e == "number");
    codGrupo = arr[0] + "-" + tam + "-" + valorIni + "-" + colorSer;
  } else {
    colorEsc = color;
    codGrupo = arr[0] + "-" + tam + "-" + valorIni + "-" + colorEsc;
  }
  pintaGrupo(codGrupo);
  xColor = true;
  pintarFichas(misFichas, true);
}

/************************************************************************************ */

function seleccionarGrupoComputador(fichas) {
  var codG; // Código del grupo
  var colorEsc; // la Escalera es monocolor, luego esto es un entero de 0 a 3
  var colorSer; // la serie de 3 le falta un color (de 0 a 3), a la de 4 ninguno (-1)
  var auxId;
  var idFicha = this.id; // las fichas tienen un Id = "S"|"E"-núm.de grupo-"F"num
  // si pertenecen a un grupo. Si no "F"num
  var valorIni = -1; //valor inicial de la escalera
  var inicG = -1; // podición inicial en misFichas del grupo
  var tam = 0; // tamaño del grupo
  var arr = idFicha.split("-");
  var arrayChildren = [...filaJugador.children]; // comjunto de fichas en al mano del jugador
  var colorExcl = [0, 1, 2, 3];

  if (arr[0] != "S" && arr[0] != "E") {
    return;
  }
  idGrupo = arr[0] + "-" + arr[1];
  // recorro la fichas del panel del jugador para ver las que estan marcadas
  for (let i = 0; i < arrayChildren.length; i++) {
    auxId = arrayChildren[i].id;
    if (auxId.startsWith(idGrupo)) {
      if (inicG == -1) inicG = i;
      if (!XColor) {
        color = fichas[i] % 100;
        if (color >= 20) color = color - 20;
        delete colorExcl[colorExcl.indexOf(color)];
        valorIni = Math.floor(fichas[i] / 100);
      } else {
        if (valorIni == -1) valorIni = fichas[i] % 100;
        if (valorIni >= 20) valorIni = valorIni - 20;
        colorEsc = Math.floor(fichas[i] / 100);
      }
      tam++;
    } else {
    }
  }
  if (arr[0] == "S") {
    colorSer = colorExcl.filter((e) => typeof e == "number");
    codGrupo = arr[0] + "-" + tam + "-" + valorIni + "-" + colorSer;
  } else {
    codGrupo = arr[0] + "-" + tam + "-" + valorIni + "-" + colorEsc;
  }
  var aux;
  pintaGrupo(codGrupo);
  for (let i = 0; i < tam; i++) {
    aux = misFichas.findIndex((el) => Math.floor(el / 100) == valorIni);
    delete misFichas[aux];
  }

  var limp = misFichas.filter((e) => typeof e == "number");
  if (aux.lenth != tam) alert("algo va mal");

  for (let i = 0; i < tam; i++) {
    misFichas.splice(misFichas.indexOf(fichas[inicG + i]), 1);
  }

  if (jugador) {
    misFichas = fichas.slice();
  } else {
    maqFichas = fichas.slice();
  }
  xColor = true;

  pintarFichas();
}

// ********************************************************************************************
function pintaGrupo(codigoGrupo) {
  var figuraFichaMesa;
  var arr = codigoGrupo.split("-");
  var tam = arr[1];
  var val = arr[2];
  var col = arr[3];

  filaMesa = document.createElement("tr");
  filaMesa.id = codigoGrupo;
  tablaMesa.appendChild(filaMesa);

  if (codigoGrupo.startsWith("S")) {
    //es una serie. Ej: S-3-10-2: "10(0), 10(1), 10(3)"
    for (let i = 0, c = 0; i < tam; i++) {
      figuraFichaMesa = document.createElement("td");
      figuraFichaMesa.className = "figuraFicha";
      figuraFichaMesa.id = codigoGrupo;
      if (tam == 3) {
        // hay un color que no está (col)
        figuraFichaMesa.style.color = arrayColores[c != col ? c : ++c];
      } else {
        //estan los 4 colores
        figuraFichaMesa.style.color = arrayColores[i];
      }
      figuraFichaMesa.innerHTML = val;
      c++;
      filaMesa.appendChild(figuraFichaMesa); // la dibujo
    }
  } else {
    //es una escalera. Ej: E-5-3-2: 3(2) 4(2) 5(2) 6(2) 7(2)
    for (let i = 0; i < tam; i++) {
      figuraFichaMesa = document.createElement("td");
      figuraFichaMesa.className = "figuraFicha";
      figuraFichaMesa.id = codigoGrupo;
      figuraFichaMesa.style.color = arrayColores[col];
      figuraFichaMesa.innerHTML = parseInt(val) + i;
      filaMesa.appendChild(figuraFichaMesa); // la dibujo
    }
  }
}

var textoJ = document.getElementById("textoJugador");

// ************************************************************************
// esta función busca series cuyos componentes sean del mismo valor y distinto color
function buscarSeries(jugador) {
  var p = [];
  var grupoValor = [];
  var valorS = [];
  var posicS = [];
  var cuentaS = 0;
  var tamanyoS = [];
  var tamSer = [];
  var fichas2 = [];

  xColor = false;
  var fichas = copiaDeTrabajo(jugador);
 
  codifSer(fichas); // El num. de la fichas da prioridad al valor.
  // Ejemplo la 302 es una fichas de valor 3 y color 2
  ordenar(fichas);
  if (jugador || depuracion) pintarFichas(fichas, jugador);

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
    p[n] = fichas2.length;
    fichas2 = fichas2.concat(grupoValor[n]);

    // miro si el grupo de valor n (sin dups) es de 3 o 4 fichas ==> es una serie
    tamSer[n] = grupoValor[n].length - cuentaDups; // de 0 a 4
    if (tamSer[n] >= 3) {
      tamanyoS[cuentaS] = tamSer[n];
      valorS[cuentaS] = n;
      posicS[cuentaS] = p[n];
      cuentaS++;
    }
  }

  if (jugador || depuracion) pintarFichas(fichas2, jugador);

  if (cuentaS > 0) {
    for (let i = 0; i < cuentaS; i++) {
      marcaFichas("S", posicS[i], tamanyoS[i]);
      if (cuentaS == 1) {
        textoJ.innerHTML = "Juega la serie marcada";
      } else {
        textoJ.innerHTML = "Juega una de las series marcadas";
      }
    }
  } else {
    textoJ.innerHTML = "No hay ninguna serie en tu mano";
  }
}

// ********************************************************************************************
function buscarEscaleras(jugador) {
  var du = [];
  var p = [];
  var fichas = copiaDeTrabajo(jugador);
  var fichas2 = [];
  xColor = true;
  // esta función busca escaleras cuyos compenentes sean del mismo color
  var grupoColor = [];
  ordenar(fichas);
  if (jugador || depuracion) pintarFichas(fichas, jugador);
  // separo las fichas en grupos del mismo color c

  var posicE = [];
  var tamanyoE = [];
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
          posicE[cuentaE] = ini  + p[c];
          tamanyoE[cuentaE] = tam;
          console.log("Escalera de color : " +  c + " en pos " +
            posicE[cuentaE] + " tamaño " + tamanyoE[cuentaE]);
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

  if (cuentaE > 0) {
    for (let i = 0; i < cuentaE; i++) {
      marcaFichas("E", posicE[i], tamanyoE[i]);
      if (cuentaE == 1) {
        textoJ.innerHTML = "Juega la escalera marcada";
      } else {
        textoJ.innerHTML = "Juega una de las esaleras marcadas";
      }
    }
  } else {
    textoJ.innerHTML = "No hay ninguna escalera en tu mano";
  } 
  }


// cambia el turno a computador
function cambioTurno() {
  jugador = false;
  jugarComp();
  jugador = true;
}

function jugarComp() {
  buscarSerie(false);
}
