'use strict';

require('knex')._db = require('knex')({
  client: 'pg',
  connection: process.env.HEROKU_POSTGRESQL_CYAN_URL+'?ssl=true'
});