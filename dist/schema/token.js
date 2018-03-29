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

var tokenSchema = new _mongoose2.default.Schema({
  token: {
    type: String
  },
  email: {
    type: String
  },
  isActive: {
    type: String
  },
  expiry: {
    type: Date
  }

});

tokenSchema.plugin(_mongooseUniqueValidator2.default);
// tokenSchema.plugin(autoIncrement.plugin, 'id');

exports.default = tokenSchema;
//# sourceMappingURL=token.js.map