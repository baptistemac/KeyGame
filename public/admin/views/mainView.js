var KeyGame = (function(keygame) {

  keygame.Views.MainView = Backbone.View.extend({

    el: $("body"),

    template  : $('#screens_template').html(),

    json      : {},

    // Rappel des terrains
    fields    : [ "marais", "Forêt", "mer", "montagne" ],


    initialize: function() {
      console.log("MainView initialize");
      this.get_data();
    },

    render: function() {
      //var test = {}
      //test.screens = _.indexBy(this.json.screens, 'id');
      console.log("MainView render", this.json );

      Mustache.parse(this.template);   // optional, speeds up future uses
      var rendered = Mustache.render(this.template, this.json );
      $(this.el).find("#screens").html(rendered);

      // Et comme le template ne peux pas afficher les field déjà actif
      // Puisqu'ils sont contenu dans un array et non un objet... (relou)
      // Je le fais ici :
      var that = this;
      _.each( this.json.screens, function(screen) {
        _.each( screen.fields_id, function(id){
          var name = _.where( that.json.fields, { "id": id } )[0].name;
          $("#screens").find(".screen[meta-id="+screen.id+"]").find("input[name="+name+"]").attr("checked", true);
        });
      });
    },


    events : {
      'click #save'                     : 'saveJson',
      'click #add'                      : 'addScreen',
      'blur input'                      : 'input_change',
      'keydown p[contenteditable=true]' : 'prevent_enter_in_contenteditable', // Remplace les <div> créé par les retour chariot par des <br>
      'blur p[contenteditable=true]'    : 'contentEditable_change',
      'change .fields input'            : 'input_fields_change',
      'change .others input'            : 'input_others_change',
      'click .remove'                   : 'remove_screen'
    },


    // GET JSON
    get_data: function () {
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
          console.table( data.screens_with_objects );
          console.table( data.objects );
          that.json = data;
          that.render();
        }
      });
    },


    saveJson: function (e) {
      e.preventDefault();
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

    addScreen: function (e) {
      e.preventDefault();
      console.log("addScreen");
      
      var id = this.get_new_id();
      var new_screen = {
        "id"    : id,
        "title"  : "New screen",
        "color" : "lightgrey"
      };
      this.json.screens.push(new_screen);
      this.render(this.json);
      window.scrollTo(0,document.body.scrollHeight);
    },


    // Fonctions utiles
    /*
    get_index: function (curr) {
      var _index;
      var _id = $(curr).parents("li").attr("meta-id") || this.throw_error("Impossible de récupèrer l'id correspondant.");
      _.each( this.json.screens, function(element, index){
        console.log("id recherché:", _id, "- each", element, index, element.id);
        if( element.id == _id ) { 
          console.log("trouvé:",_id);
          _index = index;
          return false;
        }
      });
      return _index;
    },
    */
    get_id_from_json: function (screen) {
      return screen.id;
    },
    get_id_from_html: function (curr) {
      return parseInt($(curr).parents("li").attr("meta-id"));
    },
    get_screen_from_id: function (id) {
      return _.where( this.json.screens, { "id": id } )[0];
    },

    get_new_id: function () {
      var max = _.max(this.json.screens, function(item){ return parseInt(item.id); });
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
      console.log("-- input_fields_change", e.currentTarget);
      var curr    = e.currentTarget;
      var id      = this.get_id_from_html( curr );
      var name    = curr.name;
      var screen  = this.get_screen_from_id( id );
      var field_id = parseInt(_.where( this.json.fields, { name: name })[0].id);
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
      console.log(id, name, value, this.json.screens );
      var screen  = this.get_screen_from_id( id );
      screen[name] = value;
      console.log("screen", screen);
    },

    update_screen: function (id, name, value) {
      switch (name) {
        case "color" :
            $("#screens .screen[meta-id="+id+"]").css("background-color", value);
            break;
      }
    },

    remove_screen: function (e) {
      e.preventDefault();
      var curr = e.currentTarget;
      var index = this.get_index( curr );
      if ( confirm("Want to remove screen "+this.json.screens[index].text+" ?") ) {
        this.json.screens.splice(index, 1);
        var id = this.get_id_from_html(curr);
        $("#screens > [meta-id="+id+"]").slideUp();
        console.log(this.json.screens);
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
