import express from 'express';
import 'babel-polyfill';
import './database/db';
import env from './env';
import routes from './routes';
import bodyParser from 'body-parser';
import authenticated from './middlewares/authenticated';
import async from 'async';


const app = express();
var server = require('http').createServer(app);
// console.log("Server in app.js", server);
// var io = require('socket.io')(8080);
var io = require('socket.io')(server);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static('client'))

app.use('/users', authenticated);
app.use('/users/*', authenticated);
routes(app);
// require('./controller/messagesController')(app, io);

require('./controller/messagesController')(app, io);
server.listen(env.Api_port, () => {


  console.log(`Api listening on port ${env.Api_port}!`);
});