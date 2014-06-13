var KeyGame = (function(keygame) {

  keygame.Views.KeyboardView = Backbone.View.extend({

    el: $("#keyboard"),

    initialize: function() {
      console.log("keyboard initialize");
      this.render();
    },

    render: function() {
      console.log("keyboard render", this);
    },

    events : {
    },

    // Affichage du terrain sur le clavier
    display_field_onKeyboard: function ( args ) {
      var that = this;
      var mapview = args.mapview;
      var fields = mapview.fieldView.fields;
      console.log("display_field_onKeyboard", mapview);

      // Pour chaque terrain
      _.each(fields, function(field, name) {
          console.log(field, name);
          // Pour chaque touche de ce terrain
          _.each(field, function(key, index) {
              that.$el.find(".key-"+key).addClass(name);
          }); 
      }); 
    },

    // Mise à jour de la class .double sur les touches présentes en double
    // qui rende impossible la detection de proximité.
    display_doubleKeys_onKeyboard: function ( args ) {
      var that = this;
      var keys_double = args.keys_double;
      _.each(keys_double, function(key) {
        that.$el.find("> .key-"+key).addClass("double");
      });
    },

    // Mise à jour de la class .press sur la touche appuyée
    display_press_onKeyboard: function (k) {
      this.$el.find("> li").removeClass("press").end().find("> .key-"+k).addClass("press");
    },
    remove_press_onKeyboard: function () {
      this.$el.find("> li").removeClass("press");
    },

    display_bonus: function (k) {
      this.$el.find("> .key-"+k).addClass("bonus1");
    },

    display_princess: function (k) {
      this.$el.find("> .key-"+k).addClass("princesse");
    }

    /*
    $("#keyboard li").each( function (index){
      console.log( index + ": " + $( this ).text() );
      $(this).text( $(this).attr("class") );
    });
    */

  });
  return keygame;
}(KeyGame));