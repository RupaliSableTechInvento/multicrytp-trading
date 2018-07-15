'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _messages = require('./../schema/messages');

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var messagesModel = _mongoose2.default.model('messages', _messages2.default);

exports.default = messagesModel;
//# sourceMappingURL=messagesModel.js.map