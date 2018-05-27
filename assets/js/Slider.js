var Slider = {
    //DEFINITON DES PROPRIETES POUR L'OBJET Slider
    conteneur : document.getElementById("slider_container"),
	arrowLeft: document.getElementById("left"),
	arrowRight : document.getElementById("right"),
    playBtn: document.getElementById("play"),
    pauseBtn: document.getElementById("pause"),
    interval: "",
	currentPosition : 0,
    

    //FONCTION LANCEE DANS Main.js POUR ENTRER DANS Slider.js / AJOUT DES LISTENER
    init: function(){
        
        Slider.arrowLeft.addEventListener("click", Slider.changePictureClick)
        Slider.arrowRight.addEventListener("click", Slider.changePictureClick)
        window.addEventListener("keydown", Slider.changePictureKeyboard)
        Slider.playBtn.addEventListener("click", Slider.autoplay)
        Slider.pauseBtn.addEventListener("click", Slider.pause)
	},
    
    //POUR DECALER L'IMAGE DANS LE SLIDER
    changePicture: function(){

        if(Slider.currentPosition > 3){
            Slider.currentPosition = 0
        }
        else if (Slider.currentPosition < 0){
            Slider.currentPosition = 3
        }
        switch (Slider.currentPosition){

            case 0:
            Slider.conteneur.style.right = "0%";
            break;
            case 1:
            Slider.conteneur.style.right = "100%";
            break;
            case 2:
            Slider.conteneur.style.right = "200%";
            break;
            case 3:
            Slider.conteneur.style.right = "300%";
            break;
			
        }

	},

    //POUR FAIRE DEFILER LE SLIDER AUTOMATIQUEMENT AU CLIC SUR PLAY
    autoplay: function(){
        Slider.interval = setInterval(function(){
            Slider.currentPosition++;
            Slider.changePicture();
        },3000);
        Slider.pauseBtn.style.display = "block";
        Slider.playBtn.style.display = "none";
    },
    
    //POUR STOPER LE SLIDER AU CLIC SUR PAUSE
    pause: function(){
        clearInterval(Slider.interval)
        Slider.pauseBtn.style.display = "none";
        Slider.playBtn.style.display = "block";
        
    },

	//POUR DECALER LE SLIDER AU CLIC SOURIS SUR LES FLECHES		
	changePictureClick: function(){
        if (this.id=="right"){
            Slider.currentPosition++
        }else {
            Slider.currentPosition--
        }

        Slider.changePicture()
							
	},

    //POUR DECALER LE SLIDER AVEC LES FLECHES DU CLAVIER
	changePictureKeyboard: function(e){
        if (e.keyCode == 39){
			Slider.currentPosition++
		}
		else if (e.keyCode == 37){
			Slider.currentPosition--
		}
		Slider.changePicture()
	}

};