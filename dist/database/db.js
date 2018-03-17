'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _env = require('./../env');

var _env2 = _interopRequireDefault(_env);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.connect(_env2.default.DB_URL, { useMongoClient: true });

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);

// When successfully connected
_mongoose2.default.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + _env2.default.DB_URL);
});

// If the connection throws an error
_mongoose2.default.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
_mongoose2.default.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

exports.default = _mongoose2.default;
//# sourceMappingURL=db.js.map