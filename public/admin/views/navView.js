var KeyGame = (function(keygame) {

  keygame.Views.NavView = Backbone.View.extend({

    el: $("#sidebar"),

    initialize: function() {
      console.log("NavView initialize");
    },

    render: function() {
      console.log("NavView render", this.json );
    },


    events : {
      'click .objects'                     : 'objects'
    },

    objects: function () {
      //window.router.navigate("objects");
      $("h1").html("Objects");
    }

  });
  return keygame;

}(KeyGame));
