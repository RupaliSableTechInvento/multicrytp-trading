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

var messages = new _mongoose2.default.Schema({
  message: {
    type: String
  },
  sender: {
    type: String
  },
  reciever: {
    type: String
  },
  date: {
    type: Date
  }
});

messages.plugin(_mongooseUniqueValidator2.default);

exports.default = messages;
//# sourceMappingURL=messages.js.map