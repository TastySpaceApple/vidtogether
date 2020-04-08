const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

//var sslRedirect = require('./lib/heroku-ssl-redirect');
//app.use(sslRedirect());

app.use(express.static(path.join(__dirname, 'static')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/messaging', require('./routes/messaging'))

app.listen(3000);

console.log('Started');

module.exports = app;
