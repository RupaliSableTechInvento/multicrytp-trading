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

var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var encode = require('hashcode').hashCode;
var usersController = {

  getAll: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _usersModel2.default.find({}, function (err, users) {
                if (err) return res.json({ isError: true, data: err });
                res.json({ isError: false, data: users });
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
    // console.log("------------",next);
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    _usersModel2.default.findOne({ 'email': decoded.email }, function (err, user) {
      if (err) {
        res.json({ isError: true, data: err });
      } else {
        res.json({ isError: false, data: user });
      }
    });
  },

  create: function create(req, res, next) {
    _usersModel2.default.create(req.body, function (err, user) {
      if (err) return res.json({ isError: true, data: err });
      res.json({ isError: false, data: user });
    });
  },

  update: function update(req, res, next) {
    // var id = mongoose.Types.ObjectId(req.body.id);
    _usersModel2.default.findOneAndUpdate({
      '_id': req.body.id
    }, req.body, {
      new: true
    }, function (err, user) {
      if (err) return res.json({ isError: true, data: err });
      res.json({ isError: false, data: user });
    });
  },

  delete: function _delete(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    _usersModel2.default.findOneAndUpdate({
      'email': decoded.email
    }, { isActive: 'inactive' }, function (err, ok) {
      if (err) return res.json({ isError: true, data: err });else {
        res.json({ isError: true, data: true });
      }
    });
  },
  forgetPassword: function forgetPassword(req, res, next) {
    var email = req.body.email;
    console.log("email", email);
    _usersModel2.default.find({
      'email': req.body.email
    }, function (err, result) {
      if (err) {
        res.json({ isError: true, data: err });
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
          nodemailer.createTestAccount(function (err, account) {
            // create reusable transporter object using the default SMTP transport
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'mailerabhi111@gmail.com',
                pass: 'Abhi@1234'
              }
            });

            // setup email data with unicode symbols
            var mailOptions = {
              from: 'mailerabhi111@gmail.com', // sender address
              to: email, // list of receivers
              subject: 'Change Password', // Subject line
              text: 'Please Click below link to change password', // plain text body
              html: '<a href=http://localhost:3000/recover?accessToken=' + token + '>Click Here</a>' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                return console.log("error--11--", error);
                res.json({ isError: true, data: error });
              } else {
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                res.json({ isError: false, data: 'Please check your Email' });
              }
              // Preview only available when sending through an Ethereal account
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
            //    res.json(mailOptions);
          });
        } else {
          res.json({ isError: true, data: 'please provide a valid mail' });
        }
      }
    });
  },

  storeBasicUserInfo: function storeBasicUserInfo(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    var id = req.body.id;
    _usersModel2.default.findOneAndUpdate({
      'email': decoded.email
    }, {
      'basicInfo': req.body
    }, {
      new: true
    }, function (err, user) {
      if (err) return res.json({ isError: true, data: err });
      res.json({ isError: false, data: user });
    });
  },

  emailVarification: function emailVarification(req, res, next) {
    var email = req.body.email;
    _usersModel2.default.find({
      'email': req.body.email
    }, function (err, result) {
      if (err) {
        res.json({ isError: true, data: err });
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
          nodemailer.createTestAccount(function (err, account) {
            // create reusable transporter object using the default SMTP transport
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'mailerabhi111@gmail.com',
                pass: 'Abhi@1234'
              }
            });
            var mailOptions = {
              from: 'mailerabhi111@gmail.com', // sender address
              to: email, // list of receivers
              subject: 'Change Password', // Subject line
              text: 'Please Click below link to change password', // plain text body
              html: 'Please<a href=http://localhost:3000/ev/' + token + '>Click Here</a>' // html body
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                res.json({ isError: true, data: error });
                return console.log("error--11--", error);
              } else {
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                res.json({ isError: false, data: 'Please check your email' });
              }
            });
          });
        } else {
          res.json({ isError: true, data: 'please provide a valid mail' });
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
      _usersModel2.default.findOneAndUpdate({
        "email": decoded.email
      }, {
        $set: {
          "varification.email_varified": "varified"
        }
      }, function (err, user) {
        if (err) return res.json({ isError: true, data: err });
        res.json({ isError: false, data: "email_varified" });
      });
    } else {
      res.json({ isError: true, data: "session expire" });
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
      v.setMinutes(d.getMinutes() + 60);
      var token = _jsonwebtoken2.default.sign({
        exp: Math.floor(v),
        email: decoded.email
      }, _env2.default.App_key);
      res.redirect('/recover/' + token);
    } else {
      res.json({ isError: true, data: "session expire" });
    }
  },
  changePassword: function changePassword(req, res, next) {
    console.log("req.headers--->", req.headers['authorization'], req.body);
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    req.body.password = encode().value(req.body.password);
    req.body.new_pasword = encode().value(req.body.new_pasword);
    _usersModel2.default.findOneAndUpdate({
      $and: [{
        "password": req.body.password
      }, {
        "email": decoded.email
      }]
    }, {
      $set: {
        "password": req.body.new_pasword
      }
    }, function (err, user) {
      if (err) return res.json({ isError: true, data: err });
      res.json({ isError: false, data: user });
    });
  },
  recoverPassword: function recoverPassword(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    if (req.body.password != "" && req.body.password.length > 6) {
      req.body.password = encode().value(req.body.password);
      var checkDate = new Date(decoded.expiry);
      var dt = new Date();
      // console.log(dt,"------",decoded);
      if (dt < checkDate) {
        _usersModel2.default.findOneAndUpdate({
          "email": decoded.email
        }, {
          $set: {
            "password": req.body.password
          }
        }, function (err, user) {
          if (err) return res.json(err);
          res.json({ isError: false, data: user });
        });
      } else {
        res.json({ isError: true, data: "session expire" });
      }
    } else {
      res.json({ isError: true, data: "Please provide valid password" });
    }
  },
  changeEmail: function changeEmail(req, res, next) {
    if (req.body.new_email) {
      req.body.password = encode().value(req.body.old_password);
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
        if (err) return res.json({ isError: true, data: err });
        res.json({ isError: false, data: user });
      });
    } else {
      res.json({ isError: true, data: "NULL" });
    }
  }

};

exports.default = usersController;
//# sourceMappingURL=usersController.js.map