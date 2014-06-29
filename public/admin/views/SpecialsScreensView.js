var KeyGame = (function(keygame) {

  keygame.Views.SpecialsScreensView = Backbone.View.extend({

    el: $("#specials_screens"),

    navClassName: "specials_screens",

    template  : $('#specialsscreens_template').html(),

    initialize: function( args ) {
      this.mainview = args.mainview;
      this.jsonlist = this.mainview.json.screens_specials;
      console.log("SpecialsScreensView initialize", this.jsonlist);
      this.render();
    },

    render: function() {
      //var test = {}
      //test.screens = _.indexBy(this.json.screens, 'id');
      console.log("SpecialsScreensView render", this.mainview.json );

      Mustache.parse(this.template);   // optional, speeds up future uses
      var rendered = Mustache.render(this.template, this.mainview.json );
      $(this.el).html(rendered);

      // Et comme le template ne peux pas afficher les field déjà actif
      // Puisqu'ils sont contenu dans un array et non un objet... (relou)
      // Je le fais ici :
      var that = this;
      _.each( this.jsonlist, function(screen) {
        _.each( screen.fields_id, function(id){
          var name = _.where( that.mainview.json.fields, { "id": id } )[0].name;
          $(that.el).find(".screen[meta-id="+screen.id+"]").find("input[name="+name+"]").attr("checked", true);
        });
      });
    },


    events : {
      'click .add_specialscreen'        : 'add',
      'blur input'                      : 'input_change',
      'keydown p[contenteditable=true]' : 'prevent_enter_in_contenteditable', // Remplace les <div> créé par les retour chariot par des <br>
      'blur p[contenteditable=true]'    : 'contentEditable_change',
      'change .fields input'            : 'input_fields_change',
      'change .others input'            : 'input_others_change',
      'click .remove'                   : 'remove_screen'
    },


    add: function (e) {
      e.preventDefault();
      console.log("addSpecialScreen", this.mainview.json);
      
      var id = this.get_new_id();
      var new_screen = {
        "id"    : id,
        "title"  : "New special screen",
        "color" : "lightgrey"
      };
      this.jsonlist.push(new_screen);
      this.render(this.mainview.json);
      window.scrollTo(0,document.body.scrollHeight);
    },


    get_id_from_json: function (screen) {
      return screen.id;
    },
    get_id_from_html: function (curr) {
      return parseInt($(curr).parents("li").attr("meta-id"));
    },
    get_screen_from_id: function (id) {
      return _.where( this.jsonlist, { "id": id } )[0];
    },

    get_new_id: function () {
      var max = _.max(this.jsonlist, function(item){ return parseInt(item.id); });
      return parseInt(max.id)+1;
    },

    throw_error: function (text) {
      console.log("[Error] "+text);
      return;
    },


    // Fontions appelées au changement d'un item

    contentEditable_change: function (e) {
      console.log("-- contentEditable_change", e.currentTarget);
      var curr    = e.currentTarget; 
      var id      = this.get_id_from_html( curr );
      var name    = $(curr).attr("class");
      var value   = $(curr).html();
      console.log("id", id, this.get_screen_from_id( id ) );
      var screen  = this.get_screen_from_id( id );
      screen[name] = value;
      console.log("contentEditable_change", id, name, value, screen);
    },

    input_fields_change: function (e) {
      console.log("-- input_fields_change ouai", e.currentTarget);
      var curr    = e.currentTarget;
      var id      = this.get_id_from_html( curr );
      var name    = curr.name;
      var screen  = this.get_screen_from_id( id );
      var field_id = parseInt(_.where( this.mainview.json.fields, { name: name })[0].id);
      console.log( curr, id, name, screen, field_id);
      if ( !screen.fields_id ) screen.fields_id = [];
      ( $(curr).is(":checked")) ?  screen.fields_id.push( field_id )  :  screen.fields_id.splice( screen.fields_id.indexOf(field_id) , 1);   
      console.log("screen.fields_id", screen.fields_id);
    },

    input_others_change: function (e) {
      console.log("-- input_others_change", e.currentTarget);
      var curr    = e.currentTarget;
      var id      = this.get_id_from_html( curr );
      var name    = curr.name;
      var value   = curr.value;
      this.update_screen(id, name, value);
      console.log(id, name, value, this.jsonList );
      var screen  = this.get_screen_from_id( id );
      screen[name] = value;
      console.log("screen", screen);
    },

    update_screen: function (id, name, value) {
      switch (name) {
        case "color" :
            $("#specials_screens .special_screen[meta-id="+id+"]").css("background-color", value);
            break;
      }
    },

    remove_screen: function (e) {
      e.preventDefault();
      var curr = e.currentTarget;
      var index = this.get_index( curr );
      if ( confirm("Want to remove screen "+this.jsonList[index].text+" ?") ) {
        this.mainview.json.screens.splice(index, 1);
        var id = this.get_id_from_html(curr);
        $("#specials_screens > [meta-id="+id+"]").slideUp();
        console.log(this.jsonList);
      }
    },

    prevent_enter_in_contenteditable : function (e) {
      // trap the return key being pressed
      if (e.keyCode == 13) {
        // insert 2 br tags (if only one br tag is inserted the cursor won't go to the second line)
        document.execCommand('insertHTML', false, '<br>');
        // prevent the default behaviour of return key pressed
        return false;
      }
    }


  });
  return keygame;

}(KeyGame));
