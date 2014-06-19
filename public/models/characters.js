var KeyGame = (function(keygame) {

  keygame.Models.Characters = Backbone.Model.extend({


    /* valeurs par défaut du modèle */
    defaults: {
      // Name: princesse, rival ou hero
      name: "",
      current_key: "",
      // Chemin parcouru
      tracker: []
    },


    initialize: function() {
      console.log("Characters initialize:", this.attributes.name);
    },

    setPrincesseKey : function ( args ) {
        this.mainview = args.mainview;
        console.log("setPrincesseKey");
        var keys_available = this.mainview.mapView.keys_available;        
        this.current_key = keys_available[Math.floor(Math.random() * keys_available.length)];
        window.keyboard.display_princess(this.current_key);
        console.log("setPrincesseKey current_key", this.current_key);
    }

    /* les getters et les setters à l'ancienne */
    // ...

  });


  keygame.Collections.Characters = Backbone.Collection.extend({
    model: keygame.Models.Characters,
    initialize: function () {}
  });

  return keygame;
}(KeyGame));
