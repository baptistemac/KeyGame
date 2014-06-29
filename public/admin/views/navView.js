var KeyGame = (function(keygame) {

  keygame.Views.NavView = Backbone.View.extend({

    el: $("#nav"),

    initialize: function() {
      console.log("NavView initialize");
    },

    render: function() {
      console.log("NavView render", this.json );
    },


    events : {
      'click li>a'                          : 'navigate',
      'click #save'                         : 'saveJson'
    },

    navigate: function (e) {
      e.preventDefault();
      var href = $(e.currentTarget).attr("href");
      console.log("navigate", href);
      window.router.navigate('admin/'+href, true);
    },

    navigateNext: function () {
      
      // Check si le cursor est dans un input text ou un contenteditable
      if ( this.is_cursor_in_input() ) return false;

      var currentNav = mainView.currentView.navClassName;
      console.log("navigateNext", currentNav );
      if ( $(this.el).find(">ul >li."+currentNav).next().length ) {
        $(this.el).find(">ul >li."+currentNav).next().find("a").click();
      } else {
        $(this.el).find(">ul >li:first").find("a").click();
      }
    },

    navigatePrev: function () {

      // Check si le cursor est dans un input text ou un contenteditable
      if ( this.is_cursor_in_input() ) return false;

      var currentNav = mainView.currentView.navClassName;
      console.log("navigatePrev", currentNav );
      if ( $(this.el).find(">ul >li."+currentNav).prev().length ) {
        $(this.el).find(">ul >li."+currentNav).prev().find("a").click();
      } else {
        $(this.el).find(">ul >li:last").find("a").click();
      }
    },

    is_cursor_in_input: function () {
      //console.log("is_cursor_in_input", $(':focus').length);
      return $(':focus').length;
    },

    saveJson: function (e) {
      console.log("saveJson");
      e.preventDefault();
      window.mainView.saveJson();
    },

    currentClass: function ( currentView ) {
      $(this.el).find(">ul").find(">li").removeClass("current")
      .end().find("."+currentView.navClassName).addClass("current");
    }

  });
  return keygame;

}(KeyGame));
