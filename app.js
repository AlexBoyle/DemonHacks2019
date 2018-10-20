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
let createUser = function(res, name, address, type) {
	sql.query('INSERT INTO users (name, address, type) VALUES (?, ?, ?)', [name, address, type]).then(function(result){}, function(err){console.log(err);});
}
let getUser = function(res) {
	sql.query('SELECT * FROM users').then(function(result){res.send(result)}, function(err){console.log(err);});
}
app.post('/userInfo', (req, res) => {
  //TODO: do stuff with data
	createUser(res, 'Alex', "11111", false);
	getUser(res)
	/*
  res.status(200);
  res.json({
    "type" : 'userInfo',
    "uuid" : req.headers.uuid,
    "name": req.body.name,
    "address": req.body.address,
    "type": req.body.type
  });
	*/

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
