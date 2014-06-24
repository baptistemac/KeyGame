yepnope({
  load: {
    jquery:       '../libs/vendors/jquery-1.10.2.js',
    underscore:   '../libs/vendors/underscore.js',
    backbone:     '../libs/vendors/backbone.js',
    mustache:     '../libs/vendors/mustache.js',

    mainview:     'MainView.js'
  },

  complete: function() {
    $(function() {

      console.log("Lauching admin ...");

      window.mainview = new Admin.Views.MainView();

    });

  } // Fin de complete
});




