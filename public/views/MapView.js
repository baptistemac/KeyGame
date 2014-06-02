var KeyGame = (function(keygame) {

  keygame.Views.MapView = Backbone.View.extend({

    keys: [
    191,49,50,51,52,53,54,55,56,57,48,189,187,8,
    9,81,87,69,82,84,89,85,73,79,80,219,221,
    20,65,83,68,70,71,72,74,75,76,186,222,13,
    192,90,88,67,86,66,78,77,188,190,191,
    17,91,32,93,37,38,39,40
    ],

    screens : {
      'liste' : [

      {type:"", 
      text:"La princesse n'est pas ici.", 
      color:"LightGreen", 
      sound:""},

      {type:"", 
      text:"Tu viens de marcher sur un piège posé par ton rival. </br>Il t'a repéré.",
      color:"Plum",
      sound:""},
      
      {type:"", 
      text:"Tu viens de trouver la boussole à princesse. </br>Suis-la, elle te guidera vers elle.", 
      color:"PaleTurquoise", 
      sound:""},

      {type:"", 
      text:"Le sol n'est pas trés solide ici.</br>Passe ton tour.", 
      color:"Salmon", 
      sound:""},
      
      {type:"", 
      text:"<span class='img' style='background-image: url(img/church.jpg)'></span>Tu attéris devant l'église. </br>Le prêtre te questionne sur le bienfondé de ta quète.",
      answers: [
        "<div class='answer'>Sauver la princesse!<span>Va en <span class='key-style'>V</span></div>",
        "<div class='answer'>Sauter la princesse!<span>Va en <span class='key-style'>T</span></div>"],
      color:"#ecf5fc", 
      sound:""},
      
      {type:"", 
      text:"Tu vas te faire manger", 
      color:"Peru", 
      sound:""}

      ],

      'welcome' :[
        {text:"Tu dois retrouver la princesse avant ton rival.<span>Rendez-vous sur<span class='key-style space block'>espace</span> pour commencer l'aventure.</span>", 
        color:"CadetBlue", 
        sound:""}],

      'begin' : [
        {text:"Commence donc par explorer les environs.", 
        color:"Silver", 
        sound:""}],

      'findPrincess' : [
        {text:"Tu as trouvé la princesse avant ton rival!", 
        color:"Gold", 
        sound:""}],

      'notAccepted' : [
        {text:"Il n'y a rien ici.", 
        color:"LightCoral", 
        sound:""}]

    },

    princesse_key : "",

    map: {},

    tracker: [],

    initialize: function(keys) {
        console.log("initialize MapView");
        // Pour chaque touche, on attribu une action aléatoirement.
        var i=0;
        for ( i; i<this.keys.length; i++ ) {
          var random_screen_index = Math.floor(Math.random() * this.screens.liste.length);
          this.map[this.keys[i]] = random_screen_index;
        }
        console.log("this.map", this.map);
    },
    
    positionnerPrincesse : function () {
        console.log("positionnerPrincesse");
        var pos = this.keys[Math.floor(Math.random() * this.keys.length)];
        this.princesse_key = pos;
        $("#keyboard #"+pos).addClass("princesse");
        console.log("princesse_key", this.princesse_key);
    },

    tracker_push: function (key) {
      this.tracker.push(key);
    }

  });

  return keygame;
}(KeyGame));