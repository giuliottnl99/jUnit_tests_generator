/**In questo file si trovano le logiche backend di generazione degli output (che si attivano quando si clicca su "generaOutput") */

/** Questo è il metodo principale: prende tutti i dati dalle varie textArea e chaima funzioni che, nell'ordine:
 * 1. Costruiscono un oggetto di classe Condizione (rappresentante il primo if) collegato a una serie di altri oggetti di classe Condizione (rappresentanti if annidati o conseguenti)
 * 2. A partire dall'oggetto, creano una lista "listaFiglie" di tipo Condizione ciascuna rappresentante i nodi finali di ciascun if 
 * 3. A partire da listaFiglie, crea un array contenente tutte le condizioni per rendere true/false ogni caso, tutti gli assert per ogni caso e il "suffisso" del nome del metodo per ogni caso
 * 4. A partire da questo array, genera per ogni riga di questo array un metodo
 */
function generaOutput() {

    //Intanto prendo tutti gli input dal codice
    const outputTextarea = document.getElementById('output');
    let output = '';
    let nomeMetodo = document.getElementById('nomeMetodo').value;
    let nomeMetodoComeDaChiamare = document.getElementById('nomeMetodoComeDaChiamare').value;
    let toBeThrown = document.getElementById('toBeThrown').value;
    let precondizioni_comuni = document.getElementById('precondizioni_comuni').value;
    let flgCarryOneResult = document.getElementById('flgCarryOneResult').checked;

    condizioneBase = generaCondizioniAnnidateEConseguenti("divInput");
    let listaFiglie = [];
    trovaTutteLeCondizioniFiglie(condizioneBase, listaFiglie);
    let arrayResult = creaCondizioniEAssert(listaFiglie, flgCarryOneResult);

    let result;
    result = generaMetodiCondizionaliConFiglie(precondizioni_comuni, nomeMetodo, toBeThrown, nomeMetodoComeDaChiamare, arrayResult);
    outputTextarea.value = result;
}



