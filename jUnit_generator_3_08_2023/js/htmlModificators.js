
/**
 * Questo file contiene tutte le funzioni js che creano, modificano o eliminano del codice HTML presente nella pagina web (eccetto quello riguardante i salvataggi)
 */
/**
 * 
 * @param {*} divAnnidato 
 * @param {*} divName 
 * @param {*} divIdToBeAttachedTo 
 * Questa funzione ha lo scopo di creare il codice di un nuovo input annidato o conseguente e attaccarlo all'interno del div precedente
 */

function aggiungiInputsAnnidati(divAnnidato, divName, divIdToBeAttachedTo) {
  divAnnidato.id = divName;
  divAnnidato.innerHTML = '<i> Questo è il div: ' + divName + "</i>"
    + '<i class="bi bi bi-bookmark-dash" onclick="changeDivHiddenValue(\'' + divName + '\')"></i>'
    + '<div id="Inside' + divName + '" class="divInputChiudibile">'
    + '</p><p>Area delle condizioni perchè sia true (1): </p>'
    + '<textarea id="' + divName + 'AreaCondizioniTrue1" rows="10" cols="50"></textarea><br>'
    + '<button onclick="trasformaCondizione(' + "'" + divName + "AreaCondizioniTrue1', true)\"" + ">Rendilo true</button><br>"
    + '<button onclick="trasformaCondizione(' + "'" + divName + "AreaCondizioniTrue1', false)\"" + ">Rendilo false</button><br>"
    + '<button onclick="addTrueAlternative(this, 1)" id="' + divName + 'buttonTrue1"> Aggiungi una condizione alternativa che dà sempre true </button>'



    + '</p><p>Area delle condizioni perchè sia false (1): </p>'
    + '<textarea id="' + divName + 'AreaCondizioniFalse1" rows="10" cols="50"></textarea><br>'
    + '<button onclick="trasformaCondizione(' + "'" + divName + "AreaCondizioniFalse1', true)\"" + ">Rendilo true</button><br>"
    + '<button onclick="trasformaCondizione(' + "'" + divName + "AreaCondizioniFalse1', false)\"" + ">Rendilo false</button><br>"
    + '<button onclick="addFalseAlternative(this, 1)" id="' + divName + 'buttonFalse1"> Aggiungi una condizione alternativa che dà sempre false </button>'



    + '</p><p>Area delle cose da verificare se True </p>'
    + '<textarea id="' + divName + 'AreaConseguenzeTrue" rows="10" cols="50"></textarea><br/>'
    + '<button onclick="trasformaInAssert(' + "'" + divName + "AreaConseguenzeTrue')\"" + ">Trasforma in assert</button>"
    + '</p><p>Area delle cose da verificare se False</p>'
    + '<textarea id="' + divName + 'AreaConseguenzeFalse" rows="10" cols="50"></textarea><br/>'
    + '<button onclick="trasformaInAssert(' + "'" + divName + "AreaConseguenzeFalse')\"" + ">Trasforma in assert</button><br>"
    + '</p><p>Area delle cose da verificare indipendentemente dall\' estito dell\'if</p>'
    + '<textarea id="' + divName + 'AreaConseguenzeAmbo" rows="10" cols="50"></textarea><br/>'
    + '<button onclick="trasformaInAssert(' + "'" + divName + "AreaConseguenzeAmbo')\"" + ">Trasforma in assert</button><br>"
    + '<button onclick="generaAssertDaPrecedenti(' + "'" + divName + "AreaConseguenzeAmbo')\"" + ">Genera assert da precedenti</button><br>"
    + '<button onclick="aggiungiInputAnnidatiTrue(this)"> Aggiungi Annidato dipendente dal ritorno True </button>'
    + '<button onclick="aggiungiInputAnnidatiFalse(this)"> Aggiungi Annidato dipendente dal ritorno False </button>'
    + '<button onclick="aggiungiInputSuccessivi(this)"> Aggiungi una condizione successiva (indipendente dal ritorno true o false) </button>'
    + '<button onclick="eliminaInput(this)"> Elimina questo input e tutti gli input annidati e conseguenti </button>'
    + "</div>";

  document.getElementById(divIdToBeAttachedTo).appendChild(divAnnidato);
}


/** Questa funzione viene chiamata quando si schiaccia il "+" o il "-" di apertura/chiusura di un div e si occupa di modificare la visibilità 
 * di un div aggiungendo o togliendo la classe css "hidden". Inoltre, trasforma il pulsante "+" in "-"  o viceversa */
