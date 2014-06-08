var KeyGame = (function(keygame) {

  keygame.Views.MapView = Backbone.View.extend({

    el: $("#keyboard"),
    
    // Définition des touches des différents claviers.
    keyboard_type: "qwerty_fr",
    // -1 = insensitive key : Utile pour déterminer la proximité
    keyboards: {
      "qwerty_fr": {
        "row0": [ 27 ], // Les autres touches à droite de Echap ne sont capturables
        "row1": [ 191,49,50,51,52,53,54,55,56,57,48,189,187,8 ],
        "row2": [ 9,81,87,69,82,84,89,85,73,79,80,219,221 ],
        "row3": [ 20,65,83,68,70,71,72,74,75,76,186,222,220,13 ],
        "row4": [ 16,192,90,88,67,86,66,78,77,188,190,191,16 ],
        "row5": [ -1,17,18,91,32,93,18,37,38,39,40 ]
      },
      "qwerty_en": {
        // TO DO
      },
      "azerty": {
        // TO DO
      }
    },

    // A vérifier : les codes des touches ci-dessous sont-ils les mêmes pour un autre type de clavier ?
    escape_key      : 27,
    shift_key       : 16,
    ctrl_key        : 17,
    alt_key         : 18,
    space_key       : 32,
    cmd_left_key    : 91,
    cmd_right_key   : 93,
    keys_double     : [16,18,191],
    
    keys_available  : [], 

    // Définition des bonus et malus
    objets: {
      "bonus" : [
      // Chapeau d'invisibilité
      { invibility: true, turn: 1 },
      // Permet de voir les pièges du rival
      { trap_visible: true, turn: 1 },
      // Piège à poser
      {},
      // Lampe à jeter pour éclairer n'importe ou = voir plus sur ta boussole
      // Effet secondaire: Ton rival connait ta position.
      {}
      ],
      "malus" : [
      {}
      ]
    },

    initialize: function() {
        console.log("initialize MapView");

        // Initialialisation du terrain
        this.fieldView = new KeyGame.Views.FieldView( {parent:this} );

        // Affichage des boutons en double sur le calvier
        window.keyboard.display_doubleKeys_onKeyboard( {keys_double: this.keys_double} );
        
        // Affichage du terrain sur le clavier
        window.keyboard.display_field_onKeyboard( {mapview:this} );

        // Définition du tableau contenant uniquement les touches "jouables", 
        // soit sans les touches en doubles et la touche espace.
        // Ce tableau va nous servir à positionner la princesse, les bonus et les malus.
        var keys_unavailable = _.union(this.keys_double, this.space_key, -1);
        console.log("keys_unavailable", keys_unavailable);
        var rows = this.keyboards.qwerty_fr;
        var all_keys = rows.row0.concat(rows.row1, rows.row2, rows.row3, rows.row4, rows.row5);
        this.keys_available = _.difference(all_keys, keys_unavailable);
        console.log("this.keys_available", this.keys_available);

        // Ajout des malus et bonus avec le tableau des touches "jouables"
        // NB: Pour des raisons de simplicité, les touches ne peuvent contenir 2 objets en même temps.
        // NB: La touche espace ne devrait pas contenir d'objets car c'est la touche d'entrée dans le jeu
        // NB: On affiche les bonus et les malus sur le clavier, à leur instantiation.
        var bonus1 = new keygame.Models.Bonus1( { mapview:this} );


        /*
        // Pour chaque touche, on attribu une action aléatoirement.
        var i=0;
        for ( i; i<this.keys.length; i++ ) {
          var random_screen_index = Math.floor(Math.random() * this.screens.liste.length);
          this.map[this.keys[i]] = random_screen_index;
        }
        console.log("this.map", this.map);
        */
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

      // On détermine la rangée de la touche et son index
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
        console.log("[ERROR] La touche "+k+" n'est pas prise en compte dans ce clavier.");
      }
      console.log("k", k, "k_row", k_row, "k_index", k_index);

      /*
      Si rangée 1, alors on récupère les touches avoisinantes suivantes :
      [  0  1  1  ]
      [  1  K  1  ]
      [  0  1  1  ]
      */

      var top = [];
      var right = [];
      var bottom = [];
      var left = [];

      // Pour la dernière rangée, je ne calcule pas du tout la proximité,
      // parce que c'est compliqué avec la touche éspace et les flèches.
      if (k_row==5) {
        return [top,right,bottom,left];
      }

      // Détermine les touches à proximité sur la rangée au dessus
      if ( this.keys2["row"+(k_row-1)] ) {
        var row_top = this.keys2["row"+(k_row-1)];
        ( row_top[k_index] ) ? top.push( row_top[k_index] ) : null ;
        if ( k_row == 4 ) {
          ( row_top[k_index-1] ) ? top.push( row_top[k_index-1] ) : null ;
        } else {
          ( row_top[k_index+1] ) ? top.push( row_top[k_index+1] ) : null ;
        }
      }

      // Détermine les touches à proximité à droite
      if ( this.keys2["row"+k_row] ) {
        var row_right = this.keys2["row"+k_row];
        ( row_right[k_index+1] ) ? right.push( row_right[k_index+1] ) : null ;
      }

      // Détermine les touches à proximité sur la rangée du dessous
      if ( this.keys2["row"+(k_row+1)] ) {
        var row_bottom = this.keys2["row"+(k_row+1)];
        console.log("row_bottom[k_index-1]", row_bottom[(k_index-1)]);      
        if ( k_row == 4 ) {
          // Quand k es sur la rangée 4 (au dessus de la touche Espace),
          // la touche espace décale tout et complique le calcul.
          // Pour cette raison, je ne chercherai pas à connaitre les touches à proximité.
        } else if ( k_row == 1 || k_row == 2 ) {
          ( row_bottom[k_index] ) ? bottom.push( row_bottom[k_index] ) : null ;
          ( row_bottom[k_index-1] ) ? bottom.push( row_bottom[k_index-1] ) : null ;
        } else {
          ( row_bottom[k_index] ) ? bottom.push( row_bottom[k_index] ) : null ;
          ( row_bottom[k_index+1] ) ? bottom.push( row_bottom[k_index+1] ) : null ;
        }
      }

      // Détermine les touches à proximité à gauche
      if ( this.keys2["row"+k_row] ) {
        var row_left = this.keys2["row"+k_row];
        ( row_left[k_index-1] ) ? left.push( row_left[k_index-1] ) : null ;
      }

      console.log("[top,right,bottom,left]", [top,right,bottom,left])

      // On ajoute la class au #keyboard
      top.forEach(this.keyboard_top);
      right.forEach(this.keyboard_right);
      bottom.forEach(this.keyboard_bottom);
      left.forEach(this.keyboard_right);

      return [top,right,bottom,left];

    },

    keyboard_top: function (element, index, array) {
        $("#keyboard").find(".key-"+element).addClass("proximity top");
    },

    keyboard_right: function(element, index, array) {
        $("#keyboard").find(".key-"+element).addClass("proximity right");
    },

    keyboard_bottom: function(element, index, array) {
        $("#keyboard").find(".key-"+element).addClass("proximity bottom");
    },

    keyboard_left: function(element, index, array) {
        $("#keyboard").find(".key-"+element).addClass("proximity left");
    },

    tracker_push: function (key) {
      this.tracker.push(key);
    },

    remove_class_from_keypress: function () {
      $(this.el).find("li").removeClass("proximity top right bottom left");
    }

  });

  return keygame;
}(KeyGame));