function creaCondizione(strCondizione) {
    // Chiamo il metodo per inserire le parentesi mancanti
    let strCondizioneClone = inserisciParentesiDoveMancano(strCondizione);
    
    // Trovo le posizioni delle parentesi e degli operatori
    let listaPosizioniCondizioni = trovaPosizioniParentesiEOperatori(strCondizioneClone);
    
    // Inserisco le parentesi agli operatori OR se ci sono sia AND sia OR
    for(let i=0; i<listaPosizioniCondizioni.length; i++){
      if(listaPosizioniCondizioni[i][3] != null && listaPosizioniCondizioni[0][3] !=  listaPosizioniCondizioni[i][3]){
        inserisciParentesiAgliOr(strCondizioneClone, listaPosizioniCondizioni);
        break;
      }
    }
    
    // Aggiorno la lista delle posizioni dopo l'inserimento delle parentesi
    listaPosizioniCondizioni = trovaPosizioniParentesiEOperatori(strCondizioneClone);
    
    // Definisco un array per le condizioni interne
    let listaCondizioniInterne = [];
    
    // Ciclo attraverso le posizioni trovate
    let flgIsFinito = false;
    for (let i = 0; i < listaPosizioniCondizioni.length; i++) {
      // Estraggo la condizione interna
      let condizioneSeparataStr = strCondizioneClone.substr(listaPosizioniCondizioni[i][0], listaPosizioniCondizioni[i][1] - listaPosizioniCondizioni[i][0]);
      
      //nota che se non ci sono condizioniInterne viene passata la condizione stessa come condizioneInterna. Quindi è importante che in tal caso
      // non reitero il ciclo formando così un ciclo infinito
      //in caso di "fine", creo la condizione
      let condizioneInterna;
      if("(" + condizioneSeparataStr + ")" != strCondizioneClone){
          condizioneInterna = creaCondizione(condizioneSeparataStr);
      }
      else{
        condizioneInterna = null;
        flgIsFinito = true;
      }
      // Memorizzo le informazioni sulla condizione interna
      let puntoIniziale = listaPosizioniCondizioni[i][0];
      let puntoFinale = listaPosizioniCondizioni[i][1];
      let operatoreIniziale = listaPosizioniCondizioni[i][2];
      let operatoreFinale = listaPosizioniCondizioni[i][3];
      
      // Aggiungo la condizione interna alla lista
      listaCondizioniInterne.push({
        condizioneDaVerificare: condizioneInterna,
        legantePre: operatoreIniziale,
        legantePost: operatoreFinale,
        inizio: puntoIniziale,
        fine: puntoFinale
      });
    }
    let result = null;
    // Creo l'oggetto CondizioneDaVerificare, indipendentemente dal risultato dell'if:
    if(!flgIsFinito && listaCondizioniInterne.length>1){
      result = new CondizioneDaVerificare(strCondizione, listaCondizioniInterne);
    }
    else{
      result = new CondizioneDaVerificare(strCondizione, null);
    }
    
    // Imposto la condizione padre per le condizioni figlio -> Salvo che sia all'ultimo nodo figlio senza figli
    if(!flgIsFinito){
      for (let i = 0; i < listaCondizioniInterne.length; i++) {
        let condizione = listaCondizioniInterne[i]["condizioneDaVerificare"];
          condizione.condizionePadre = result;
      }
    }
    
    // Ritorno l'oggetto risultante
    return result;
  }


  function trasformaCondizione(elementToChange, booleanCaso) {
    let input = document.getElementById(elementToChange).value;
    let condizioneIniziale = creaCondizione(input);
    let result = generaSettersDaCondizioneIniziale(condizioneIniziale, booleanCaso);
    document.getElementById(elementToChange).value = result + ";";
  }


  /** Questa funzione ritorna una lista contenente in ogni elemento informazioni su apertura e chiusura di una data parentesi della str passata.
   * Ogni elemento contiene le seguenti informazioni, in ordine: posizioneAperturaParentesi, posizioneChiusura, operatorePrecedente, operatoreSuccessivo
   */
  function trovaPosizioniParentesiEOperatori(strCondizione) {
    let posizioneChiusura = 0;
    let listaPosizioneCondizioni = [];
    let legantePrecedente = [null, null];
    let leganteSuccessivo = [null, null];
    let posizioneApertura = null;
    let strNull = ""; //questa variabile serve solo come filler per il ritorno di trovaChiusuraEAperturaParentesi
  
    while (posizioneChiusura < strCondizione.length) {
      legantePrecedente = leganteSuccessivo;
  
      [strNull, posizioneChiusura, posizioneApertura] = trovaChiusuraEAperturaParentesi(strCondizione, posizioneChiusura);
      leganteSuccessivo = trovaLegante(strCondizione, posizioneChiusura);

      if(posizioneChiusura==null){
        break;
      }

      listaPosizioneCondizioni.push([posizioneApertura, posizioneChiusura, legantePrecedente[0], leganteSuccessivo[0]]);
    }
  
    return listaPosizioneCondizioni;
  }
  
  /** Questo metodo, data una singola condizione dentro l'if senza operatori la converte nel codice che serve per rendere la medesima condizione true o false */
  function convertiCondizione(strCondizione, booleanoDiConversione) {
    let strResult = tagliaStringaCondizione(strCondizione, booleanoDiConversione);
    strResult = settaCondizione(strResult);
    return strResult;
  }

  function settaCondizione(stringheCondizione) {
    let condizioneRisultato = "" + new String(stringheCondizione[0]);

    if(stringheCondizione[2]=="==" || stringheCondizione[2]=="!=" ){
      return stringheCondizione[0] + " = " + stringheCondizione[1];
    }
  
    // Cerca il primo "get" o "is" partendo dalla fine e lo sostituisce con "set"
    const getIndex = condizioneRisultato.lastIndexOf("get");
    const isIndex = condizioneRisultato.lastIndexOf("is");

    //attenzione: va rimpiazzato solo l'ultimo e il più "in fondo" tra get e is
    if(getIndex>isIndex){
      condizioneRisultato = sostituisciParolaConSet(condizioneRisultato, getIndex, "get");
    }
    if(isIndex>getIndex){
      condizioneRisultato = sostituisciParolaConSet(condizioneRisultato, isIndex, "is");
    }
  
    // Cerca la prima parentesi aperta "(" dopo il valore "set" e vi aggiunge la stringa "stringheCondizione[1]"
    const openingParenthesisIndex = condizioneRisultato.indexOf("(", condizioneRisultato.lastIndexOf("set"));
    if (openingParenthesisIndex !== -1) {
      condizioneRisultato =
        condizioneRisultato.slice(0, openingParenthesisIndex + 1) +
        stringheCondizione[1] +
        condizioneRisultato.slice(openingParenthesisIndex + 1);
    }
  
    return condizioneRisultato;
  }

  /** La funzione prende l'indice a cui la parola va sostituita e la parola da rimpiazzae: ritorna la stringa rimpiazzata */
  function sostituisciParolaConSet(str, index, toBeReplaced){
    let str1 = str.substring(0, index);
    let str2 = str.substring(index+toBeReplaced.length);
    return str1 + "set" + str2;
  }
  


  
  function tagliaStringaCondizione(strCondizione, casoDaGenerare) {
    // Rimuove gli spazi dalla stringa di condizione
    strCondizione = strCondizione.replace(/\s/g, ""); 
    let stringheCondizione = [];
  
    if (strCondizione.includes("==")) {
      stringheCondizione = strCondizione.split("==");
      if (!casoDaGenerare && stringheCondizione[1] == "null"){
        stringheCondizione[1] = "NotNull";
      }
      else if (!casoDaGenerare && isNaN(stringheCondizione[1])) {
        stringheCondizione[1] = "'" + stringheCondizione[1].slice(0, -1) + "diverso" + '"';
      }
      else if(!casoDaGenerare){
        let varAppoggio = Number(stringheCondizione[1]) + 1;
        stringheCondizione.pop();
        stringheCondizione[1] = varAppoggio;
      }
    } else if (strCondizione.includes("!=")) {
      stringheCondizione = strCondizione.split("!=");
      if (casoDaGenerare && stringheCondizione[1] == "null"){
        stringheCondizione[1] = "NotNull";
      }
      else if (casoDaGenerare && isNaN(stringheCondizione[1])) {
        stringheCondizione[1] = stringheCondizione[1].slice(0, -1) + "diverso" + '"';
      }
      else if(casoDaGenerare){
        let varAppoggio = Number(stringheCondizione[1]) + 1;
        stringheCondizione.pop();
        stringheCondizione[1] = varAppoggio;
      }
    } 
    //Se invece include segni di disuguaglianza: in questo caso aggiungo o tolgo 10 in modo che la condizione sia sempre vera oppure falsa
    else if (strCondizione.includes(">=") || strCondizione.includes("<=") || strCondizione.includes(">") || strCondizione.includes("<")) {
      if (strCondizione.includes(">=") || strCondizione.includes(">")) {
        let stringheCondizioneTaglio = null;
        if(strCondizione.includes(">=")){
         stringheCondizioneTaglio = strCondizione.split(">=");
        }
        else{
          stringheCondizioneTaglio = strCondizione.split(">");
        }
        let varNumber = (Number(stringheCondizioneTaglio[1]));
        
        stringheCondizione.push(stringheCondizioneTaglio[0]);
        if (casoDaGenerare) {
          stringheCondizione.push("" + (varNumber + 10));
        } else {
          stringheCondizione.push("" + (varNumber - 10));
        }


        
      } else if (strCondizione.includes("<=")  || strCondizione.includes("<")) {

        let stringheCondizioneTaglio = null;
        if(strCondizione.includes("<=")){
         stringheCondizioneTaglio = strCondizione.split("<=");
        }
        else{
          stringheCondizioneTaglio = strCondizione.split("<");
        }
        let varNumber = (Number(stringheCondizioneTaglio[1]));
        
        stringheCondizione.push(stringheCondizioneTaglio[0]);
        if (casoDaGenerare) {
          stringheCondizione.push("" + (varNumber - 10));
        } else {
          stringheCondizione.push("" + (varNumber + 10));
        }

      }
    } else if (strCondizione.includes("StringUtils.isEmpty")) {
      let flgNegazione = false;
      if (strCondizione.includes("!")) {
        strCondizione = strCondizione.replace("!", "");
        flgNegazione = true;
      }
      if (!casoDaGenerare) {
        flgNegazione = !flgNegazione;
      }
      let strDaSettare = strCondizione.substring(strCondizione.indexOf("(") + 1, strCondizione.lastIndexOf(")"));
      stringheCondizione.push(strDaSettare);
      stringheCondizione.push(flgNegazione ? '"piena"' : '""');
    } 
    else if (strCondizione.includes("StringUtils.isNotEmpty")) {
        let flgNegazione = false;
        if (strCondizione.includes("!")) {
          strCondizione = strCondizione.replace("!", "");
          flgNegazione = true;
        }
        if (!casoDaGenerare) {
          flgNegazione = !flgNegazione;
        }
        let strDaSettare = strCondizione.substring(strCondizione.indexOf("(") + 1, strCondizione.lastIndexOf(")"));
        stringheCondizione.push(strDaSettare);
        stringheCondizione.push(flgNegazione ? '""' : '"piena"');
    }
    
    
    
    
    else if (strCondizione.includes("StringUtils.equalsIgnoreCase") || strCondizione.includes("StringUtils.equals")) {
      let flgNegazione = false;
      if (strCondizione.includes("!")) {
        strCondizione = strCondizione.replace("!", "");
        flgNegazione = true;
      }
      if (!casoDaGenerare) {
        flgNegazione = !flgNegazione;
      }
      let strParentesi = strCondizione.substring(strCondizione.indexOf("(") + 1, strCondizione.lastIndexOf(")"));
      let [strDaSettare, strUguale] = strParentesi.split(",").map((str) => str.trim());
      if(strUguale.includes("get") && !strDaSettare.includes("get")){
        [strDaSettare, strUguale] = [strUguale, strDaSettare];
      }
      stringheCondizione.push(strDaSettare);
      if (flgNegazione) {
        stringheCondizione.push(strUguale.substring(0, strUguale.lastIndexOf('"'))  + "diverso" + "\"");
      } else {
        stringheCondizione.push(strUguale);
      }
    }
  else if (strCondizione.includes("BooleanUtils.isTrue")) {
    let flgNegazione = false;
    if (strCondizione.includes("!")) {
      strCondizione = strCondizione.replace("!", "");
      flgNegazione = true;
    }
    if (!casoDaGenerare) {
      flgNegazione = !flgNegazione;
    }
    let strDaSettare = strCondizione.substring(strCondizione.indexOf("(") + 1, strCondizione.lastIndexOf(")"));
    stringheCondizione.push(strDaSettare);
    if (flgNegazione) {
      stringheCondizione.push("false");
    } else {
      stringheCondizione.push("true");
    }
  }

  else if (strCondizione.includes("BooleanUtils.isFalse")) {
    let flgNegazione = false;
    if (strCondizione.includes("!")) {
      strCondizione = strCondizione.replace("!", "");
      flgNegazione = true;
    }
    if (!casoDaGenerare) {
      flgNegazione = !flgNegazione;
    }
    let strDaSettare = strCondizione.substring(strCondizione.indexOf("(") + 1, strCondizione.lastIndexOf(")"));
    stringheCondizione.push(strDaSettare);
    if (flgNegazione) {
      stringheCondizione.push("true");
    } else {
      stringheCondizione.push("false");
    }
  }
  else if (strCondizione.includes(".equalsIgnoreCase") && !strCondizione.includes("StringUtils")) {
    let flgNegazione = false;
    if (strCondizione.startsWith("!")) {
      strCondizione = strCondizione.replace("!", "");
      flgNegazione = true;
    }
    if (!casoDaGenerare) {
      flgNegazione = !flgNegazione;
    }
    let [strDaSettare, strIgnoreCase] = strCondizione.split(".equalsIgnoreCase");
    //devo togliere la parentesi:
    let posParentesiAperta = strIgnoreCase.indexOf("(") +1;
    let posParentesiChiusa = strIgnoreCase.lastIndexOf(")");
    strIgnoreCase = strIgnoreCase.substring(posParentesiAperta, posParentesiChiusa);

    let numPuntiDa = (strDaSettare.match(/\./g) || []).length;
    let numPuntiIgnoreCase = (strIgnoreCase.match(/\./g) || []).length;
    if (numPuntiIgnoreCase > numPuntiDa) {
      [strDaSettare, strIgnoreCase] = [strIgnoreCase, strDaSettare];
    }
    if(flgNegazione){
      strIgnoreCase = strIgnoreCase.slice(0, -1) + "diverso" + '"';
    }

    stringheCondizione.push(strDaSettare);
    stringheCondizione.push(strIgnoreCase);
  }
  else if (strCondizione.includes(".equals") && !strCondizione.includes("StringUtils")) {
    let flgNegazione = false;
    if (strCondizione.startsWith("!")) {
      strCondizione = strCondizione.replace("!", "");
      flgNegazione = true;
    }
    if (!casoDaGenerare) {
      flgNegazione = !flgNegazione;
    }
    let [strDaSettare, strRight] = strCondizione.split(".equals");
    //devo togliere la parentesi:
    let posParentesiAperta = strRight.indexOf("(") +1;
    let posParentesiChiusa = strRight.lastIndexOf(")");
    strRight = strRight.substring(posParentesiAperta, posParentesiChiusa);

    let numPuntiDa = (strDaSettare.match(/\./g) || []).length;
    let numPuntiIgnoreCase = (strRight.match(/\./g) || []).length;
    if (numPuntiIgnoreCase > numPuntiDa) {
      [strDaSettare, strRight] = [strRight, strDaSettare];
    }
    if(flgNegazione){
      strRight = strRight.slice(0, -1) + "diverso" + '"';
    }

    
    stringheCondizione.push(strDaSettare);
    stringheCondizione.push(strRight);
  }
    else if (strCondizione.includes(".isEmpty") && !strCondizione.includes("StringUtils")) {
        let flgNegazione = false;
        if (strCondizione.startsWith("!")) {
          strCondizione = strCondizione.replace("!", "");
          flgNegazione = true;
        }
        if (!casoDaGenerare) {
          flgNegazione = !flgNegazione;
        }
        let strDaSettare = strCondizione.split(".isEmpty")[0];
        stringheCondizione.push(strDaSettare);
        if (flgNegazione) {
          stringheCondizione.push('"pieno"');
        } else {
          stringheCondizione.push('""');
        }
      }
    
      else if (strCondizione.includes(".isNotEmpty") && !strCondizione.includes("StringUtils")) {
        let flgNegazione = false;
        if (strCondizione.startsWith("!")) {
          strCondizione = strCondizione.replace("!", "");
          flgNegazione = true;
        }
        if (!casoDaGenerare) {
          flgNegazione = !flgNegazione;
        }
        let strDaSettare = strCondizione.split(".isNotEmpty")[0];
        stringheCondizione.push(strDaSettare);
        if (flgNegazione) {
          stringheCondizione.push('""');
        } else {
          stringheCondizione.push('"pieno"');
        }
      }
      //caso di flag semplici ma senza get/is
      //ultimo caso: quello di flag con get/is
      else {
        let flgNegazione = false;
        if (strCondizione.startsWith("!")) {
          strCondizione = strCondizione.replace("!", "");
          flgNegazione = true;
        }
        if (!casoDaGenerare) {
          flgNegazione = !flgNegazione;
        }
        stringheCondizione.push(strCondizione);
        if (flgNegazione) {
          stringheCondizione.push("false");
        } else {
          stringheCondizione.push("true");
        }

      }

      //il metodo di inserimento cambia in base alla presenza o meno di un "get""
      if(stringheCondizione[0].includes("get")){
        stringheCondizione.push("get")
      }
      else{
        stringheCondizione.push("==")
      }
    //il ritorno è nella forma: primaParte, secondaParte, metodoDiInserimento


      return stringheCondizione;
    }
    


    function generaSettersDaCondizioneIniziale(condizioneIniziale, casoScelto) {
      const tipoLegame = condizioneIniziale.tipoLegame;
    
      if (condizioneIniziale.condizioniFiglie == null || condizioneIniziale.condizioniFiglie.length == 0) {
        return convertiCondizione(condizioneIniziale.contenutoStr, casoScelto);
      } else {
        const condizioniFiglie = condizioneIniziale.condizioniFiglie;
    
        if (tipoLegame == "&&" && casoScelto) {
          let strResult = "";
          for (let i = 0; i < condizioniFiglie.length; i++) {
            strResult += generaSettersDaCondizioneIniziale(condizioniFiglie[i]["condizioneDaVerificare"], casoScelto) + ";\n";
          }
          return strResult;
        } else if (tipoLegame == "&&" && !casoScelto) {
          return generaSettersDaCondizioneIniziale(condizioniFiglie[0]["condizioneDaVerificare"], casoScelto) + ";\n";
        } else if (tipoLegame == "||" && casoScelto) {
          return generaSettersDaCondizioneIniziale(condizioniFiglie[0]["condizioneDaVerificare"], casoScelto) + ";\n";
        } else if (tipoLegame == "||" && !casoScelto) {
          let strResult = "";
          for (let i = 0; i < condizioniFiglie.length; i++) {
            strResult += generaSettersDaCondizioneIniziale(condizioniFiglie[i]["condizioneDaVerificare"], casoScelto) + ";\n";
          }
          if(strResult[strResult.length-2]==";"){
            return strResult;
          }
          else{
            return strResult + ";";
          }
        }
      }
    }
    
    /** ritorna un vettore contenente: [strTraParentesi, chiusuraParentesi, aperturaParentesi] */
    function trovaChiusuraEAperturaParentesi(strDaEsaminare, posizioneDaCuiPartire) {
      let pos1 = strDaEsaminare.indexOf("(", posizioneDaCuiPartire)==-1 ? 1000000: strDaEsaminare.indexOf("(", posizioneDaCuiPartire);
      let pos2 = strDaEsaminare.indexOf("[", posizioneDaCuiPartire)==-1 ? 1000000: strDaEsaminare.indexOf("[", posizioneDaCuiPartire);
      let pos3 = strDaEsaminare.indexOf("{", posizioneDaCuiPartire)==-1 ? 1000000: strDaEsaminare.indexOf("{", posizioneDaCuiPartire);
      let posPrimaParentesi = Math.min(pos1, pos2, pos3);
      const tipoParentesi = strDaEsaminare[posPrimaParentesi];

      let posizioneApertura = posPrimaParentesi;
      let numeroParentesiAperte = 0;
    
      if (tipoParentesi == "(") {
        for (let i = posizioneApertura + 1; i < strDaEsaminare.length; i++) {
          if (strDaEsaminare[i] == ")" && numeroParentesiAperte == 0) {
            return [strDaEsaminare.substring(posizioneApertura + 1, i), i, posizioneApertura+1];
          } else if (strDaEsaminare[i] == "(") {
            numeroParentesiAperte++;
          } else if (strDaEsaminare[i] == ")") {
            numeroParentesiAperte--;
          }
        }
      } else if (tipoParentesi == "[") {
        for (let i = posizioneApertura + 1; i < strDaEsaminare.length; i++) {
          if (strDaEsaminare[i] == "]" && numeroParentesiAperte == 0) {
            return [strDaEsaminare.substring(posizioneApertura + 1, i), i, posizioneApertura+1];
          } else if (strDaEsaminare[i] === "[") {
            numeroParentesiAperte++;
          } else if (strDaEsaminare[i] === "]") {
            numeroParentesiAperte--;
          }
        }
      } else if (tipoParentesi == "{") {
        for (let i = posizioneApertura + 1; i < strDaEsaminare.length; i++) {
          if (strDaEsaminare[i] == "}" && numeroParentesiAperte == 0) {
            return [strDaEsaminare.substring(posizioneApertura + 1, i), i, posizioneApertura+1];
          } else if (strDaEsaminare[i] == "{") {
            numeroParentesiAperte++;
          } else if (strDaEsaminare[i] == "}") {
            numeroParentesiAperte--;
          }
        }
      }
      else{
        return [null, null, posizioneApertura+1];
      }

      throw "Errore: le parentesi non sono giuste. La stringa incriminata è: " + strDaEsaminare;
    }


