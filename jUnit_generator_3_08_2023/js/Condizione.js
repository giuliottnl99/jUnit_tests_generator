//nota che condizioneXTrue e condizioneXFalse non sono stringhe ma liste di stringhe

/** Questa è la classe Condizione. Ogni oggetto rappresenta un nodo if/else del metodo java da testare e un divInput sul FontEnd dello script :
 * La classe contiene le seguenti informazioni:
 * condizioneXTrue è una lista di stringhe contenenti tutte le possibili condizioni che rendono tale nodo vero
 * condizioneXTrue è una lista di stringhe contenenti tutte le possibili condizioni che rendono tale nodo falso 
 * assertIfTrue è una stringa contenente gli assert che vanno lanciati dopo l'esecuzione per verificare che il metodo funzioni correttamente quando il nodo è vero 
 * assertIfFalse è una stringa contenente gli assert che vanno lanciati dopo l'esecuzione per verificare che il metodo funzioni correttamente quando il nodo è falso 
 * assertIfFalse è una stringa contenente gli assert che vanno lanciati dopo l'esecuzione per verificare che il metodo funzioni correttamente e che vanno chiamati indipendentemente dalla veridicità o meno del nodo
 * condizioneFigliaTrue è l'eventuale nodo collegato che per essere eseguito richiede che questo sia vero
 * condizioneFigliaTrue è l'eventuale nodo collegato che per essere eseguito richiede che questo sia falso
 * condizioneFigliaConseguente è l'eventuale nodo collegato che può essere eseguito indipendemente dal risultato
 * condizioneGenitore è la condizione a cui il nodo è annidato, se c'è
 * condizionePrecedente è la condizione di cui il nodo è precedente, se c'è
 * tipoGenitore può essere true, false o conseguente a seconda del nodo che sta "sopra". Se è il nodo primo, sarà null
 */
class Condizione {
  constructor(condizioneXTrue, condizioneXFalse, assertIfTrue, assertIfFalse, assertInBoth, condizioneFigliaTrue, condizioneFigliaFalse) {
    this._condizioneXTrue = condizioneXTrue;
    this._condizioneXFalse = condizioneXFalse;
    this._assertIfTrue = assertIfTrue;
    this._assertIfFalse = assertIfFalse;
    this._assertInBoth = assertInBoth;
    this._condizioneFigliaTrue = condizioneFigliaTrue;
    this._condizioneFigliaFalse = condizioneFigliaFalse;
    this._condizioneGenitore = null;
    this._tipoGenitore = null;
    this._condizioneConseguente = null;
    this._condizionePrecedente = null;

  }

  // Getter e setter per la proprietà condizioneXTrue
  get condizioneXTrue() {
    return this._condizioneXTrue;
  }

  set condizioneXTrue(value) {
    this._condizioneXTrue = value;
  }

  // Getter e setter per la proprietà condizioneXFalse
  get condizioneXFalse() {
    return this._condizioneXFalse;
  }

  set condizioneXFalse(value) {
    this._condizioneXFalse = value;
  }

  // Getter e setter per la proprietà assertIfTrue
  get assertIfTrue() {
    return this._assertIfTrue;
  }

  set assertIfTrue(value) {
    this._assertIfTrue = value;
  }

  // Getter e setter per la proprietà assertIfFalse
  get assertIfFalse() {
    return this._assertIfFalse;
  }

  set assertIfFalse(value) {
    this._assertIfFalse = value;
  }

  // Getter e setter per la proprietà condizioneFigliaTrue
  get condizioneFigliaTrue() {
    return this._condizioneFigliaTrue;
  }

  set condizioneFigliaTrue(value) {
    this._condizioneFigliaTrue = value;
  }

  // Getter e setter per la proprietà condizioneFigliaFalse
  get condizioneFigliaFalse() {
    return this._condizioneFigliaFalse;
  }

  set condizioneFigliaFalse(value) {
    this._condizioneFigliaFalse = value;
  }

  // Getter e setter per la proprietà condizionePadre
  get condizioneGenitore() {
    return this._condizioneGenitore;
  }

  set condizioneGenitore(value) {
    this._condizioneGenitore = value;
  }

  get tipoGenitore() {
    return this._tipoGenitore;
  }

  set tipoGenitore(value) {
    this._tipoGenitore = value;
  }

  get condizioneConseguente() {
    return this._condizioneConseguente;
  }

  set condizioneConseguente(value) {
    this._condizioneConseguente = value;
  }

  get condizionePrecedente() {
    return this._condizionePrecedente;
  }

  set condizionePrecedente(value) {
    this._condizionePrecedente = value;
  }

  get assertInBoth() {
    return this._assertInBoth;
  }

  set assertInBoth(value) {
    this._assertInBoth = value;
  }
}
