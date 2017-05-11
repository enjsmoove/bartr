const path = require('path');
const express = require('express');
const expressSession = require('express-session');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.header("Access-Control-Allow-Methods", 'GET, POST, PUT ,DELETE');
    next();
  });
}

app.use(morgan());
// app.use(expressSession({secret: 'bigboost'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, '../client/static')));

const router = require('./router');

app.use('/', router);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  } else {
    console.log(err)
    res.status(500).end('error unknown')
  }
});

app.set('port', (process.env.PORT));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
