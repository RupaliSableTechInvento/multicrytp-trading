'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _trade = require('./../schema/trade');

var _trade2 = _interopRequireDefault(_trade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tradeModel = _mongoose2.default.model('trade', _trade2.default);

exports.default = tradeModel;
//# sourceMappingURL=postatrade.js.map