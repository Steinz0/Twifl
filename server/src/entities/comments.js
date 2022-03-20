class Comment{
  constructor(comments) {
    this.comments = comments
    this.comments.loadDatabase();
    };

  insertCmt(user_id, msg_id, msg) {
      return new Promise((resolve, reject) => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const min = date.getMinutes();
        const hour = date.getHours();

          this.comments.insert({user_id, msg_id, msg, day, month, year, min, hour}, function(err, result) {
              if (err) {
                  reject(err);
              }else{
                  console.log(result)
                  resolve(result);
              }
          });
      })
  }

  deleteCmt(idCmt, user_id){
      return new Promise((resolve, reject) =>{
          this.comments.remove({_id: idCmt, user_id: user_id}, {}, function(err, numRemoved) {
              if (err) {
                  reject(err);
              }else{
                  resolve(numRemoved);
              }
          });
      })
  }
  //delete tout les comments d'un msg
  deleteAllCmtByMsgID(idMsg, user_id){
    return new Promise((resolve, reject) =>{
        this.comments.remove({msg_id: idMsg, user_id: user_id}, {multi: true}, function(err, numRemoved) {
            if (err) {
                reject(err);
            }else{
                resolve(numRemoved);
            }
        });
    })
}

  recupCmtID(id){
    return new Promise((resolve, reject) => {
        this.comments.find({msg_id: id}).sort({date: 1}).exec( function (err, result) {
            if (err){
                reject(err);
            }
            resolve(result);
        });
    }) 
}
  

  exists(id){
      return new Promise((resolve, reject) => {
          this.comments.find({ _id: id}, function (err, result) {
              if (err){
                  reject(err);
              }
              resolve(result.length != 0);
          });
      })
  }
}

exports.default = Comment;