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
	sql.query('INSERT INTO users (id, name, address, type) VALUE (?, ?, ?, ?);', [uuid, name, address, type]).then(function(result){res.json(result)}, function(err){res.json(err)});
}
let getUser = function(res, uid) {
	sql.query('SELECT * FROM users WHERE id=?;', [uid]).then(function(result){res.json(result)}, function(err){res.json(err)});
}
let postRequests = function(res, uid, foodType, quantity) {
	sql.query('INSERT INTO requestFood (uid, foodType, quantity) VALUE (?, ?, ?);', [uid, foodType, quantity]).then(function(result){res.json(result)}, function(err){res.json(err)});
}

let postDonation = function(res, uid, foodType, quantity) {
	sql.query('INSERT INTO donationFood (uid, foodType, quantity) VALUE (?, ?, ?);', [uid, foodType, quantity]).then(function(result){res.json(result)}, function(err){res.json(err)});
}
let getRequests = function(res) {
	sql.query('SELECT * FROM requestFood as r LEFT JOIN users AS u ON u.id=r.uid AND completed=FALSE;').then(function(result){res.json(result)}, function(err){res.json(err)});
}

let getDonation = function(res) {
	sql.query('SELECT * FROM donationFood as d LEFT JOIN users AS u ON u.id=d.uid AND completed=FALSE;').then(function(result){res.json(result)}, function(err){res.json(err)});
}
let putRequests = function(res, id) {
	sql.query('UPDATE requestFood SET completed=TRUE  WHERE id=?', [id]).then(function(result){res.json(result)}, function(err){res.json(err)});
}

let putDonation = function(res, id) {
	sql.query('UPDATE donationFood SET completed=TRUE  WHERE id=?', [id]).then(function(result){res.json(result)}, function(err){res.json(err)});
}
let donationStatsSum = function(res, uid) {
	sql.query('SELECT foodType, SUM(quantity) AS count FROM donationFood WHERE uid=? GROUP BY foodType;', [uid]).then(function(result){res.json(result)}, function(err){res.json(err)});
}
let requestStatsSum = function(res, uid) {
	sql.query('SELECT foodType, SUM(quantity) AS count FROM requestFood WHERE uid=? GROUP BY foodType;', [uid]).then(function(result){res.json(result)}, function(err){res.json(err)});
}
let donationStatsCount = function(res, uid) {
	sql.query('SELECT foodType, Count(quantity) AS count FROM donationFood WHERE uid=? GROUP BY foodType;', [uid]).then(function(result){res.json(result)}, function(err){res.json(err)});
}
let requestStatsCount = function(res, uid) {
	sql.query('SELECT foodType, Count(quantity) AS count FROM requestFood WHERE uid=? GROUP BY foodType;', [uid]).then(function(result){res.json(result)}, function(err){res.json(err)});
}
app.get('/reset', (req, res) => {
	sql.setup();
	res.send("Reseting DB")
});
app.get('/test', (req, res) => {
	res.send("Doing nothing")
  createUser({json:()=>{}}, 1, "Pasta", "213 Way", true);
  
  postRequests({json:()=>{}}, 1, "Bagles", 123);
  postRequests({json:()=>{}}, 1, "Bagles", 123);
  postRequests({json:()=>{}}, 1, "Not Bagles", 123);
  postRequests({json:()=>{}}, 1, "Bagles", 123);
  postRequests({json:()=>{}}, 1, "Bagles", 123);
  postRequests({json:()=>{}}, 1, "Bagles", 123);
  postRequests({json:()=>{}}, 1, "Bagles", 123);
  postRequests({json:()=>{}}, 1, "Bagles", 123);
  postRequests({json:()=>{}}, 1, "Bagles", 123);
  postRequests({json:()=>{}}, 1, "Bagles", 123);
  
  postDonation({json:()=>{}}, 1, "Bagles", 123);
  postDonation({json:()=>{}}, 1, "Bagles", 123);
  postDonation({json:()=>{}}, 1, "Pasta", 123);
  postDonation({json:()=>{}}, 1, "Bagles", 123);
  postDonation({json:()=>{}}, 1, "Bagles", 123);
  postDonation({json:()=>{}}, 1, "Bagles", 123);
  postDonation({json:()=>{}}, 1, "Bagles", 123);
  postDonation({json:()=>{}}, 1, "Bagles", 123);
  postDonation({json:()=>{}}, 1, "Bagles", 123);
  postDonation({json:()=>{}}, 1, "Bagles", 123);
});

app.get('/api/stats/req/sum', (req, res) => {
	requestStatsSum(res, req.headers.uuid);
});

app.get('/api/stats/don/sum', (req, res) => {
	donationStatsSum(res, req.headers.uuid);
});

app.get('/api/stats/req/count', (req, res) => {
	requestStatsCount(res, req.headers.uuid);
});

app.get('/api/stats/don/count', (req, res) => {
	donationStatsCount(res, req.headers.uuid);
});

app.post('/api/user', (req, res) => {
	createUser(res, req.headers.uuid, req.body.name, req.body.address, req.body.type);
});

app.get('/api/user', (req, res) => {
	getUser(res, req.headers.uuid);
});

app.post('/api/requests', (req, res) => {
	postRequests(res, req.headers.uuid, req.body.foodType, req.body.quantity);
});

app.post('/api/donation', (req, res) => {
	postDonation(res, req.headers.uuid, req.body.foodType, req.body.quantity);
});

app.get('/api/requests', (req, res) => {
	getRequests(res);
});

app.get('/api/donation', (req, res) => {
	getDonation(res);
});

app.put('/api/requests', (req, res) => {
	putRequests(res, req.body.id);
});

app.put('/api/donation', (req, res) => {
	putDonation(res, req.body.id);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
