yepnope({
  load: {
    jquery:       '../libs/vendors/jquery-1.10.2.js',
    underscore:   '../libs/vendors/underscore.js',
    backbone:     '../libs/vendors/backbone.js',
    mustache:     '../libs/vendors/mustache.js',

    //NameSpace
    keygame:      '../KeyGame.js',

    //Models
    //objets        :'models/objects.js',
    //characters    :'models/characters.js',


    //Controllers
    mainview                :'views/MainView.js',
    navview                 :'views/NavView.js',
    screenssview            :'views/ScreensView.js',
    specialsscreenssview    :'views/SpecialsScreensView.js',
    objectsview             :'views/ObjectsView.js',
    fieldsview              :'views/FieldsView.js',
    keyboardsview           :'views/KeyboardsView.js',

    //mapview       :'views/MapView.js',
    //keyboardview  :'views/KeyboardView.js',

    //Routes
    routes:       'routes.js',

    //autre
    functions:    '../src/functions.js'

  },

  callback: {},

  complete: function() {
    $(function() {

      console.log("Lauching admin ...");
      
      window.mainView = new KeyGame.Views.MainView();
      
      window.navView      = new KeyGame.Views.NavView();

    });

  } // Fin de complete
});