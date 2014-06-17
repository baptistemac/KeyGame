var Admin = (function(admin) {

  admin.Views.ScreenView = Backbone.View.extend({

    el: $("#screen"),
    
    initialize: function( screen ) {
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

  return admin;
}(Admin));