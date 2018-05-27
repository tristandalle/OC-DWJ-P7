var Main = {
    //POINT D'ENTREE DANS TOUS LES FICHIERS JS
	init: function(){
		Slider.init()
		Gmap.getStations()
		Reservation.init()
        //LISTENER AU RESIZE POUR LE RESPONSIVE DU CANVAS
        window.addEventListener('resize', Main.mqCanvas)
	},
    
    //TABLEAU DES POINTS DE RUPTURE POUR LE RESPONSIVE DU CANVAS
    mq:[ 
        window.matchMedia("(max-width: 768px)"),
        window.matchMedia("(max-width: 1200px)")
    ],
    
    //FONCTION POUR DONNER LA TAILLE DU CANVAS EN FONCTION DES MQ
    mqCanvas: function(){
        if (Main.mq[0].matches){
            canvas.setAttribute("width", 200);
            canvas.setAttribute("height", 50);
        }else if (Main.mq[1].matches){
            canvas.setAttribute("width", 150);
            canvas.setAttribute("height", 80);
        }else{
            canvas.setAttribute("width", 300);
            canvas.setAttribute("height", 80);    
        }
    }
}
//LANCEMENT DE LA FONCTION PRINCIPALE
window.onload = Main.init
