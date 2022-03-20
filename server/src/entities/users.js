class Users {
  constructor(users) {
    this.users = users

    const createUserTable = `CREATE TABLE IF NOT EXISTS users (
    login VARCHAR(50) NOT NULL PRIMARY KEY,
    lastname VARCHAR(50) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL
    )`;
    this.users.exec(createUserTable, err => {
     if (err) throw err;
     console.log('User table ready');
    });
  }

  create(login, password, lastname, firstname, email) {
    return new Promise((resolve, reject) => {
      const insertUser = `INSERT INTO users
      VALUES ( '${login}', '${lastname}', '${firstname}','${password}', '${email}')`;
      let matchesNumbers = password.match(/\d+/g)
      let matchesUppercases = password.match(/[A-Z]/)
      let matchesSymbols = (new RegExp(/[^A-Za-z0-9]/)).test(password)
      if (matchesNumbers && matchesUppercases && matchesSymbols && password.length >= 10) {
        this.users.exec(insertUser, err => {
          if (err) reject(err);
          else resolve(login);
        });
      }
      else reject('password not strong');
    });
  }
  
  setPW(userid, password) {
    return new Promise((resolve, reject) => {
      const getUserById = `UPDATE users SET password="${password}" WHERE login="${userid}"`;
      this.users.get(getUserById, (err, row) => {
          if(err) {
            //erreur
            reject(err);
          } else {
            resolve(row);
          }
      });
    });
  }

  setLastname(userid, lastname) {
    return new Promise((resolve, reject) => {
      const getUserById = `UPDATE users SET lastname="${lastname}" WHERE login="${userid}"`;
      this.users.get(getUserById, (err, row) => {
          if(err) {
            //erreur
            reject(err);
          } else {
            resolve(row);
          }
      });
    });
  }

  setFirstname(userid, firstname) {
    return new Promise((resolve, reject) => {
      const getUserById = `UPDATE users SET firstname="${firstname}" WHERE login="${userid}"`;
      this.users.get(getUserById, (err, row) => {
          if(err) {
            //erreur
            reject(err);
          } else {
            resolve(row);
          }
      });
    });
  }

  get(userid) {
    return new Promise((resolve, reject) => {
      const getUserById = `SELECT ROWID, * FROM users WHERE login="${userid}"`;
      this.users.get(getUserById, (err, row) => {
          if(err) {
            //erreur
            reject(err);
          } else {
            resolve(row);
          }
      });
    });
  }

  getWords(userid) {
    return new Promise((resolve, reject) => {
      const getUserById = `SELECT login FROM users WHERE login="${userid}" OR lastname="${userid}" OR firstname="${userid}"`;
      console.log(getUserById)
      this.users.all(getUserById, (err, row) => {
          if(err) {
            //erreur
            reject(err);
          } else {
            resolve(row);
          }
      });
    });
  }
  
  async exists(id) {
    return new Promise((resolve, reject) => {
      const getUserByLogin = `SELECT ROWID,login FROM users WHERE login="${id}"`;
      this.users.get(getUserByLogin, (err, row) => {
        if (err){
            reject(err);
        } else {
            resolve(row != undefined);
        }
      });
    });
  }

  checkpassword(login, password) {
    return new Promise((resolve, reject) => {
      const chkLoginPwd = `SELECT ROWID,login FROM users WHERE login="${login}" AND password="${password}"`;
      this.users.get(chkLoginPwd, (err, row) => {
        if (err){
            reject(err);
        } else {
            resolve(row);
        }
      });
    });
  }

}

exports.default = Users;