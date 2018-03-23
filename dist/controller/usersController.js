'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _usersModel = require('../models/usersModel');

var _usersModel2 = _interopRequireDefault(_usersModel);

var _postatrade = require('../models/postatrade');

var _postatrade2 = _interopRequireDefault(_postatrade);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _env = require('../env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mongoose = require('mongoose');

var usersController = {

  getAll: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _usersModel2.default.find({}, function (err, users) {
                if (err) return res.json(err);
                res.json(users);
              });

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function getAll(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }(),

  getOne: function getOne(req, res, next) {
    console.log("------------");
    _usersModel2.default.findById(req.params.id, function (err, user) {
      res.json(user || {});
    });
  },

  create: function create(req, res, next) {
    _usersModel2.default.create(req.body, function (err, user) {
      if (err) return res.json(err);
      res.json(user);
    });
  },

  update: function update(req, res, next) {
    // var id = mongoose.Types.ObjectId(req.body.id);
    _usersModel2.default.findOneAndUpdate({
      '_id': req.body.id
    }, req.body, {
      new: true
    }, function (err, user) {
      if (err) return res.json(err);
      res.json(user);
    });
  },

  delete: function _delete(req, res, next) {
    _usersModel2.default.remove({
      _id: req.params.id
    }, function (err, ok) {
      if (err) return res.json(err);
    });
    res.json(true);
  },
  changePassword: function changePassword(req, res, next) {
    _usersModel2.default.find({
      'email': req.body.email
    }, function (err, result) {
      if (err) {
        res.json(err);
      } else {
        if (result != "") {
          var d = new Date();
          var v = new Date();
          v.setMinutes(d.getMinutes() + 30);
          var token = _jsonwebtoken2.default.sign({
            exp: Math.floor(v),
            email: req.body.email
          }, _env2.default.App_key);
          console.log(result);
          res.json('http://localhost:3000/cp/' + token);
        } else {
          res.json('please provide a valid mail');
        }
      }
    });
  },

  storeBasicUserInfo: function storeBasicUserInfo(req, res, next) {
    var id = req.body.id;
    _usersModel2.default.findOneAndUpdate({ '_id': id }, { 'basicInfo': req.body }, { new: true }, function (err, user) {
      if (err) return res.json(err);
      res.json(user);
    });
  },

  emailVarification: function emailVarification(req, res, next) {
    _usersModel2.default.find({
      'email': req.body.email
    }, function (err, result) {
      if (err) {
        res.json(err);
      } else {
        if (result != "") {
          var d = new Date();
          var v = new Date();
          v.setMinutes(d.getMinutes() + 30);
          var token = _jsonwebtoken2.default.sign({
            exp: Math.floor(v),
            email: req.body.email
          }, _env2.default.App_key);
          console.log(result);
          res.json('http://localhost:3000/ev/' + token);
        } else {
          res.json('please provide a valid mail');
        }
      }
    });
  },

  emailVarified: function emailVarified(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.params.token, _env2.default.App_key);
    var dt = new Date();
    var checkDate = new Date(decoded.exp);
    if (dt < checkDate) {
      console.log("----------");
      _usersModel2.default.findOneAndUpdate({ "email": decoded.email }, {
        $set: { "varification.email_varified": "varified" }
      }, function (err, user) {
        if (err) return res.json(err);
        res.json(user);
      });
    } else {
      res.json("session expire");
    }
  },

  varifyToken: function varifyToken(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.params.token, _env2.default.App_key);
    var dt = new Date();
    var checkDate = new Date(decoded.exp);
    if (dt < checkDate) {
      console.log("----");

      var d = new Date();
      var v = new Date();
      v.setMinutes(d.getMinutes() + 5);
      var token = _jsonwebtoken2.default.sign({
        exp: Math.floor(v),
        email: decoded.email
      }, _env2.default.App_key);
      res.redirect('/recover/' + token);
    } else {

      res.json("session expire");
    }
  },

  recoverPassword: function recoverPassword(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.body.token, _env2.default.App_key);
    var dt = new Date();
    var checkDate = new Date(decoded.exp);
    if (dt < checkDate) {
      _usersModel2.default.findOneAndUpdate({ "email": decoded.email }, {
        $set: { "password": req.body.password }
      }, function (err, user) {
        if (err) return res.json(err);
        res.json(user);
      });
    } else {
      res.json("session expire");
    }
  },

  changeEmail: function changeEmail(req, res, next) {
    if (req.body.new_email) {
      _usersModel2.default.findOneAndUpdate({
        $and: [{
          "password": req.body.password
        }, {
          "email": req.body.email
        }]
      }, {
        $set: {
          "email": req.body.new_email
        }
      }, function (err, user) {
        if (err) return res.json(err);
        res.json(user);
      });
    } else {
      res.json("NULL");
    }
  }
};

exports.default = usersController;
//# sourceMappingURL=usersController.js.map