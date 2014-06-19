var KeyGame = (function(keygame) {

  keygame.Models.Item = Backbone.Model.extend({

    urlRoot: "/items",

    /* valeurs par défaut du modèle */
    defaults: {
      context: "welcome",
      text: "Hi guys",
      color: "#00FF00"
    },

    initialize: function() {
      var that = this;
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
    getColor: function() {
      return this.get("color");
    },
    setTColor: function(value) {
      this.set("color", value);
    }
  });


  keygame.Collections.Items = Backbone.Collection.extend({
    model: keygame.Models.Item,
    initialize: function () { // Fontion utile pour activer la variable _order_by_id
      this.order_by = "type";
    },
    comparator: function(model) {
        console.log("comparator", model);
        if (this.order_by=="type") {
            return model.get("type");
        } else if (this.order_by=="title") {
            return model.get("title");
        }
        //return -(new Date(model.get("date")).getTime());
    },
    all: function() {
      this.url = "/items";
      return this;
    },
    query: function(query) {
      this.url = "/items/query/" + query;
      return this;
    }
  });

  return keygame;
}(KeyGame));
