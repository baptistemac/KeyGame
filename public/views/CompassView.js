var KeyGame = (function(keygame) {

  keygame.Views.CompassView = Backbone.View.extend({

  	el: $(".compass"),

    initialize: function () {
      console.log("initialize CompassView");
    },

    render: function ( compass ) {
      console.log("render CompassView", compass);
      $(this.el).find(".princess").css({ top: compass.princess.top+"px", left: compass.princess.left+"px" })
      .siblings(".circle").text( compass.key+"" );
    },

    update: function ( key ) {
    	console.log("update", key );

    	// On vérifi d'abord si .hero est positionné sur le clavier.
    	// (ce qui n'est pas le cas au tout début).
    	if ( $("#keyboard .hero").length == 0 ) return false;

    	// On calcule la différence de positon (top et left) entre le hero et la princesse
    	var princess_pos = $("#keyboard .princess").position();
    	var hero_pos = $("#keyboard .hero").position();
    	console.log("princess_pos", princess_pos, "hero_pos", hero_pos);

    	var char = this.get_letter(key);

    	var compass = {
    		key: char,
    		princess: {
	    		top: princess_pos.top-hero_pos.top,
	    		left: princess_pos.left-hero_pos.left
	    	}
    	}
    	this.render( compass );
    },

    get_letter: function( key ) {
    	return String.fromCharCode(key);
    }

  });

  return keygame;
}(KeyGame));