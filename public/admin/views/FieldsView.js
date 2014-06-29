var KeyGame = (function(keygame) {

  keygame.Views.FieldsView = Backbone.View.extend({

    el: $("#fields"),

    navClassName: "fields",

    template  : $('#fields_template').html(),

    initialize: function( args ) {
      this.mainview = args.mainview;
      console.log("FieldsView initialize");
      this.render();
    },

    render: function() {
      //var test = {}
      //test.screens = _.indexBy(this.json.screens, 'id');
      console.log("FieldsView render", this.mainview.json );

      Mustache.parse(this.template);   // optional, speeds up future uses
      var rendered = Mustache.render(this.template, this.mainview.json );
      $(this.el).html(rendered);

      // Et comme le template ne peux pas afficher les field déjà actif
      // Puisqu'ils sont contenu dans un array et non un objet... (relou)
      // Je le fais ici :
      var that = this;
      _.each( this.mainview.json.screens, function(screen) {
        _.each( screen.fields_id, function(id){
          var name = _.where( that.mainview.json.fields, { "id": id } )[0].name;
          $(that.el).find(".screen[meta-id="+screen.id+"]").find("input[name="+name+"]").attr("checked", true);
        });
      });
    },


    events : {
      'click .add_field'               : 'addField',
    },


    addField: function (e) {
      e.preventDefault();
      console.log("addField");
      
      var id = this.get_new_id();
      var new_screen = {
        "id"    : id,
        "title"  : "New screen",
        "color" : "lightgrey"
      };
      this.mainview.json.fields.push(new_screen);
      this.render(this.json);
      window.scrollTo(0,document.body.scrollHeight);
    },



  });
  return keygame;

}(KeyGame));
