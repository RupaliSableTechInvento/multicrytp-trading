'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _env = require('../env');

var _env2 = _interopRequireDefault(_env);

var _tokenModel = require('./../models/tokenModel');

var _tokenModel2 = _interopRequireDefault(_tokenModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authenticated = function authenticated(req, res, next) {
  var token = req.headers['authorization'];
  var today = new Date();
  _tokenModel2.default.findOne({ $and: [{ 'token': token }, { 'isActive': 'active' }, { expiry: { $gt: today } }] }, function (err, user) {
    if (err) {
      res.json({ isError: true, data: err });
    } else {
      if (user != null) {
        // console.log("-------------",user);
        _jsonwebtoken2.default.verify(token, _env2.default.App_key, function (err, decode) {
          if (err) {
            res.json({ isError: true, data: err });
          } else {
            next();
          }
        });
      } else {
        res.json({ isError: true, data: "Middle Order Login Again" });
      }
    }
  });
};
// const authenticated = (req, res, next) => {
//
// }
exports.default = authenticated;
//# sourceMappingURL=authenticated.js.map