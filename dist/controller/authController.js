'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _usersModel = require('./../models/usersModel');

var _usersModel2 = _interopRequireDefault(_usersModel);

var _tokenModel = require('./../models/tokenModel');

var _tokenModel2 = _interopRequireDefault(_tokenModel);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _env = require('../env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var encode = require('hashcode').hashCode;
var authController = {
  login: function login(req, res, next) {
    req.body.password = encode().value(req.body.password);
    var credential = req.body;
    _usersModel2.default.findOne({
      email: credential.email,
      password: credential.password
    }, function (err, user) {
      if (err) res.json(err);
      if (user !== null) {
        console.log("User=>", user);
        var d = new Date();
        var v = new Date();
        v.setMinutes(d.getMinutes() + 60);
        var token1 = _jsonwebtoken2.default.sign({
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          expiry: v
        }, _env2.default.App_key);
        var token = new _tokenModel2.default();
        console.log(user.email);
        var token2 = { 'token': token1, email: user.email, isActive: "active", expiry: v };
        _tokenModel2.default.findOneAndUpdate({ $and: [{ email: user.email }, { isActive: "active" }] }, { $set: { isActive: "inactive" } }, function (err, data) {
          if (err) return res.json({ isError: true, data: err });else {
            _tokenModel2.default.create(token2, function (err, token) {
              if (err) return res.json(err);
              res.json({ isError: false, data: token1, user: { first_name: user.first_name, last_name: user.last_name, id: user._id } });
            });
          }
        });
      } else {
        res.json({ isError: true, data: "email or password incorrect !" });
      }
    });
  },

  register: function register(req, res, next) {
    console.log("req.body", req.body, req.params, req.query);
    if (req.body.password != "" && req.body.password.length > 6) {
      req.body.password = encode().value(req.body.password);
      var user = new _usersModel2.default(req.body);
      user.save(req.body, function (err, user) {
        if (err) return res.json(err);
        res.json(user);
      });
    } else {
      res.json("Please provide valid password");
    }
  },
  logout: function logout(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    _tokenModel2.default.findOneAndUpdate({ $and: [{ 'email': decoded.email }, { 'isActive': 'active' }] }, { $set: { 'isActive': 'inactive' } }, function (err, data) {
      if (err) {
        res.json({ isError: true, data: err });
      } else {
        res.json({ isError: false, data: data });
      }
    });
  }
};

exports.default = authController;
//# sourceMappingURL=authController.js.map