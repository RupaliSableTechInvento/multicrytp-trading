'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseUniqueValidator = require('mongoose-unique-validator');

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inbox = new _mongoose2.default.Schema({

  from: {
    type: String
  },
  to: {
    type: Array
  },
  sent: {
    type: Date
  },
  msg: {
    type: String
  }
});

inbox.plugin(_mongooseUniqueValidator2.default);

exports.default = inbox;