//generazione condizioni annidate: impossibile creare js a parte
/**Questo metodo genera una Condizione "padre" a cui sono collegate in modo "piramidale" tutte le condizioni annidate e conseguenti. 
 * 
 * Ogni area di input o di assert ha un id. Tale id è composto dal nome del div esterno (esempio "divInputTrueConseguente") 
 * + un suffisso che identifica il tipo di input (es. AreaCondizioniTrue)
 * Quindi quello che fa il metodo è cercare a partire da divInput vedendo se ci sono campi "divInputAreaCondizioniTrue", "divInputAreaCondizioniFalse", ecc.
 * Per poi continuare la ricerca anche per divInputTrue...., divInputFalse..., divInputConseguente...e così via ricorsivamente fino a che
 * il div che non si trovano più div con nome divBase + "true", divBase+"False", divBase+"Conseguente".
 * Se arriva al punto che non ci sono più div successivi, crea una Condizione con i dati che possiede, altrimenti crea la condizione annidata o conseguente chiamando ricorsivamente il metodo
 * e poi crea la condizione passando la figlia o la conseguente.
 * 
 * Il risultato è un oggetto di tipo Condizione, con le seguenti informazioni:
 * 1. Un array di stringhe contenenti le condizioni perchè la condizione sia vera
 * 2. Un array di stringhe contenenti le condizioni perchè la condizione sia falsa
 * 3. Una stringa contenente gli assert da scrivere dopo il metodo nel caso true
 * 4. Una stringa contenente gli assert da scrivere dopo il metodo nel caso false
 * 5. un oggetto di tipo Condizione rappresentante la condizione conseguente (null se non esiste)
 * 6. un oggetto di tipo Condizione rappresentante la condizione figlia true (null se non esiste)
 * 7. un oggetto di tipo Condizione rappresentante la condizione figlia false (null se non esiste)
 * 8. Informazioni sulla Condizione genitore o precedente, se esiste
*/
function generaCondizioniAnnidateEConseguenti(nomeInputBase) {
    let partenzaTrue = nomeInputBase + "True";
    let partenzaFalse = nomeInputBase + "False";
    let partenzaConseguente = nomeInputBase + "Conseguente";
    let inputTrue = document.getElementById(partenzaTrue);
    let inputFalse = document.getElementById(partenzaFalse);
    let inputConseguente = document.getElementById(partenzaConseguente);


    let assertXTrue;
    let assertXFalse;
    let assertAmbo;
    assertXTrue = document.getElementById(nomeInputBase + "AreaConseguenzeTrue").value;
    assertXFalse = document.getElementById(nomeInputBase + "AreaConseguenzeFalse").value;
    assertAmbo = document.getElementById(nomeInputBase + "AreaConseguenzeAmbo").value;

    //Gestisco tutti i possibili casi alternativi di assertXTrue e assertXFalse
    let i = 0;
    let conditionTrue = [];
    let conditionFalse = [];
    while (true) {
        i++;
        let alternativeConditionTrue = document.getElementById(nomeInputBase + "AreaCondizioniTrue" + i);
        let alternativeConditionFalse = document.getElementById(nomeInputBase + "AreaCondizioniFalse" + i);
        if ((alternativeConditionTrue == null || alternativeConditionTrue.value == null || alternativeConditionTrue.value == "")
            && (alternativeConditionFalse == null || alternativeConditionFalse.value == null || alternativeConditionFalse.value == "")) {
            break;
        }
        if (alternativeConditionTrue != null && alternativeConditionTrue.value != null && alternativeConditionTrue.value != "") {
            conditionTrue.push(alternativeConditionTrue.value);
        }
        if (alternativeConditionFalse != null && alternativeConditionFalse.value != null && alternativeConditionFalse.value != "") {
            conditionFalse.push(alternativeConditionFalse.value);
        }

    }

    // }

    //problema se nomeInputBase è divInputAnnidati -> metto un default per l'input


    if (inputTrue == null && inputFalse == null && inputConseguente == null) {
        //se conditionTrue o conditionFalse fossero array completamente vuoti, devono comunque avere dentro una stringa vuota!
        addEmptyStringInConditionsListEmpty(conditionTrue, conditionFalse);
        let condizioneUltimaSenzaFigliSenzaConseguenti = new Condizione(conditionTrue, conditionFalse, assertXTrue, assertXFalse, assertAmbo, null, null);
        return condizioneUltimaSenzaFigliSenzaConseguenti;
    }
    let condizioneAttuale = null;
    if (inputTrue != null) {
        let condizioneFiglia = generaCondizioniAnnidateEConseguenti(partenzaTrue);
        //nota: se ha una figlia true, l'assertXTrue non dovrebbe essere usato
        addEmptyStringInConditionsListEmpty(conditionTrue, conditionFalse);
        condizioneAttuale = new Condizione(conditionTrue, conditionFalse, assertXTrue, assertXFalse, assertAmbo, condizioneFiglia, null);
        condizioneFiglia.condizioneGenitore = condizioneAttuale;
        condizioneFiglia.tipoGenitore = true;
    }
    //poi vedo se inputFalse!=null
    if (inputFalse != null) {
        let condizioneFiglia = generaCondizioniAnnidateEConseguenti(partenzaFalse);
        if (condizioneAttuale == null) {
            //nota: se ha una figlia false, l'assertXFalse non dovrebbe essere usato
            addEmptyStringInConditionsListEmpty(conditionTrue, conditionFalse);
            condizioneAttuale = new Condizione(conditionTrue, conditionFalse, assertXTrue, assertXFalse, assertAmbo, null, condizioneFiglia);
        }
        else {
            condizioneAttuale.condizioneFigliaFalse = condizioneFiglia;
        }
        condizioneFiglia.condizioneGenitore = condizioneAttuale;
        condizioneFiglia.tipoGenitore = false;
    }
    if (inputConseguente != null) {
        let condizioneConseguente = generaCondizioniAnnidateEConseguenti(partenzaConseguente);
        if (condizioneAttuale == null) {
            //nota: se non è già inizializzato, lo inizializzo
            addEmptyStringInConditionsListEmpty(conditionTrue, conditionFalse);
            condizioneAttuale = new Condizione(conditionTrue, conditionFalse, assertXTrue, assertXFalse, assertAmbo, null, null);
        }
        //setto i rapporti tra condizioi conseguenti e precedenti
        condizioneAttuale.condizioneConseguente = condizioneConseguente;
        condizioneConseguente.condizionePrecedente = condizioneAttuale;
        condizioneConseguente.tipoGenitore = "Precedente";
    }
    return condizioneAttuale;
}


