    var Saco = []; 
    var misFichas = []; 
    var maquinaFichas = [];
    var misTrios = [];
    var dups = [];
    var arrayColores = ['black', 'red', 'blue', 'magenta'];
    var fichaActual;
    var figuraFicha;
    var inicio = true;

    function IniciarJuego() {
        //  location.reload(true);
        for (let a =1; a < 3; a++) {
            for (let v = 1; v < 14; v++) {
                for (let c = 0; c < 4; c++) {
                    var ficha = new Object();
                    ficha.color = c;
                    ficha.valor = v;
                    Saco.push(ficha); 
                } 
            }
        }
        AgitarSaco(); 
        repartirFichas(); 
        //repartirFichasPrueba();
    }

    function AgitarSaco() {
        Saco.sort(function(a, b){return 0.5 - Math.random()}); //remeno
        pintarSaco();
    }

    function pintarSaco() {
        if (!inicio) zonaSaco.removeChild(tabla1);
        inicio = false;
        zonaSaco = document.getElementById("zonaSaco");
        tabla1 = document.createElement("table");
        var cont = 0;
        tabla1.id = "table1";
        zonaSaco.appendChild(tabla1);
        
        for (let j = 0; j < 8; j++) {
            if (cont === Saco.length) break;
            fila1 = this.document.createElement("tr");
            tabla1.appendChild(fila1); 
            for (let i = 0; i < 13; i++) {
                if (cont === Saco.length) break;
                fichaActual = new Object();
                fichaActual = Saco[cont++]
                figuraFicha = this.document.createElement("td");
                figuraFicha.addEventListener("click", seleccionarFicha);
                figuraFicha.className = "figuraFichaSaco";
                figuraFicha.id="fichaActual.valor"
                figuraFicha.innerHTML = fichaActual.valor;
                figuraFicha.style.color = arrayColores[fichaActual.color];
                
                fila1.appendChild(figuraFicha);
            }
        }
    }

    function repartirFichas() {
        for (let i = 1; i < 15; i++) 
            misFichas.push(Saco.pop());
        for (let i = 1; i < 15; i++)  
            maquinaFichas.push(Saco.pop());
        pintarSaco();
        pintarMisFichas(true);
    }


function repartirFichasPrueba() {
    // reparto de prueba 1
    misFichas = [   {color:1, valor:1},
                    {color:0, valor:2}, 
                    {color:1, valor:2}, 
                    {color:3, valor:2},  
                    {color:0, valor:8}, 
                    {color:0, valor:8},  
                    {color:1, valor:8},
                    {color:1, valor:8},  
                    {color:2, valor:8},
                    {color:2, valor:8}, 
                    {color:3, valor:8},  
                    {color:1, valor:13},
                    {color:2, valor:13}, 
                    {color:2, valor:13}
             ];

   // reparto de prueba 1 para el computador
    maquinasFichas = [   {color:1,valor:1},{color:1,valor:1},
                    {color:0,valor:2},{color:1, valor:2},
                    {color:3,valor:2},
                    {color:1,valor:7},{color:1,valor:7},
                    {color:0,valor:8},{color:1,valor:8},
                    {color:3,valor:8},
                    {color:3,valor:8},{color:1,valor:12},
                    {color:1,valor:13},{color:2,valor:13}
             ];
    pintarMisFichas(true);
}

