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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());
app.use(_express2.default.static('client'));
app.use('/users', _authenticated2.default);
(0, _routes2.default)(app);

app.listen(_env2.default.Api_port, function () {
    console.log('Api listening on port ' + _env2.default.Api_port + '!');
});
//# sourceMappingURL=app.js.map