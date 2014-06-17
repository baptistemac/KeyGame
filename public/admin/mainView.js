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
      this.render();
    },

    render: function() {
      console.log("MainView render", this.json);
      Mustache.parse(this.template);   // optional, speeds up future uses
      var rendered = Mustache.render(this.template, this.json);
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
          that.render( data )
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
    // GROS PROBLÈME : confusion entre id et index...
    get_id: function (curr) {
      console.log("[[[[  GROS PROBLÈME : confusion entre id et index...  ]]]]");
      return $(curr).parents("li").attr("meta-id") || console.log("[Error] Impossible de récupèrer l'id correspondant.");
    },

    get_new_id: function () {
      var max = _.max(this.json.screens, function(item){ return parseInt(item.id); });
      return parseInt(max.id)+1;
    },


    // Fontions appelées au changement d'un item

    contentEditable_change: function (e) {
      console.log("contentEditable_change", e.currentTarget);
      var curr = e.currentTarget; 
      var id = this.get_id( curr );
      var name = "text";
      var value = $(curr).html();
      console.log("contentEditable_change", id, value, this.json.screens[id], name);
      this.json.screens[id][name] = value;
    },

    input_fields_change: function (e) {
      console.log("input_fields_change", e.currentTarget);
      var curr = e.currentTarget;
      var id = this.get_id( curr );
      var name = curr.name;
      var fields = this.json.screens[id]["fields"] || [];
      ( $(curr).is(":checked")) ?  fields.push( name )  :  fields.splice( fields.indexOf(name) , 1);
      //console.log("fields", fields);
      _.uniq(fields);
      this.json.screens[id]["fields"] = fields;
    },

    input_others_change: function (e) {
      console.log("input_others_change", e.currentTarget);
      var curr = e.currentTarget;
      var id = this.get_id( curr );
      var name = curr.name;
      var value = curr.value;
      this.update_screen(id, name, value);
      console.log(id, name, value, this.json.screens[id][name]);
      this.json.screens[id][name] = value;
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
      var _id = this.get_id( curr );
      if ( confirm("Want to remove screen "+_id+" ?") ) {
        var screen = _.findWhere(this.json.screens, {id: _id});
        var odds = _.reject(this.json.screens, function(num){ return num.id==_id; });
        console.log("remove screen", _id, "screen", screen, "odds", odds);
        this.json.screens = odds;
        $("#screens > [meta-id="+_id+"]").slideUp();
      }
    }

  });
  return admin;

}(Admin));
