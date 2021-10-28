const bcrypt = require("bcryptjs");
const saltRounds = 10;

module.exports = (app, db) => {
  const userModel = require("../models/userModel")(db);

  //##########  REGISTER  ########## //
  app.get("/register", async (req, res, next) => {
    res.render("layout", {
      template: "register",
      session: req.session,
    });
  });
  app.post("/register", async (req, res, next) => {
    let isAlreadyUsed = await userModel.getUserByEmail(req.body.email);
    if (isAlreadyUsed.length === 0) {
      let register = await userModel.saveOneUser(req);
      if (register.code) {
        res.render("layout", {
          template: "register",
          status: 500,
          msg: "il y a eu un problème !",
          result: register,
          session: req.session,
        });
      } else {
        res.redirect("/");
      }
    } else {
      return "Email déjà utilisé";
    }
  });

  //##########  LOGIN  ########## //
  app.get("/login", async (req, res, next) => {
    res.render("layout", {
      template: "login",
      error: null,
      session: req.session,
    });
  });

  app.post("/login", async (req, res, next) => {
    let user = await userModel.getUserByEmail(req.body.email);

    if (user.length === 0) {
      res.render("layout", {
        template: "login",
        error: "Email inconnu",
        session: req.session,
      });
    } else {
      //si on trouve un mail on compare les mots de passe
      bcrypt
        .compare(req.body.password, user[0].Password)
        .then((same) => {
          console.log("SAME", same);
          if (same) {
            req.session.user = {
              firstName: user[0].FirstName,
              lastName: user[0].LastName,
              email: user[0].Email,
              role: user[0].Role,
            };

            req.session.isLogged = true;
            res.redirect("/");
          } else {
            //sinon on envoie l'erreur mauvais mot de passe
            res.render("layout", {
              template: "login",
              error: "Mot de passe incorrect",
              session: req.session,
            });
          }
        })
        .catch((err) => console.log(err));
    }
  });

  //une route get de logout
  app.get("/logout", async (req, res, next) => {
    req.session.destroy((err) => {
      // cannot access session here
      res.redirect("/");
    });
  });
};
