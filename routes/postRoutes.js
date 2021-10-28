module.exports = (app, db) => {
  const postModel = require("../models/postModel")(db);

  //ici on aura toutes nos routes
  app.get("/", async (req, res, next) => {
    let posts = await postModel.getAllPostsWithCatAndAuth();
    if (posts.code) {
      res.json({ status: 500, msg: "Il y'a un problème", result: posts });
    } else {
      //si il y'a un code d'erreur on envoi une réponse d'erreur
      //on fait un render  de notre page post en envoyant nos données
      console.log(posts);
      res.json({ status: 200, posts: posts });
    }
  });

  //une route d'affichage d'un post
  app.get("/Post/:id", async (req, res, next) => {
    //je récup le param d'id
    let id = req.params.id;
    //j'ai besoin de récupérer mon post (appel la fonction du modèle qui nous permet de récupérer l'post dans la bdd) ,AWAIT on stock dans une variable
    let post = await postModel.getOnePost(id);
    //on check si il y'a une err (si il y'a une erreur il va retourner un objet avec .code dans notre variable)
    if (post.code) {
      res.json({
        status: 500,
        msg: "Il y'a un problème",
        result: { post },
      });
    } else {
      let comments = await postModel.showComments(id);
      if (post.code) {
        res.json({
          status: 500,
          msg: "Il y'a un problème",
          result: { post },
        });
      } else {
        console.log(comments);
        //il n'ya pas d'erreur récupération des commentaire de cet post
        //si il y'a un code d'erreur on envoi une réponse d'erreur
        //on fait un render  de notre page post en envoyant nos données
        res.render("layout", {
          template: "post",
          post: post[0],
          comments: comments,
          session: req.session,
        });
      }
    }
  });

  //route post d'ajout de commentaire
  app.post("/add_comment/:id", async (req, res, next) => {
    let id = req.params.id;

    let newCom = await postModel.addComment(req, id);
    if (newCom.code) {
      res.json({ status: 500, msg: "il y a eu un problème !", result: newCom });
    } else {
      res.redirect("/article/" + id);
    }
  });
};
