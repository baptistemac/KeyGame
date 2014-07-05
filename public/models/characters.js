var KeyGame = (function(keygame) {

  keygame.Models.Characters = Backbone.Model.extend({


    /* valeurs par défaut du modèle */
    defaults: {
      name: "",
      key: "",
      tracker: []
    },


    initialize: function() {
      console.log("Characters initialize:", this.attributes.name);
    },

    /* les getters et les setters à l'ancienne */
    // ...

    getKey: function () {
      return this.attributes.key;
    },

    setKey: function ( value ) {
      this.set("key",value);
      this.attributes.tracker.push(value);
      window.keyboard.display_characterKey( this.attributes );
    }

  });

  return keygame;
}(KeyGame));
