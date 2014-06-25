var KeyGame = (function(keygame) {

  keygame.Views.MapView = Backbone.View.extend({

    el: $(".screen"),
    
    // Variables contenant les datas du json
    keyboards             : [],
    fields                : [],
    screens               : [],
    screens_with_objects  : [],
    objects               : [],

    // Création de la map à partir du json data.json
    map                   : [],
    /* Format de map :
    map : [
            {
              "key": 191,
              "screen_id": 3,
              "field_id": 1 
            },
            {
              "key": 49,
              "screen_id": 1,
              "fields_id": 2
            }
    ],
    */

    keyboard_type: "qwerty_fr",
    

    // A vérifier : les codes des touches ci-dessous sont-ils les mêmes pour un autre type de clavier ?
    escape_key      : 27,
    shift_key       : 16,
    ctrl_key        : 17,
    alt_key         : 18,
    space_key       : 32,
    cmd_left_key    : 91,
    cmd_right_key   : 93,
    double_keys     : [ 16, 18, 191 ],
    impossibles_keys: [ 27, 16, 17, 18, 32, 191, -1 ],

    curr_screen     : {},


    /*
    // Définition des bonus et malus
    objets: [

      // Chapeau d'invisibilité
      // = Personne ne te voit sur sa boussole.
      { name:"hat", quantity:2, invibility: true, turn: 1, field: "marais" },

      // Permet de voir les pièges du rival
      { name:"seehistrap", quantity:0, trap_visible: true, turn: 1 },

      // Permet de voir la position de ton rival (et son dernier chemin parcouru?)
      { name:"magic magnifying glass", quantity:0 },

      // Piège à poser
      // Effet secondaire: Tu peux aussi exploser dessus. Souviens toi de la ou tu mets tes bombes :)
      { name:"trap", quantity:0 },

      // Bombe à jeter
      { name:"bomb", quantity:0 },

      // Lampe à jeter pour éclairer n'importe ou 
      // = te permet de voir plus loin sur ta boussole
      // = mais dévoile ta position à tous
      { name:"light flare", quantity:0 },

      // Magnette déboussoleur
      // Casse la boussole si tu tombe sur cet objet

      // Implants d'oreilles
      // Sons holophonique, tu peux deviner ou se trouve les autres (impose d'avoir la tête face au clavier)

      // Plume chatouilleuse
      // = Dévoile ta position à tous

      // Flute ennivrante
      // = Passe ton tour

      // Mouche collante
      // = la princesse ne répond pas à ton appel

      // Animal qui se balade :)

    ],
    */

    initialize: function () {
      console.log("initialize MapView");
      this.compassView = new KeyGame.Views.CompassView();
    },
    
    build_map: function( data ) {
        console.log("build_map MapView", data);

        this.template = $("#screens_template").html();
        this.json = data;
        this.keyboard               = data.keyboards[this.keyboard_type];
        this.fields                 = data.fields;
        this.screens                = data.screens;
        this.screens_with_objects   = data.screens_with_objects;
        this.objects                = data.objects;

        // Initialialisation du terrain
        //this.fieldView = new KeyGame.Views.FieldView( {parent:this} );


        // On créer l'objet map qui va contenir pour chaque touche, toutes les informations necessaires.
        // Pour chaque touche,
        that = this;
        var row = this.keyboard;
        this.keys = row[0].concat(row[1],row[2],row[3],row[4],row[5]);
        //var key_x = 0; // to do
        //var key_y = 0;

        _.each( this.keys, function(key){
          console.log("====== ", key);

          // -1 = insensitive key : Impossible à detecter,
          // mais utile pour déterminer le calcul de proximité des touches
          if ( key == -1) { return false; }

          // On créer l'objet de cette touche
          var k = { "key": key };

          // Attribution du field correspondant
          if ( !_.contains( this.double_keys, key ) ){
            k.field_id = that.attribute_field(key);
          }

          // Attribution de l'écran correspondant
          k.screen_id = that.attribute_screen(k);

          that.map.push( k );

        });

        // La map est ainsi créée.
        // Il nous reste cependant à y ajouter les objets,
        // et donc remplacer certains écrans.
        
        // Parmis les touches possibles.
        // (on ne mets pas d'objects sur les touches impossibles )
        var screenField = _.filter( this.map, function(o) {
          return !_.contains(that.impossibles_keys, o.key);
        });
        //console.log("screenField", screenField);

        _.each( this.objects, function(o){
          //console.log("object", o, o.fields_id);

          // Si ils ont un terrain défini, on leur attribu une touche avec ce terrain.
          if ( o.fields_id && o.fields_id.length ) {
            screenField = _.filter( screenField, function(screen) {
              return _.contains(o.fields_id, screen.field_id );
            });
          }
          // Puis on en choisi au hasard parmis le tableau
          var rand = Math.floor(Math.random() * screenField.length);
          var rand_key = screenField[rand].key;
          //console.log("rand_key", rand_key );
          var map_key = _.where( that.map, { key: rand_key } )[0];
          //console.log("map_key", map_key );
          map_key.object_id = o.id;

          // On a déjà attribué l'objet à une touche,
          // on va maintenant attribuer un screen_with_objects à cette même touche.
          var screenObject = _.filter( that.screens_with_objects, function(screen) {
            return _.contains( screen.objects_id, o.id);
          });
          //console.log("screenObject", screenObject);
          var rand2 = Math.floor(Math.random() * screenObject.length);
          map_key.objectscreen_id = screenObject[rand2];
        });

        console.table(this.map);


        // Affichage des boutons en double sur le clavier
        window.keyboard.display_doubleKeys_onKeyboard( { double_keys: this.double_keys } );
        
        // Affichage du terrain sur le clavier
        window.keyboard.display_field_onKeyboard( { mapview: this } );


        // On est enfin prêt à lancer l'écran d'accueil du jeu!
        mainView.render();
    },
    
    
    render: function(screen) {
      console.log("MapView render", screen);
      this.curr_screen = screen;
      
      // Mise à jour de l'écran
      this.$el.css('background-color', screen.color);
      this.$el.find("> .box").addClass("box_old");
      var transitionEnd = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";
      this.$el.find("> .box").bind( transitionEnd, function(){
        console.log("transitionEnd");
        $(this).unbind(transitionEnd).removeClass("box_old")
        .html('<p class="title">'+(screen.title||"")+'</p><p class="text">'+(screen.text||"")+'</p>');
      });
      
      // Mise à jour de la boussole
      this.compassView.update( this.curr_screen.attribute_key );

    },



    //==========
    //========== Fonctions de build de la map
    //==========


    attribute_field: function (key) {
      for ( var i=0; i < this.fields.length; i++) {
        if ( _.contains(this.fields[i].keys, key)) { 
          return this.fields[i].id;
        }
      }
    },

    attribute_screen: function (k) {
      // Dans un premier temps,
      // on recherche les écrans qui ont le terrain correspondant à la touche,
      // et qui n'on pas déjà été attribué.
      var screensFields = _.filter( this.screens, function(screen) {
        return ( !screen.attribute_key && _.contains( screen.fields_id, k.field_id ));
      });
      // Si le tableau des terrains correspondants n'est pas vide,
      // on en choisi un aléatoirement.
      if ( screensFields.length ) {
        var rand = Math.floor(Math.random() * screensFields.length);
        screensFields[rand].attribute_key = k.key;
        return screensFields[rand].id;
        
      } else {
        // Sinon, si aucun ne correspond,
        // on recherche les écrans non attribués qui n'ont pas de précision sur le terrain.
        var screensFields = _.filter( this.screens, function(screen) {
          return ( !screen.attribute_key && ( !screen.fields_id || ( screen.fields_id && screen.fields_id.length==0 ) ) );
        });
        //console.log("screensFields", screensFields);
        // Si le tableau des terrains correspondants n'est pas vide,
        // on en choisi un aléatoirement.
        //console.log( "screensFields.length", screensFields.length);
        if ( screensFields.length ) {
          var rand = Math.floor(Math.random() * screensFields.length);
          screensFields[rand].attribute_key = k.key;
          return screensFields[rand].id;

        } else {
          // Si décidemment, aucun écran ne correspond,
          // on en prend un au hasard (qui sera surement déjà attribué à une touche).
          var rand = Math.floor(Math.random() * this.screens.length);
          //screensFields[rand].attribute_key = k.key;
          return this.screens[rand].id;
        }
      }
      
    },

    setPrincessKey: function ( princess ) {
      var possible_keys = _.difference( this.keys, this.impossibles_keys );
      var rand = Math.floor(Math.random() * possible_keys.length);
      princess.setKey( possible_keys[rand] );
    },


    //==========
    //========== Fonctions d'affichage
    //==========


    get_screen_fromKey: function (value) {
      var screen_id = _.where(this.map, {key: value})[0].screen_id;
      //console.log("screen_id", screen_id);
      return _.where(this.screens, {id: screen_id})[0];
    },

    get_screen_fromType: function (value) {
      return _.where(this.screens, {type: value})[0];
    },

    get_curr_screen_ForceKey: function () {
      //console.log("get_curr_screen_ForceKey", this.curr_screen);
      return this.curr_screen.forcekey || null;
    },

    render_screenKey:function(value) {
      var screen = this.get_screen_fromKey(value);
      this.render( screen );
    },

    render_screenType:function(value) {
      var screen = this.get_screen_fromType(value);
      //console.log("render_screenType", screen);
      this.render( screen );
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


    remove_class_from_keypress: function () {
      $(this.el).find("li").removeClass("proximity top right bottom left");
    }

  });

  return keygame;
}(KeyGame));