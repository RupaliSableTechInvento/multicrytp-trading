'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _inbox = require('./../schema/inbox');

var _inbox2 = _interopRequireDefault(_inbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inboxModel = _mongoose2.default.model('inbox', _inbox2.default);

exports.default = inboxModel;
//# sourceMappingURL=inboxModel.1.js.map