/**A partire dalla condizione "padre di tutte" (il nodo in cima alla piramide) 
 * si vanno a cercare ricorsivamente le condizioni che non hanno nessuna figlia o che ne hanno una sola e si inseriscono nella lista risultato*/
function trovaTutteLeCondizioniFiglie(condizionePadre, listaFiglie) {

    let condizioneRiferimentoTrue = condizionePadre.condizioneFigliaTrue;//va trovata una soluzione per decidere come prendere
    let condizioneRiferimentoFalse = condizionePadre.condizioneFigliaFalse;
    let condizioneRiferimentoConseguente = condizionePadre.condizioneConseguente;


    if (condizioneRiferimentoTrue == null || condizioneRiferimentoFalse == null) {
        listaFiglie.push(condizionePadre);
    }

    //nota: può anche succedere che un padre abbia una condizione figlia null e l'altra
    //valorizzata. In questo caso continua.

    if (condizioneRiferimentoTrue != null) {
        trovaTutteLeCondizioniFiglie(condizioneRiferimentoTrue, listaFiglie);
    }
    if (condizioneRiferimentoFalse != null) {
        trovaTutteLeCondizioniFiglie(condizioneRiferimentoFalse, listaFiglie);
    }
    //Questo caso va controllato a prescindere: le figlie vanno aggiunte anche se c'è una conseguente
    if (condizioneRiferimentoConseguente != null) {
        trovaTutteLeCondizioniFiglie(condizioneRiferimentoConseguente, listaFiglie);
    }
    return;
}


