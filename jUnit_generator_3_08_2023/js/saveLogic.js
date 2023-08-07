/** In questo file sono presenti le lofiche che generano il codice di salvataggio e permettono di ricostruire il salvataggio */


/** Questo metodo genera il codice di salvataggio che poi potrà essere inserito per rigenerare tutto
 * Per farlo recupera prima l'html dentro inputContainer e poi i valori inseriti in ciascuna textArea
*/
function generaCodiceSalvataggioInputContainer() {
    let part1 = document.getElementById("inputContainer").innerHTML;
    let part2 = returnStrListOfValues();
    document.getElementById("HTMLInputContainerSalvataggio").value = part1 + "\n---\n" + part2;
}

/** Questo metodo si occupa di recuperare tutte le textArea e per ciascuna associare all'id il corrispettivo valore */
function returnStrListOfValues() {
    let initialDiv = document.body;
    let arrayTextAreas = recursiveListCreation(initialDiv.children, []);
    let result = "";
    for (let i = 0; i < arrayTextAreas.length; i++) {
        result += arrayTextAreas[i][0] + " : " + arrayTextAreas[i][1] + ";-;\n";
    }

    return result;
}

//inizialmente viene passata la lista di elementi nel "inputContainer" e una lista vuota
/** Questa funzione deve creare una lista di informazioni per ogni textArea dentro inputContainer, anche se in modo ricorsivo.
 * Ogni elemento dell'array dà informazioni su una textArea, sotto forma di un array contenente [id_textarea, valoreInput];
 */
function recursiveListCreation(elementsList, resultMatrix) {
    if (elementsList == null || elementsList.length == 0) {
        return resultMatrix;
    }
    for (let i = 0; i < elementsList.length; i++) {
        if (elementsList[i].tagName == "DIV") {
            resultMatrix = recursiveListCreation(elementsList[i].children, resultMatrix);
        }
        if (elementsList[i].tagName == "TEXTAREA") {
            resultMatrix.push([elementsList[i].id, elementsList[i].value])
        }
    }
    return resultMatrix;
}


/** Prende il codice di salvtaaggio  */
function generaInputContainerDaCodiceSalvataggio() {
    let input = document.getElementById("HTMLInputContainerRicostruzione");
    if (input.value == null || input.value.replace(" ", "") == "") {
        return;
    }
    let part1;
    let part2;
    [part1, part2] = input.value.split("\n---\n");
    document.getElementById("inputContainer").innerHTML = part1;
    setSavedValuesFromStr(part2);
}


/** Questa funzione si occupa di riempire le textArea a partire dalla stringa di salvataggio inserita*/
function setSavedValuesFromStr(strSaving) {
    let arraySavings = strSaving.split(";-;\n");
    for (let i = 0; i < arraySavings.length; i++) {
        let textArea = arraySavings[i].split(" : ");
        if (textArea.length != 2) {
            continue;
        }
        document.getElementById(textArea[0]).value = textArea[1];
    }
}


