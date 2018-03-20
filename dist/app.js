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

var BlockIo = require('block_io');
var version = 2; // API version
var block_io = new BlockIo('e1e0-ea6a-d686-dd2e', 'Abhi1Abhi1Abhi1', version);
// block_io.get_new_address({'label1': 'shibe1'}, console.log);
// let param1=null,param2=null;
// block_io.get_my_addresses({},function (data,a) {
// var addr = a;
// console.log(addr);
// for (var i = 0; i < addr.data.addresses.length; i++) {
//    console.log(addr.data.addresses[i]);
// }
// });
// block_io.get_current_price({}, console.log);
// block_io.get_my_archived_addresses({}, console.log);
// block_io.archive_address({'addresses': '2NFqxPiKTA13iZpyt3jt5ftPz5VbFuVu5eU'},console.log);
// block_io.get_my_archived_addresses({}, console.log);
block_io.get_network_fee_estimate({ 'amounts': '0', 'to_addresses': '2NFqxPiKTA13iZpyt3jt5ftPz5VbFuVu5eU' }, console.log);
// block_io.get_my_addresses({}, console.log);
// block_io.create_forwarding_address({'to_address': '39mQmjBtG9yPbQfDqF1hjr15bjYjANAZCT'},console.log);
// console.log("addr",addr);
// setTimeout(function () {
//   console.log("addr",param1,param2);
// }, 5000);


var app = (0, _express2.default)();

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());
// app.use(express.static('client'))
// app.use('/users', authenticated);
// app.use('/users/*', authenticated);
(0, _routes2.default)(app);

app.listen(_env2.default.Api_port, function () {
    console.log('Api listening on port ' + _env2.default.Api_port + '!');
});
//# sourceMappingURL=app.js.map