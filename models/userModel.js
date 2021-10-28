module.exports = (_db) => {
  db = _db;
  return PostModel;
};

class PostModel {
  /*------------------------------*/
  /*------------ POST ------------*/
  /*------------------------------*/

  static addPost(req) {
    let sql =
      "INSERT INTO Post (Title, Contents, Author_Id, Category_Id, CreationTimestamp) VALUES (?, ?, ?, ?, NOW())";
    return db
      .query(sql, [
        req.body.title,
        req.body.content,
        req.body.author,
        req.body.category,
      ])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  static editPost(req, id) {
    let sql = "UPDATE Post SET Title = ?, Contents = ? WHERE Id = ?";
    return db
      .query(sql, [req.body.title, req.body.content, id])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  static deletePost(id) {
    let sql = "DELETE FROM Post WHERE Id = ?";
    return db
      .query(sql, [id])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  static getAllPostsWithCatAndAuth() {
    let sql =
      "SELECT Post.Id AS PostId, Author.Id AS AuthorId, Category.Id AS CategoryId, Title, Contents, CreationTimestamp, FirstName, LastName, Category.Name AS Category_Name FROM Post INNER JOIN Author ON Post.Author_Id = Author.Id INNER JOIN Category ON Post.Category_Id = Category.Id ORDER BY CreationTimestamp DESC";
    return db
      .query(sql, [])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  static getOnePost(id) {
    let sql =
      "SELECT Post.Id, Title, Contents, CreationTimestamp, FirstName, LastName FROM Post INNER JOIN Author ON Post.Author_Id = Author.Id WHERE Post.Id = ?";
    return db
      .query(sql, [id])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  /*------------------------------*/
  /*--------- CATEGORIES ---------*/
  /*------------------------------*/

  static addCat(req) {
    let sql = "INSERT INTO Category (Name) VALUES ( ?)";
    return db
      .query(sql, [req.body.name])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  static editCat(req, id) {
    let sql = "UPDATE Category SET Name = ? WHERE Id = ?";
    return db
      .query(sql, [req.body.name, id])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  static deleteCat(id) {
    let sql = "DELETE FROM Category WHERE Id = ?";
    return db
      .query(sql, [id])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  static getAllCat() {
    let sql = "SELECT * FROM Category";
    return db
      .query(sql, [])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  static getOneCat(id) {
    let sql = "SELECT * FROM Category WHERE Id = ?";
    return db
      .query(sql, [id])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  /*------------------------------*/
  /*---------- AUTEURS -----------*/
  /*------------------------------*/

  static addAuth(req) {
    let sql = "INSERT INTO Author (FirstName, LastName) VALUES (?, ?)";
    return db
      .query(sql, [req.body.firstName, req.body.lastName])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  static editAuth(req, id) {
    let sql = "UPDATE Author SET FirstName = ?, LastName = ? WHERE Id = ?";
    return db
      .query(sql, [req.body.firstName, req.body.lastName, id])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  static deleteAuth(id) {
    let sql = "DELETE FROM Author WHERE Id = ?";
    return db
      .query(sql, [id])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  static getAllAuth() {
    let sql = "SELECT * FROM Author";
    return db
      .query(sql, [])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  static getOneAuth(id) {
    let sql = "SELECT * FROM Author WHERE Id = ?";
    return db
      .query(sql, [id])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  /*------------------------------*/
  /*-------- COMMENTAIRES --------*/
  /*------------------------------*/

  static addComment(req, postId) {
    let sql =
      "INSERT INTO Comment (NickName, Contents, CreationTimestamp, Post_Id) VALUES (?, ?, NOW(), ?)";
    return db
      .query(sql, [req.body.nickName, req.body.content, postId])
      .then((response) => {
        // console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  static deleteComments(postId) {
    let sql = "DELETE FROM Comment WHERE Post_Id = ?";
    return db
      .query(sql, [postId])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  static showComments(postId) {
    let sql = "SELECT * FROM Comment WHERE Post_Id = ?";
    return db
      .query(sql, [postId])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        return err;
      });
  }
}
