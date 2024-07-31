let datas = [];
let preferiti = [];
function loadDoc() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        datas = JSON.parse(this.responseText);
        document.getElementById("istruzioni").innerHTML = 'Inserire il nome o il cognome dell\'utente per iniziare la ricerca';
      } 
    };
    xhttp.open("GET", "es5_dataset.json", true);
    xhttp.send();
    if (localStorage.getItem('preferiti')) {
        preferiti = [];
        let preferitiObj = JSON.parse(localStorage.getItem('preferiti'));
        preferiti.push(...preferitiObj);
    }
}

loadDoc();

const firstNameField = document.getElementById('nome');
const lastNameField = document.getElementById('cognome');
const firstNameSearchDiv = document.getElementsByClassName('searchMatch')[0];
const lastNameSearchDiv = document.getElementsByClassName('searchMatch')[1];
const showResultsDiv = document.getElementsByClassName('showResults')[0];

function findName(event) {
    let evt = event.target;
    let firstNameVal =  firstNameField.value;
    let lastNameVal =  lastNameField.value;
    
    if (evt === firstNameField && firstNameVal !== '') { //controllo se l'evento è il nome e il valore non è vuoto, quindi mostro i suggerimenti
        closeSearchDiv();
        lastNameField.value = '';
        for (let i = 0; i < datas.length; i++) { /* ciclo x verificare se la proprietà first_name di ciascuno oggetto dell'array del file json concide col valore inserito */
        let data = Object.entries(datas[i]);
        let datasTemp = datas[i];
           //creo un p per mostrare i riscontri nell'elenco json
           if (data[1][1].substr(0, firstNameVal.length).toUpperCase() === firstNameVal.toUpperCase()) {
               let pTemp = document.createElement('p');
               pTemp.classList.add('firstNameSearch');
               console.log(firstNameField.offsetLeft);
               pTemp.setAttribute('id', data[0][1]);
               pTemp.innerHTML += '<b>' + data[1][1].substr(0, firstNameVal.length) + '</b>' + data[1][1].substr(firstNameVal.length) + ', <i>' + data[2][1] + '</i>';
               pTemp.addEventListener('click', function() { //se clicco su un riscontro, chiama la creazione di una tabella per mostrare i risultati
                setTable(data[1][1], data[2][1], data, datasTemp); //passo gli argomenti: nome, cognome, array degli entries, oggetto attuale
               });
               firstNameSearchDiv.appendChild(pTemp);
            }
            firstNameSearchDiv.style.left = (firstNameField.offsetLeft - 7) + 'px';
            firstNameSearchDiv.style.display = 'inline-block';
        }
    } else if (evt === lastNameField && lastNameVal !== '') { //controllo se l'evento è il cognome e il valore non è vuoto, quindi mostro i suggerimenti
        closeSearchDiv();
        firstNameField.value = '';
        for (let i = 0; i < datas.length; i++) { /* ciclo x verificare se la proprietà last_name di ciascuno oggetto dell'array del file json concide col valore inserito */
        let data = Object.entries(datas[i]);
        let datasTemp = datas[i];
           if (data[2][1].substr(0, lastNameVal.length).toUpperCase() === lastNameVal.toUpperCase()) {
               let p2Temp = document.createElement('p');
               p2Temp.classList.add('lastNameSearch');
               p2Temp.setAttribute('id', data[0][1]);
               p2Temp.setAttribute('firstName', data[1][1]);
               p2Temp.setAttribute('lastName', data[2][1]);
               p2Temp.setAttribute('dataArray', data);
               p2Temp.innerHTML += '<b>' + data[2][1].substr(0, lastNameVal.length) + '</b>' + data[2][1].substr(lastNameVal.length) + ', <i>' + data[1][1] + '</i>';
               p2Temp.addEventListener('click', function() {
                setTable(data[1][1], data[2][1], data, datasTemp);
               });
               lastNameSearchDiv.appendChild(p2Temp);
            }
            lastNameSearchDiv.style.left = (lastNameField.offsetLeft - 7) + 'px';
            lastNameSearchDiv.style.display = 'inline-block';
        }        
    } else { //se il valore di uno dei due è vuoto elimina i relativi suggerimenti
        closeSearchDiv();
    }

    //crea la tabella coi risultati
    function setTable(first, last, dataArray, dataObj) {
        closeSearchDiv();
        //button per aggiungere preferiti
        let buttonTemp = document.createElement('button');
        buttonTemp.setAttribute('type', 'button');
        buttonTemp.classList.add('btn');
        buttonTemp.classList.add('btnAdd');
        buttonTemp.innerHTML = 'Aggiungi ai preferiti';
        buttonTemp.addEventListener('click', function() {
            managePref.setPreferiti(dataObj);
            
        });
        buttonTemp.addEventListener('click', btnAddPrefChange);
        firstNameField.value = first;
        lastNameField.value = last;
        //crea la tabella
        let data = dataArray;
        tempTable = document.createElement('table');
        let tempCaption = document.createElement('caption');
        tempCaption.innerHTML = '<b>' + first + ' ' + last + '</b>';
        tempTable.appendChild(tempCaption);
        for (let h = 0; h < data.length; h++) {
            let tempTr = document.createElement('tr');
            tempTr.innerHTML = '<td>' + data[h][0] + ': </td>' + '<td>' + data[h][1] + '</td>';
            tempTable.appendChild(tempTr);
        } 
        showResultsDiv.appendChild(buttonTemp);                  
        showResultsDiv.appendChild(tempTable);
        showResultsDiv.style.display = 'block';
    
    }
    //stilizza il button "aggiungi preferiti"
    function btnAddPrefChange(event) {
        ev = event.target;
        ev.classList.remove('btn');
        ev.classList.add('btnAdded');
        ev.innerHTML = 'Aggiunto ai preferiti';
    }
}

