var KeyGame = (function(keygame) {

  keygame.Router.RoutesManager = Backbone.Router.extend({

    initialize: function(args) {
      //this.collection = args.collection;
      //console.log("this.collection", this.collection);
    },

    routes: {
      "admin"         : "admin",
      "objects"       : "objects",
      "*path"         : "root",
      "specials_screens": "specials_screens"
    },

    root: function() {
      var that = this;
      console.log("Routes root");
      /*
      this.collection.all().fetch({
        success: function(result) {
         mainView.render(result);
        }
      });
      */
    },

    admin: function() {
      console.log("admin");
      $("h1").html("Hello World !!!");
    },

    objects : function () {
      console.log("Roote objets");
    },

    specials_screens: function (e) {
      this.navigate("admin");
      $("h1").html("Écrans spéciaux");
    }



  });
  return keygame;
}(KeyGame));