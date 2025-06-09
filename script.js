const carouselList = document.getElementById('carousel-list');
const carouselCounter = document.getElementById('carousel-counter');
const bulletContainer = document.getElementById('bullet-container');
const nItems = carouselList.querySelectorAll('.carousel-item').length;

//
const styleTheme = document.getElementById('style-theme');
const logoAiap = document.getElementById("logo-aiap")
const logoDesignverso = document.getElementById("logo-designverso")
const logoPoli = document.getElementById("logo-poli")

let currentItem = 0;

// Funzione per aggiornare la visibilità delle didascalie
function updateCaptions() {
    const captions = carouselList.querySelectorAll('.carousel-caption');
    captions.forEach((caption, index) => {
        if (index === currentItem) {
            caption.style.display = 'block';
        } else {
            caption.style.display = 'none';
        }
    });
}

updateCounter();
updateBullets();
updateCaptions(); // Aggiungo la chiamata iniziale

let isScrolling; // Conterrà il riferimento a un timer

// È possibile definire la funzione che verrà eseguita all'evento di 
// scroll direttamente come secondo parametro di addEventListener().
// In questo caso non stiamo dichiarando una funzione, bensì stiamo
// utilizzando una function expression:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function
carouselList.addEventListener('scroll', function() {
    /*
     * Con setTimeout() è possibile schedulare l'esecuzione
     * di una funzione dopo un certo ritardo di tempo.
     * Il primo argomento è la funzione da eseguire, mentre
     * il secondo è il ritardo di tempo in millisecondi.
     * Restituisce un numero intero che identifica il timer
     * creato con la chiamata a setTimeout().
     */
    
    /*
     * Con la funzione clearTimeout() andiamo a cancellare un
     * timer precedentemente creato da setTimeout().
     * Questo perché l'interazione di scroll ha una certa durata
     * nel tempo, durante la quale più eventi di scroll vengono
     * generati.
     * Cancellando e resettando il timer siamo sicuri che la funzione
     * carouselScroll() verrà eseguita solo una volta che l'interazione
     * di scroll sarà terminata completamente.
     */
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(carouselScroll, 100);
});

/*
 * Restituisce l'indice dell'elemento visualizzato in questo momento 
 */
function getCurrentCarouselItem() {
    /*
     * Vogliamo conoscere l'indice dell'immagine che è attualmente
     * visibile all'interno del mio slideshow.
     * Per fare questo occorre dividere la posizione di scroll in cui
     * lo slideshow si trova (variabile `scrollPosition`), per la
     * larghezza di una singola slide (variabile `slideWidth`).
     */

    /*
     * Attenzione: le slide sono organizzate in un contenitore a griglia.
     * Tramite CSS è possibile specificare un gap tra colonne, di cui
     * bisogna tenere conto nel il calcolo della larghezza di una slide.
     * È possibile conoscere il gap in pixel tramite l'istruzione seguente.
     */
    let gapWidth = parseInt(window.getComputedStyle(carouselList).columnGap);
    let slideWidth = carouselList.offsetWidth + gapWidth;
    let scrollPosition = carouselList.scrollLeft;

    // Divisione tra posizione di scroll e larghezza di slide.
    // Math.round() arrotonda il risultato al numero intero più vicino.
    let itemIdx = Math.round(scrollPosition / slideWidth);

    return itemIdx; // restituisco l'indice della slide corrente
}

/*
 * Aggiorna lo stato dello slideshow.
 */
function carouselScroll() {
    let itemIdx = getCurrentCarouselItem();

    // Aggiorno lo stato
    currentItem = itemIdx;

    updateCounter();
    updateBullets();
    updateCaptions(); // Aggiungo la chiamata qui
}

function scrollToItem(i) {
    /*
     * Le istruzioni seguenti (racchiuse in un commento) ci
     * permettevano di ignorare tutte le chiamate alla funzione
     * scrollToItem quando i non risultava essere un indice valido
     * (cioè non compreso tra 0 e nItems - 1)
     */

    /*
    if (i < 0 || i >= nItems) {
        return; // early exit
    }
    */

    /*
     * Le istruzioni che seguono servono a riavvolgere lo slideshow
     * quando si supera la prima o l'ultima immagine.
     */

    /*
     * L'operatore `%` restituisce il resto della divisione tra i
     * due operandi. Ad esempio: 4 % 3 = 1.
     * In questo caso lo usiamo per assicurarci che l'indice i
     * sia compreso tra 0 e nItems - 1.
     */
    i = i % nItems;

    /*
     * Attenzione agli indici negativi.
     * Per esempio, l'operazione -4 % 3 restituirà -1.
     * In questo caso possiamo riportare i tra 0 e nItems
     * sommando nItems ad i.
     */
    if (i < 0) {
        i = nItems + i;
    }

    /*
     * Calcoliamo l'offset in pixel a cui scrollare.
     * La scrollPosition sarà pari all'indice della slide che
     * voglio visualizzare, moltiplicato per la larghezza di una
     * singola slide.
     * La larghezza di una singola slide la possiamo conoscere
     * accedendo alla proprietà offsetWidth dell'oggetto carouselList.
     * Attenzione: le slide sono organizzate in un contenitore a
     * griglia, quindi è possibile specificare un gap tra colonne di cui
     * dobbiamo tenere conto.
     * È possibile conoscere il suo valore con l'istruzione seguente.
     */
    let gapWidth = parseInt(window.getComputedStyle(carouselList).columnGap);
    let scrollStep = carouselList.offsetWidth + gapWidth;
    let scrollPosition = i * scrollStep;

    /*
     * Scrolliamo alla posizione che ci interessa.
     * La funzione scrollTo accetta un oggetto che specifica in quale
     * posizione voglio scrollare e (opzionale) con quale comportamento
     * far avvenire lo scrolling.
     */
    carouselList.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });

    currentItem = i; // Aggiorno lo stato (l'immagine corrente) del mio slideshow
    updateCounter(); // Aggiorno il contatore di slide
    updateBullets(); // Aggiorno i bullet
    updateCaptions(); // Aggiungo la chiamata qui
}

