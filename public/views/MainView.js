var KeyGame = (function(keygame) {

  keygame.Views.MainView = Backbone.View.extend({

    env_test: 1,

    el: "body",
    context: "welcome",

    initialize: function() {
      console.log("MainView initialize");

      if (this.env_test) $("#keyboard").show();

      // Instanciation de la vue d'un écran
      console.log("this", this);
      this.screensView = new keygame.Views.ScreensView();

      // Initialisation la princesse :)
      this.princessView = new keygame.Views.PrincessView( {parent:this} );

      // Initialisation du rival
      this.rivalView = new keygame.Views.RivalView( {parent:this} );

      // Initialialisation de la map
      this.mapView = new KeyGame.Views.MapView();

      // Initialisation du héros
      this.heroView = new keygame.Views.HeroView( {parent:this} );

      // Positionnement aléatoire de la princesse
      this.princessView.setPrincesseKey();

      //this.render();
    },

    render: function() {
      console.log("MainView render", this);
      //console.log("screens", this.mapView.screens.welcome[0]);
      //On affiche le premier écran
      //this.screensView.render(this.mapView.screens.welcome[0]);
    },


    events : {
      'keydown' : 'keydown',
      //'keyup'   : 'keyup',
      'click'   : 'click',
    },

    keydown : function (e) {
      //e.preventDefault();
      var k = e.which;
      var char = String.fromCharCode(k);
      console.log("----- keydown", k, char);

      // Affichage du bouton appuyé (.press)
      window.keyboard.display_press_onKeyboard(k);

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

    },

    keyup : function (e) {
      e.preventDefault();
      var char = String.fromCharCode(e.which);
      console.log("keyup", e.which, "char", char);
      //$(this.el).find("#keyboard #"+e.which).removeClass("press");
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