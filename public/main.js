yepnope({
  load: {
    jquery:       'libs/vendors/jquery-1.10.2.js',
    underscore:   'libs/vendors/underscore.js',
    backbone:     'libs/vendors/backbone.js',
    mustache:     'libs/vendors/mustache.js',

    //NameSpace
    keygame:      'KeyGame.js',

    //Models
    objets        :'models/objects.js',
    characters    :'models/characters.js',


    //Controllers
    mainview      :'views/MainView.js',
    screenview    :'views/ScreensView.js',
    mapview       :'views/MapView.js',
    //princessview  :'views/PrincessView.js',
    //rivalview     :'views/RivalView.js',
    keyboardview  :'views/KeyboardView.js',
    fieldview     :'views/FieldView.js',
    //heroView      :'views/HeroView.js',

    //Routes
    routes:       'routes.js',

    //autre
    functions:    'src/functions.js'

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

      window.keyboard = new KeyGame.Views.KeyboardView();

      window.mainView = new KeyGame.Views.MainView();

      window.router = new KeyGame.Router.RoutesManager({
        //collection: itemscollection
      });

      Backbone.history.start();

    });

  } // Fin de complete
});