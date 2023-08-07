/** Questa classe serve per la generazione delle condizioni.  */
class CondizioneDaVerificare {

  //condizioniFiglie contengono: condizioneDaVerificare, legantePre, legantePost, inizio, fine
    constructor(contenutoStr, condizioniFiglie = null) {
      this._condizionePadre = null;
      this._condizioniFiglie = condizioniFiglie;
      this._contenutoStr = contenutoStr;

      if(condizioniFiglie==null || condizioniFiglie.length==0){
        this._tipoLegame = null;
      }
      else{
          //mi aspetto che tipoLegame==&& o || sempre
          this._tipoLegame = condizioniFiglie[0]["legantePost"];
      }
    }
  
    // Getter per la condizione padre
    get condizionePadre() {
      return this._condizionePadre;
    }
  
    // Setter per la condizione padre
    set condizionePadre(condizionePadre) {
      this._condizionePadre = condizionePadre;
    }
  
    // Getter per la lista delle condizioni figlie
    get condizioniFiglie() {
      return this._condizioniFiglie;
    }
  
    // Setter per la lista delle condizioni figlie
    set condizioniFiglie(condizioniFiglie) {
      this._condizioniFiglie = condizioniFiglie;
    }
  
    // Getter per il contenuto stringa
    get contenutoStr() {
      return this._contenutoStr;
    }
  
    // Setter per il contenuto stringa
    set contenutoStr(contenutoStr) {
      this._contenutoStr = contenutoStr;
    }
  
    // Getter per il tipo di legame
    get tipoLegame() {
      return this._tipoLegame;
    }
  
    // Setter per il tipo di legame
    set tipoLegame(tipoLegame) {
      this._tipoLegame = tipoLegame;
    }
  }
  