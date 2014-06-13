/*--------------------------------------------
Déclaration des librairies
--------------------------------------------*/
var express = require('express');
var logfmt = require("logfmt");
var nStore = require('nstore');
var app = module.exports = express();

app.use(logfmt.requestLogger());

nStore = nStore.extend(require('nstore/query')());



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


/*--------------------------------------------
Définition des "bases" items & users
--------------------------------------------*/
var items, users;

items = nStore.new("items.db", function() {
  users = nStore.new("users.db", function() {
    /*
      une fois les bases ouvertes, on passe
      en attente de requête http (cf. code de
      la fonction Routes())
      Si les bases n'existent pas,
      elles sont crées automatiquement
    */
    //Routes();
    var port = Number(process.env.PORT || 5000);
    app.listen(port, function() {
      console.log("Listening on " + port);
    });

  });
});






/*======= Authentification =======*/

var connectedUsers = [];

function addUser(user) {
  users.save(null, user, function(err, key) {
    if (err) {
      console.log("Erreur : ", err);
    } else {
      user.id = key;
      console.log(user);
    }
  });
}

function addUsers() {
  addUser({
    email     : "bob@morane.com",
    password  : "backbone",
    isAdmin   : true,
    firstName : "Bob",
    lastName  : "Morane"
  });
  addUser({
    email     : "sam@lepirate.com",
    password  : "underscore",
    isAdmin   : false,
    firstName : "Sam",
    lastName  : "Le Pirate"
  });

  //etc. ...
}

function findUserByMail(email) {
  /*
    Permet de vérifier si un utilisateur est déjà loggé
  */
  return connectedUsers.filter(function(user) {
    return user.email == email;
  })[0];
}

function findUserBySession(sessionID) {
  /*
    Permet de retrouver un utilisateur par son id de session
  */
  return connectedUsers.filter(function(user) {
    return user.sessionID == sessionID;
  })[0];

}

haveToBeAdmin = function(req, res, next) {
  console.log("NEEDS ADMIN RIGHTS");
  if (findUserBySession(req.sessionID)) {
    if (findUserBySession(req.sessionID).isAdmin == true) {
      next();
    } else {
      throw "You have to be administrator";
    }
  } else {
    throw "You have to be connected";
  }
}






