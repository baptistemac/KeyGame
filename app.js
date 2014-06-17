/*--------------------------------------------
Déclaration des librairies
--------------------------------------------*/
var express = require('express');
var logfmt = require("logfmt");
var fs = require('fs');
var app = module.exports = express();

app.use(logfmt.requestLogger());



/*--------------------------------------------
Paramétrages de fonctionnement d'Express
--------------------------------------------*/
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser('ilovebackbone'));
app.use(express.session({
  secret: "ilovebackbone"
}));


Routes();

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});



function Routes() {
  
  // Défintion des variables utiles
  var jsonfile = "./screens.json";

  // POST screens
  app.post('/screens', function(req, res){
    console.log("post test", req.body);

    var json = req.body;
    var json = JSON.stringify( json );
    //var store = JSON.parse( json );
    fs.writeFile( jsonfile, json, function(err) {
      if (err) throw err;
      console.log('[Great!] Le fichier '+jsonfile+' a bien été mis à jour.');
    });
    res.json(json);

  });

  // GET screens
  // Ce GET N'est pas utile du tout,
  // c'était juste pour comprendre le principe.
  app.get('/screens', function(req, res){
    console.log("get test");
    var data = {};
    fs.readFile( jsonfile, "utf8", function (err, data) {
      if (err) throw err;
      data = JSON.parse(data);
      console.log("data", data);
      res.json(data);
    });
    
  });

}
