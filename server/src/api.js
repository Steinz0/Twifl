const express = require("express");
const Users = require("./entities/users.js");
const Messages = require("./entities/messages.js");
const Follows = require("./entities/follow.js");
const Comments = require("./entities/comments.js");

var user_id = 0;

function init(user,mongo,follow,comment) {
    const router = express.Router();
    // On utilise JSON
    router.use(express.json());
    // simple logger for this router's requests
    // all requests to this router will first hit this middleware
    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });
    const users = new Users.default(user);
    const messages = new Messages.default(mongo);
    const follows = new Follows.default(follow);
    const comments = new Comments.default(comment);


    //User
    router.post("/user/login", async (req, res) => {
        try {
            const { login, password } = req.body;
            // Erreur sur la requête HTTP
            if (!login || !password) {
                res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : login et password nécessaires"
                });
                return;
            }
            if(! await users.exists(login)) {
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return;
            }
            let userid = await users.checkpassword(login, password);
            
            
            if (userid != undefined) {
                // Avec middleware express-session
                req.session.userid = userid.login
                user_id = req.session.userid
                console.log(req.session.id)
                console.log(req.session)

                res.status(201).json({
                    status: 201,
                    message: "Connected !"
                });
            }
            else{
                // Faux login : destruction de la session et erreur
                req.session.destroy((err) => { });
                res.status(403).json({
                    status: 403,
                    message: "login et/ou le mot de passe invalide(s)"
                });
            }
            return;
        }
        catch (e) {
            // Toute autre erreur
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    });

    router.post("/user/logout", async (req, res) => {
        try {
            req.session.destroy((err) => { });
            user_id = -1;
            res.status(200).json({
                status: 200,
                message: "Disconnected"
            });
            return;
        }
        catch (e) {
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    })

    router
        .route("/user/getUser/:user_id")
        .get(async (req, res) => {
        try {
            const user = await users.get(req.params.user_id);
            if (!user){
                res.status(404).send({"status": "error", "msg": "Nothing"});
            }else
                res.send(user);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
        .delete((req, res, next) => res.send(`delete users ${req.params.user_id}`));

    router.get("/user/myUser", async (req, res) => {
        if (user_id === -1){
            res.status(401).send({"status": "error", "msg": `No Authenticated`});
        }
        try {
            const user = await users.get(user_id);
            if (!user){
                res.status(404).send({"status": "error", "msg": "Nothing"});
            }else
                res.send(user);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
    router.put("/user/insertUser", async (req, res) => {
        console.log('ouais',req.body)
        const { login, password, lastname, firstname, email } = req.body;
        if (!login || !password || !lastname || !firstname || !email) {
            res.status(400).send({"status": "error", "msg": "Missing fields"});
        } else if (await users.exists(login)) {
            res.status(500).send({"status": "error", "msg": "Existing user, choose another login"});

        } else {
            users.create(login, password, lastname, firstname, email)
                .then((user_id) => res.status(201).send({ id: user_id }))
                .catch((err) => res.status(500).send(err));
        }
    });

    router.post("/user/getUsersWords", async (req,res) => {
        if (user_id === -1){
            res.status(401).send({"status": "error", "msg": `No Autentificated`});
        }
        const {words} = req.body
        let tabWords = [];
        console.log(words)
        if (!words){
            res.status(400).send({"status": "error", "msg": "Missing fields"});
        }
        try {
            tabWords = words.split(' ')
            
            const getData = await Promise.all(
                tabWords.map(async (element) => {
                const getUsersWords = await users.getWords(element)
                return getUsersWords
                })
            )

            if (getData.length === 0){
                res.status(500).send({"status": "error", "msg": "Error getData full empty"});
            }else
                res.status(200).send(getData.flat());
        } 
        catch (e) {
            res.status(500).send(e);
        }    
    })

    router.post("/user/setPW", async (req,res) => {
        if (user_id === -1){
            res.status(401).send({"status": "error", "msg": `No Autentificated`});
        }
        const {password} = req.body

        if (!(await users.exists(user_id))){
            res.status(500).send({"status": "error", "msg": `User ${user_id} not exist`});
        }
        let matchesNumbers = password.match(/\d+/g)
        let matchesUppercases = password.match(/[A-Z]/)
        let matchesSymbols = (new RegExp(/[^A-Za-z0-9]/)).test(password)
        if (!(matchesNumbers && matchesUppercases && matchesSymbols && password.length >= 10)) {
            res.status(500).send({"status": "error", "msg": `Password low`});
        }
        else{
            try {
                const setPW = await users.setPW(user_id, password)
                res.send(setPW);
            }
            catch (e) {
                res.status(500).send(e);
            }
        }
    })

    router.post("/user/setLastname", async (req,res) => {
        if (user_id === -1){
            res.status(401).send({"status": "error", "msg": `No Autentificated`});
        }
        const {lastname} = req.body

        if (!(await users.exists(user_id))){
            res.status(500).send({"status": "error", "msg": `User ${user_id} not exist`});
        }
        else{
            try {
                const setLastname = await users.setLastname(user_id, lastname)
                res.send(setLastname);
            }
            catch (e) {
                res.status(500).send(e);
            }
        }
    })

    router.post("/user/setFirstname", async (req,res) => {
        if (user_id === -1){
            res.status(401).send({"status": "error", "msg": `No Autentificated`});
        }
        const {firstname} = req.body

        if (!(await users.exists(user_id))){
            res.status(500).send({"status": "error", "msg": `User ${user_id} not exist`});
        }
        else{
            try {
                const setFirstname = await users.setFirstname(user_id, firstname)
                res.send(setFirstname);
            }
            catch (e) {
                res.status(500).send(e);
            }
        }
    })

    //Message
    router.put("/message/insertMsg", async (req, res) => {
        if (user_id === -1){
            res.status(401).send({"status": "error", "msg": `No Autenticated`});
        }
        if (!(await users.exists(user_id))){
            res.status(500).send({"status": "error", "msg": `User ${user_id} not exist`});
        }
        else{
            const msg = messages.insertMsg(user_id, req.body)
            .then(() => res.status(201).send(msg))
            .catch((err) => res.status(500).send(err));
        }
    })
    
    router.get("/message/recupMsg", async (req, res) => {
        try {
            const getMsg = await messages.recupMsg()
            if (!getMsg){
                res.status(204).send({"status": "error", "msg": "getMsg Nothing"});
            }else
                res.status(200).send(getMsg);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })

    router.get("/message/recupMsg/:user_id", async (req, res) => {
        if(!(await users.exists(req.params.user_id))){
            res.status(500).send({"status": "error", "msg": "User not exist"});
        }
        else{
            try {
                const getMsgID = await messages.recupMsgID(req.params.user_id)
                if (!getMsgID){
                    res.status(404).send({"status": "error", "msg": "getMsgID Nothing"});
                }else
                    res.status(200).send(getMsgID);
            }
            catch (e) {
                res.status(500).send(e);
            }
        }
    })

    router.get("/message/recupMsgIDMsg/:_id", async (req, res) => {
        if(!(await messages.exists(req.params._id))){
            res.status(500).send({"status": "error", "msg": "Message doesn't exist"});
        }
        else{
            try {
                const getMsgIDMsg = await messages.recupMsgIDMsg(req.params._id)
                if (!getMsgIDMsg){
                    res.status(404).send({"status": "error", "msg": "getMsgIDMsg Nothing"});
                }else
                    res.send(getMsgIDMsg);
            }
            catch (e) {
                res.status(500).send(e);
            }
        }
    })

    router.get("/message/findMsg", async (req,res) => {
        const {value, dmy} = req.body
        if (!value || !dmy){
            res.status(400).send({"status": "error", "msg": "Missing fields"});
        }
        try {
            const getfindMsg = await messages.findMsgDate(value, dmy)
            if (!getfindMsg){
                res.status(404).send({"status": "error", "msg": "getfindMsg Nothing"});
            }else
                res.send(getfindMsg);
        } 
        catch (e) {
            res.status(500).send(e);
        }    
    })

    router.post("/message/findMsgWords", async (req,res) => {
        const {words} = req.body
        let tabWords = [];

        if (!words){
            res.status(400).send({"status": "error", "msg": "Missing fields"});
        }
        try {
            tabWords = words.split(' ')
            
            const getData = await Promise.all(
                tabWords.map(async (element) => {
                console.log('Element : ', element)
                const getfindMsgWords = await messages.findMsgWords(element)
                console.log('getfindMsgWords : ', getfindMsgWords)
                return getfindMsgWords
                })
            )

            if (getData.length === 0){
                res.status(404).send({"status": "error", "msg": "Error getData full empty"});
            }else
                res.status(200).send(getData.flat());
        } 
        catch (e) {
            res.status(500).send(e);
        }    
    })

    router.post("/message/getMsgFollower", async (req,res) => {
        try {
            const listFollower = await follows.getFollowing(user_id);
            if (!listFollower){
                res.status(200).send({"msg": "Empty"});
            }else{
                const getData = await Promise.all(
                    listFollower.map(async (element) => {
                    const getfindMsgFollower = await messages.recupMsgID(element.followed)
                    console.log('getfindMsgFollower : ',element.followed,' => ', getfindMsgFollower)
                    return getfindMsgFollower
                    })
                )
                console.log('DATA : ',getData)
                if (getData.length === 0){
                    res.status(404).send({"status": "error", "msg": "Error getData full empty"});
                }else
                    res.status(200).send(getData.flat()); 
            }
        }
        catch (e) {
            res.status(500).send(e);
        }
    })

    router.delete("/message/deleteMsg/:_id", async (req, res) => {
        if (user_id === -1){
            res.status(401).send({"status": "error", "msg": `No Autentificated`});
        }
        if(!(await messages.exists(req.params._id))){
            res.status(500).send({"status": "error", "msg": "Message not exist"});
        }
        try {
            const deleteMsg = await messages.deleteMsg(req.params._id, user_id)
            if (deleteMsg == 0){
                res.status(500).send({"status": "error", "msg": "The message was not deleted"});
            }else
                res.status(200).send({"msg": "The message was deleted correctly"});;
        }
        catch (e) {
            res.status(500).send(e);
        }
    })

    router.post("/message/findMsgExactDate", async (req,res) => {
        const {day, month, year} = req.body
        if (!day || !month || !year){
            res.status(400).send({"status": "error", "msg": "Missing fields"});
        }
        try {
            const day_num = Number(day)
            const month_num = Number(month)
            const year_num = Number(year)
            const getfindMsgExactDate = await messages.findMsgExactDate(day_num, month_num, year_num)
            if (!getfindMsgExactDate){
                res.status(404).send({"status": "error", "msg": "getfindMsgExactDate Nothing"});
            }else
                res.send(getfindMsgExactDate);
        } 
        catch (e) {
            res.status(500).send(e);
        }    
    })

    router.post("/message/findMsgLess1Hour", async (req,res) => {
        try {
            const getfindMsgLess1Hour = await messages.findMsgLess1Hour()
            if (!getfindMsgLess1Hour){
                res.status(404).send({"status": "error", "msg": "getfindMsgLess1Hour Nothing"});
            }else
                res.send(getfindMsgLess1Hour);
        } 
        catch (e) {
            res.status(500).send(e);
        }    
    })

    router.post("/message/findMsgLess1Day", async (req,res) => {
        try {
            const getfindMsgLess1Day = await messages.findMsgLess1Day()
            if (!getfindMsgLess1Day){
                res.status(404).send({"status": "error", "msg": "getfindMsgLess1Day Nothing"});
            }else
                res.send(getfindMsgLess1Day);
        } 
        catch (e) {
            res.status(500).send(e);
        }    
    })

    router.post("/message/findMsgLess1Week", async (req,res) => {
        try {
            const getfindMsgLess1Week = await messages.findMsgLess1Week()
            if (!getfindMsgLess1Week){
                res.status(404).send({"status": "error", "msg": "getfindMsgLess1Week Nothing"});
            }else
                res.send(getfindMsgLess1Week);
        } 
        catch (e) {
            res.status(500).send(e);
        }    
    })

    router.post("/message/findMsgLess1Month", async (req,res) => {
        try {
            const getfindMsgLess1Month = await messages.findMsgLess1Month()
            if (!getfindMsgLess1Month){
                res.status(404).send({"status": "error", "msg": "getfindMsgLess1Month Nothing"});
            }else
                res.send(getfindMsgLess1Month);
        } 
        catch (e) {
            res.status(500).send(e);
        }    
    })

    //Follow
    router.put("/follow", async(req,res) => {
        if (user_id === -1){
            res.status(401).send({"status": "error", "msg": `No Autentificated`});
        }
        const {followed} = req.body;
        console.log(followed)
        if (user_id === ''){
            res.status(400).send({"status": "error", "msg": "Not connected"});
        }
        if (followed === user_id){
            res.status(400).send({"status": "error", "msg": "Same than user_id !"});
        }
        if(!followed){
            res.status(400).send({"status": "error", "msg": "Missing fields"});
        }else{
            if (!(await users.exists(followed))){
                res.status(500).send({"status": "error", "msg": "Followed not exist"});
            }
            else{
                try {
                    const putFollow = follows.create(user_id, followed)
                    if (!putFollow){
                        res.status(500).send({"status": "error", "msg": "Relationship was not created"});
                    }else
                        res.status(201).send({"msg": "Relationship create"});;
                }
                catch (e) {
                    res.status(500).send(e);
                }
            }
        }
    })

    router.delete("/follow/delete", async(req, res) => {
        if (user_id === -1){
            res.status(401).send({"status": "error", "msg": `No Autentificated`});
        }
        const { followed } = req.body;
        if(!followed){
            res.status(400).send({"status": "error", "msg": "Missing fields"});
        }else{
            if (!(await users.exists(user_id))){
                res.status(500).send({"status": "error", "msg": "Follower not exist"});
            }
             else if (!(await users.exists(followed))){
                res.status(500).send({"status": "error", "msg": "Followed not exist"});
            }
            else{
                try {
                    const deleteFollow = follows.delete(user_id, followed)
                    if (!deleteFollow){
                        res.status(500).send({"status": "error", "msg": "Relationship was not deleted"});
                    }else
                        res.status(200).send({"msg": "Relationship delete"});;
                }
                catch (e) {
                    res.status(500).send(e);
                }
            }
        }
    })

    router.get("/follow/exists",async (req, res) => {
        const { follower, followed } = req.body;
        if (!(await users.exists(follower))){
            res.status(500).send({"status": "error", "msg": "Follower not exist"});
        }
         else if (!(await users.exists(followed))){
            res.status(500).send({"status": "error", "msg": "Followed not exist"});
        }
        else{
            try{
                follow = await follows.exists(follower, followed);
                if (!follow)
                    res.status(500).send({"status": "error", "msg": "no relation"});
                else
                    res.status(200).send({"msg": "relation exists"});
            }
            catch(e){
                res.status(500).send(e);
            }
        }
    })

    router.get("/follow/getFollower/:user_id", async (req, res) => {
        if(!(await users.exists(req.params.user_id))){
            res.status(500).send({"status": "error", "msg": "User not exist"});
        }
        try {
            const listFollower = await follows.getFollower(req.params.user_id);
            if (!listFollower){
                res.status(200).send({"msg": "Empty"});
            }else
                res.send(listFollower);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })

    router.get("/follow/getFollowing/:user_id", async (req,res) => {
        if(!(await users.exists(req.params.user_id))){
            res.status(500).send({"status": "error", "msg": "User not exist"});
        }
        try {
            const listFollowing = await follows.getFollowing(req.params.user_id);
            console.log(listFollowing)
            if (!listFollowing){
                res.status(200).send({"msg": "Empty"});
            }else
                res.send(listFollowing);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
    
    router.post("/follow/exists", async (req,res) => {
        console.log('REQQ',req.body)
        const {followed} = req.body
        try {
            const exists = await follows.exists(user_id, followed);
            res.send(exists);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })

    //Partie Comment
    router.put("/comment/insertComment", async (req, res) => {
        if (user_id === -1){
            res.status(401).send({"status": "error", "msg": `No Autentificated`});
        }
        const {msg_id, text} = req.body
        if (!msg_id){
            res.status(500).send({"status": "error", "msg": "msg_id not specified"});
        }
        if (!(await messages.exists(msg_id))){
            res.status(500).send({"status": "error", "msg": "Message not exist"});
        }
        else{
            try {
                const comment = comments.insertCmt(user_id, msg_id, text)
                if (!comment){
                    res.status(404).send({"status": "error", "msg": "Error to put comment retry"});
                }else
                    res.status(201).send({"msg": "Comment created"})
            }
            catch(e) {
               res.status(500).send(e);
            }
        }
    })
    router.get("/message/recupMsgIDMsg/:_id", async (req, res) => {
        if(!(await messages.exists(req.params._id))){
            res.status(500).send({"status": "error", "msg": "Message doesn't exist"});
        }
        else{
            try {
                const getMsgIDMsg = await messages.recupMsgIDMsg(req.params._id)
                if (!getMsgIDMsg){
                    res.status(404).send({"status": "error", "msg": "getMsgIDMsg Nothing"});
                }else
                    res.send(getMsgIDMsg);
            }
            catch (e) {
                res.status(500).send(e);
            }
        }
    })
    router.get("/comment/recupComment/:msg_id", async (req, res) => {
        if(!(await messages.exists(req.params.msg_id))){
            res.status(500).send({"status": "error", "msg": "Message doesn't exist"});
        }
        else{
            try {
                const recupComment = await comments.recupCmtID(req.params.msg_id)
                if (!recupComment){
                    res.status(404).send({"status": "error", "msg": "Error recup comment retry"});
                }else{
                    res.send(recupComment)
                }
            }
            catch(e) {
               res.status(500).send(e);
            }
        }
    })

    router.delete("/comment/deleteComment/:_id", async (req, res) => {
        if (user_id === -1){
            res.status(401).send({"status": "error", "msg": `No Autentificated`});
        }
        if(!(await comments.exists(req.params._id))){
            res.status(500).send({"status": "error", "msg": "Comment doesn't exist"});
        }
        try {
            const deleteComment = await comments.deleteCmt(req.params._id, user_id)
            if (deleteComment == 0){
                res.status(500).send({"status": "error", "msg": "The comment was not delete"});
            }else
                res.status(200).send({"msg": "The comment was delete correctly"});;
        }
        catch (e) {
            res.status(500).send(e);
        }
    })

    router.delete("/comment/deleteCommentsByMsgID/:msg_id", async (req, res) => {
        if (user_id === -1){
            res.status(401).send({"status": "error", "msg": `No Autentificated`});
        }
        if(!(await messages.exists(req.params.msg_id))){
            res.status(500).send({"status": "error", "msg": "Message doesn't exist"});
        }
        try {
            const deleteComment = await comments.deleteAllCmtByMsgID(req.params.msg_id, user_id)
            res.status(200).send({"msg": `${deleteComment} comments was delete correctly`});
        }
        catch (e) {
            res.status(500).send(e);
        }
    })

    return router;
}

exports.default = init;