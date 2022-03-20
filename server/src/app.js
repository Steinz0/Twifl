const path = require('path');
const api = require('./api.js');
const Datastore = require('nedb');

// Détermine le répertoire de base
const basedir = path.normalize(path.dirname(__dirname));
console.debug(`Base directory: ${basedir}`);

express = require('express');
var cors = require('cors');

const app = express()

app.use(cors());
const session = require("express-session");

app.use(session({
    secret: "technoweb rocks"
}));

const sqlite3 = require('sqlite3').verbose();


console.log('Création BDD SQLite3 Follows...');
const follows = new sqlite3.Database('./follows.db', err => {
    if (err) console.log('Problème Follows:', err); 
    else console.log('DB SQLite Follows OK!');
    });

console.log('Création BDD SQLite3 Users...');
const db = new sqlite3.Database('./users.db', err => {
    if (err) console.log('Problème Users:', err); 
    else console.log('DB SQLite Users OK!');
    });

console.log('Création BDD Mango Messages...');
const messages = new Datastore({filename: './messages.db'})
messages.loadDatabase(err => {
    if (err) console.log('Problème Messages:', err); 
    else console.log('BDD Mango Messages OK!');
    });

console.log('Création BDD Mango Comments...');
const comments = new Datastore({filename: './comments.db'})
comments.loadDatabase(err => {
    if (err) console.log('Problème Comments:', err); 
    else console.log('BDD Mango Comments OK!');
    });

app.use('/api', api.default(db,messages,follows,comments));

// Démarre le serveur
app.on('close', () => {});
exports.default = app;
