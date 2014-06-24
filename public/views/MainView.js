var KeyGame = (function(keygame) {

  keygame.Views.MainView = Backbone.View.extend({


    env_test: 0,

    el: "body",

    // Temps à partie pour chaque tour
    turn_time: 10000, // ms



    initialize: function() {
      console.log("MainView initialize");

      if (this.env_test) $("#keyboard").show();


      this.mapView = new KeyGame.Views.MapView();

      // Récupèration de data.json.
      // Lorsque c'est récupéré, on créé la map,
      // puis on appelle mainview.render().
      this.get_data();

      // Initialisation des personnages
      this.hero       = new keygame.Models.Characters( { name: "hero" } );
      this.princess   = new keygame.Models.Characters( { name: "princess" } );
      this.rival      = new keygame.Models.Characters( { name: "rival" } );

      // Instanciation de la vue d'un écran
      // screensView se chargera de l'affichage des écrans.
      // Attention! À ce moment, nous n'avons pas encore les data, puisque la récupèration et asynchrone.
      //this.screensView = new keygame.Views.ScreensView( {mainview:this} );
    },


    render: function() {
      console.log("MainView render", this.mapView);

      // Positionnement aléatoire de la princesse
      this.mapView.setPrincessKey( this.princess );
      //On affiche le premier écran

      this.mapView.render_screenType("welcome");
    },


    get_data: function () {
      var that = this;
      $.ajax({
        type: 'GET',
        url: '/data',
        error: function (err) {
          console.log("[Error] Impossible de récupérer le fichier JSON.", err);
        },
        success: function (data) {
          // On a les data (Screens, fields, keyboards, objects)
          // On créer donc la map correspondante.
          // A la fin, on appelera mainview.render() pour lancer le premier écran.
          console.log("data", data);
          console.table( data.keyboards.qwerty_fr );
          console.table( data.fields );
          console.table( data.screens );
          console.table( data.screens_with_objects );
          console.table( data.objects );
          that.mapView.build_map( data );
        }
      });
    },


    events : {
      'keydown' : 'keydown',
      'keyup'   : 'keyup',
      'click'   : 'click',
    },

    keydown : function (e) {
      //console.log("e", e);
      //e.preventDefault();
      var key = e.which;
      var char = String.fromCharCode(key);
      console.log("----- keydown", key, char);

      // Affichage du bouton appuyé (.press)
      window.keyboard.display_press_onKeyboard(key);
      
      
      //  Flow : 
      //  0.  Vérifi si la touche est autorisée
      //  1.  Vérifi si il y a des objets ou des personnages.

      var forcekey = this.mapView.get_curr_screen_ForceKey();
      if ( forcekey && !_.contains( forcekey, key ) ) {
        console.log("[info] Impossible de se déplacer ailleurs que sur les touches :", forcekey );
        // dev: Pomme+R appelle le rafraichissement 
        if ( key==82 && e.metaKey) {
          console.log("rafraichissement");
        } else {
          return false;
        }
      }
      
      this.hero.setKey(key);
      this.mapView.render_screenKey(key);



      /*
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
      /*
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
  */
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