/**
 * Data la "listaFiglie" di tipo Condizione, questa funzione si occupa di prendere a ritroso tutte le condizioni e gli assert delle condizioni genitori e precedenti di ogni Condizione della lista.
 * Poi aggiunge il caso finale. Infine, aggiunge nella matrice "result" tutti i dati creati
 * 
 * Il risultato è una matrice: un array che per ogni Condizione della lista ha un elemento contenente ha 2 array interni (uno per il caso ultimo true e uno per il caso ultimo false):
 * : [listStrCondizioniCompleteFalse, strAssertFalse, tipoUltimoGenitore, listStrSequenceFalse]
 * [listStrCondizioniCompleteTrue, strAssertTrue, tipoUltimoGenitore, listStrSequenceTrue])
 * Dove il primo elemento è una lista di condizioni possibili che arrivano fino a quel nodo, il secondo una stringa di assert da verificare dopo il lancio del metodo,
 * il terzo dice se il caso è annidato a un caso true, false, se è conseguente a un precedente o se è il nodo "genitore di tutti" (null),
 * il quarto contiene una lista di tutti i possibili suffissi al nome del metodo
*/
function creaCondizioniEAssert(listaFiglie, flgCarryOneResult) {
    let arrayResult = [];

    for (let i = 0; i < listaFiglie.length; i++) {
        //prendo una a una le condizioni del padre
        let countCicli = 0;
        //parto con un "a capo" per evitare sovrapposizioni
        let listStrCondizioniIntermedie = [];
        listStrCondizioniIntermedie.push("\n"); //TODO: Serve lo "\n" o dà fastidio?
        //gli assert sono uguali alle condizioni comuni + quelle solo true/false
        let strAssertTrue = listaFiglie[i].assertInBoth + "\n" + listaFiglie[i].assertIfTrue;
        let strAssertFalse = listaFiglie[i].assertInBoth + "\n" + listaFiglie[i].assertIfFalse;
        let listStrCondizioneFinaleIfTrue = listaFiglie[i].condizioneXTrue;
        let listStrCondizioneFinaleIfFalse = listaFiglie[i].condizioneXFalse;
        let condizioneRiferimento;
        condizioneRiferimento = listaFiglie[i];
        let tipoUltimoGenitore = null;
        let listStrSequenza = [];
        listStrSequenza.push("");
        //se ha una figlia non null, segno il flag mezza_madre
        let flgMezzaMadre = false;
        let tipoFigliaMezzaMadre = null;
        if (listaFiglie[i].condizioneFigliaTrue != null || listaFiglie[i].condizioneFigliaFalse != null) {
            flgMezzaMadre = true;
            if (listaFiglie[i].condizioneFigliaTrue != null) {
                tipoFigliaMezzaMadre = true;
            }
            if (listaFiglie[i].condizioneFigliaFalse != null) {
                tipoFigliaMezzaMadre = false;
            }
            if (listaFiglie[i].condizioneFigliaTrue != null && listaFiglie[i].condizioneFigliaFalse != null) {
                throw "Errore: è stata passata nella listaFiglie (che dovrebbe contenere solo le condizioni con al più una figlia) una condizione con due figlie";
            }
        }

        //genero le stringhe prendendo uno a uno i nodi -> Se il padre è null rompo
        while (true) {
            //La primissima figlia si inserisce a parte perchè ha due condizioni
            //prendo il genitore e il tipo di genitore per ricavare la codizione da scrivere 
            let tipoGenitore = condizioneRiferimento.tipoGenitore;
            // condizioneRiferimento = condizioneRiferimento.condizioneGenitore;
            //condizioneRiferimento è il genitore oppure il precedente (quello valorizzato). Se non c'è nè uno nè l'altro, sarà null
            if (condizioneRiferimento.condizionePrecedente != null) {
                condizioneRiferimento = condizioneRiferimento.condizionePrecedente;
            }
            else if (condizioneRiferimento.condizioneGenitore != null) {
                condizioneRiferimento = condizioneRiferimento.condizioneGenitore;
            }
            else {
                condizioneRiferimento = null;
            }

            //se la condizione precedente è null vuol dire che sono al nodo padre, l'unico che on ha nè genitori nè precedenti -> Rompo segnandolo come ultimo genitore
            if (condizioneRiferimento == null) {
                //se esco qui, tipoUltimoGenitore è quello della condizione figlia del genitore "base"
                tipoUltimoGenitore = tipoGenitore;
                break;
            }
            else {
                if (tipoGenitore == "Precedente") {
                    //Se tipoGenitore=='Precedente' non faccio nulla -> strCondizioniIntermedie non va modificato ma devo aggiornare il nome del metodo
                    //segno solo per il nome metodo
                    for (let k = 0; k < listStrSequenza.length; k++) {
                        listStrSequenza[k] = "Conseguente" + listStrSequenza[k];
                    }
                }
                else if (tipoGenitore == true) {
                    //per ogni elemento di condizioneRiferimento.condizioneTrue, lo aggiungo 
                    if (flgCarryOneResult) {
                        listStrCondizioniIntermedie[0] += condizioneRiferimento.condizioneXTrue[0] + "\n";
                        listStrSequenza[0] = "True1" + listStrSequenza[0];
                    }
                    else {
                        [listStrCondizioniIntermedie, listStrSequenza] = updateConditionsList(listStrCondizioniIntermedie, condizioneRiferimento.condizioneXTrue, listStrSequenza, "True", false);
                    }

                }
                else if (tipoGenitore == false) {
                    if (flgCarryOneResult) {
                        listStrCondizioniIntermedie[0] += condizioneRiferimento.condizioneXFalse[0] + "\n";
                        listStrSequenza[0] = "False1" + listStrSequenza[0];

                    }
                    else {
                        [listStrCondizioniIntermedie, listStrSequenza] = updateConditionsList(listStrCondizioniIntermedie, condizioneRiferimento.condizioneXFalse, listStrSequenza, "False", false);
                    }
                }
                else {
                    throw "Errore: tipoGenitore non è definito correttamente";
                }
            }
            countCicli++;

            if (countCicli >= 1000000) {
                throw "Errore: creaCondizioniAssert sta ciclando all'infinito";
            }
        }

        //TODO: risolvere rischio di bug -> primo genitore non viene letto
        let listStrCondizioniCompleteTrue = null;
        let listStrCondizioniCompleteFalse = null;
        let listStrSequenceTrue;
        let listStrSequenceFalse;
        [listStrCondizioniCompleteTrue, listStrSequenceTrue] = updateConditionsList(listStrCondizioniIntermedie, listStrCondizioneFinaleIfTrue, listStrSequenza, "True", true);
        [listStrCondizioniCompleteFalse, listStrSequenceFalse] = updateConditionsList(listStrCondizioniIntermedie, listStrCondizioneFinaleIfFalse, listStrSequenza, "False", true);



        //se è una mezza madre, deve avere un trattamento speciale -> Setta a null i valori associati alla condizione con una figlia
        //IN questo modo, le funzioni che useranno l'array sapranno riconoscere la mezza-madre
        if (flgMezzaMadre) {
            if (tipoFigliaMezzaMadre == true) {
                //a fine ciclo, metto "" i risultati degli assert se ha una figlia true
                strAssertTrue = "";
            }
            if (tipoFigliaMezzaMadre == false) {
                //a fine ciclo, metto "" i risultati degli assert se ha una figlia false
                strAssertFalse = "";
            }
        }



        //in posizione 0 le false, in 1 le true
        arrayResult[i] = [];
        arrayResult[i].push([listStrCondizioniCompleteFalse, strAssertFalse, tipoUltimoGenitore, listStrSequenceFalse]);
        arrayResult[i].push([listStrCondizioniCompleteTrue, strAssertTrue, tipoUltimoGenitore, listStrSequenceTrue]);
    }
    return arrayResult;
}

