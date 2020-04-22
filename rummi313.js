
const arrayColores = ['black', 'red', 'blue', 'magenta'];

var arraySaco = [];
var misFichasOrig = [];
var misFichas = [];
var Series = [];
var Esc = [];
var maqFichas = [];
var maqFichasOrig = [];
//var dups = [];
var figuraFicha;
var inicio = true;
var sacoNoVisible = true
var numGrupo = 0;
var primero;
var esc = true;
var filaMesa;

function nuevoJuego() {
    location.reload();
}

function iniciar() {
    let i = 0;
    for (let a = 1; a < 3; a++) {           // hay 2 de cada
        for (let v = 1; v < 14; v++) {      // 13 valores
            for (let c = 0; c < 4; c++) {   // y 4 colores
                arraySaco[i] = c * 100 + v;  // Codif. por color. Es al codif. por defecto. 
                // Las fichas del saco siempre son así
                // Ejemplo el 108 es de color 1 y valor 8 
                i++;
            }
0        }
    }
    arraySaco.sort(function (a, b) { return 0.5 - Math.random() });  //remuevo el saco
    repartirFichas();
    document.getElementById('botonRepartir').disabled = true;
    primero = 0;
    //repartirFichasPrueba();
     // preparamos la mesa de jeugo
     zonaMesa = document.getElementById("zonaMesa");
     tablaMesa = this.document.createElement("table");
     tablaMesa.id = "tablaMesa";
     zonaMesa.appendChild(tablaMesa);
     filaMesa = this.document.createElement("tr");
     tablaMesa.appendChild(filaMesa);
 
}

