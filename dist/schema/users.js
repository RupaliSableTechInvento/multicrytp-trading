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

var usersSchema = new _mongoose2.default.Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true
  }
});
var sellerSchema = new _mongoose2.default.Schema({
  user: {
    type: String
  },
  payment_method: {
    type: String
  },
  price_btc: {
    type: Number
  },
  currency: {
    type: String
  },
  limit_from: {
    type: Number
  },
  limit_to: {
    type: Number
  }
});

usersSchema.plugin(_mongooseUniqueValidator2.default);
usersSchema.plugin(_mongooseAutoIncrement2.default.plugin, 'id');

exports.default = usersSchema;
//# sourceMappingURL=users.js.map