//la funzione ritorna una nuova lista di condizioni intermedie aggiornata correttamente
//chosenCase può avere valori "True"" o "False"
function updateConditionsList(currentListStrConditions, newlistOfConditions, listStrMethodName, chosenCase, isFinal){
    let currentListStrConditionsClone = Array.from(currentListStrConditions);
    let listStrMethodNameClone = Array.from(listStrMethodName);
  
    //se la nuova lista di condizioni ha dimensione 1, aggiorno semplicemente
    if(newlistOfConditions.length==1){
      for(let i=0; i<currentListStrConditionsClone.length; i++){
        //se è la finale, i nuovi pezzi vanno aggiunti a fine stringa, altrimenti all'inizio
        if(isFinal){
          currentListStrConditionsClone[i] += newlistOfConditions[0] + "\n";
          listStrMethodNameClone[i] += chosenCase;  
        }
        else{
          currentListStrConditionsClone[i] = newlistOfConditions[0] + currentListStrConditionsClone[i] + "\n";
          listStrMethodNameClone[i] = chosenCase + listStrMethodNameClone[i];  
        }
      }
      return [currentListStrConditionsClone, listStrMethodNameClone];
    }
    else if(newlistOfConditions.length>1){
      //se ha più di 1 elemento, mi tocca ricreare l'array
      let newArrayConditions = [];
      let newArrayName = [];
      for(let i=0; i<currentListStrConditionsClone.length; i++){
        for(let j=0; j<newlistOfConditions.length; j++){
          //se è la finale, i nuovi pezzi vanno aggiunti a fine stringa, altrimenti all'inizio
          if(isFinal){
            newArrayConditions.push(currentListStrConditionsClone[i] + newlistOfConditions[j]);
            newArrayName.push(listStrMethodNameClone[i] + chosenCase + (j+1));
          }
          else{
            newArrayConditions.push(newlistOfConditions[j] + currentListStrConditionsClone[i] );
            newArrayName.push(chosenCase + (j+1) + listStrMethodNameClone[i]);  
          }
        }
      }
      return [newArrayConditions, newArrayName];
    }
    throw new Error("Errore: la newListOfConditions è null o vuota");
  }
    