function Routes() {
  
  app.get('/test', function(req, res){
    console.log("test", res);
  });

  app.post('/test', function(req, res){
    console.log("test", res);
  });

  app.get('/addusers', function(req, res) {
    addUsers();
    res.json({
      MESSAGE: "Users added."
    });
  });

  app.get('/alreadyauthenticated', function(req, res) {

    var alreadyAuthenticatedUser = findUserBySession(req.sessionID);

    //Si je suis déjà authentifié, renvoyer les informations utilisateur
    if (alreadyAuthenticatedUser) {
      res.json({
        email: alreadyAuthenticatedUser.email,
        firstName: alreadyAuthenticatedUser.firstName,
        lastName: alreadyAuthenticatedUser.lastName,
        isAdmin: alreadyAuthenticatedUser.isAdmin
      });
    } else {
      res.json({});
    }

  });

  app.post('/authenticate', function(req, res) {

    console.log("POST authenticate ", req.body);

    //Je récupère les information de connexion de l'utilisateur
    var user = req.body;

    //est ce que l'email est déjà utilisé ?
    if (findUserByMail(user.email)) {
      res.json({
        infos: "Utilisateur déjà connecté"
      })
    } else { //si l'email n'est pas utilisé
      //Je cherche l'utilisateur dans la base de données
      users.find({
        email: user.email,
        password: user.password
      },

      function(err, results) {
        if (err) {
          res.json({
            error: "Oups, Houson, on a un problème"
          });
        } else {
          
          //J'ai trouvé l'utilisateur
          var key = Object.keys(results)[0],
            authenticatedUser = results[key];

          //Je rajoute l'id de session à l'objet utilisateur

          authenticatedUser.key = key;
          authenticatedUser.sessionID = req.sessionID;

          //Ajouter l'utilisateur authentifié à la liste des utilisateurs connectés
          connectedUsers.push(authenticatedUser);

          //Je renvoie au navigateur les informations de l'utilisateur
          // ... sans le mot de passe bien sûr
          res.json({
            email: authenticatedUser.email,
            firstName: authenticatedUser.firstName,
            lastName: authenticatedUser.lastName,
            isAdmin: authenticatedUser.isAdmin
          });

        }
      });
    }

  });
  
  app.get('/logoff', function(req, res) {

    //Je recherche l'utilisateur courant parmi les utilisateurs connectés
    var alreadyAuthenticatedUser = findUserBySession(req.sessionID);

    if (alreadyAuthenticatedUser) {
      //Je l'ai trouvé, je le supprime de la liste des utilisateurs connectés
      var posInArray = connectedUsers.indexOf(alreadyAuthenticatedUser);
      connectedUsers.splice(posInArray, 1);
      res.json({
        state: "disconnected"
      });
    } else {
      res.json({});
    }

  });

  /*======= Fin des routes "authentification" =======*/


  /*
    Obtenir la liste de tous les posts lorsque
    l'on appelle http://localhost:3000/items
    en mode GET
  */
  app.get('/items', function(req, res) {
    console.log("GET (ALL) : /items");
    items.all(function(err, results) {
      if (err) {
        console.log("Erreur : ", err);
        res.json(err);
      } else {
        var items = [];
        for (var key in results) {
          var item = results[key];
          item.id = key;
          items.push(item);
        }
        res.json(items);
      }
    });
  });

  /*
    Obtenir la liste de tous les items correspondant à un critère
    lorsque l'on appelle http://localhost:3000/items/query/ en
    mode GET avec une requête en paramètre
    ex : query : { "title" : "Mon 1er post"} }
  */
  app.get('/items/query/:query', function(req, res) {
    console.log("GET (QUERY) : /items/query/" + req.params.query);

    items.find(JSON.parse(req.params.query), function(err, results) {
      if (err) {
        console.log("Erreur : ", err);
        res.json(err);
      } else {
        var items = [];
        for (var key in results) {
          var item = results[key];
          item.id = key;
          items.push(item);
        }
        res.json(items);
      }
    });

  });

  /*
    Retrouver un post par sa clé unique lorsque
    l'on appelle http://localhost:3000/items/identifiant_du_post
    en mode GET
  */

  app.get('/items/:id', function(req, res) {
    console.log("GET : /items/" + req.params.id);
    items.get(req.params.id, function(err, item, key) {
      if (err) {
        console.log("Erreur : ", err);
        res.json(err);

      } else {
        item.id = key;
        res.json(item);
      }
    });
  });

  /*
    Créer un nouveau item lorsque
    l'on appelle http://localhost:3000/item
    avec en paramètre l'item au format JSON
    en mode POST
  */
  app.post('/items', function(req, res, next) {
    console.log("POST CREATE ", req.body);

    var d = new Date(),
      model = req.body;
    model.saveDate = (d.valueOf());

    items.save(null, model, function(err, key) {
      if (err) {
        console.log("Erreur : ", err);
        res.json(err);
      } else {
        model.id = key;
        res.json(model);
      }
    });
  });


  /*
    Mettre à jour un item lorsque
    l'on appelle http://localhost:3000/item
    avec en paramètre l'item au format JSON
    en mode PUT
  */
  app.put('/items/:id', function(req, res, next) {
    console.log("PUT UPDATE", req.body, req.params.id);

    var d = new Date(),
      model = req.body;
    model.saveDate = (d.valueOf());

    items.save(req.params.id, model, function(err, key) {
      if (err) {
        console.log("Erreur : ", err);
        res.json(err);
      } else {
        res.json(model);
      }
    });
  });

  /*
    supprimer un item par sa clé unique lorsque
    l'on appelle http://localhost:3000/item/identifiant_du_post
    en mode DELETE
  */
  app.delete('/items/:id', function(req, res, next) {
    console.log("DELETE : /delete/" + req.params.id);

    items.remove(req.params.id, function(err) {
      if (err) {
        console.log("Erreur : ", err);
        res.json(err);
      } else {
        //petit correctif de contournement (bug ds nStore) :
        //ré-ouvrir la base lorsque la suppression a été faite
        items = nStore.new("items.db", function() {
          res.json(req.params.id);
          //Le modèle est vide si on ne trouve rien
        });
      }
    });
  });

}
