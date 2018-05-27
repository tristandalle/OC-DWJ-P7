var Reservation = {
    //DEFINITON DES PROPRIETES POUR L'OBJET Reservation
	eltSign: document.getElementById("sign"),
	eltBtnResa: document.getElementById("btnResa"),
    eltBtnClear: document.getElementById("btnClear"),
    eltBtnValid: document.getElementById("btnValid"),
    eltBtnCancel: document.getElementById("btnCancel"),
    eltEtatResa: document.getElementById("etat_resa"),
    canvas: document.getElementById("canvas"),
    currentStation: null,
    timer: null,
    
    //FONCTION LANCEE DANS Main.js POUR ENTRER DANS Reservation.js / AJOUT DES LISTENER
    init: function(){
        Reservation.eltBtnResa.addEventListener("click", Reservation.resa)
        Reservation.eltBtnValid.addEventListener("click", Reservation.valid)
        Reservation.eltBtnCancel.addEventListener("click", Reservation.cancelResa)
        Reservation.eltBtnClear.addEventListener("click", Reservation.clear)
        //AJOUT DU CANVAS
        Reservation.addSignature()
        //SI IL Y A UNE DONNEE DANS LE SESSIONSTORAGE ON RETOURNE DANS InitResa
        if (sessionStorage.getItem('stationSelect') !== null){
            Reservation.initResa();
        }else {
            Reservation.eltEtatResa.innerHTML = "Vous n'avez pas de réservation en cours.";
        }
	},
    
    //CREATION DU CANVAS
    addSignature: function(){
        Reservation.canvas = new SignaturePad(Reservation.canvas, {
            backgroundColor: 'rgb(255, 255, 255)',
            
        });     
        
    },
    
    //AU CLIC SUR LE BOUTON EFFACER ON EFFACE LE CANVAS
    clear: function(){
        Reservation.canvas.clear()
    },
    
    
    //AU CLIC SUR LE BOUTON RESERVER ON FAIT APPARAITRE LE CANVAS
    resa: function(){
        Reservation.eltSign.style.display = "block";
        Reservation.eltBtnResa.style.display = "none";
    },

    
    //AU CLIC SUR LE BOUTON VALIDER :
    valid: function(){
        //ON VERIFIE SI IL Y A UNE SIGNATURE DANS LE CANVAS
       if (Reservation.canvas.isEmpty()){
           //SI VIDE ON AFFICHE UNE ALERTE
            alert("Merci de signer pour valider votre reservation");
        }else {
            //SI OK, ON LANCE initResa
            Reservation.initResa();
            //ON STOCKE DANS SESSIONSTORAGE LA STATION ET L'HEURE DE RESERVATION
            sessionStorage.setItem('stationSelect', Gmap.stations[Reservation.currentStation].name.substr(7));
            var TakeHResa = new Date().setMinutes(new Date().getMinutes()+20);
            sessionStorage.setItem('HResa', TakeHResa);
        }
    },
    
    

    //GESTION DE LA RESERVATION
    initResa: function(){
            //ON LANCE LE COMPTE A REBOUR
            Reservation.timer = setInterval(function(){
                var now = new Date();
                //EN RECUPERANT L'H DE RESA DANS LE STORAGE
                var dif = sessionStorage.getItem('HResa') - now;
                var min = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));
                var sec = Math.floor((dif % (1000 * 60)) / 1000);
                //ET ON MET LE RESULTAT DU DESCOMPTE DU COMPTE A REBOUR DANS LE STORAGE
                sessionStorage.setItem('minRest', min);
                sessionStorage.setItem('secRest', sec);  
                
                //ON AFFICHE DANS LE FOOTER LES INFOS DE LA RESERVATION EN COURS
                Reservation.eltEtatResa.innerHTML = "1 vélo réservé à la station : ".toUpperCase()+' " ' + sessionStorage.getItem('stationSelect') +' " '+ " POUR : " + sessionStorage.getItem('minRest') + " MIN " + sessionStorage.getItem('secRest') + " SEC";
                   
                //FIN DU COMPTE A REBOUR ON ANNULE LA RESA
                if (dif < 0) {
                    Reservation.cancelResa();
                }

            }, 1000)
            Reservation.clear();
            Reservation.eltSign.style.display = "none";
            Reservation.eltBtnCancel.style.display = "block";
    },
  
    
    //ANNULATION DE LA RESERVATION
    cancelResa: function(){
        clearInterval(Reservation.timer);
        sessionStorage.clear();
        Reservation.eltEtatResa.innerHTML = "Votre réservation est annulée."
        setTimeout(function(){
            Reservation.eltEtatResa.innerHTML = "Vous n'avez pas de réservation en cours.";
        }, 3000);
        Reservation.eltBtnCancel.style.display = "none";
        
    },
    
  
   
        
};












