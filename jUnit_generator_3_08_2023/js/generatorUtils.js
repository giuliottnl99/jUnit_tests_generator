/** Questa funzione ritorna true se c'è un oggetto equivalente nell'array 
 * Compensa il fatto che il metodo "includes" ritorna true solo se ci sono oggetti IDENTICI
 */
function includesNotOnlyIdentical(str, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == str) {
      return true;
    }
  }
  return false;
}

/** Date due liste, aggiunge alla prima gli elementi della seconda */
function mergeList(list1, list2) {
  if (list1 == null || list2 == null) {
    throw new Error("One of the lists to be merged are null");
  }
  for (let i = 0; i < list2.length; i++) {
    list1.push(list2[i]);
  }
}


/** Prende una riga e la pulisce dai commenti*/
function pulisciDaCommenti(javacode) {
  let righe = javacode.split("\n");
  let codicePulito = "";
  for (let i = 0; i < righe.length; i++) {
    let riga = righe[i];
    const index = riga.indexOf("//");
    if (index == 0) {
      continue;
    }
    if (index !== -1) {
      riga = riga.substring(0, index);
    }
    //in ogni caso, aggiungo nel risultato
    codicePulito += riga + "\n";
  }
  return codicePulito;
}

/** Questa funzione elimina i doppioni dagli Assert*/
function pulisciDoppioniAssert(risultatoAssert) {
  //prende uno a uno i valori separti da ";"
  let istruzioni = risultatoAssert.replace("\n", "").split(";");
  let traParentesiGiaInserite = [];
  let result = "";
  //prendo una a una le istruzioni tra parentesi (sevre metodo) a partire dal fondo e le inserisco in istruzioniGiaInserite
  // Se l'istruzione c'è già -> skippo
  // Se non c'è già -> Aggiungo nel vettore  nel result = istruzione + "\n" + result
  for (let i = istruzioni.length - 1; i >= 0; i--) {
    let traParentesi = prendiParentesiAssert(istruzioni[i]);
    if (includesNotOnlyIdentical(traParentesi, traParentesiGiaInserite)) {
      continue;
    }
    else {
      traParentesiGiaInserite.push(traParentesi);
      result = istruzioni[i] + ";\n" + result;
    }
  }
  return result;

}


function addEmptyStringInConditionsListEmpty(conditionTrue, conditionFalse) {
  //se conditionTrue o conditionFalse fossero array completamente vuoti, devono comunque avere dentro una stringa vuota! -> Altrimenti non costruisce le stringhe finali
  if (conditionTrue.length == 0) {
    conditionTrue.push("");
  }
  if (conditionFalse.length == 0) {
    conditionFalse.push("");
  }
}


/**Questa funzione ritorna il valore tra le parentesi degli assert [(]es. assertTrue(form.isFlgT()) -> ritorna form.isFlgT() ] */
function prendiParentesiAssert(riga) {
  if (riga == null || riga == "" || !riga.includes("assert")) {
    return riga;
  }
  let setIndex = riga.indexOf("assert");
  let aperte = 0;
  let chiuse = 0;
  let aperturaIndex = -1;
  let chiusuraIndex = -1;

  for (let i = setIndex + 6; i < riga.length; i++) {
    if (riga[i] == '(') {
      aperte++;
      if (aperturaIndex == -1) {
        aperturaIndex = i;
      }
    } else if (riga[i] == ')') {
      chiuse++;
      if (aperturaIndex !== -1 && chiuse == aperte) {
        chiusuraIndex = i;
        break;
      }
    }
    //c'è un altro caso da considerare per chiudere: quello che le chiuse sono una in meno delle aperte ma c'è una "," e la riga contiene assertEquals:
    else if (aperturaIndex !== -1 && (chiuse == aperte - 1) && riga[i] == "," && riga.includes("AssertEquals")) {
      chiusuraIndex = i;
      break;
    }

  }

  if (aperturaIndex == -1 || chiusuraIndex == -1) {
    throw new Error('Parentesi non bilanciate');
  }

  return riga.substring(aperturaIndex + 1, chiusuraIndex);
}

