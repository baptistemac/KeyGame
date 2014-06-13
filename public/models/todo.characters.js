var KeyGame = (function(keygame) {

  keygame.Models.Characters = Backbone.Model.extend({


    //urlRoot: "/characters",

    /* valeurs par défaut du modèle */
    defaults: {
      current_key: ""
    },

    initialize: function() {
      console.log("Characters initialize", this);
    },

    /* les getters et les setters à l'ancienne */
    // ...

  });


  keygame.Collections.Characters = Backbone.Collection.extend({
    model: keygame.Models.Characters,
    initialize: function () {}
  });

  return keygame;
}(KeyGame));
