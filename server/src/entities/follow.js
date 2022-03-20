class Follows{
  constructor(follows) {
    this.follows = follows

		const createFTable = `CREATE TABLE IF NOT EXISTS follows (
    follower VARCHAR(50) NOT NULL,
    followed VARCHAR(50) NOT NULL,
		PRIMARY KEY (follower,followed)
    )`;
    this.follows.exec(createFTable, err => {
     if (err) throw err;
     console.log('User table ready');
    });
  }


	create(follower, followed) {	
		return new Promise((resolve, reject) => {
			const insertF = `INSERT INTO follows
			VALUES ('${follower}', '${followed}')`;
			this.follows.exec(insertF, err => {
				if (err){
					reject(err)
				}else{
					resolve(follower)
				}
			});	
		})
	}

	delete(follower, followed) {	
		return new Promise((resolve, reject) => {
			const insertF = `DELETE FROM follows
      WHERE follower="${follower}" AND followed="${followed}"`;
			this.follows.exec(insertF, err => {
				if (err){
					reject(err)
				}else{
					resolve(this.lastID)
				}
			});
		})
	}

	get(follower, followed) {
		return new Promise((resolve, reject) => {
			const getF = `SELECT ROWID,* FROM follows
			WHERE follower="${follower}" AND followed="${followed}"`;
			this.follows.get(getF, (err, result) => {
				if(err) {
					reject(err);
				} else if(result != undefined) {
					resolve(result);
				} else {
					reject(null);
				}
			});
		});
	}

	async exists(follower, followed) {
    return new Promise((resolve, reject) => {
      const getF = `SELECT ROWID,follower FROM follows WHERE follower="${follower}" AND followed="${followed}"`;
      this.follows.get(getF, (err, row) => {
        if (err){
            reject(err);
        } else {
            resolve(row != undefined);
        }
      });
    });
  }

	getFollower(userid) {
    return new Promise((resolve, reject) => {
      const getF = `SELECT ROWID, * FROM follows WHERE followed="${userid}"`;
      this.follows.all(getF, (err, res) => {
          if(err) {
            //erreur
            reject(err);
          } else {
						console.log(res)
            resolve(res);
          }
      });
    });
  }

	getFollowing(userid){
		return new Promise((resolve, reject) => {
			const getF = `SELECT followed FROM follows WHERE follower="${userid}"`;
			this.follows.all(getF, (err, row) => {
				if(err) {
					//erreur
					reject(err);
				} else {
					resolve(row);
				}
			});
    });
	}
}	
	
exports.default = Follows;