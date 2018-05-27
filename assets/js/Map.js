var Gmap = {
    //DEFINITON DES PROPRIETES POUR L'OBJET Gmap
	xhr: new XMLHttpRequest(),
	stations: [],
	markers: [],
	url: "https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=5e76fc103bd2c49f83b17c15c2e53fd35849a611",
	map: null,
	options: {
		map: {
			zoom: 14,
	  		center: {lat: 45.760757, lng: 4.861139},
		}
	},
	
    //CREATION DE LA MAP
    initializeMap: function(){
		Gmap.map = new google.maps.Map(document.getElementById('map'), Gmap.options.map);
	},
    
    /*FONCTION LANCEE DANS Main.js POUR ENTRER DANS Gmap.js
    ENVOI DE LA REQUETE AJAX HTTP GET VERS L'URL DE L'API JCDECAUX POUR RECUP LES DONNEES DES STATIONS*/
	getStations: function(){
		Gmap.xhr.open('GET', Gmap.url, true);
		Gmap.xhr.onload = Gmap.onLoadStations;
		Gmap.xhr.send();
	},

    //REPONSE DE LA REQUETE AVEC GESTION DES ERREURS / SI OK ON PARSE LA REPONSE JSON ET ON LANCE LA FONCTION CreateStation
	onLoadStations: function(){
		if (Gmap.xhr.status >= 200 && Gmap.xhr.status < 400) {
            Gmap.stations = JSON.parse(Gmap.xhr.responseText);
           	Gmap.stations.forEach(Gmap.createStation);
            //CREATION DES MARKERCLUSTERS
            var mcOptions = {gridSize: 100, maxZoom: 15, imagePath: 'assets/images/m'};
            var markerCluster = new MarkerClusterer(Gmap.map, Gmap.markers, mcOptions);
        } else {
            console.error(Gmap.xhr.status + " " + Gmap.xhr.statusText + " " + Gmap.url);
        }
	},

    //DONNE UN INDEX A CHAQUE STATION DANS LE TABLEAU Gmap.Stations / ON LANCE Gmap.CreateMarker
	createStation: function(station, index){
		Gmap.stations[index] = station;
		Gmap.createMarker(index);
	},

	
    //CREATION D'UN MARKER POUR CHAQUE STATION
	createMarker: function(index){
		var marker = new google.maps.Marker({
            position: new google.maps.LatLng(Gmap.stations[index].position.lat, Gmap.stations[index].position.lng),
            map: Gmap.map,
            icon: "",
            
        });
        
        //ON MET CHAQUE MARKER DANS LE TABLEAU Gmap.markers QUI SERT POUR LES MARKERCLUSTERS
        Gmap.markers.push(marker);
        //ON DONNE UN INDEX A CHAQUE MARKER
		marker.metadata = {
			id: index	
		};
        //ON LANCE LA FONCTION POUR PERSONNALISER CHAQUE MARKER
		Gmap.colorMarker(marker, marker.metadata.id);	
        
        //LISTENER AU CLIC SUR UN MARKER
		google.maps.event.addListener(marker,'click',function (e) {
            //ON FAIT APPARAITRE LA DIV QUI CONTIENT LES DETAILS DE LA STATION 
            document.getElementById("details_station").style.display = "flex";
            //ON LANCE LA FONCTION POUR AFFICHER LES DETAILS DE LA STATION 
			Gmap.stationDetails(marker.metadata.id);
            //ON LANCE LA FONCTION POUR ANIMER LE MARKER AU CLIC
            Gmap.toggleBounce(marker, marker.metadata.id);			

        }); 
	},  
    
    //AFFICHER LES DETAILS DE LA STATION AU CLIC SUR SON MARKER
	stationDetails : function(index){
        
        var eltNomStation = document.getElementById("nom");
		var eltAdresse = document.getElementById("adresse");
		var eltVelo = document.getElementById("velo");
		var eltSupport = document.getElementById("support");
		var eltStatut = document.getElementById("statut");
		var eltBtnResa = document.getElementById("btnResa");
		var eltSign = document.getElementById("sign");

        eltNomStation.innerHTML = Gmap.stations[index].name.substr(7);
        eltAdresse.innerHTML = "Adresse : " + Gmap.stations[index].address.toUpperCase();
        eltVelo.innerHTML = "Nombre de vélo(s) restant(s) : " + Gmap.stations[index].available_bikes;
        eltSupport.innerHTML = "Nombre de support(s) restant(s) : " + Gmap.stations[index].available_bike_stands;
        if (Gmap.stations[index].status == "OPEN"){
            eltStatut.innerHTML = "La station est ouverte !"
            eltStatut.style.color = "#00c75d"
            eltBtnResa.style.display = "block"
        }else {
                eltStatut.innerHTML = "La station est fermée..."
                eltStatut.style.color = "#C71300"
                eltBtnResa.style.display = "none"
        }
        if(eltSign.style.display = "block"){
            eltSign.style.display = "none"
        }
        if (Gmap.stations[index].available_bikes == 0){
            eltVelo.style.color = "#C71300"
            eltBtnResa.style.display = "none"
        }else {
            eltVelo.style.color = "black"
        }
        if (Gmap.stations[index].available_bike_stands == 0){
            eltSupport.style.color = "#C71300"
        }else {
            eltSupport.style.color = "black"
        }			
        Reservation.currentStation = index
        		
	},

    //PERSONNALISATION DES MARKERS
	colorMarker: function(marker, index){
        //CALCUL DU POURCENTAGE DE VELO EN STATION
		var calcul = (Gmap.stations[index].available_bikes * 100) / Gmap.stations[index].bike_stands;
        //EN FONCTION DU RESULTAT ON ATTRIBUT UNE IMAGE AU MARKER
		if (Gmap.stations[index].status === "CLOSED"){
			marker.icon = "assets/images/marker_icon/ico0.png"
		}
		else if (calcul <= 100 && calcul >= 75){
			marker.icon = "assets/images/marker_icon/ico6.png"
		}
		else if (calcul < 75 && calcul >= 50){
			marker.icon = "assets/images/marker_icon/ico5.png"
		}
		else if (calcul < 50 && calcul >= 25){
			marker.icon = "assets/images/marker_icon/ico4.png"
		}
		else if (calcul < 25 && calcul >= 10){
			marker.icon = "assets/images/marker_icon/ico3.png"
		}
        else if (calcul < 10 && calcul >= 1){
			marker.icon = "assets/images/marker_icon/ico2.png"
		}
        else if (calcul === 0){
            marker.icon = "assets/images/marker_icon/ico1.png"
        }
    },
    
    //POUR ANIMER LE MARKER AU CLIC
	toggleBounce: function (marker, index){
  				if (marker.getAnimation() !== null) {
    				marker.setAnimation(null);
  				} 
  				else {
    				marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function(){
                        marker.setAnimation(null);}, 5000);
  				}
			},

	
}
				


	

	
	



	

