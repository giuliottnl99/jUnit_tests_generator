/** Questo file contiene la logica che permette di costruire automaticamente gli assert cliccando su "trasforma in assert" */

/** Questa funzione viene chiamata cliccando su "trasformaInAssert. Si occupa di modificare l'assert" */
function trasformaInAssert(elementToChange) {
    //questa funzione converte in assert i valori della casella Condizioni da verificare se true:
    let input = document.getElementById(elementToChange).value;
    let result = creaAssert(input);
    document.getElementById(elementToChange).value = result;
  }

/** Questa funzione prova a creare gli assert a partire dal codice. Per esempio valore.setReadonly(true) diventerà Assert.assertTrue(valore.isReadonly()) */
  function creaAssert(codiceJava) {
    let result = '';
    let istruzioni = codiceJava.split(';');

    for (let i = 0; i < istruzioni.length; i++) {
      let istruzione = istruzioni[i];

            //pulisco da eventuali commenti
            if(istruzione.includes('//')){
              istruzione = pulisciDaCommenti(istruzione);
            }      
      if (!istruzione.includes('set')) {
        continue;
      }

      const risultatoParentesi = prendiParentesiSetter(istruzione);

      if (risultatoParentesi == 'true' || risultatoParentesi == 'false') {
        const tmp = istruzione.replace('set', 'is').replace(risultatoParentesi, '').replace(';', '').trim();

        if (risultatoParentesi == 'true') {
          result += 'Assert.assertTrue(' + tmp + ');\n';
        } else {
          result += 'Assert.assertFalse(' + tmp + ');\n';
        }
      } else if (risultatoParentesi == 'null') {
        const tmp = istruzione.replace('set', 'get').replace(risultatoParentesi, '').replace(';', '').trim();
        result += 'Assert.assertNull(' + tmp + ');\n';
      }
      else {
        const tmp = istruzione.replace('set', 'get').replace(risultatoParentesi, '').replace(';', '').trim();
        result += 'Assert.assertEquals(' + tmp + ', ' + risultatoParentesi + ');\n';
      }
    }

    return result;
  }


  function prendiParentesiSetter(riga) {
    if (!riga.includes('set')) {
      throw new Error('La stringa non contiene "set"');
    }

    const setIndex = riga.indexOf('set');
    let aperte = 0;
    let chiuse = 0;
    let aperturaIndex = -1;
    let chiusuraIndex = -1;

    for (let i = setIndex + 3; i < riga.length; i++) {
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
    }

    if (aperturaIndex == -1 || chiusuraIndex == -1) {
      throw new Error('Parentesi non bilanciate');
    }

    return riga.substring(aperturaIndex + 1, chiusuraIndex);
  }
