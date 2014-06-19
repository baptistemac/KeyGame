var Admin = (function(admin) {

  admin.Views.MainView = Backbone.View.extend({

    el: $("body"),

    template  : $('#screens_template').html(),

    json      : {},

    // Rappel des terrains
    fields    : [ "marais", "Forêt", "mer", "montagne" ],


    initialize: function() {
      console.log("MainView initialize");
      this.getJson();
      //this.render();
    },

    render: function() {
      var test = {}
      test.screens = _.indexBy(this.json.screens, 'id');

      console.log("render", this.json );
      //console.log( test, JSON.stringify( test ) );
      //this.json = test;
      //this.json.screens = _.map(this.json.screens, function(value, index) {
      //    return [value];
      //});


      console.log("MainView render", this.json.screens);
      Mustache.parse(this.template);   // optional, speeds up future uses
      var rendered = Mustache.render(this.template, this.json );
      $(this.el).find("#screens").html(rendered);

      // Et comme le template ne peux pas afficher les field déjà actif
      // Puisqu'ils sont contenu dans un array et non un objet... (relou)
      // Je le fais ici :
      _.each( this.json.screens, function(screen) {
        //console.log("this", screen.id, screen.fields);
        _.each( screen.fields, function(field){
          //console.log(screen.id, field);
          $("#screens").find(".screen[meta-id="+screen.id+"]").find("input[name="+field+"]").attr("checked", true);
        });
      });
    },


    events : {
      'click #save'               : 'saveJson',
      'click #add'                : 'addScreen',
      'blur input'                : 'input_change',
      'blur p.contentEditable'    : 'contentEditable_change',
      'change .fields input'      : 'input_fields_change',
      'change .others input'      : 'input_others_change',
      'click .remove'             : 'remove_screen'

    },


    // GET JSON
    getJson: function () {
      var that = this;
      $.ajax({
        type: 'GET',
        url: '/screens',
        error: function (err) {
          console.log("[Error] Impossible de récupérer le fichier JSON.", err);
        },
        success: function (data) {
          console.log("GET JSON :", data);
          console.table( data.screens );
          that.json = data;
          that.render( data );
        }
      });
    },

    saveJson: function (e) {
      e.preventDefault();
      console.log("saveJson", this.json);
      var that = this;
      $.ajax({
        type: 'POST',
        url: '/screens',
        data: that.json,
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
        "text"  : "New screen",
        "color" : "lightgrey"
      };
      this.json.screens.push(new_screen);
      this.render(this.json);
      window.scrollTo(0,document.body.scrollHeight);
    },


    // Fonctions utiles
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

    get_id_from_json: function (screen) {
      return screen.id;
    },
    get_id_from_html: function (curr) {
      return $(curr).parents("li").attr("meta-id") || this.throw_error("Impossible de récupèrer l'id correspondant.");
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
      var curr = e.currentTarget; 
      var index = this.get_index( curr );
      var name = "text";
      var value = $(curr).html();
      console.log("contentEditable_change", index, value, this.json.screens[index], name);
      this.json.screens[index][name] = value;
    },

    input_fields_change: function (e) {
      console.log("-- input_fields_change", e.currentTarget);
      var curr = e.currentTarget;
      var index = this.get_index( curr );
      var name = curr.name;
      var fields = this.json.screens[index]["fields"] || [];
      ( $(curr).is(":checked")) ?  fields.push( name )  :  fields.splice( fields.indexOf(name) , 1);
      //console.log("fields", fields);
      _.uniq(fields);
      this.json.screens[index]["fields"] = fields;
    },

    input_others_change: function (e) {
      console.log("-- input_others_change", e.currentTarget);
      var curr = e.currentTarget;
      var index = this.get_index( curr );
      var name = curr.name;
      var value = curr.value;
      this.update_screen(index, name, value);
      console.log(index, name, value, this.json.screens[index][name]);
      this.json.screens[index][name] = value;
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
    }

  });
  return admin;

}(Admin));
