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
    screenview    :'views/ScreensView.js',
    mapview       :'views/MapView.js',
    keyboardview  :'views/KeyboardView.js',
    //fieldview     :'views/FieldView.js',

    //Routes
    routes:       'routes.js',

    //autre
    functions:    'src/functions.js'

  },

  callback: {},

  complete: function() {
    $(function() {

      console.log("Lauching admin ...");

      window.keyboard = new KeyGame.Views.KeyboardView();

      window.mainView = new KeyGame.Views.MainView();

      window.router = new KeyGame.Router.RoutesManager({
        //collection: itemscollection
      });

    });

  } // Fin de complete
});