var KeyGame = (function(keygame) {

  keygame.Views.ObjectsView = Backbone.View.extend({

    el: $("#objects"),

    navClassName: "objects",

    template  : $('#objects_template').html(),

    initialize: function( args ) {
      this.mainview = args.mainview;
      console.log("ObjectsView initialize");
      this.render();
    },

    render: function() {
      //var test = {}
      //test.screens = _.indexBy(this.json.screens, 'id');
      console.log("ObjectsView render", this.mainview.json );

      Mustache.parse(this.template);   // optional, speeds up future uses
      var rendered = Mustache.render(this.template, this.mainview.json );
      $(this.el).html(rendered);
    },
    
    events : {
      'click .add_object'               : 'addObject'
    },


    addObject: function (e) {
      e.preventDefault();
      console.log("addObject");
      
      var id = this.get_new_id();
      var new_screen = {
        "id"    : id,
        "name"  : "New object"
      };
      this.mainview.json.objects.push(new_screen);
      this.render(this.mainview.json);
      window.scrollTo(0,document.body.scrollHeight);
    },

    get_new_id: function () {
      var max = _.max(this.mainview.json.objects, function(item){ return parseInt(item.id); });
      return parseInt(max.id)+1;
    }


  });
  return keygame;

}(KeyGame));
