'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
//const Knex = require('knex');
var mysql = require('mysql');
var app = express();
app.enable('trust proxy');
app.use(express.static('publicFiles'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));

//////////////////////////////////////////////////////////

const config = {
  user: 'root',
  password: 'password',
  database: 'DemonHacks',
  port: 3307
};

if (process.env.NODE_ENV === 'production') {
  config.socketPath = '/cloudsql/demonhacks-1:us-central1:sql-1';
}
var pool = mysql.createPool(config);
var query = module.exports.query = function(query, params) {
		return new Promise((resolve, reject) => {
			pool.getConnection(function (err, con) {
				con.query(query, params, function(err, res, fields){
					if(!err){
						resolve(res);
					}
					reject(err);
				});
			});
		});
	};
	query(`
			CREATE TABLE IF NOT EXISTS users (
				id INT NOT NULL AUTO_INCREMENT,
				username VARCHAR(32) NOT NULL DEFAULT '',
				fname VARCHAR(32) NOT NULL DEFAULT '',
				Lname VARCHAR(32) NOT NULL DEFAULT '',
				password VARCHAR(264) NOT NULL,
				enabled BOOLEAN NOT NULL DEFAULT TRUE,
				PRIMARY KEY (id)
			);
		`,null)
		.then(
			function(){},
			function(err){
				console.log(err)
			}
		);
/*
// Connect to the database
const knex = Knex({
  client: 'mysql',
  connection: config
});
knex.schema.createTable('users',
	(table) => {
		table.uuid('id').primary()
		table.string('name');
		table.string('address');
		table.boolean('type');
	}
)
.then(() => {console.log('Successfully Users');})
.catch((err) => {console.error('Failed Users');}
knex.schema.createTable('dFood',
	(table) => {
		table.uuid('id').primary()
		table.string('foodType');
		table.string('quantity');
	}
)
.then(() => {console.log('Successfully Users');})
.catch((err) => {console.error('Failed Users');}
);
*/
//////////////////////////////////////////////////////////

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});


app.post('/userInfo', (req, res) => {
  //TODO: do stuff with data

  res.status(200);
  res.json({
    "type" : 'userInfo',
    "uuid" : req.headers.uuid,
    "name": req.body.name,
    "address": req.body.address,
    "type": req.body.type
  });


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

/*function checkData(data){
  if(data == "NULL")
    return false
  return true
}*/

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]
