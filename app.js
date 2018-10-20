'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const Knex = require('knex');
var app = express();

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

// Connect to the database
const knex = Knex({
  client: 'mysql',
  connection: config
});
 knex.schema.createTable('visits',
    (table) => {
      table.increments();
      table.timestamp('timestamp');
      table.string('userIp');
    })
    .then(() => {
      console.log(`Successfully created 'visits' table.`);
      return knex.destroy();
    })
    .catch((err) => {
      console.error(`Failed to create 'visits' table:`, err);
      if (knex) {
        knex.destroy();
      }
    });
//////////////////////////////////////////////////////////

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end(); 
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]