//cancella i p per mostrare i riscontri nell'elenco json 
function closeSearchDiv() {
    if (firstNameSearchDiv.hasChildNodes()) {
           for (let j = (firstNameSearchDiv.childNodes.length-1); j >= 0; j--) {
            firstNameSearchDiv.removeChild(firstNameSearchDiv.childNodes[j]);
            console.log('removing node ' + firstNameSearchDiv.childNodes[j] + '  ' + j);
            firstNameSearchDiv.style.display = 'none';
           }                
    } //aggiungere per lastNameSearchDiv
    if (lastNameSearchDiv.hasChildNodes()) {
           for (let j = (lastNameSearchDiv.childNodes.length-1); j >= 0; j--) {
            lastNameSearchDiv.removeChild(lastNameSearchDiv.childNodes[j]);
            console.log('removing node ' + lastNameSearchDiv.childNodes[j] + '  ' + j);
            lastNameSearchDiv.style.display = 'none';
        }                
 } 
}

//cancella quanto si trova nel div dei risultati
function closeResultsDiv() {
    if (showResultsDiv.hasChildNodes()) {
        for (let j = (showResultsDiv.childNodes.length-1); j >= 0; j--) {
            showResultsDiv.removeChild(showResultsDiv.childNodes[j]);
            showResultsDiv.style.display = 'none';
           } 
    }
}

//resetta il form
function resetSearch() {
    closeResultsDiv();
    document.getElementById('form').reset();
}

//oggetto con metodi per gestire i preferiti
let managePref = {
    //"getter", funzione solo se esiste lo storage per 'preferiti'
    getPreferiti: function()  {
        if (localStorage.getItem('preferiti')) { 
             preferiti = [];
             let preferitiObj = JSON.parse(localStorage.getItem('preferiti'));
             preferiti.push(...preferitiObj);
             console.log(preferitiObj);
             console.log('preferiti ' + preferiti);
             closeSearchDiv();
             closeResultsDiv();
             //crea tabella per i risultati
             for (let k = 0; k < preferitiObj.length; k++) {
                let dataPreferiti = preferitiObj[k];
                let dataPreferitiEntries = Object.entries(dataPreferiti);
                console.log(dataPreferiti);
                    let tempTable = document.createElement('table');
                    let tempCaption = document.createElement('caption');
                    tempCaption.innerHTML = '<b>' + dataPreferitiEntries[1][1] + ' ' + dataPreferitiEntries[2][1] + '</b>';
                    firstNameField.value = '';
                    lastNameField.value = '';
                    tempTable.appendChild(tempCaption);
                        for (let h = 0; h < dataPreferitiEntries.length; h++) {
                            let tempTr = document.createElement('tr');
                            tempTr.innerHTML = '<td>' + dataPreferitiEntries[h][0] + ': </td>' + '<td>' + dataPreferitiEntries[h][1] + '</td>';
                            tempTable.appendChild(tempTr);
                        }                 
                showResultsDiv.appendChild(tempTable);
                showResultsDiv.style.display = 'block';
                
             }    
        //se lo storage per i preferiti non esiste, produce un messaggio di errore
        } else {
            closeResultsDiv();
            firstNameField.value = '';
            lastNameField.value = '';
            let b = document.createElement('b');
            b.innerHTML = 'Non hai ancora aggiunto alcun elemento preferito!';
            showResultsDiv.appendChild(b);
            showResultsDiv.style.textAlign = 'center';
            showResultsDiv.style.display = 'block';
            showResultsDiv.style.color = 'red';
            setTimeout(function() {
                showResultsDiv.removeChild(b);
                showResultsDiv.style.textAlign = '';
                showResultsDiv.style.display = 'none';
                showResultsDiv.style.color = 'black';
            }, 1000);            
        }
    },
    //"setter"
    setPreferiti: function(elementObj)  {
        console.log(elementObj)
        if (preferiti !== [] && preferiti.indexOf(elementObj) === -1) {
            preferiti.push(elementObj);
            localStorage.setItem('preferiti', JSON.stringify(preferiti));
        } else if (preferiti === []) {
            preferiti.push(elementObj);
            localStorage.setItem('preferiti', JSON.stringify(preferiti));
        } else {

        }
        console.log('preferiti ' + preferiti)
    },
    //"remover"
    removePreferiti: function() {
        if (localStorage.getItem('preferiti')) {
            localStorage.removeItem('preferiti');
            closeResultsDiv();
            preferiti = [];
        }
    }
    
}
const mostraPrefButton = document.getElementById('mostraPreferiti');
mostraPrefButton.addEventListener('click', managePref.getPreferiti);
const removePrefButton = document.getElementById('eliminaPreferiti');
removePrefButton.addEventListener('click', managePref.removePreferiti);

document.addEventListener("click", function (e) {
    closeSearchDiv();
});




