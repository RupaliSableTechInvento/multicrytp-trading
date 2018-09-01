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

var _postatrade = require('../models/postatrade');

var _postatrade2 = _interopRequireDefault(_postatrade);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var encode = require('hashcode').hashCode;

var app = (0, _express2.default)();

// var http = require('http')(9004);
// global = {};

var authController = {
  login: function login(req, res, next) {
    req.body.password = encode().value(req.body.password);
    var credential = req.body;
    console.log("in login credential==>", credential);
    global.email = credential.email;
    _usersModel2.default.findOne({
      email: credential.email,
      password: credential.password
    }, function (err, user) {
      if (err) res.json(err);
      if (user) {
        console.log("User to get login=>", user);
        var d = new Date();
        var v = new Date();
        v.setMinutes(d.getMinutes() + 10);
        var token1 = _jsonwebtoken2.default.sign({
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          expiry: v
        }, _env2.default.App_key);
        var token = new _tokenModel2.default();
        console.log(user.email);
        var currentTime = new Date();
        var token2 = {
          'token': token1,
          email: user.email,
          isActive: "active",
          expiry: v,
          userActiveTime: currentTime
        };
        _tokenModel2.default.findOneAndUpdate({
          $and: [{
            email: user.email
          }, {
            isActive: "active"
          }]
        }, {
          $set: {
            isActive: "inactive"
          }
        }, function (err, data) {
          if (err) return res.json({
            isError: true,
            data: err
          });else {
            _tokenModel2.default.create(token2, function (err, token) {
              if (err) return res.json(err);
              res.json({
                isError: false,
                data: token1,
                user: {
                  first_name: user.first_name,
                  last_name: user.last_name,
                  id: user._id
                }
              });
            });
          }
        });
      } else {
        res.json({
          isError: true,
          data: "email or password incorrect !"
        });
      }
    });
  },

  getActiveUser: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _tokenModel2.default.find({
                isActive: "active"
              }, function (err, tokenModel) {
                if (err) return res.json({
                  isError: true,
                  tokenModel: err
                });else {
                  var emailObj = [];
                  console.log("trade model result", tokenModel.length);
                  for (var index = 0; index < tokenModel.length; index++) {
                    emailObj.push(tokenModel[index].email);
                  }
                  console.log("active user email ", emailObj);

                  _usersModel2.default.find({
                    'email': {
                      $in: emailObj
                    }
                  }, function (err, user) {
                    if (err) return res.json({
                      isError: true,
                      user: err
                    });else {
                      return res.json({
                        isError: false,
                        tokenModel: tokenModel,
                        user: user
                      });
                    }
                  });
                }
              });

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function getActiveUser(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }(),

  register: function register(req, res, next) {
    console.log("req.body for register", req.body);
    var account_created = new Date();
    if (req.body.password != "" && req.body.password.length > 6) {
      req.body.password = encode().value(req.body.password);
      var user = new _usersModel2.default(req.body);
      req.body.account_created = account_created;

      console.log("Account Created==>", account_created);
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
    _tokenModel2.default.findOneAndUpdate({
      $and: [{
        'email': decoded.email
      }, {
        'isActive': 'active'
      }, {
        'token': req.headers['authorization']
      }]
    }, {
      $set: {
        'isActive': 'inactive',
        'userInactiveTime': new Date()
      }
    }, function (err, data) {
      if (err) {
        res.json({
          success: false,
          data: err
        });
      } else {
        res.json({
          success: true,
          data: data
        });
      }
    });
  }
};

exports.default = authController;
//# sourceMappingURL=authController.js.map