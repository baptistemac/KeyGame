yepnope({
  load: {
    jquery: 'libs/vendors/jquery-1.10.2.js',
    underscore: 'libs/vendors/underscore.js',
    backbone: 'libs/vendors/backbone.js',
    mustache: 'libs/vendors/mustache.js',

    //NameSpace
    keygame: 'KeyGame.js',

    //Models
    posts: 'models/item.js',

    //Controllers
    mainview: 'views/MainView.js',
    screenview: 'views/ScreensView.js',
    mapview: 'views/MapView.js',

    //Routes
    routes: 'routes.js',

    //autre

  },

  callback: {
    "routes": function() {
      console.log("Check out the code at http://github.com/baptiste/keygame");
      console.log("routes loaded ...");
    }
  },

  complete: function() {
    $(function() {

      console.log("Lauching application ...");

      //window.itemscollection = new KeyGame.Collections.Items();

      window.mainView = new KeyGame.Views.MainView({
        //collection: itemscollection
      });

      window.router = new KeyGame.Router.RoutesManager({
        //collection: itemscollection
      });

      Backbone.history.start();

    });

  } // Fin de complete
});