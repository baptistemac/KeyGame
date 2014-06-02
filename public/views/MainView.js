var KeyGame = (function(keygame) {

  keygame.Views.MainView = Backbone.View.extend({

    env_test: 1, 

    el: "body",

    context: "welcome",

    shift: 16,
    ctrl: 17,
    alt: 18,
    space: 32,
    cmd_left: 91,
    cmd_right: 93, 

    initialize: function() {
      console.log("MainView initialize");

      if (this.env_test) $("#keyboard").show();

      // On instancie la vue d'un écran
      console.log("this", this);
      this.screensView = new keygame.Views.ScreensView();

      // On initialise la map
      this.mapView = new KeyGame.Views.MapView();

      // On détermine la position de la princesse
      this.mapView.positionnerPrincesse();

      this.render();
    },

    render: function() {
      console.log("MainView render", this);
      console.log("screens", this.mapView.screens.welcome[0]);
      //On affiche le premier écran
      this.screensView.render(this.mapView.screens.welcome[0]);
    },


    events : {
      'keydown' : 'keydown',
      'keyup' : 'keyup'
    },

    keydown : function (e) {
      //e.preventDefault();
      var char = String.fromCharCode(e.which);
      console.log("keydown", e.which, "char", char);
      $(this.el).find("#keyboard li").removeClass("press").parent().find("li#"+e.which).addClass("press");

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

        if (e.which==this.mapView.princesse_key) {
          // Si tu as trouvé la princesse
          this.screensView.render(this.mapView.screens.findPrincess[0]);
          this.mapView.tracker_push(e.which);

        } else if (e.which==this.alt) {
        // Si la touche appuyé n'est pas autorisée (Ex: ALT)
          this.screensView.render(this.mapView.screens.notAccepted[0]);
          this.mapView.tracker_push(e.which);

        } else {
        // On va chercher le screen qui correspond à la touche
          var screen_index = this.mapView.map[e.which];
          var screen = this.mapView.screens.liste[screen_index];
          this.screensView.render(screen);
          this.mapView.tracker_push(e.which);

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

    rival_play: function () {
      console.log("rival_play");
      var rival_key = this.mapView.keys[Math.floor(Math.random() * this.mapView.keys.length)];
      $(this.el).find("#keyboard li").removeClass("rival").parent().find("li#"+rival_key).addClass("rival");
    }

  });
  return keygame;
}(KeyGame));