/** Questo metodo prende i dati "comuni" e l'array contenente tutte le informazioni e chiama il metodo creaMetodo() per creare effettivamente il metodo */
function generaMetodiCondizionaliConFiglie(precondizioni_comuni, nomeMetodo, toBeThrown, nomeMetodoComeDaChiamare, arrayCasiPossibili) {
    let result = '';

    for (let i = 0; i < arrayCasiPossibili.length; i++) {
        let caseFalse = arrayCasiPossibili[i][0];
        let caseTrue = arrayCasiPossibili[i][1];
        //ciascun elemento di caeTrue o caseFalse  sarà una lista così composta:
        //[listaDiStrCond, strAssert, tipoGenitore, sequenza]
        //caseTrue o caseFalse servono solo per stabilire il suffisso
        let listOfConditionsTrue = caseTrue[0];
        let strAssertTrue = caseTrue[1];
        let listOfSequencesTrue = caseTrue[3];
        if (listOfConditionsTrue != null && listOfConditionsTrue.length != 0) {
            for (let j = 0; j < listOfConditionsTrue.length; j++) {
                let thisCondition = listOfConditionsTrue[j];
                let thisSequence = "_caseTrue_Sequence_" + listOfSequencesTrue[j];
                result += creaMetodo(precondizioni_comuni, thisCondition, strAssertTrue, nomeMetodo, toBeThrown, nomeMetodoComeDaChiamare, thisSequence) + '\n\n';
            }
        }

        let listOfConditionsFalse = caseFalse[0];
        let strAssertFalse = caseFalse[1];
        let listOfSequencesFalse = caseFalse[3];
        if (listOfConditionsFalse != null && listOfConditionsFalse.length != 0) {
            for (let j = 0; j < listOfConditionsFalse.length; j++) {
                let thisCondition = listOfConditionsFalse[j];
                let thisSequence = "_caseFalse_Sequence_" + listOfSequencesFalse[j];
                result += creaMetodo(precondizioni_comuni, thisCondition, strAssertFalse, nomeMetodo, toBeThrown, nomeMetodoComeDaChiamare, thisSequence) + '\n\n';
            }
        }
    }

    return result;
}

/** Passati tutti i dati, questo metodo si occupa di creare il test: scrive l'intestazione del test, incolla le condizioni comuni, le condizioni specifiche, gli assert specifici e chiude il metodo*/
function creaMetodo(precondizioni_comuni, condizioni, conseguenze, nomeMetodo, toBeThrown, nomeMetodoComeDaChiamare, suffisso) {
    if (toBeThrown == null) {
        toBeThrown = "";
    }
    let result = '';
    result += "@Test\n";
    result += 'public void ' + nomeMetodo + '_Test_' + suffisso + '() ' + toBeThrown + ' {\n';
    result += precondizioni_comuni + '\n';
    result += condizioni + '\n';
    result += nomeMetodoComeDaChiamare + '\n';
    result += conseguenze + '\n}';
    return result;
}



