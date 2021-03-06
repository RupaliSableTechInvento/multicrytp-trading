'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

require('babel-polyfill');

require('./database/db');

var _env = require('./env');

var _env2 = _interopRequireDefault(_env);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _authenticated = require('./middlewares/authenticated');

var _authenticated2 = _interopRequireDefault(_authenticated);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = require('http').createServer(app);
// console.log("Server in app.js", server);
// var io = require('socket.io')(8080);
var io = require('socket.io')(server);
app.use(_bodyParser2.default.urlencoded({
  extended: true
}));
app.use(_bodyParser2.default.json());
app.use(_express2.default.static('client'));

app.use('/users', _authenticated2.default);
app.use('/users/*', _authenticated2.default);
(0, _routes2.default)(app);
// require('./controller/messagesController')(app, io);

require('./controller/messagesController')(app, io);
server.listen(_env2.default.Api_port, function () {

  console.log('Api listening on port ' + _env2.default.Api_port + '!');
});
//# sourceMappingURL=app.js.map