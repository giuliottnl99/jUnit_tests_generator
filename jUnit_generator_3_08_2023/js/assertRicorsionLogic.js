/** Questo file contiene le logiche che generano gli assert "indipendenti" a partire dagli assert precedenti quando si clicca su "genera assert da precedenti" */

/** Questa funzione ha uno scopo preciso: generare gli assert comuni a partire*/
function generaAssertDaPrecedenti(inputTextId) {
    let inputText = document.getElementById(inputTextId);
    var div = inputText.parentNode;
    let divId = div.id;
    let assertPrecedenti = generaAssertDaPrecedentiRicorsione(divId);
    let risultatoAssert = assertPrecedenti;
    if (inputText.value != null && inputText.value != "" && inputText.value != "undefined") {
        risultatoAssert = assertPrecedenti + inputText.value;
    }
    let risultatoAssertPuliti = pulisciDoppioniAssert(risultatoAssert);
    inputText.value = risultatoAssertPuliti;
}

function generaAssertDaPrecedentiRicorsione(divId) {
    let vettIndietro = variabileIndietro(divId);
    let ultimaParte = vettIndietro[0];
    let idPrecedente = vettIndietro[1];
    let result = "";

    //se il div precedente è quello base, è perchè non ci sono più true/false -> In tal caso devo prende l'id speciale
    if (idPrecedente == "divInputAnnidati") {
        //Prendo il valore che mi interessa e poi ritorno
        if (ultimaParte == "True") {
            let assertTrue = document.getElementById("toDoIfTrue").value;
            return assertTrue;
        }
        if (ultimaParte == "False") {
            let assertTrue = document.getElementById("toDoIfFalse").value;
            return assertTrue;
        }
        if (ultimaParte == "Conseguente") {
            let assertTrue = document.getElementById("toDoAmbo").value;
            return assertTrue;
        }
        throw "Errore in generaAssertDaPrecedentiRicorsione()";
    }
    //Se l'ultima parte era True e non avevo idPrecedente="divInputAnnidati", prendo l'id dei true e ciclo
    if (ultimaParte == "True") {
        result += document.getElementById(idPrecedente + "AreaConseguenzeTrue").value;
        let toBeAdded = generaAssertDaPrecedentiRicorsione(idPrecedente);
        result = toBeAdded + "\n" + result;
        return result;
    }
    if (ultimaParte == "False") {
        result += document.getElementById(idPrecedente + "AreaConseguenzeFalse").value;
        let toBeAdded = generaAssertDaPrecedentiRicorsione(idPrecedente);
        result = toBeAdded + "\n" + result;
        return result;
    }
    if (ultimaParte == "Conseguente") {
        result += document.getElementById(idPrecedente + "AreaConseguenzeAmbo").value;
        let toBeAdded = generaAssertDaPrecedentiRicorsione(idPrecedente);
        result = toBeAdded + "\n" + result;
        return result;
    }
    throw "Errore in generaAssertDaPrecedentiRicorsione()";

}



