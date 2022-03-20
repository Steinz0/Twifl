class Message{
    constructor(messages) {
      this.messages = messages
      this.messages.loadDatabase();
      };

    insertMsg(user_id, msg) {
        return new Promise((resolve, reject) => {
            const date = new Date();
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const min = date.getMinutes();
            const hour = date.getHours();

            this.messages.insert({user_id, msg, day, month, year, min, hour, date}, function(err, result) {
                if (err) {
                    reject(err);
                }else{
                    console.log(result)
                    resolve(result);
                }
            });
        })
    }

    deleteMsg(idMsg, user_id){
        return new Promise((resolve, reject) =>{
            this.messages.remove({_id: idMsg, user_id: user_id}, {}, function(err, numRemoved) {
                if (err) {
                    reject(err);
                }else{
                    resolve(numRemoved);
                }
            });
        })
    }

    recupMsg(){
        return new Promise((resolve, reject) => {
            this.messages.find({}).sort({date: 1}).exec( function (err, result) {
                if (err){
                    reject(err);
                }
                resolve(result.reverse());
            });
        }) 
    }

    recupMsgID(id){
        return new Promise((resolve, reject) => {
            this.messages.find({ user_id: id}).sort({date: 1}).exec(function (err, result) {
                if (err){
                    reject(err);
                }
                resolve(result.reverse());
            });
        })
    }

    recupMsgIDMsg(id){
        return new Promise((resolve, reject) => {
            this.messages.find({ _id: id}).sort({date: 1}).exec(function (err, result) {
                if (err){
                    reject(err);
                }
                resolve(result.reverse());
            });
        })
    }

    findMsgExactDate(day, month, year){
        return new Promise((resolve, reject) => {
            this.messages.find({day: day, month: month, year: year}).sort({date: 1}).exec( function (err, result) {
                if(err){
                    reject(err);
                }
                resolve(result.reverse());
            });
        }) 
    }

    findMsgLess1Hour(){
        let d = new Date();
        console.log(d)
        d.setHours(d.getHours()-1);
        console.log(d.getDay(), d.getMonth(), d.getFullYear(), d.getHours(), d.getMinutes())
        return new Promise((resolve, reject) => {
            this.messages.find({date: {$gte: d}}).sort({date: 1}).exec( function (err, result) {
                if(err){
                    reject(err);
                }
                resolve(result.reverse());
            });
        }) 
    }

    findMsgLess1Day(){
        let d = new Date();
        d.setDate(d.getDate()-1);
        console.log(d)
        return new Promise((resolve, reject) => {
            this.messages.find({date: {$gte: d}}).sort({date: 1}).exec( function (err, result) {
                if(err){
                    reject(err);
                }
                resolve(result.reverse());
            });
        }) 
    }

    findMsgLess1Week(){
        let d = new Date();
        d.setDate(d.getDate()-7);
        return new Promise((resolve, reject) => {
            this.messages.find({date: {$gte: d}}).sort({date: 1}).exec( function (err, result) {
                if(err){
                    reject(err);
                }
                resolve(result.reverse());
            });
        }) 
    }

    findMsgLess1Month(){
        let d = new Date();
        d.setDate(d.getDate()-30);
        return new Promise((resolve, reject) => {
            this.messages.find({date: {$gte: d}}).sort({date: 1}).exec( function (err, result) {
                if(err){
                    reject(err);
                }
                resolve(result.reverse());
            });
        }) 
    }

    findMsgWords(word){
        return new Promise((resolve, reject) => {
            this.messages.find({}).sort({date: 1}).exec( function (err, result) {
                if(err){
                    reject(err);
                }
                resolve(result.reverse().filter(data => data.msg.text.includes(word)))
            });
        })
    }

    exists(msg_id){
        return new Promise((resolve, reject) => {
            this.messages.find({ _id: (msg_id)}, function (err, result) {
                if (err){
                    reject(err);
                }
                resolve(result.length != 0);
            });
        })
    }
}

exports.default = Message;