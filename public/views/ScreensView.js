var KeyGame = (function(keygame) {

  keygame.Views.ScreensView = Backbone.View.extend({

    el: $("#screens"),
    
    screens: {},


    initialize: function( args ) {
      this.mainview = args.mainview;
      console.log("ScreensView initialize");
      this.template = $("#screens_template").html();
      this.get_screens();
    },
    
    render: function(screen) {
      console.log("ScreenView render", screen);
      var renderedContent = Mustache.to_html(this.template, {
        item: screen
      });
      this.$el.html(renderedContent);
    },

    get_screens: function () {
      var that = this;
      $.ajax({
        type: 'GET',
        url: '/screens',
        error: function (err) {
          console.log("[Error] Impossible de récupérer le fichier JSON.", err);
        },
        success: function (data) {
          that.screens = data.screens;
          console.table( that.screens );
          that.mainview.render();
        }
      });
    },

    get_type: function (value) {
      return _.where(this.screens, {type: value});
    },

    render_type:function(value) {
      var screen = this.get_type(value);
      this.render( screen );
    },

    define_screen: function (args) {
      console.log("define_screen", args);
      

      //this.render( this.screens.welcome );
    },

    is_in_forceskey: function (k) {
      console.log("check_key");
      if ( _.contains([32], k) ) {
        return true;
      } else {
        return false;
      }
    }

  });

  return keygame;
}(KeyGame));