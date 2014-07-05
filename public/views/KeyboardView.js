var KeyGame = (function(keygame) {

  keygame.Views.KeyboardView = Backbone.View.extend({

    el: $("#keyboard"),

    initialize: function() {
      console.log("keyboard initialize");
      this.render();
    },

    render: function() {
      console.log("keyboard render");
    },

    events : {
    },

    /*
    // Affichage du terrain sur le clavier
    display_fields_onKeyboard: function ( args ) {
      var that = this;
      var fields = args.mapview.fields;
      var double_keys = args.mapview.double_keys;
      console.log("display_field_onKeyboard", double_keys);

      // Pour chaque terrain
      _.each( fields, function(field) {
          // Pour chaque touche de ce terrain
          _.each(field.keys, function(key) {
            // On enléve les keys en double. Elles n'auront pas de terrain attribué.
            if ( !_.contains( double_keys, key ) ) {
              that.$el.find(".key-"+key).addClass(field.name);
            }
          }); 
      }); 
    },
    */

    // Affichage de la map sur le clavier
    display_map_onKeyboard : function ( args ) {
      var that = this;
      var mapview = args.mapview;
      var map = mapview.map;
      var double_keys = mapview.double_keys;
      var fields = mapview.fields;
      var objects = mapview.objects;
      console.log("display_objects_onKeyboard", map);

      _.each( map, function(mapItem){

        var curr = that.$el.find(".key-"+mapItem.key);

        // Affichage des touches en double
        var double_key = _.contains( double_keys, mapItem.key ) || false;
        if (double_key) curr.addClass( "double" );

        // Affichage du terrain
        var fieldName = _.where( fields, { "id": mapItem.field_id } )[0].name || "";
        curr.addClass( fieldName );

        // Affichage des objets
        if ( mapItem.objects ) {
          _.each( mapItem.objects, function(o) {
            var objectName = _.where( objects, { "id": o.object_id } )[0].name || "";
            curr.addClass( "object "+objectName+" "+o.html_id );
          });
        }

      });
    },


    // Mise à jour de la class .press sur la touche appuyée
    display_press_onKeyboard: function (k) {
      this.$el.find("> li").removeClass("press").end().find("> .key-"+k).addClass("press");
    },
    remove_press_onKeyboard: function () {
      this.$el.find("> li").removeClass("press");
    },

    display_characterKey: function ( character ) {
      this.$el.find(">").removeClass(character.name).end().find("> .key-"+character.key).addClass(character.name);
    },

    display_bonus: function (k) {
      this.$el.find("> .key-"+k).addClass("bonus1");
    },

    display_princess: function (k) {
      this.$el.find("> .key-"+k).addClass("princesse");
    },

    reset_keyboard: function () {
      // Enlever les objets...
      // Rebuild d'un template du keyboard ?
    },

    position: function () {
      /*
      var keyboard_width = 466;
      var keyboard_height = 160;
      var hero       = $("#keyboard .hero");
      var pos        = hero.position();
      var marginTop  = parseInt( $("#keyboard").css('margin-top') );
      var marginLeft = parseInt( $("#keyboard").css('margin-left') );

      console.log("pos", pos, marginTop,marginLeft);

      var marginTop  = pos.top - (keyboard_height/2);
      var marginLeft = - (keyboard_width/2) + pos.left;
      console.log("margin",marginTop,marginLeft);

      this.$el.css({ "margin-top": marginTop+"px", "margin-left": marginLeft+"px" });
      */
    }
    

  });
  return keygame;
}(KeyGame));