var KeyGame = (function(keygame) {

  keygame.Views.MainView = Backbone.View.extend({

    env_test: 1,

    el: "body",

    // Temps à partie pour chaque tour
    turn_time: 10000, // ms

    // S'update à chaque changement d'écran :
    touches_possibles : {},  // Redondant avec screen.json ?


    initialize: function() {
      console.log("MainView initialize");

      if (this.env_test) $("#keyboard").show();

      // Instanciation de la vue d'un écran
      // A la fin du chargement de screens.json, on lance mainview.render().
      this.screensView = new keygame.Views.ScreensView( {mainview:this} );

      // Initialisation la princesse :)
      this.princesse = new keygame.Models.Characters( {name:"princesse"} );

      // Initialisation du rival
      this.rival = new keygame.Models.Characters( {name:"rival"} );

      // Initialialisation de la map
      this.mapView = new KeyGame.Views.MapView();

      // Initialisation du héros
      this.hero = new keygame.Models.Characters( {name:"hero"} );

      // Positionnement aléatoire de la princesse
      this.princesse.setPrincesseKey( { mainview: this } );

      //this.render();
    },

    render: function() {
      console.log("MainView render");
      //On affiche le premier écran
      this.screensView.render_type("welcome");
    },



    events : {
      'keydown' : 'keydown',
      'keyup'   : 'keyup',
      'click'   : 'click',
    },

    keydown : function (e) {
      //console.log("e", e);
      //e.preventDefault();
      var k = e.which;
      var char = String.fromCharCode(k);
      console.log("----- keydown", k, char);

      // Affichage du bouton appuyé (.press)
      window.keyboard.display_press_onKeyboard(k);
      
      /*
      ///////////  Flow : 
      ///////////  0. Demande à ScreenView si la touche est autorisée
      ///////////  1. Demande à FieldView, le terrain correspondant à la touche courante.
      ///////////  2. Demande à MapView si il y a des objets,
      ///////////  3. ou des personnages.
      ///////////  4. Envoi le tout à ScreensView qui détermine l'écran le plus pertinent.


      Affichage de l'écran correspondant
      En fonction de :
        - enigme/jeux dont tu es le héros/jeux de mémoire/rapidité en cours ?
        - objets 
        - terrain (marais/fôret)
        - Aide "Besoin d'aide? Revient sur le mont espace."
        - Indication et conseils (Ex: Tu as 5s pour jouer.)

        Actions possibles
        - utiliser un objet dans l'inventaire
        - appeler la princesse
      */

      // Cette touche est-elle autorisée par l'écran en cours ?
      if ( this.screensView.is_in_forceskey(k) ) {
        // Si oui, possède-t-elle un écran associée ?
        if ( this.screensView.is_in_forceskey(k) ) {
          this.screensView.define_screen();
          return false;
        }
      }


      console.log("test");
      //if ( _.contains([this.screensView.screens.touches, 3)  ) {

      //}

      var options = {
        enigme: false,
        objets: false,
        terrain: false
      }
      this.screensView.define_screen( options );

      // Lancement du temps de tour
      if ( intervalID ) clearInterval(intervalID);
      var intervalID = window.setInterval(timer, this.turn_time);

      function timer () {
        console.log("timer");
      }

      /*
      if (this.context=="welcome") {
      // Si on est sur la page d'accueil
        if (e.which==this.space) {
          $(".welcome .key-style").addClass("press");
          this.screensView.render(this.mapView.screens.begin[0]);
          this.mapView.tracker_push(e.which);
          this.context = "begin";
        }
      
      } else {
      // Si on n'est pas sur la page d'accueil

        this.mapView.remove_class_from_keypress();

        if (e.which==this.mapView.princesse_key) {
          // Si tu as trouvé la princesse
          this.screensView.render(this.mapView.screens.findPrincess[0]);
          this.mapView.tracker_push(e.which);

        } else {
        // On va chercher le screen qui correspond à la touche
          var screen_index = this.mapView.map[e.which];
          var screen = this.mapView.screens.liste[screen_index];
          this.screensView.render(screen);
          this.mapView.tracker_push(e.which);

          console.log("is proximity", e.which, this.mapView.keys_double);
          if ( !this.mapView.keys_double.has(e.which) ) {
            this.mapView.detectRivalProximity(e.which);
          } else {
            console.log("[INFO] Cette touche existe à plusieurs endroit du clavier. Il est donc impossible de déterminer ses touches à proxinité.");
          }

          //Rival play
          this.rival_play();
        }
        
      }
      */
    },

    keyup : function (e) {
      e.preventDefault();
      var char = String.fromCharCode(e.which);
      // On retire la class du bouton appuyé (.press)
      window.keyboard.remove_press_onKeyboard();
    },

    click: function (e) {
      e.preventDefault();
      console.log("[A afficher à l'écran] Inutile de cliquer, tout se passe sur ton clavier.");
    },

    rival_play: function () {
      console.log("rival_play");
      var rival_key = this.mapView.keys[Math.floor(Math.random() * this.mapView.keys.length)];
      $(this.el).find("#keyboard li").removeClass("rival").parent().find("li#"+rival_key).addClass("rival");
    }

  });
  return keygame;
}(KeyGame));