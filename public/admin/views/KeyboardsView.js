var KeyGame = (function(keygame) {

  keygame.Views.KeyboardsView = Backbone.View.extend({

    el: $("#keyboards"),

    navClassName: "keyboards",

    template  : $('#keyboards_template').html(),

    initialize: function( args ) {
      this.mainview = args.mainview;
      console.log("KeyboardsView initialize");
      this.render();
    },

    render: function() {
      //var test = {}
      //test.screens = _.indexBy(this.json.screens, 'id');
      console.log("KeyboardsView render", this.mainview.json );

      Mustache.parse(this.template);   // optional, speeds up future uses
      var rendered = Mustache.render(this.template, this.mainview.json );
      $(this.el).html(rendered);
    },


    events : {
      //'click .add_keyboard'               : 'addKeyboard',
    },


    addKeyboard: function (e) {
      e.preventDefault();
      console.log("addKeyboard");
      
      var id = this.get_new_id();
      var new_screen = {
        "id"    : id,
        "title"  : "New screen",
        "color" : "lightgrey"
      };
      this.mainview.json.keyboards.push(new_screen);
      this.render(this.json);
      window.scrollTo(0,document.body.scrollHeight);
    }



  });
  return keygame;

}(KeyGame));
