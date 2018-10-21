(function() {
	var mysql = require('mysql');
	var sha256 = require('sha256');
	
	const config = {
	connectionLimit : 100,
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
	module.exports.setup = function(){
		query(`DROP TABLE IF EXISTS userRequest;`,null).then(function(){
		query(`DROP TABLE IF EXISTS userDonation;`,null).then(function(){
		query(`DROP TABLE IF EXISTS donationFood;`,null).then(function(){
		query(`DROP TABLE IF EXISTS requestFood;`,null).then(function(){
		query(`DROP TABLE IF EXISTS users;`,null).then(function(){
		query(`
			CREATE TABLE IF NOT EXISTS users (
				id VARCHAR(32) NOT NULL,
				name VARCHAR(32) NOT NULL DEFAULT '',
				address VARCHAR(128) NOT NULL DEFAULT '',
				type BOOLEAN NOT NULL DEFAULT TRUE,
				PRIMARY KEY (id)
			);
			`,null)
		.then(function(){
		
		query(`
			CREATE TABLE IF NOT EXISTS donationFood (
				id INT NOT NULL AUTO_INCREMENT,
				uid VARCHAR(32) NOT NULL,
				foodType VARCHAR(32) NOT NULL DEFAULT '',
				quantity Int NOT NULL DEFAULT 0,
				completed BOOLEAN NOT NULL DEFAULT FALSE,
				PRIMARY KEY (id)
			);
			`,null)
		.then(function(){
		
		query(`
			CREATE TABLE IF NOT EXISTS requestFood (
				id INT NOT NULL AUTO_INCREMENT,
				uid VARCHAR(32) NOT NULL,
				foodType VARCHAR(32) NOT NULL DEFAULT '',
				quantity INT NOT NULL DEFAULT 0,
				completed BOOLEAN NOT NULL DEFAULT FALSE,
				PRIMARY KEY (id)
			);
			`,null)
		.then(function(){
		},function(err){console.log(err)});
		},function(err){console.log(err)});
		},function(err){console.log(err)});
		},function(err){console.log(err)});
		},function(err){console.log(err)});
		},function(err){console.log(err)});
		},function(err){console.log(err)});
		},function(err){console.log(err)});
	}
}());