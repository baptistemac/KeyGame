var KeyGame = (function(keygame) {

  keygame.Views.HeroView = Backbone.View.extend({

    // Touche actuelle
    current_key: "",

    // Chemin parcouru
    tracker: [],

    initialize: function (args) {
        this.mainview = args.parent;
        console.log("initialize HeroView");
    }

  });

  return keygame;
}(KeyGame));