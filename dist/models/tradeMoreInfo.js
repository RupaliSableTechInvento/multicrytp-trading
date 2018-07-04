'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _tradeMoreInfo = require('./../schema/tradeMoreInfo');

var _tradeMoreInfo2 = _interopRequireDefault(_tradeMoreInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tradeMoreInfo = _mongoose2.default.model('trade_more_info', _tradeMoreInfo2.default);

exports.default = tradeMoreInfo;