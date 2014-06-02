var KeyGame = (function(keygame) {

  keygame.Views.ScreensView = Backbone.View.extend({

    el: $("#screens"),
    
    initialize: function() {
      console.log("ScreenView initialize");
      this.template = $("#screens_template").html();
    },
    
    render: function(item) {
      console.log("ScreenView render", item);
      var renderedContent = Mustache.to_html(this.template, {
        item: item
      });

      this.$el.html(renderedContent);
    }

  });

  return keygame;
}(KeyGame));