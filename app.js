'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sql = require('./sqlService');
const app = express();

app.enable('trust proxy');
app.use(express.static('publicFiles'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

sql.setup();
let createUser = function(res, uuid,  name, address, type) {
	sql.query('INSERT INTO users (id, name, address, type) VALUE (?, ?, ?, ?);', [uuid, name, address, type]).then(function(result){res.send(JSON.stringify(result))}, function(err){res.send(JSON.stringify(err))});
}
let getUser = function(res, uid) {
	sql.query('SELECT * FROM users WHERE id=?;', [uid]).then(function(result){res.send(JSON.stringify(result))}, function(err){res.send(JSON.stringify(err))});
}

app.post('/api/user', (req, res) => {
	createUser(res, req.headers.uuid, req.body.name, req.body.address, req.body.type);
});

app.get('/api/user', (req, res) => {
	getUser(res, req.headers.uuid);
});

app.post('/donation', (req, res) => {
  //TODO: do stuff with data

  res.status(200);
  res.json({
    "type" : "donation",
    "uuid" : req.headers.uuid,
    "foodType": req.body.foodType,
    "quantity": req.body.quantity
  });

});

app.post('/request', (req, res) => {
  //TODO: do stuff with data

  res.status(200);
  res.json({
    "type" : "request",
    "uuid" : req.headers.uuid,
    "foodType": req.body.foodType,
    "quantity": req.body.quantity
  });

});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
