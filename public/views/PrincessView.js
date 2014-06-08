var KeyGame = (function(keygame) {

  keygame.Views.PrincessView = Backbone.View.extend({

    current_key : "",
    
    initialize: function (args) {
        this.mainview = args.parent;
        console.log("initialize PrincessView");
    },

    setPrincesseKey : function () {
        console.log("setPrincesseKey");
        var keys_available = this.mainview.mapView.keys_available;        
        this.current_key = keys_available[Math.floor(Math.random() * keys_available.length)];
        window.keyboard.display_princess(this.current_key);
        console.log("setPrincesseKey current_key", this.current_key);
    }

  });

  return keygame;
}(KeyGame));