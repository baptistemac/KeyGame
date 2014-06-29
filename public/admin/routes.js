var KeyGame = (function(keygame) {

  keygame.Router.RoutesManager = Backbone.Router.extend({

    initialize: function(args) {
      Backbone.history.start( { pushState: true } );
    },

    routes: {
      "admin/screens"         : "screens",
      "admin/specials_screens": "specials_screens",
      "admin/objects"         : "objects",
      "admin/fields"          : "fields",
      "admin/keyboards"       : "keyboards",
      "*path"                 : "root"
    },

    root: function() {
      console.log("Routes root");
      // Par défaut, on affiche screens
      this.navigate('admin/screens', true);
    },

    screens : function () {
      console.log("Route screens");
      mainView.showView( mainView.screensView );
    },

    specials_screens : function () {
      console.log("Route specials_screens");
      mainView.showView( mainView.specialsscreensView );
    },

    objects : function () {
      console.log("Route objets");
      mainView.showView( mainView.objectsView );
    },
    
    fields : function () {
      console.log("Route fields");
      mainView.showView( mainView.fieldsView );
    },

    keyboards : function () {
      console.log("Route keyboards");
      mainView.showView( mainView.keyboardsView );
    }


  });
  return keygame;
}(KeyGame));