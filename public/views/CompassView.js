var KeyGame = (function(keygame) {

  keygame.Views.CompassView = Backbone.View.extend({

  	el: $(".compass"),



    initialize: function () {
      console.log("initialize CompassView");
      this.template = $("#compass_template").html();
    },

    build: function( args ) {
    	this.mapview = args.mapview;
    	console.log("build CompassView", this.mapview.objets);

    	var renderedContent = Mustache.to_html(this.template, {
			objets : [
			{
				id: 1,
				index: 0,
				name: "test"
			},
			{
				id: 1,
				index: 1,
				name: "test"
			},
			{
				id: 2,
				index: 0,
				name: "yo"
			}
			]
    	});
    	this.$el.html(renderedContent);

    },

    render: function ( compass ) {
      console.log("render CompassView", compass);
      $(this.el).find(".princess").css({ top: compass.princess.top+"px", left: compass.princess.left+"px" })
      .siblings(".circle").text( compass.key+"" );
      
      //_.each( objets, )
      //.end().find("#object1-0").css({ top: compass.princess.top+"px", left: compass.princess.left+"px" })

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
    	console.log("char", char, key);

    	var compass = {
    		key: char,
    		princess: {
	    		top: princess_pos.top-hero_pos.top,
	    		left: princess_pos.left-hero_pos.left
	    	},
	    	objets : [
	    		{
	    			id: "objet1-0",
	    			top: princess_pos.top-hero_pos.top,
	    			left: princess_pos.left-hero_pos.left
	    		}
	    	]
    	}

    	// Update des objets
    	//_.each( this.mapview.map,  )

    	this.render( compass );
    },

    get_letter: function( key ) {
    	return String.fromCharCode(key);
    }

  });

  return keygame;
}(KeyGame));