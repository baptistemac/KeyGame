yepnope({
  load: {
    jquery:       'libs/vendors/jquery-1.10.2.js',
    underscore:   'libs/vendors/underscore.js',
    backbone:     'libs/vendors/backbone.js',
    //mustache:     'libs/vendors/mustache.js',

    //NameSpace
    keygame:      'KeyGame.js',

    //Models
    objets        :'models/objects.js',
    characters    :'models/characters.js',


    //Controllers
    mainview      :'views/MainView.js',
    //screenview    :'views/ScreensView.js',
    mapview       :'views/MapView.js',
    keyboardview  :'views/KeyboardView.js',
    compassview     :'views/CompassView.js',

    //Routes
    routes:       'routes.js',

    // Sound
    soundbuffer:  'src/sound-buffer-loader.js',
    //sound:  'src/sound.js',

    //autre
    functions:    'src/functions.js'

  },

  callback: {},

  complete: function() {
    $(function() {

      console.log("Check out the code at https://github.com/baptistemac/KeyGame");
      console.log("Lauching application ...");

      //window.itemscollection = new KeyGame.Collections.Items();
      
      window.keyboard = new KeyGame.Views.KeyboardView();
      
      window.mainView = new KeyGame.Views.MainView();
      
      //window.sound = new KeyGame.Views.SoundView();

      window.router   = new KeyGame.Router.RoutesManager({
      //collection: itemscollection
      });

      Backbone.history.start();


    });

  } // Fin de complete
});