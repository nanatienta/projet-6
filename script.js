var resultRechercheLivre = document.querySelector('.resultatRechercheLivres');
const btnAjout = document.querySelector('.btnAjouterLivre');
const formReceup = document.querySelector('form');
const btnRechercher = document.querySelector('.btnRechercher');

//evement declenché lors du click du bouton ajouter
btnAjout.addEventListener('click',function afficheForm(){
              formReceup.style.display= 'block';
          });

//evenement declenché lors du click du bouton rechercher
btnRechercher.addEventListener('click',function rechercherLivres(e){
    e.preventDefault();
    var bookTitleRecup = document.querySelector('.titreLivre').value;
    var bookAuthorRecup = document.querySelector('.auteurLivre').value;
    const urlApi = "https://www.googleapis.com/books/v1/volumes?q="+bookTitleRecup+"+inauthor:"+bookAuthorRecup+"&key=AIzaSyCKEk1bfHajoAoN4SehSdmK34uTq2noU7A";
    console.log('urlApi:' +urlApi);
    fetch(urlApi).then(function(res){
        console.log("données: " +JSON.stringify(res));
        if(res.ok){ 

            return res.json();
        }
    }).then(function(data){
        if (bookTitleRecup == "" || bookTitleRecup == undefined ) {
            alert('Veuillez renseigner un titre');
            
        }
        data.items.forEach(elementBook => {
        resultBooks(elementBook);
        });

    }).catch(function (error){
        console.error("erreur: " +error);
    })
        });

//recuperer livres à partir de l'API google books
function fetchBook()
{
    fetch(urlApi).then(function(res){
        console.log("données: " +JSON.stringify(res));
        if(res.ok){ 

            alert("pas de resultat");
            return res.json();
        }
    }).then(function(data){
        console.log("donnéesApi: "+JSON.stringify(data.items[0]));
        //resultBooks();

    }).catch(function (error){
        console.error("erreur: " +error);
    })
}

//afficher un livre après recherche
function resultBooks(book){
    console.log("image: "+ JSON.stringify(book.volumeInfo.imageLinks));
    var bookSection = document.createElement('section');
    bookSection.className = "bookSection";
    bookSection.setAttribute("id",book.id);
    var imageBook;
    if (book.volumeInfo.imageLinks.thumbnail==undefined) {

        imageBook ="images/unavailable.png";
    } 
    else{
      imageBook = book.volumeInfo.imageLinks.thumbnail;
    }

    bookSection.innerHTML = `
    <div class="cardSection">
        <i class="fas fa-bookmark enregistreLivreBtn" onclick= bookStockage('${book.id}')></i>
        <h5 class="card-identifiant"> Id: : '${book.id}'</h5>
          <h5 class="card-title"> Titre : '${book.volumeInfo.title}'</h5>
          <p class="card-author">  Auteur: '${book.volumeInfo.authors[0]}'</p>
          <p class="card-description">  Description: `+gestionDescription(book)+`</p>
          <img class="imageBook" src="${imageBook} " alt="">
      </div>`;
      resultRechercheLivre.appendChild(bookSection);
}
function gestionDescription(item) {
    if (item.volumeInfo.description) {
      if (item.volumeInfo.description.length > 200) {
              return item.volumeInfo.description.substring(200,length)+'...';
      } else {
        return item.volumeInfo.description;
      }
    } else {
      return "information manquante";
    }
     }

function bookStockage(bookId){
    var bookSection = document.getElementById(bookId);
	sessionStorage.setItem( bookId, bookSection.innerHTML);
      var iconeBtnEnregistrerLivre= bookSection.querySelector(".enregistreLivreBtn");
         var iconeBtnSupprimerLivre = document.createElement("div");
         iconeBtnSupprimerLivre.className= "supprimerLivreBtn";
         iconeBtnSupprimerLivre.innerHTML= '<i class="fas fa-trash " onclick= bookStockage('+bookId+')></i>';
         iconeBtnEnregistrerLivre.replaceWith(iconeBtnSupprimerLivre);
         // supprimer le livre quand on clique sur le bouton

         iconeBtnSupprimerLivre.addEventListener('click',function supprimerFavori(){
            sessionStorage.removeItem(cle);
            resultRechercheLivre.removeChild(bookSection);
        });
}

window.onload = function pageRefresh(){
     for(var i = 0; i < sessionStorage.length; i++){
         var cle= sessionStorage.key(i);
         var sectionDuLivreFromStorage = sessionStorage.getItem(cle);
         var bookSection = document.createElement("section");
         bookSection.className= "bookSection";
         bookSection.innerHTML= sectionDuLivreFromStorage;
         resultRechercheLivre.appendChild(bookSection);
         var iconeBtnEnregistrerLivre= bookSection.querySelector(".enregistreLivreBtn");
         var iconeBtnSupprimerLivre = document.createElement("div");
         iconeBtnSupprimerLivre.className= "supprimerLivreBtn";
         iconeBtnSupprimerLivre.innerHTML= '<i class="fas fa-trash " ></i>';
         iconeBtnEnregistrerLivre.replaceWith(iconeBtnSupprimerLivre);
         // supprimer le livre quand on clique sur le bouton

         iconeBtnSupprimerLivre.addEventListener('click',function supprimerFavori(){
            sessionStorage.removeItem(cle);
            resultRechercheLivre.removeChild(bookSection);
        });
        
     }
}
function supprimerLivre(bookId){
    var bookSection = document.getElementById(bookId);
    var iconeBtnSupprimerLivre= bookSection.querySelector(".supprimerLivreBtn");
       var iconeBtnEnregistrerLivre = document.createElement("div");
       iconeBtnEnregistrerLivre.className= "enregistreLivreBtn";
       iconeBtnEnregistrerLivre.innerHTML= '<i class="fas fa-bookmark"></i>';
       iconeBtnSupprimerLivre.replaceWith(iconeBtnEnregistrerLivre);
       // supprimer le livre quand on clique sur le bouton

       iconeBtnEnregistrerLivre.addEventListener('click',function enregistrerFavori(){
         bookStockage(bookId);
      });
}

