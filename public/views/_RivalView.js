var KeyGame = (function(keygame) {

  keygame.Views.RivalView = Backbone.View.extend({

    current_key : "",
    
    // Chemin parcouru
    tracker: [],
    
    initialize: function (args) {
        this.mainview = args.parent;
        console.log("initialize RivalView");
    }

  });

  return keygame;
}(KeyGame));