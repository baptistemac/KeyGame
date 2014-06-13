$(function() {

  console.log("Admin!");

  //var jsonfile = "./screens.json";
  var jsonfile = "../assets/screens/screens.json";
  var template = $('#screens_template').html();
  var json = {};

  // get JSON file
  var jqxhr = $.getJSON( jsonfile, function(data) {
    console.log( "success", data );
    json = data;
    template_render(json);
  }).fail(function() {
    console.log( "[Erreur] Impossible de lire le JSON." );
  });

  // Render template
  function template_render ( json ) {
    Mustache.parse(template);   // optional, speeds up future uses
    var rendered = Mustache.render(template, json);
    $('#screens').html(rendered);
  }

  // Event
  $("#save").click( save );
  $("#add").click( add );

  $("input").blur(function () {
    console.log("blur");
  });

  function save () {
    $.ajax({
      type: 'POST',
      url: '/screens',
      data: json,
      error: function (err) {
        console.log("[Error]", err);
      },
      success: function () {
        console.log("Le JSON  "+jsonfile+"  a bien été mis à jour.");
      }
    });
  }

  function add () {
    var new_screen = {
      "text": "New screen",
      "color": "white"
    };
    json.screens.unshift(new_screen);
    template_render(json);
  }

});