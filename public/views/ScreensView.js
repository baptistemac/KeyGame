var KeyGame = (function(keygame) {

  keygame.Views.ScreensView = Backbone.View.extend({

    el: $("#screens"),

    main: {},


    initialize: function( args ) {
      this.main = args.mainview;
      console.log("ScreensView initialize", this.main);
      this.template = $("#screens_template").html();
    },
    
    render: function(screen) {
      console.log("ScreenView render", screen);
      var renderedContent = Mustache.to_html(this.template, {
        item: screen
      });
      this.$el.html(renderedContent);
    },

    get_type: function (value) {
      console.log(this.main.mapView);
      //return _.where(this.mainView.mapView.screens, {type: value});
    },

    render_screenType:function(value) {
      var screen = this.get_type(value);
      this.render( screen );
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