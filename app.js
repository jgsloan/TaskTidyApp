const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv').config({ path: './config.env' });
const session = require('express-session');
const router = require('./routes/taskroutes');
const path = require('path');

const app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'atopsecretstring1234',
    resave: false,
    saveUninitialized: false,
  })
);
app.use('/', router);

app.set('view engine', 'ejs');

module.exports = app;