function verSaco() {
    var botonSaco = document.getElementById('botonSaco');
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
    zonaSaco = document.getElementById("zonaSaco");
    tabla1 = document.createElement("table");
    tabla1.id = "tablaSaco";
    zonaSaco.appendChild(tabla1);

    let i = 0;
    for (let c = 0; c < 8; c++) {  // 8 filas
        if (i == arraySaco.length) break;
        fila1 = this.document.createElement("tr");
        tabla1.appendChild(fila1);
        for (let f = 0; f < 13; f++) {  // 13 filas 8*13 = 104 fichas
            if (i == arraySaco.length) break;
            figuraFicha = this.document.createElement("td");
          //  figuraFicha.addEventListener("click", seleccionarFicha);
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
    for (let i = 0; i < 14; i++) {// se reparten 14 fichas
        misFichas.push(arraySaco.pop());
        misFichasOrig[i] = misFichas[i];
        maqFichas.push(arraySaco.pop());
        maqFichasOrig[i] = maqFichas[i];
    }
    pintarMisFichas();
}


function repartirFichasPrueba() {
    // reparto de prueba 1: tiene uns a escalera de 4 azul(2) y dos rojas (1)
    // misFichas = [8, 101, 102, 302, 105, 106, 103, 4, 203, 204, 204, 107, 205, 206];
    // reparto de prueba 2: tiene una a serie de 3 azul(2) y dos rojas (1)
    misFichas = [101, 102, 302, 105, 106, 103, 303, 203, 204, 204, 107, 205, 206];

    // reparto de prueba 1 para el computador
    maqFichas = [101, 102, 302, 100, 105, 103, 402, 203, 203, 303, 107, 213, 213, 1308];

    guardarActual();
    pintarMisFichas()
}

function robarFicha() {
    recuperaOrig();
    misFichas.push(arraySaco.pop());
    guardarActual();
    pintarMisFichas();
}

// ********************************************************************************************
function guardarActual() {
    misFichasOrig = [];
  // let  = misFichasOrig.slice(0,misFichas.length-1)
    for (let i = 0; i < misFichas.length; i++) {
        misFichasOrig[i] = misFichas[i];
        maqFichasOrig[i] = maqFichas[i];
    }
}

// ********************************************************************************************
function recuperaOrig() {
    esc=true;
    for (let i = 0; i < misFichasOrig.length; i++) {
        misFichas[i] = misFichasOrig[i];
        maqFichas[i] = maqFichasOrig[i];
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
        if (val >= 20) { arr[i] = (val - 20) * 100 + col + 20; }
        else { arr[i] = val * 100 + col; }
    }
}

// ********************************************************************************************
function codifEsc(arr) {
    let val;
    let col;
    for (let i = 0; i < arr.length; i++) {
        val = Math.floor(arr[i]/100);
        col = arr[i] % 100;
        if (col >= 20) arr[i] = (col-20)*100 + val+20;
        else  arr[i] = col*100 + val;
    }
}
// ********************************************************************************************

function ordenar(arreglo) {
    arreglo.sort(function (a, b) { return (a - b) });
}

// ********************************************************************************************

function pintarMisFichas() {
    if (document.getElementById("tablaJugador")) {
        zonaJugador.removeChild(tablaJugador);
    } // si existe la borro
    zonaJugador = document.getElementById("zonaJugador");
    tablaJugador = this.document.createElement("table");
    tablaJugador.id = "tablaJugador";
    zonaJugador.appendChild(tablaJugador);
    filaJugador = this.document.createElement("tr");
    tablaJugador.appendChild(filaJugador);

    //Fichas del jugador           
    for (let i = 0; i < misFichas.length; i++) {
        figuraFicha = this.document.createElement("td");
        figuraFicha.addEventListener("click", seleccionarGrupo);
        figuraFicha.className = "figuraFicha";
        figuraFicha.id = "Ficha" + i;
        if (!esc) {
            let color = misFichas[i] % 100;
            if (color >= 20) { // es un dup
                figuraFicha.style.color = arrayColores[(color - 20)];
                figuraFicha.innerHTML = Math.floor(misFichas[i] / 100) + "D";
            } else {
                figuraFicha.style.color = arrayColores[color];
                figuraFicha.innerHTML = Math.floor(misFichas[i] / 100);
            }
        } else {
            let valor = misFichas[i] % 100;
            if (valor >= 20) { // es un dup
                figuraFicha.innerHTML = (valor - 20) + " D";
            } else {
                figuraFicha.innerHTML = valor;
            }
            figuraFicha.style.color = arrayColores[Math.floor(misFichas[i] / 100)];
        }
        filaJugador.appendChild(figuraFicha);  // la dibujo
    }

    // número las posiciones de las fichas
    filaJugadorIn = this.document.createElement("tr");
    tablaJugador.appendChild(filaJugadorIn);
    for (let i = 0; i < misFichas.length; i++) {
        numFicha = this.document.createElement("td");
        numFicha.innerHTML = i.toString();
        //numFicha.className = .
        filaJugadorIn.appendChild(numFicha);
    }
}

function marcaFichas(arr, pos, tam) {
    var idFicha;
    // recuerda que para que los "Id" de las fichas sean correctos PREVIAMENTE hay que pintarFichas
    for (let i = 0; i < tam; i++) {
        figuraFicha = this.document.getElementById("Ficha" + (pos + i));
        idFicha = figuraFicha.id;
        figuraFicha.id = "G00" + numGrupo + "." + idFicha ;
        figuraFicha.className = "figuraFichaMarcada";
    }
    numGrupo++;
}

function pintarMaquinaFichas() {
    if (zonajugador.getElementById("tablaMaqina")) {
        zonaJugador.removeChild(tablaMaquina);
    } // si existe la borro
    if (tablaMaquina) { zonaJugador.removeChild(tablaMaquina) } // si existe la borro
    zonaMaquina = document.getElementById("zonaMaquina");
    tablaMaquina = this.document.createElement("table");
    tablaMaquina.id = "tablaMaquina";
    zonaMaquina.appendChild(tablaMaquina);
    filaMaquina = this.document.createElement("tr");
    tablaMaquina.appendChild(filaMaquina);


    //Fichas de la máquina
    for (let i = 0; i < maqFichas.length; i++) {
        figuraFicha = this.document.createElement("td");
        figuraFicha.className = "figuraFichaMaquina";
        figuraFicha.id = "maqFicha" + i;
        // fichaActual = new Object();
        let valor = misFichas[i] % 100;
        if (valor > 20) { // es un dup
            figuraFicha.innerHTML = (valor - 20) + " D";
        } else {
            figuraFicha.innerHTML = valor;
        }
        figuraFicha.style.color = arrayColores[Math.floor(maqFichas[i] / 100)];
        filaMaquina.appendChild(figuraFicha);  // la dibujo
    }
    // número las posiciones de las fichas
    filaMaquina = this.document.createElement("tr");
    tablaMaquina.appendChild(filaJugador);
    for (let i = 0; i < maqFichas.length; i++) {
        numFicha = this.document.createElement("td");
        numFicha.innerHTML = i.toString();
        //numFicha.className = .
        filaMaquina.appendChild(numFicha);
    }
}

// ********************************************************************************************

function seleccionarGrupo(e) {
    var auxId;
    var idFicha;
    var figuraFichaMesa;
    idFicha = this.id;
    if (idFicha.startsWith("G")) {
        idGrupo = idFicha.slice(0, 4);
    } else return;
    var arrayChildren = [...filaJugador.children];
    var countG = 0;
    var inicG = -1;
    for (let i = 0; i < arrayChildren.length; i++) {
        auxId = arrayChildren[i].id;
        if (auxId.startsWith(idGrupo)) {
            if (inicG == -1) inicG = i;
            figuraFichaMesa = document.createElement("td");
            figuraFichaMesa.className = "figuraFicha";
            figuraFichaMesa.id = idFicha;
            if (!esc) {
                let color = misFichas[i] % 100;
                if (color >= 20) { // es un dup
                    figuraFichaMesa.style.color = arrayColores[(color - 20)];
                    figfiguraFichaMesauraFicha.innerHTML = Math.floor(misFichas[i] / 100) + "D";
                } else {
                    figuraFichaMesa.style.color = arrayColores[color];
                    figuraFichaMesa.innerHTML = Math.floor(misFichas[i] / 100);
                }
            } else {
                let valor = misFichas[i] % 100;
                if (valor >= 20) { // es un dup
                    figuraFichaMesa.innerHTML = (valor - 20) + " D";
                } else {
                    figuraFichaMesa.innerHTML = valor;
                }
                figuraFichaMesa.style.color = arrayColores[Math.floor(misFichas[i] / 100)];
            }
            filaMesa.appendChild(figuraFichaMesa);  // la dibujo
            countG++;
        } else { }
    }
    var grup = misFichas.splice(inicG, countG);
    if (!esc) codifEsc(misFichas);
    esc = true;
    guardarActual();
    pintarMisFichas();
    // número las posiciones de las fichas
    filaMesaI = document.createElement("tr");
    tablaMesa.appendChild(filaMesaI);
    for (let i = 0; i < countG; i++) {
        numFicha = document.createElement("td");
        numFicha.innerHTML = i.toString();
        //numFicha.className = .
        filaMesaI.appendChild(numFicha);
    }
}

var textoJ = document.getElementById("textoJugador");

// ********************************************************************************************
function buscarSeries() {
    var du = [];
    if (!primero) {
        recuperaOrig();
        // pintarMisFichas();
    }
    esc = false;
    // esta función busca series cuyos componentes sean del mismo valor y distinto color
    codifSer(misFichas);    // El num. de la fichas da prioridad al valor. 
    // Ejemplo la 302 es una fichas de valor 3 y color 2
    ordenar(misFichas);
    pintarMisFichas();
    grupoValor = [];
    //separo las fichas en grupos del mismo valor
    for (let n = 0; n < 13; n++) {
        grupoValor[n] = misFichas.filter(el => Math.floor(el / 100) == n + 1
        );
    }

    //este bucle pone una marca los dups (Suma 20 al color)
    // ejemplo: la 322 una fichas de valor 3 y color 2 que está duplicada (está tb. la 302)

    for (let n = 0; n < 13; n++) {
        let cont = 0;
        for (let i = 1; i < grupoValor[n].length; i++) {
            if (grupoValor[n][i] === grupoValor[n][i - 1]) { // el elemento i es un dup
                grupoValor[n][i] += 20;  // los dups van del 20 al 23
                cont++;
            }
        }
        du[n] = cont;
        ordenar(grupoValor[n]);
    }
    //reconstruyo misFichas con los subgrupos ordenados
    {
        let j = 0;
        for (let n = 0; n < 13; n++) {
            for (let i = 0; i < grupoValor[n].length; i++) {
                misFichas[j++] = grupoValor[n][i];
            }
        }
    }
    //    pintarMisFichas();

    var tamSer = [];
    for (let n = 0; n < 13; n++) {
        tamSer[n] = grupoValor[n].length - du[n]; // de 0 a 4
        //     console.log("hay serie de valor : " + n + " de " + imaxSer[n] + " a " + fmaxSer[n])
    }
    var tmaxSer = Math.max(...tamSer); // ... = spread operator
    if (tmaxSer >= 3) {
        var ivalor = tamSer.indexOf(tmaxSer);
        console.log("la serie mejor es de " + tmaxSer + " fichas de valor " + ivalor + 1);
        var p = 0;
        for (let n = 0; n != ivalor; n++) {
            p += grupoValor[n].length
        }
        pintarMisFichas();
        marcaFichas(misFichas, p, tmaxSer);
        textoJ.innerHTML = "Juega la serie marcada";
    } else { textoJ.innerHTML = "No hay ninguna serie en tu mano"; }
    primero = false;
}

// ********************************************************************************************
function buscarEscaleras() {
    // esta función busca escaleras cuyos compenentes sean del mismo color
    esc = true;
    var du = [];
    var grupoColor = [];
    if (!primero) {
       recuperaOrig();
       // pintarMisFichas();
    }
    //porColor(misFichas);
    ordenar(misFichas);
    pintarMisFichas();
    for (let c = 0; c <= 3; c++) {
        grupoColor[c] = misFichas.filter(el => Math.floor(el / 100) == c);
    }
     //este bucle pone una marca los dups +20 en el valor
    for (let c = 0; c <= 3; c++) {
        let cont = 0;
        for (let i = 1; i < grupoColor[c].length; i++) {
            if (grupoColor[c][i] === grupoColor[c][i - 1]) { // el elemento i es un dup
                grupoColor[c][i] += 20; // los dups van del 21 al 33
                cont++;
            }
            du[c] = cont;
            ordenar(grupoColor[c]);
        }
    }
    jndex = 0;
    for (let c = 0; c <= 3; c++) {
        for (let i = 0; i < grupoColor[c].length; i++) {
            misFichas[jndex++] = grupoColor[c][i];
        }
    }
    //   pintarMisFichas();
    var ini, imax;
    var fin, fmax;
    var tam, tmax, lim;
    var imaxEsc = [], fmaxEsc = [], tmaxEsc = [];
    for (let c = 0; c <= 3; c++) {
        ini = 0; imaxEsc[c] = 0;
        fin = 0; fmaxEsc[c] = 0;
        tam = 1; tmaxEsc[c] = 1;
        lim = grupoColor[c].length - du[c];
        for (let i = 1; i <= lim; i++) {
            if ((grupoColor[c][i] != grupoColor[c][i - 1] + 1) || (i == lim)) {
                if (tam >= tmaxEsc[c]) {
                    imax = ini;
                    fmax = fin;
                    tmax = tam;
                }
                ini = i;
                fin = i;
                tam = 1;
            } else {
                fin = i;
                tam++;
            }
        }
        imaxEsc[c] = imax;
        fmaxEsc[c] = fmax;
        tmaxEsc[c] = tmax;
        if (tmax >= 3)
            console.log("hay escalera de color : " + c + " de " + imaxEsc[c] + " a " + fmaxEsc[c]);

        var tmaxmax = Math.max(...tmaxEsc); // ... = spread operator
        if (tmaxmax >= 3) {
            var icolor = tmaxEsc.indexOf(tmaxmax);
            console.log("la escalera mejor es de " + tmaxmax + " fichas de color ?????" + icolor);
            var p = 0;
            for (let c = 0; c != icolor; c++) {
                p += grupoColor[c].length
            }
            pintarMisFichas();
            marcaFichas(misFichas, p + imaxEsc[icolor], tmaxmax);
            textoJ.innerHTML = "Juega la escalera marcada";
        } else { textoJ.innerHTML = "No hay ninguna escalera en tu mano"; }

    }
    primero = false;
}

