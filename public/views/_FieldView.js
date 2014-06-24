var KeyGame = (function(keygame) {

  keygame.Views.FieldView = Backbone.View.extend({

    // Définition de l'environnement/du terrain
    fields: {
      "marais"    : [ 27,   
      				191,49,50,51,52,
      				9,81,87,69,82,
      				20,65,83,68,70,71,
      				16,192,90,88,
      				17,18,91 ],
      "foret"     : [ 				53,54,55,56,
      								84,89,85,73,
      								72,74,75,
      								67,86,66,78,
      								32,93,18 ],
      "mer"       : [ 							57,48,189,
      											79,80,
      											76,186,
      											77,188
      											],
      "montagne"  : [ 										187,8,
      														219,221,
      														222,220,13,
      														190,191,16,
      														37,38,39,40 ],
    },
    
    initialize: function (args) {
        this.mainview = args.parent;
        console.log("initialize FieldView");
    }

  });

  return keygame;
}(KeyGame));