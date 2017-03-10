var config = require('config');

var knex = require('knex')({
    client: 'mysql',
    connection: config.get('mysql')
});

var DB = require('bookshelf')(knex);

var User = DB.Model.extend({
    tableName: 'users',
    hasTimestamps: true,
    idAttribute: 'ID'
});

module.exports = {
    User: User
};