function changeDivHiddenValue(divName) {
  let divInternal = document.getElementById("Inside" + divName);
  let divExternal = document.getElementById(divName);
  if (divInternal.classList.contains("hidden")) {
    divInternal.classList.remove("hidden");
    divInternal.classList.add("divInputChiudibile");
    let arrowElement = divExternal.querySelector(".bi-bookmark-plus");
    arrowElement.classList.remove("bi-bookmark-plus");
    arrowElement.classList.add("bi-bookmark-dash");

  }
  else {
    divInternal.classList.add("hidden");
    divInternal.classList.remove("divInputChiudibile");
    let arrowElement = divExternal.querySelector(".bi-bookmark-dash");
    arrowElement.classList.remove("bi-bookmark-dash");
    arrowElement.classList.add("bi-bookmark-plus");
  }

}

/** Quando si clicca su "Aggiungi una condizione alternativa che dà sempre true", viene chiamato questo metodo per generare la condizione alternativa e i rispettivi tasti di assert ed eliminazione" */
function createAlternativeInputsTrue(divName, numberInput) {
  let toBeAdded = '<p class="' + divName + 'True' + numberInput + '">Area delle condizioni perchè sia true (' + numberInput + '): </p>'
    + '<textarea class="' + divName + 'True' + numberInput + '" id="' + divName + 'AreaCondizioniTrue' + numberInput + '" rows="10" cols="50"></textarea>'
    + '<button class="' + divName + 'True' + numberInput + '" onclick="trasformaCondizione(' + "'" + divName + "AreaCondizioniTrue" + numberInput + "', true)\"" + ">Rendilo true</button><br>"
    + '<button class="' + divName + 'True' + numberInput + '" onclick="trasformaCondizione(' + "'" + divName + "AreaCondizioniTrue" + numberInput + "', false)\"" + ">Rendilo false</button><br>"
    + '<button class="' + divName + 'True' + numberInput + '" onclick="deleteAlternativeCondition(\'' + divName + 'True' + numberInput + '\')"> Cancella la condizione alternativa aggiunta </button>'
    + '<button class="' + divName + 'True' + numberInput + '" onclick="addTrueAlternative(this, ' + numberInput + ')" id="buttonTrue' + numberInput + '"> Aggiungi una condizione alternativa che dà sempre true </button>';
  return toBeAdded;
}

/** Quando si clicca su "Aggiungi una condizione alternativa che dà sempre false" si attiva,
 *  genera la condizione alternativa e i rispettivi tasti di assert, aggiunta di ulteriore nuovo metodo ed eliminazione" */
function createAlternativeInputsFalse(divName, numberInput) {
  let toBeAdded = '<p class="' + divName + 'False' + numberInput + '">Area delle condizioni perchè sia false (' + numberInput + '): </p>'
    + '<textarea class="' + divName + 'False' + numberInput + '" id="' + divName + 'AreaCondizioniFalse' + numberInput + '" rows="10" cols="50"></textarea>'
    + '<button class="' + divName + 'False' + numberInput + '" onclick="trasformaCondizione(' + "'" + divName + "AreaCondizioniFalse" + numberInput + "', true)\"" + ">Rendilo true</button><br>"
    + '<button class="' + divName + 'False' + numberInput + '" onclick="trasformaCondizione(' + "'" + divName + "AreaCondizioniFalse" + numberInput + "', false)\"" + ">Rendilo false</button><br>"
    + '<button class="' + divName + 'False' + numberInput + '" onclick="deleteAlternativeCondition(\'' + divName + 'False' + numberInput + '\')"> Cancella la condizione alternativa aggiunta </button>'
    + '<button class="' + divName + 'False' + numberInput + '" onclick="addFalseAlternative(this, ' + numberInput + ')" id="buttonFalse' + numberInput + '"> Aggiungi una condizione alternativa che dà sempre false </button>';
  return toBeAdded;
}

/**Quando si clicca su "aggiungi una condizione alternativa che dà sempre true" si attiva
 *  crea il codice html per la nuova condizione true e lo attacca nel posto giusto */
function addTrueAlternative(button, numberInput) {
  //Aggiunta dell'alternativa true
  let parentNode = button.parentNode.parentNode;
  let newHTML = createAlternativeInputsTrue(parentNode.id, parseInt(numberInput) + 1);
  button.insertAdjacentHTML('afterend', newHTML);
}

/**Quando si clicca su "aggiungi una condizione alternativa che dà sempre false" si attiva
 *  crea il codice html per la nuova condizione false e lo attacca nel posto giusto */
