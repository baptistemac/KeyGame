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
    mainview      :'admin/views/MainView.js',
    navview       :'admin/views/NavView.js',
    mapview       :'views/MapView.js',
    keyboardview  :'views/KeyboardView.js',

    //Routes
    routes:       'admin/routes.js',

    //autre
    functions:    'src/functions.js'

  },

  callback: {},

  complete: function() {
    $(function() {

      console.log("Lauching admin ...");

      window.keyboard = new KeyGame.Views.KeyboardView();
      
      window.mainView = new KeyGame.Views.MainView();
      
      window.nav      = new KeyGame.Views.NavView();
      
      window.router   = new KeyGame.Router.RoutesManager({
      //collection: itemscollection
      });

      Backbone.history.start();

    });

  } // Fin de complete
});