function robarFicha() {

        var nuevaFicha = [];
        misFichas.push(Saco.pop());
 
        pintarSaco();
        pintarMisFichas(false);
    }

    
    function ordenarValor(arreglo) {
        arreglo.sort(function(a, b){return (a.valor*100 + a.color) -  (b.valor*100 + b.color)});
        pintarMisFichas(false);
    }

    function ordenarColor(arreglo) {
         
        arreglo.sort(function(a, b){return (a.color*100 + a.valor) -  (b.color*100 + b.valor)});
        pintarMisFichas(false);
    }

    function pintarMisFichas(primera) {
        if (!primera) zonaJugador.removeChild(tablaJugador);
        prmiera=false;
        zonaJugador = document.getElementById("zonaJugador");
        tablaJugador = this.document.createElement("table");
        tablaJugador.id = "tablaJugador";
        zonaJugador.appendChild(tablaJugador);
        filaJugador= this.document.createElement("tr");
        tablaJugador.appendChild(filaJugador); 

        //Fichas del jugador           
        for (let i = 0; i < misFichas.length; i++) {
            figuraFicha = this.document.createElement("td");
            figuraFicha.addEventListener("click", seleccionarFicha);
            figuraFicha.className = "figuraFicha";
            figuraFicha.id = "miFicha" + i;
            fichaActual = new Object();
            fichaActual = misFichas[i];
            figuraFicha.innerHTML = fichaActual.valor;
            figuraFicha.style.color = arrayColores[fichaActual.color];
            filaJugador.appendChild(figuraFicha);  // la dibujo
        }
        filaJugador= this.document.createElement("tr");
        tablaJugador.appendChild(filaJugador); 

        for (let i = 0; i < misFichas.length; i++) {
            numFicha = this.document.createElement("td");
            numFicha.innerHTML = i.toString();
            filaJugador.appendChild(numFicha);
        }
    }      

    function marcaFicha(pos, tamanyo) {
        for (let j = 0, i=0; i < tamanyo; j++) {
            if (!dups[pos + j]) { 
                figuraFicha = this.document.getElementById("miFicha"+ (pos + j));
                figuraFicha.className = "figuraFichaMarcada";
                i++;
            }
        }
    }       


    function pintarMaquinaFichas(primera) {
        if (!primera) zonaMaquina.removeChild(tablaMaquina);
        zonaMaquina = document.getElementById("zonaMaquina");
        tablaMaquina = this.document.createElement("table");
        tablaMaquina.id = "tablaMaquina";
        zonaMaquina.appendChild(tablaMaquina);
        filaMaquina= this.document.createElement("tr");
        tablaMaquina.appendChild(filaMaquina); 

        //Fichas de la máquina
        for (let i = 0; i < maquinaFichas.length; i++) {
            figuraFicha = this.document.createElement("td");
            figuraFicha.className = "figuraFichaMaquina";
            fichaActual = maquinaFichas[i];
            figuraFicha.innerHTML = fichaActual.valor;
            figuraFicha.style.color = arrayColores[fichaActual.color];
            filaMaquina.appendChild(figuraFicha);  // la dibujo
        }
    }                 


    function seleccionarFicha(e) {
    //          var node = e.target.cloneNode(true);
        var tabla = document.getElementById("table");
        var fila = document.createElement("tr");
        tabla.appendChild(fila);
        fila.appendChild(node);
    }

    function jugar() {
        buscaSeriesLocal();
        // buscaSeriesMesa();
        // buscaEscalerasLocal();
        // buscaEscalerasMesa();
        // SeleccionaEstrategia();
        // pintaMesa();
    }
 
    function buscaSeriesLocal() {
    // esta función buscaseries cuyos compenntes sean de disintos colores
    // contValor es un vector contador del número de fichas con cada valor

        ordenarValor(misFichas);
        var index=0, index2=0;
        var contValor = Array(13);
        contValor.fill(0);
        var contColor = Array(4);
        contColor.fill(0);
        dups = Array(misFichas.length);
        numeroMisFichas = Array(misFichas.length);
        colorMisFichas = Array(misFichas.length);

        for (let i = 0; i < numeroMisFichas.length; i++) {
            numeroMisFichas[i] = misFichas[i].valor;
            colorMisFichas[i] =  misFichas[i].color;
        }
        for (let v = 1; v <= 13; v++) {
            while ( index < numeroMisFichas.length && numeroMisFichas[index] == v) {
                contValor[v-1]++; 
                // marco la fichas "Repes" : mismo color y mismo valor
                if (contValor[v-1] >= 2 && colorMisFichas[index] == colorMisFichas[index-1]) {
                    dups[index]=true;
                }                
                index++
            }
        }
        

        console.log(contValor);   
        console.log(dups);

        var acc;
        // busco "posibles" trios locales
        // posible trios (sin mirar que sean de distinto color)
               
        tamSeries = contValor.filter(funMasDe2);
        function funMasDe2(value) {
            return value > 2;
        }
        console.log("Tamaño de las series posibles: " + tamSeries);

        posSeries = contValor.map(funAuxSeries).filter(funLimpiar);
        function funAuxSeries(value,index,array) {
            acc=0;
            if (value > 2) {
                for (let i=0; i<index; i++) acc += array[i];
                return acc;
            } else return -1;
        }
        function funLimpiar(value) {
            return value > -1;
        }
      
        console.log("Posicion de las series posibles en mis fichas " + posSeries);
        
        
        for (let p = 0; p < posSeries.length; p++){
            if (isSeries(posSeries[p], tamSeries[p], p)) {
                marcaFicha(posSeries[p], tamSeries[p]);
            }
        }

        console.log("Posicion de las series reales en mis fichas " + posSeries);

        function isSeries(pos, tam,p) {
            switch(tam) {
                case 3: return isS3(pos, p); break;
                case 4: return isS4(pos, p); break;
                case 5: return isS5(pos, p); break;
                case 6: return isS6(pos, p); break;
                case 7: return isS7(pos, p); break;
                case 8: return isS8(pos, p); break;
                default: alert ("Ha pasado algo raro. Consulta con tu psicoanalista");
            }
        }

        function howManyDups(start, end) {
            return dups.slice(start, end+1).filter (isDup).length;

            function  isDup(value) {
                return value == true;
            }
        
        console.log("Dups in myTokens " + howManyDups(0, misFichas.length+1) );
        }

        
        function isS3(pos,p) {
            
            //if ((!dups[pos + 1]) &&  (!dups[pos + 2])) {
            if (howManyDups(pos,pos+3) == 0) {
                console.log ("hay una serie de 3 válida en la posición " +  pos);
                return(true);
            } else {
                console.log ("La serie de 3 en la posición " +  pos + " NO VALE");
                posSeries.splice(p, p); //quita la entrada del vector posSeries
                tamSeries.splice(p, p); //quita la entrada del vector tamSeries
                return(false);
            }
        }

        function isS4(pos,p) {
            //if ((!dups[pos + 1]) &&  (!dups[pos + 2]) && !dups[pos+3]){
            if  (howManyDups(pos, pos + 3) == 0) {
                console.log ("hay una serie de 4 válida en la posición " +  pos);
                return (true);  // no hay que hacer nada
            } else if (howManyDups(pos, pos + 4)== 2) { 
                console.log ("La serie de 4 válida en la posición " +  pos + " NO VALE");
                posSeries.splice(p, p); //quita la entrada del vector posSeries
                tamSeries.splice(p, p); //quita la entrada del vector tamSeries
                return(false);
            } else { // hay un dup
                console.log ("hay una serie de 3 válida en la posición " +  pos + " con 1 dup");
                tamSeries[p] = 3;
                return (true);
            }
            
        }

        function isS5(pos,p) {
            if (howManyDups(pos, pos + 5) == 1){  
                console.log ("hay una S4 válida en la posición " +  pos + " con 1 dup");
                tamSeries[p] = 4;
            } else {  // hay 2 repes, entonce ses un S3
                console.log ("hay una S3 válida en la posición " +  pos + " con 2 dups");
                tamSeries[p] = 3;
            }
            return (true);
        }

        function isS6(pos,p) {
            if (howManyDups(pos, pos + 5) == 2){  // hay 2 dups, entonces  es un S4
                console.log ("hay una S4 válida en la posición " +  pos + " con 2 dup");
                tamSeries[p] = 4;
            } else {  // hay 3 dups, entonces es una S3
                console.log ("hay una S3 válida en la posición " +  pos + " con 3 dups");
                tamSeries[p] = 3;
            }
            return (true);       
        }
        
        function isS7(pos,p) {
            // seguro que hay 3 dups, entonces es una S4 y puede haber un trio que no devuelvo
            console.log ("hay una S4 válida en la posición " +  pos + " con 3 dups");
            tamSeries[p] = 4;
            return (true);       
        }

        function isS8(pos,p) {
            // seguro que hay 4 dups, entonces es hay dos S4, devuelvo uno
            console.log ("hay una S4 válida en la posición " +  pos + " con 4 dups");
            tamSeries[p] = 4;
            return (true);       
        }

    }