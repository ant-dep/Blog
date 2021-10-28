const bcrypt = require("bcryptjs");
const saltRounds = 10;

module.exports = (app, db) => {
  const postModel = require("../models/postModel")(db);
  const userModel = require("../models/userModel")(db);

  //ici on aura toutes nos routes
  //route get d'affichage d'admin (on devra récup les posts, les autheurs, les catégories)
  app.get("/admin", async (req, res, next) => {
    let articles = await postModel.getAllPostsWithCatAndAuth();
    if (articles.code) {
      res.json({
        status: 500,
        msg: "il y a eu un problème !",
        result: articles,
      });
    } else {
      let authors = await postModel.getAllAuth();
      if (authors.code) {
        res.json({
          status: 500,
          msg: "il y a eu un problème !",
          result: authors,
        });
      } else {
        let categories = await postModel.getAllCat();
        if (categories.code) {
          res.json({
            status: 500,
            msg: "il y a eu un problème !",
            result: categories,
          });
        }

        res.render("layout", {
          template: "admin",
          posts: articles,
          authors: authors,
          categories: categories,
          session: req.session,
        });
      }
    }
  });

  /*------------------------------*/
  /*------------ POST ------------*/
  /*------------------------------*/
  //route get d'ajout d'un post
  app.get("/add_post", async (req, res, next) => {
    let authors = await postModel.getAllAuth();
    if (authors.code) {
      res.json({
        status: 500,
        msg: "il y a eu un problème !",
        result: authors,
      });
    } else {
      let categories = await postModel.getAllCat();
      if (categories.code) {
        res.json({
          status: 500,
          msg: "il y a eu un problème !",
          result: categories,
        });
      }

      res.render("layout", {
        template: "add_post",
        authors: authors,
        categories: categories,
        session: req.session,
      });
    }
  });

  //route post d'ajout d'un post
  app.post("/add_post", async (req, res, next) => {
    let newPost = await postModel.addPost(req);
    if (newPost.code) {
      res.json({
        status: 500,
        msg: "il y a eu un problème !",
        result: newPost,
      });
    }

    res.redirect("/admin");
  });

  //route get d'édition d'un post
  app.get("/edit_post/:id", async (req, res, next) => {
    let id = req.params.id;
    let oldPost = await postModel.getOnePost(id);
    if (oldPost.code) {
      res.json({
        status: 500,
        msg: "il y a eu un problème !",
        result: oldPost,
      });
    }

    res.render("layout", {
      template: "edit_post",
      post: oldPost[0],
      session: req.session,
    });
  });

  //route post (ou put) d'édition d'un post
  app.post("/edit_post/:id", async (req, res, next) => {
    let id = req.params.id;
    let changePost = await postModel.editPost(req, id);
    if (changePost.code) {
      res.json({
        status: 500,
        msg: "il y a eu un problème !",
        result: changePost,
      });
    }
    res.redirect("/admin");
  });

  //route get (ou delete) de suppression d'un post 2 requètes, 1: suppression du post, 2: suppression des commentaires de ce post
  app.get("/delete_post/:id", async (req, res, next) => {
    let id = req.params.id;
    let post = await postModel.deletePost(id);
    if (post.code) {
      res.json({ status: 500, msg: "il y a eu un problème !", result: post });
    } else {
      let comments = await postModel.deleteComments(id);
      if (comments.code) {
        res.json({
          status: 500,
          msg: "il y a eu un problème !",
          result: comments,
        });
      }

      res.redirect("/admin");
    }
  });

  /*------------------------------*/
  /*--------- CATEGORIES ---------*/
  /*------------------------------*/

  //route get d'ajout d'une catégorie
  app.get("/add_cat", async (req, res, next) => {
    res.render("layout", { template: "add_cat", session: req.session });
  });

  //route post d'ajout d'une catégorie
  app.post("/add_cat", async (req, res, next) => {
    let newCat = await postModel.addCat(req);
    if (newCat.code) {
      res.json({ status: 500, msg: "il y a eu un problème !", result: newCat });
    }
    res.redirect("/admin");
  });

  //route get d'edition d'une catégorie
  app.get("/edit_cat/:id", async (req, res, next) => {
    let id = req.params.id;

    let category = await postModel.getOneCat(id);
    if (category.code) {
      res.json({
        status: 500,
        msg: "il y a eu un problème !",
        result: category,
      });
    }
    res.render("layout", {
      template: "edit_cat",
      category: category[0],
      session: req.session,
    });
  });

  //route post (ou put) d'édition d'une catégorie
  app.post("/edit_cat/:id", async (req, res, next) => {
    let id = req.params.id;
    let changeCat = await postModel.editCat(req, id);
    if (changeCat.code) {
      res.json({
        status: 500,
        msg: "il y a eu un problème !",
        result: changeCat,
      });
    }
    res.redirect("/admin");
  });

  //route get (ou delete) de suppression d'une catégorie
  app.get("/delete_cat/:id", async (req, res, next) => {
    let id = req.params.id;
    let deleteCat = await postModel.deleteCat(id);
    if (deleteCat.code) {
      res.json({
        status: 500,
        msg: "il y a eu un problème !",
        result: deleteCat,
      });
    }
    res.redirect("/admin");
  });

  /*------------------------------*/
  /*----------- AUTEURS ----------*/
  /*------------------------------*/

  //route get d'ajout d'un auteur
  app.get("/add_auth", async (req, res, next) => {
    res.render("layout", { template: "add_auth", session: req.session });
  });

  //route post d'ajout d'un auteur
  app.post("/add_auth", async (req, res, next) => {
    let newAuth = await postModel.addAuth(req);
    if (newAuth.code) {
      res.json({
        status: 500,
        msg: "il y a eu un problème !",
        result: newAuth,
      });
    }
    res.redirect("/admin");
  });

  //route get d'edition d'un auteur
  app.get("/edit_auth/:id", async (req, res, next) => {
    let id = req.params.id;
    let getAuth = await postModel.getOneAuth(id);
    if (getAuth.code) {
      res.json({
        status: 500,
        msg: "il y a eu un problème !",
        result: getAuth,
      });
    }
    res.render("layout", {
      template: "edit_auth",
      author: getAuth[0],
      session: req.session,
    });
  });

  //route post (ou put) d'édition d'un auteur
  app.post("/edit_auth/:id", async (req, res, next) => {
    let id = req.params.id;
    let changeAuth = await postModel.editAuth(req, id);
    if (changeAuth.code) {
      res.json({
        status: 500,
        msg: "il y a eu un problème !",
        result: changeAuth,
      });
    }
    res.redirect("/admin");
  });

  //route get (ou delete) de suppression d'un auteur
  app.get("/delete_auth/:id", async (req, res, next) => {
    let id = req.params.id;
    let deleteOne = await postModel.deleteAuth(id);
    if (deleteOne.code) {
      res.json({
        status: 500,
        msg: "il y a eu un problème !",
        result: deleteOne,
      });
    }
    res.redirect("/admin");
  });
};
