var KeyGame = (function(keygame) {

  keygame.Views.ScreensView = Backbone.View.extend({

    el: $("#screens"),
    
    initialize: function() {
      console.log("ScreenView initialize");
      this.template = $("#screens_template").html();
    },
    
    render: function(item) {
      console.log("ScreenView render", item);
      var renderedContent = Mustache.to_html(this.template, {
        item: item
      });

      this.$el.html(renderedContent);
    },


    screens : {
      'liste' : [

      {type:"", 
      text:"La princesse n'est pas ici.", 
      color:"LightGreen", 
      sound:""},

      {type:"", 
      text:"Tu viens de marcher sur un piège posé par ton rival. </br>Il t'a repéré.",
      color:"Plum",
      sound:""},
      
      {type:"", 
      text:"Tu viens de trouver la boussole à princesse. </br>Suis-la, elle te guidera vers elle.", 
      color:"PaleTurquoise", 
      sound:""},

      {type:"", 
      text:"Le sol n'est pas trés solide ici.</br>Passe ton tour.", 
      color:"Salmon", 
      sound:""},
      
      {type:"", 
      text:"<span class='img' style='background-image: url(assets/img/church.jpg)'></span>Tu attéris devant l'église. </br>Le prêtre te questionne sur le bienfondé de ta quète.",
      answers: [
        "<div class='answer'>Sauver la princesse!<span>Va en <span class='key-style'>V</span></div>",
        "<div class='answer'>Sauter la princesse!<span>Va en <span class='key-style'>T</span></div>"],
      color:"#ecf5fc", 
      sound:""},
      
      {type:"", 
      text:"Tu vas te faire manger", 
      color:"Peru", 
      sound:""}

      ],

      'welcome' :[
        {text:"<span class='title'>Touché Trouvé</span><strong>La princesse s'est perdue sur une des touches de ton clavier. Tu dois la retrouver avant Bart, ton rival de toujours.</strong><span>Rendez-vous sur<span class='key-style space block'>espace</span> pour commencer l'aventure.</span>", 
        color:"CadetBlue", 
        sound:""}],

      'begin' : [
        {text:"Commence donc par explorer les environs.", 
        color:"Silver", 
        sound:""}],

      'findPrincess' : [
        {text:"Tu as trouvé la princesse avant ton rival!",
        pattern: "pattern-diagmonds-light.png",
        color:"Gold", 
        sound:""}],

      'notAccepted' : [
        {text:"Il n'y a rien ici.", 
        color:"LightCoral", 
        sound:""}]

    }

  });

  return keygame;
}(KeyGame));