/*
 * Aggiorna il contenuto del contatore di slide.
 */
function updateCounter() {
    carouselCounter.innerText = (currentItem + 1) + " / " + nItems;
}

/*
 * Rende attivo il bullet corrispondente all'immagine corrente.
 */
function updateBullets() {
    // La funzione getElementsByClassName restituisce la lista di
    // tutti gli elementi di classe `bullet` all interno della pagina.
    let bullets = bulletContainer.getElementsByClassName('bullet');

    // Rimuovo la classe `active` da ciascun bullet
    for (let i=0; i < bullets.length; i++) {
        bullets[i].classList.remove('active');
    }

    // Rendo active solamente il bullet della slide corrente
    bullets[currentItem].classList.add('active');
}

function changeMode() {
    const currentTheme = styleTheme.getAttribute("href");
    // Estraggo solo il nome del file dal percorso
    const currentThemeFile = currentTheme.split('/').pop();
    
    // Determino il percorso base per le immagini in base alla pagina corrente
    const isInPagineFolder = window.location.pathname.includes('/simonetta-ferrante/pagine/');
    const base_svg_path = isInPagineFolder ? "/simonetta-ferrante/img/home/" : "/simonetta-ferrante/img/home/";
    
    // Trovo il bottone dark mode e la sua immagine
    const darkModeButton = document.querySelector('.nav-link[onclick="changeMode()"]');
    const darkModeImage = darkModeButton ? darkModeButton.querySelector('img') : null;
    
    if (currentThemeFile === "style.css") { //se il foglio css della pagina è style css
        // Mantengo lo stesso percorso relativo ma cambio solo il nome del file
        const newTheme = currentTheme.replace("style.css", "style1.css");
        styleTheme.setAttribute("href", newTheme); //inserisci il secondo foglio
        
        // Aggiorno le immagini dei loghi se esistono
        if (logoAiap) logoAiap.setAttribute("src", base_svg_path + "1logo_aiap.svg");
        if (logoDesignverso) logoDesignverso.setAttribute("src", base_svg_path + "1logo_designverso.svg");
        if (logoPoli) logoPoli.setAttribute("src", base_svg_path + "1logo_poli.svg");
        
        // Aggiorno l'immagine del bottone dark mode
        if (darkModeImage) {
            const currentSrc = darkModeImage.getAttribute("src");
            const newSrc = currentSrc.replace("mezzaluna1.svg", "mezzaluna2.svg");
            darkModeImage.setAttribute("src", newSrc);
        }
    } else {
        // Mantengo lo stesso percorso relativo ma cambio solo il nome del file
        const newTheme = currentTheme.replace("style1.css", "style.css");
        styleTheme.setAttribute("href", newTheme); //torna al primo foglio
        
        // Aggiorno le immagini dei loghi se esistono
        if (logoAiap) logoAiap.setAttribute("src", base_svg_path + "logo_aiap.svg");
        if (logoDesignverso) logoDesignverso.setAttribute("src", base_svg_path + "logo_designverso.svg");
        if (logoPoli) logoPoli.setAttribute("src", base_svg_path + "logo_poli.svg");
        
        // Aggiorno l'immagine del bottone dark mode
        if (darkModeImage) {
            const currentSrc = darkModeImage.getAttribute("src");
            const newSrc = currentSrc.replace("mezzaluna2.svg", "mezzaluna1.svg");
            darkModeImage.setAttribute("src", newSrc);
        }
    }
}

if (typeof PDFObject !== "magazine") { // Se la libreria PDFObject è presente
    PDFObject.embed(
      "magazine.pdf", // Percorso del PDF
      "#pdf-viewer", // Selettore del contenitore
      { width: "90vw", height: "70vh" } // Dimensioni del visualizzatore
    );
  }