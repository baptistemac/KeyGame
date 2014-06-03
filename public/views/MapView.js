var KeyGame = (function(keygame) {

  keygame.Views.MapView = Backbone.View.extend({

    keys: [
    191,49,50,51,52,53,54,55,56,57,48,189,187,8,
    9,81,87,69,82,84,89,85,73,79,80,219,221,
    20,65,83,68,70,71,72,74,75,76,186,222,13,
    192,90,88,67,86,66,78,77,188,190,191,
    17,91,32,93,37,38,39,40
    ],

    keys2: {
      "row1":[191,49,50,51,52,53,54,55,56,57,48,189,187,8],
      "row2":[9,81,87,69,82,84,89,85,73,79,80,219,221],
      "row3":[20,65,83,68,70,71,72,74,75,76,186,222,13],
      "row4":[16,192,90,88,67,86,66,78,77,188,190,191],
      "row5":[17,91,32,93,37,38,39,40]
    },

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
      text:"<span class='img' style='background-image: url(assets/img/church.jpg)'></span>Tu attéris devant l'église. </br>Le prêtre te questionne sur le bienfondé de ta quète.",
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

    detectRivalProximity: function (_k) {
      var k = _k;
      var keysProximity = this.detectKeyProximity(k);
      console.log("detectRivalProximity keysProximity", keysProximity);
    },

    detectKeyProximity: function (k) {
      var k_row, k_index;
      console.log("this.keys2.row1",this.keys2.row1, k, this.keys2.row1.indexOf(k),"test", this.keys2["row"+2]);
      //var keys2_all = this.keys2.row1.concat(this.keys2.row2, this.keys2.row3, this.keys2.row4, this.keys2.row5);

      // On détermine la rangée de la touche
      if ( this.keys2.row1.indexOf(k) != -1 ) {
        k_index = this.keys2.row1.indexOf(k);
        k_row = 1;
      } else if ( this.keys2.row2.indexOf(k) != -1  ) {
        k_index = this.keys2.row2.indexOf(k);
        k_row = 2;
      } else if ( this.keys2.row3.indexOf(k) != -1  ) {
        k_index = this.keys2.row3.indexOf(k);
        k_row = 3;
      } else if ( this.keys2.row4.indexOf(k) != -1  ) {
        k_index = this.keys2.row4.indexOf(k);
        k_row = 4;
      } else if ( this.keys2.row5.indexOf(k) != -1  ) {
        k_index = this.keys2.row5.indexOf(k);
        k_row = 5;
      } else {
        console.log("ERROR: La touche "+k+" n'est pas prise en compte dans ce clavier.");
      }
      console.log("k", k, "k_row", k_row, "k_index", k_index);

      /*
      Si rangée 1, alors on récupère les touches avoisinantes suivantes :
      [  0  1  1  ]
      [  1  X  1  ]
      [  0  1  1  ]
      Sinon on récupère
      */

      var top = [];
      if ( this.keys2["row"+(k_row-1)] ) {
        var row_top = this.keys2["row"+(k_row-1)];
        ( row_top[k_index] ) ? top.push( row_top[k_index] ) : null ;
        ( row_top[k_index+1] ) ? top.push( row_top[k_index+1] ) : null ;
        console.log("top", top);
      }

      var right = [];
      var bottom = [];
      var left = [];

      var keyboard = $("#keyboard");
      $(keyboard).find("li").removeClass("proximity");
      
      top.forEach(keyboard_top);
      function keyboard_top(element, index, array) {
          $(keyboard).find("#"+element).addClass("proximity");
          console.log("a[" + index + "] = " + element);
      }

      return [top,right,bottom,left];
    },

    tracker_push: function (key) {
      this.tracker.push(key);
    }

  });

  return keygame;
}(KeyGame));