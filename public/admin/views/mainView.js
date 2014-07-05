var KeyGame = (function(keygame) {

  keygame.Views.MainView = Backbone.View.extend({

    el: $("body"),

    json      : {},

    currentView: {},

    // Rappel des terrains
    fields    : [ "marais", "Forêt", "mer", "montagne" ],


    initialize: function() {

      console.log("MainView initialize");
      this.getJson();

    },

    render: function() {

      console.log("MainView render", this.json );

      this.screensView = new KeyGame.Views.ScreensView( { mainview: this } );

      this.specialsscreensView = new KeyGame.Views.SpecialsScreensView( { mainview: this } );

      this.objectsView = new KeyGame.Views.ObjectsView( { mainview: this } );

      this.fieldsView = new KeyGame.Views.FieldsView( { mainview: this } );

      this.keyboardsView = new KeyGame.Views.KeyboardsView( { mainview: this } );

      // La vue par défaut est définie ici :
      this.currentView = this.screensView;

    },

    defineRouter: function () {

      console.log("defineRouter");
      window.router   = new KeyGame.Router.RoutesManager({});

    },


    events : {
      "keydown"     : "keydown"
    },

    //
    // Get et Post JSON
    //

    getJson: function () {
      var that = this;
      $.ajax({
        type: 'GET',
        url: '/data',
        error: function (err) {
          console.log("[Error] Impossible de récupérer le fichier JSON.", err);
        },
        success: function (data) {
          console.table( data.keyboards.qwerty_fr );
          console.table( data.fields );
          console.table( data.screens );
          console.table( data.screens_objects );
          console.table( data.objects );
          that.json = data;
          that.render();
          that.defineRouter();
        }
      });
    },

    saveJson: function () {
      console.log("saveJson", this.json);
      var that = this;
      $.ajax({
        type: 'POST',
        url: '/data',
        data: JSON.stringify( that.json ),
        dataType: 'json',
        contentType: 'application/json',
        error: function (err) {
          console.log("[Error]", err);
        },
        success: function () {
          console.log("POST JSON : Le fichier a bien été mis à jour.");
        }
      });
    },


    //
    // Affichage des vues
    //
    
    showView: function ( view ) {
      console.log("--- showView", view, navView);
      window.navView.currentClass( view );
      this.hideAllViews();
      this.currentView = view;
      $(view.el).show();
    },

    hideAllViews: function () {
      console.log("hideAllViews", this.currentView );
      $(this.currentView.el).hide();
    },


    //
    // Controle du clavier
    //
    
    keydown: function (e) {
      var key = e.which;
      console.log("key", key);
      switch (key) {
        case 39 :
          // Flèche droite
          window.navView.navigateNext();
          break;
        case 37 :
          // Flèche gauche
          window.navView.navigatePrev();
          break;
        case 83 :
          // Ctrl + S
          console.log("save", e.metaKey);
          if ( e.metaKey ) {
            e.preventDefault();
            this.saveJson();
            break;
          }
      }
    }

  });
  return keygame;

}(KeyGame));
