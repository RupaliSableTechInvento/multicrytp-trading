'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mail_response = require('./../schema/mail_response');

var _mail_response2 = _interopRequireDefault(_mail_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mail_responseModel = _mongoose2.default.model('mail_response', _mail_response2.default);

exports.default = mail_responseModel;
//# sourceMappingURL=mail_responseModel.js.map