function addFalseAlternative(button, numberInput) {
  //Aggiunta dell'alternativa false
  let parentNode = button.parentNode.parentNode;
  let newHTML = createAlternativeInputsFalse(parentNode.id, parseInt(numberInput) + 1);
  button.insertAdjacentHTML('afterend', newHTML);
}


/**Quando si clicca su "cancella la condizione alternativa aggiunta" si attiva
 *  Cancella tutti i campi relativi alla nuova condizione aggiunta */
function deleteAlternativeCondition(className) {
  let elementsToRemove = document.getElementsByClassName(className);
  while (elementsToRemove.length > 0) {
    elementsToRemove[0].remove();
  }
}


/** Questa funzione viene chiamara quando si clicca su "Aggiungi una condizione successiva (indipendente dal ritorno true o false)"
 * Crea un input di tipo "True" chiudibile
 */
function aggiungiInputAnnidatiTrue(button) {
  // Creazione del div
  var divAnnidato = document.createElement('div');
  divAnnidato.classList.add("divInputChiudibile")
  let divName = generaNomeInputAnnidato(button, true)
  aggiungiInputsAnnidati(divAnnidato, divName, button.parentNode.id)
}

/** Questa funzione viene chiamara quando si clicca su "Aggiungi una condizione successiva (indipendente dal ritorno true o false)"
 * Crea un input di tipo "False" chiudibile
 */
function aggiungiInputAnnidatiFalse(button) {
  // Creazione del div
  var divAnnidato = document.createElement('div');
  divAnnidato.classList.add("divInputChiudibile")
  let divName = generaNomeInputAnnidato(button, false)
  aggiungiInputsAnnidati(divAnnidato, divName, button.parentNode.id)
}


/** Questa funzione viene chiamara quando si clicca su "Aggiungi una condizione successiva (indipendente dal ritorno true o false)"
 * Crea un input di tipo successivo chiudibile
 */
function aggiungiInputSuccessivi(buttonName) {
  var divAnnidato = document.createElement('div');
  divAnnidato.classList.add("divInputChiudibile");
  let divName = generaNomeInputAnnidato(buttonName, "Conseguente");
  aggiungiInputsAnnidati(divAnnidato, divName, buttonName.parentNode.id);
}

/** Genera il nome dell'input annidato */
function generaNomeInputAnnidato(button, tipoAggiunta) {
  // Ottieni il riferimento al div genitore del pulsante
  var div = button.parentNode.parentNode;

  // Ottieni l'ID del div
  var nomeDiv = div.id;
  //se nomeDiv è vuoto, è perchè va ancora creato il primo:
  if (nomeDiv == null || nomeDiv == "") {
    nomeDiv = "divInputAnnidati";
  }
  // Modifica il nomeDiv in base al booleano
  if (tipoAggiunta == "Conseguente") {
    nomeDiv += "Conseguente";
  }
  else if (tipoAggiunta) {
    nomeDiv += "True";
  } else {
    nomeDiv += "False";
  }
  // Ritorna il nomeDiv
  return nomeDiv;
}


/** Questo metodo viene chiamato quando si schiaccia su  " Elimina questo input e tutti gli input annidati e conseguenti "
 * Elimina tutto il div relativo al caso aggiunto per errore ed eventuali casi che sono legati a questo.
*/
function eliminaInput(button) {
  let div = button.parentNode;
  let superDiv = div.parentNode;
  eliminaInputCycle(div);
  eliminaInputCycle(superDiv);
}

/** Elimina l'input del bottone e tutti gli input annidati e conseguenti a esso*/
function eliminaInputCycle(div) {
  //ottenimento dell'id del div parente
  let nomeDiv = div.id;
  let nomeDivTrue = nomeDiv + "True";
  let nomeDivFalse = nomeDiv + "False";
  let nomeDivConseguente = nomeDiv + "Conseguente";
  let divTrue = document.getElementById(nomeDivTrue);
  let divFalse = document.getElementById(nomeDivFalse);
  let divConseguente = document.getElementById(nomeDivConseguente);

  //rimozione del div
  div.remove();
  //rimozione di tutti i div successivi a quello eliminato (ricorsione)
  if (divTrue != null) {
    eliminaInputCycle(divTrue);
  }
  if (divFalse != null) {
    eliminaInputCycle(divFalse);
  }
  if (divConseguente != null) {
    eliminaInputCycle(divConseguente);
  }
}


