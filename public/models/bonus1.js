var KeyGame = (function(keygame) {

  keygame.Models.Bonus1 = Backbone.Model.extend({


    // Bonus 1 = Chapeau d'invisibilité

    //urlRoot: "/bonus1",

    /* valeurs par défaut du modèle */
    defaults: {
      current_key: ""
    },

    initialize: function( args ) {
      var that = this;

      // Positionnement de l'objet
      var mapview = args.mapview;
      var random_key = args.mapview.keys_available[ Math.floor( Math.random() * args.mapview.keys_available.length ) ];
      this.setKey(random_key);

      this.on("change:message", function() {
        console.log("le message a changé :", this.get("message"));
      });
      this.on("change:read", function() {
        console.log("le read a changé :", this.get("read"));
        that.set({
          read: this.getRead()
        })
      });
    },

    /* les getters et les setters à l'ancienne */
    setKey: function (key) {
      this.set("current_key", key);
      window.keyboard.display_bonus(key);
    },
    getKey: function() {
      return this.get("current_key");
    }

  });


  keygame.Collections.Items = Backbone.Collection.extend({
    model: keygame.Models.Bonus1,
    initialize: function () {}
  });

  return keygame;
}(KeyGame));