/**trova il legante e ritorna una lista contenente: [tipoLegante, posizioneLegante] o [null, null] se non ce ne sono*/
  function trovaLegante(strDaEsaminare, posizioneDaCuiPartire) {
    const substrResult = strDaEsaminare.substring(posizioneDaCuiPartire);
    const posizioneLeganteAnd = substrResult.indexOf("&&");
    const posizioneLeganteOr = substrResult.indexOf("||");
    //dei due prendo quello che viene prima
    if(posizioneLeganteOr==-1 && posizioneLeganteAnd==-1){
      return [null, null];
    }
    else if (posizioneLeganteAnd==-1){
      return ["||", posizioneDaCuiPartire + posizioneLeganteOr];
    }
    else if (posizioneLeganteOr==-1){
      return ["&&", posizioneDaCuiPartire + posizioneLeganteAnd];
    }
    else if(posizioneLeganteAnd<posizioneLeganteOr){
      return ["&&", posizioneDaCuiPartire + posizioneLeganteAnd];
    }
    else if(posizioneLeganteOr<posizioneLeganteAnd){
      return ["||", posizioneDaCuiPartire + posizioneLeganteOr];
    }
    else{
      return [null, null];
    }
  }

  function vediSeParentesiEsiste(strDaEsaminare, posizioneDaCuiPartire) {
    const length = strDaEsaminare.length;
  
    for (let i = posizioneDaCuiPartire; i < length; i++) {
      const carattere = strDaEsaminare[i];
  
      if (carattere == "(") {
        return [true, i];
      }
  
      if (/[a-zA-Z!]/.test(carattere)) {
        return [false, i];
      }
    }
    return [false, -1]; // Nessuna parentesi o carattere alfabetico trovato
  }
  

  function inserisciParentesiAgliOr(strDaEsaminare, listaPosizioniCondizioni) {
    let strResult = "" + new String(strDaEsaminare);
  
    for (let i = 0; i < listaPosizioniCondizioni.length; i++) {
      let leganteSuccessivo = listaPosizioniCondizioni[i][3];
  
      if (leganteSuccessivo != "||") {
        continue;
      }
      //se c'è un "||", va aggiunta la ) alla fine e la ( all'inizio di quella che ha l'or prima
  
      strResult = inserisciCarattereNellaStringa(strResult, listaPosizioniCondizioni[i][1], listaPosizioniCondizioni, ")");
      for (let j = i; j >= 0; j--) {
        if (listaPosizioniCondizioni[j][2] == "||" || listaPosizioniCondizioni[j][2] == null) {
          strResult = inserisciCarattereNellaStringa(strResult, listaPosizioniCondizioni[j][0], listaPosizioniCondizioni, "(");
        }
      }
    }
  
    return strResult;
  }

  function inserisciParentesiDoveMancano(strDaModificare) {
    let i = 0;
    let strDaModificareClone = "" + new String(strDaModificare);
    let countOperazioni = 0;
  
    while (i < strDaModificare.length) {
      countOperazioni++;
      const resultParentesi = inserisciParentesiDoveManca(strDaModificareClone, i);
      strDaModificareClone = resultParentesi[0];
      if(resultParentesi[2]==null){
        break;
      }
      i = resultParentesi[2] + 1;
    }
    //se ho fatto una sola operazione, le parentesi non sono da mettere, altrimenti 
    // "isNull(form.getCheckRidTassoInteresse())" -> "(isNull(form.getCheckRidTassoInteresse()))"
    //e l'algoritmo fa una ricorsione infinita
    // if(countOperazioni<=1){
    //   return "" + new String(strDaModificare);
    // }

    //nel caso in cui abbia messo una sola parentesi 
  
    return strDaModificareClone;
  }
  

  function inserisciParentesiDoveManca(strDaModificare, posizioneIniziale) {
    const parentesi = vediSeParentesiEsiste(strDaModificare, posizioneIniziale, true);
  
    if (parentesi[0] == true) {
      const chiusura = trovaChiusuraEAperturaParentesi(strDaModificare, parentesi[1])[1];
      return [strDaModificare, parentesi[1], chiusura];
    }
  
    strDaModificare = inserisciCarattereNellaStringa(strDaModificare, parentesi[1], [], "(");
    let countParentesi = 0;
  
    for (let i = parentesi[1]+1; i < strDaModificare.length+1; i++) {
      if (strDaModificare[i] === "(") {
        countParentesi++;
      } else if (strDaModificare[i] === ")") {
        countParentesi--;
      }
  
      if (
        (((strDaModificare[i] == "&" || strDaModificare[i] == "|") &&
        (strDaModificare[i + 1] == "&" || strDaModificare[i + 1] == "|")) || strDaModificare[i]==null) &&
        countParentesi === 0
      ) {
        //devo aggiungere una ")", ma evitando di fare cose come: getVariabile)()); 
        //-> per evitarlo devo mettere dopo la ")" se non ci sono lettere tra la "primalettera" e la ")":
        let posizionePrimaLettera = trovaPosizionePrimaLettera(strDaModificare, i, false);
        //da qui devo notare una cosa: non va modificato da posizionePrimaLettera ma dalla prima ")" successiva
        let posizionePrimaParentesiDopoPrimaLettera = strDaModificare.indexOf(")", posizionePrimaLettera);
        let posLetteraSuccessiva = strDaModificare.slice(posizionePrimaLettera+1).search(/[a-zA-Z0-9]/) + posizionePrimaLettera-1;
        if(posLetteraSuccessiva==-1){
          //se non la trova, la metto a un valore sempre più alto
          posLetteraSuccessiva = 10000000;
        }
        let posScelta = null;
        //se la posizione della lettera successiva viene prima o non ci sono parentesi successive es -> (ciao!=null && (ciao!="") -> va messo subito dopo la "l"
        if(posLetteraSuccessiva<posizionePrimaParentesiDopoPrimaLettera || posizionePrimaParentesiDopoPrimaLettera==-1){
          posScelta = posizionePrimaLettera+1;
        }
        //altrimenti va messo dopo la ")" es. (ciao.getSaluto() && pulizie 
        else{
          posScelta = posizionePrimaParentesiDopoPrimaLettera+1;
        }
        strDaModificare = inserisciCarattereNellaStringa(strDaModificare, posScelta +1, [], ")");


        return [strDaModificare, parentesi[1], posScelta];
      }
    }
  
    return [strDaModificare, parentesi[1], strDaModificare.length];
  }

  function trovaPosizionePrimaLettera(strDaEsaminare, posizione, avanti) {
    let i = posizione;
    
    if (avanti) {
      while (i < strDaEsaminare.length) {
        if (isLetteraAlfanumerica(strDaEsaminare[i])) {
          return i;
        }
        i++;
      }
    } else {
      while (i >= 0) {
        if (isLetteraAlfanumerica(strDaEsaminare[i])) {
          return i;
        }
        i--;
      }
    }
  
    return -1; // Se non viene trovato nessun carattere alfanumerico
  }

  function inserisciCarattereNellaStringa(strDaModificare, posizioneDaModificare, listaPosizioni, carattereDaAggiungere) {
    let parteIniziale = strDaModificare.slice(0, posizioneDaModificare);
    let parteFinale = strDaModificare.slice(posizioneDaModificare);
    let nuovaStringa = parteIniziale + carattereDaAggiungere + parteFinale;
  
    for (let i = 0; i < listaPosizioni.length; i++) {
      if (listaPosizioni[i][0] > posizioneDaModificare) {
        listaPosizioni[i][0]++;
      }
      if (listaPosizioni[i][1] > posizioneDaModificare) {
        listaPosizioni[i][1]++;
      }
    }
  
    return nuovaStringa;
  }
  
  
  function isLetteraAlfanumerica(char) {
    return /[a-zA-Z0-9]/.test(char);
  }


  
  



  