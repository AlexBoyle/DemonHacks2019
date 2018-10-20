(function() {
	var mysql = require('mysql');
	var sha256 = require('sha256');
	var pool = mysql.createPool({
		connectionLimit : 20,
		host: '127.0.0.1',
		socketPath:'',
		user: 'root',
		password: 'password',
		database : 'DemonHacks',
		port:3306
	});

	var query = module.exports.query = function(query, params) {
		return new Promise((resolve, reject) => {
			pool.getConnection(function (err, con) {
				console.log(':');
				console.log(err);
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
	}
}());