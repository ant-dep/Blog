const express = require("express");
const app = express();
//ici on recup tout le dossier pubic (css, fonts, img, js)
app.use(express.static(__dirname + "/public"));
//ici on gère l'affichage des templates front
app.set("views", "./views");
app.set("view engine", "ejs");

//parse les url
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//module pour crypter et comparer par un mot de passe
const bcrypt = require("bcryptjs");
const saltRounds = 10;
let session = require("express-session");
let parseurl = require("parseurl");

const mysql = require("promise-mysql");
// connexion à notre base de donnée grâce au module mySql

//session va gérer la création/vérification du token lors du login
app.use(
  session({
    secret: "love kevin",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  })
);

app.use(function (req, res, next) {
  if (!req.session.user) {
    req.session.user = null;
    req.session.isLogged = false;
  }
  // get the url pathname   pathname est la section de chemin de l'URL, qui vient après l'hôte et avant la requête
  let pathname = parseurl(req).pathname;

  //gestion des routes protégées
  let protectedPath = [
    "/admin",
    "/add_post",
    "/edit_post",
    "/delete_post",
    "/add_auth",
    "/edit_auth",
    "/delete_auth",
    "/add_cat",
    "/edit_cat",
    "/delete_cat",
  ];

  // route uniquement pour l'admin
  let onlyAdmin = ["/admin"];

  //conditions pour les accés aux routes avec restrictions qui redirigent vers le login si il n'est pas connecté ou admin
  //si l'url demandé correspond à un url du tableau protectedPath ou onlyAdmin et que l'utilisateur n'est pas connecté
  if (
    (protectedPath.indexOf(pathname) !== -1 ||
      onlyAdmin.indexOf(pathname) !== -1) &&
    req.session.isLogged === false
  ) {
    //on redirige vers login
    res.redirect("/login");
    //sinon si l'url demandé correspond à un url du tableau onlyAdmin et que le role de l'utilisateur connecté n'est pas admin
  } else if (
    onlyAdmin.indexOf(pathname) !== -1 &&
    req.session.user.role !== "admin"
  ) {
    res.redirect("/");
  } else {
    //sinon on l'autorise a passer à la callback de la route url demandé
    next();
  }
});

// toutes mes routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const adminRoutes = require("./routes/adminRoutes");

// connexion BDD
mysql
  .createConnection({
    host: "db.3wa.io", // on rentre l'hôte l'adresse url où se trouve la bdd
    user: "antoinedepertat", // identifiant BDD
    password: "36317e1f9bfc8b2db04bf42ad6f026a8", // le password
    database: "antoinedepertat_blog", // nom de la base de donnée
  })
  .then((db) => {
    console.log("connecté à la database");
    setInterval(async function () {
      let res = await db.query("SELECT 1");
    }, 10000);

    app.get("/", (req, res, next) => {
      let sql =
        "SELECT Post.Id, Title, Contents, CreationTimestamp, FirstName, LastName FROM Post INNER JOIN Author ON Post.Author_Id = Author.Id";
      console.log(req.session);

      db.query(sql, (err, postsBDD, fields) => {
        console.log(postsBDD);
        res.render("layout", {
          template: "home",
          posts: postsBDD,
          session: req.session,
        });
      });

      userRoutes(app, db);
      postRoutes(app, db);
      adminRoutes(app, db);
    });
  })
  .catch((err) => {
    console.log("Echec de la connection!");
  });

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log("listening port " + PORT + " all is ok");
});
