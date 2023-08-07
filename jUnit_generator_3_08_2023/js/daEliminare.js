/** In questo file tengo i vecchi metodi javascript che probabilmente non mi servono più e dovranno essere eliminati. Li tengo qui in modo provvisorio senza importarli.
 * Stanno qui solo perchè voglio verificare che effettivamente non servono a nulla prima di eliminarli
*/


/** Questa funzione ritorna l'id del div senza l'ultimo True/False/Conseguente e il valore  True/False/Conseguente separato*/
/** Il sistema copia molto la struttura si getTrueOrFalseFromBaseWord ma qui se lo trova se lo salva per la fine*/
function variabileIndietro(word){
    let wordComposing="";
    let isFormingTrue = false;
    let isFormingFalse = false;
    let isFormingConseguente = false;
    let ultimaParte = null;
    let idPrecedente = null;


    for(let i=0; i<word.length; i++){

      //Se T o F, la parola ricomincia
      if(word[i]=="T" || word[i]=="F" || word[i]=="C"){
        wordComposing="";
      }

      if((word[i]=="T" || isFormingTrue==true) && word[i]!="F" && (word[i]!="C") ){
        isFormingFalse=false;
        isFormingTrue=true;
        isFormingConseguente = false;
        wordComposing += word[i];
        if(wordComposing=="True"){
          ultimaParte =  "True";
        }
        if("True".includes(wordComposing)){
            continue;
        }
        
      }

      //se stiamo generando il false
      if(( word[i]=="F"  || isFormingFalse==true) && (word[i]!="T") && (word[i]!="C")){
        isFormingFalse=true;
        isFormingTrue=false;
        isFormingConseguente = false;
        wordComposing += word[i];
        if(wordComposing=="False"){
          ultimaParte =  "False";
        }
        //se la parola non si sta più formando, devo interrompere il ciclo
        if("False".includes(wordComposing)){
            continue;
        }
        
      }

      //se staimo generando il "Seguente"
      if(( word[i]=="C"  || isFormingConseguente==true) && (word[i]!="T") && (word[i]!="F")){
        isFormingFalse=false;
        isFormingTrue=false;
        isFormingConseguente = true;
        wordComposing += word[i];
        if(wordComposing=="Conseguente"){
          //per evitare di creare ulteriori div che andranno in futuro eliminati, per convenzione i "Seguenti" li metto nel True
          ultimaParte = "Conseguente";
        }
        //se la parola non si sta più formando, devo interrompere il ciclo
        if("Conseguente".includes(wordComposing)){
            continue;
        }
        
      }
      //se non ho toccato i continue, significa che bisogna ricostruire la parola
      isFormingFalse=false;
      isFormingTrue=false;
      isFormingConseguente = false;
    }

    //Se il ciclo finisce senza trovare nulla, lancio errore
    if(ultimaParte==null){
      throw "Errore in variabileIndietro(): la parola non ha nè True nè false";
    }
    //alla fine, devo estrarre e inserire nel vettore
    if(ultimaParte=="True"){
      idPrecedente = word.substring(0, word.length - 4);
    }
    if(ultimaParte=="False"){
      idPrecedente = word.substring(0, word.length - 5);
    }
    if(ultimaParte=="Conseguente"){
      idPrecedente = word.substring(0, word.length - 11);
    }
    let arrayResult = [ultimaParte, idPrecedente];
    return arrayResult;
}


function getTrueOrFalseFromBaseWord(word){
    let wordComposing="";
    let isFormingTrue = false;
    let isFormingFalse = false;
    let isFormingConseguente = false;

    for(let i=0; i<word.length; i++){

      //Se T o F, la parola ricomincia
      if(word[i]=="T" || word[i]=="F" || word[i]=="C"){
        wordComposing="";
      }

      if((word[i]=="T" || isFormingTrue==true) && word[i]!="F" && (word[i]!="C") ){
        isFormingFalse=false;
        isFormingTrue=true;
        isFormingConseguente = false;
        wordComposing += word[i];
        if(wordComposing=="True"){
          return true;
        }
        if("True".includes(wordComposing)){
            continue;
        }

      }

      //se stiamo generando il false
      if(( word[i]=="F"  || isFormingFalse==true) && (word[i]!="T") && (word[i]!="C")){
        isFormingFalse=true;
        isFormingTrue=false;
        isFormingConseguente = false;
        wordComposing += word[i];
        if(wordComposing=="False"){
          return false;
        }
        //se la parola non si sta più formando, devo interrompere il ciclo
        if("False".includes(wordComposing)){
            continue;
        }

      }

      //se staimo generando il "Seguente"
      if(( word[i]=="C"  || isFormingConseguente==true) && (word[i]!="T") && (word[i]!="F")){
        isFormingFalse=false;
        isFormingTrue=false;
        isFormingConseguente = true;
        wordComposing += word[i];
        if(wordComposing=="Conseguente"){
          //per evitare di creare ulteriori div che andranno in futuro eliminati, per convenzione i "Seguenti" li metto nel True
          return true;
        }
        //se la parola non si sta più formando, devo interrompere il ciclo
        if("Conseguente".includes(wordComposing)){
            continue;
        }

      }
      //se non ho toccato i continue, significa che bisogna ricostruire la parola
      isFormingFalse=false;
      isFormingTrue=false;
      isFormingConseguente = false;
    }
    //Se il ciclo finisce senza trovare nulla, lancio errore
    throw "Errore: la parola non ha nè True nè false";
  }

