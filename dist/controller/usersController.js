'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _usersModel = require('../models/usersModel');

var _usersModel2 = _interopRequireDefault(_usersModel);

var _tokenModel = require('./../models/tokenModel');

var _tokenModel2 = _interopRequireDefault(_tokenModel);

var _messagesModel = require('../models/messagesModel');

var _messagesModel2 = _interopRequireDefault(_messagesModel);

var _mail_responseModel = require('../models/mail_responseModel');

var _mail_responseModel2 = _interopRequireDefault(_mail_responseModel);

var _postatrade = require('../models/postatrade');

var _postatrade2 = _interopRequireDefault(_postatrade);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _env = require('../env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var encode = require('hashcode').hashCode;
var usersController = {
  getAllUnreadMessages: function getAllUnreadMessages(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    console.log("getAllMessages reqest from==>", decoded.email);
    _messagesModel2.default.find({
      'reciever': decoded.email,
      'isRead': false
    }, function (err, messages) {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: messages
      });
    });
  },

  getAllMessagesWithFriend: function getAllMessagesWithFriend(req, res, next) {

    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    // console.log("getAllMessagesWithFriend reqest from==>", decoded.email, req.query.data)
    var friend = req.query.data.friend;
    var date = req.query.data.date;
    var temp = req.query.data.limit;
    var limit = '';

    var query = '';
    if (date) {
      query = {
        $or: [{ $and: [{ sender: decoded.email }, { reciever: friend }] }, { $and: [{ sender: friend }, { reciever: decoded.email }] }],
        "date": { $lt: date }
      };
    } else {
      query = {
        $or: [{ $and: [{ sender: decoded.email }, { reciever: friend }] }, { $and: [{ sender: friend }, { reciever: decoded.email }] }]
      };
    }

    _messagesModel2.default.find(query).sort({ 'date': -1 }).limit(10).exec(function (err, messages) {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: messages
      });
    });
  },
  setMsgRead: function setMsgRead(req, res, next) {
    // console.log("setMsgRead ==>", req.body, req.query);
    var arrMsgID = [];
    arrMsgID = req.body.data;
    console.log("arrMsgID", arrMsgID);
    var _id = '';
    var arrMsgIDList = arrMsgID.map(function (aField) {
      // return mongoose.Types.ObjectId(aField);
      return aField;
      console.log(aField);
    });

    var bulk = _messagesModel2.default.collection.initializeUnorderedBulkOp();

    arrMsgID.forEach(function (item, index) {
      _id = mongoose.Types.ObjectId(item);
      // var id = arrMsgID[index];
      bulk.find({ _id: _id }).updateOne({ $set: { isRead: true } });
    });
    bulk.execute(function (err, messages) {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: messages
      });
    });
  },
  getFriendsList: function getFriendsList(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    console.log("addUserInfo", decoded.email);
    _usersModel2.default.find({
      'email': decoded.email
    }, { "friends": 1, "_id": 0 }, function (err, users) {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: users
      });
    });
  },
  getUserInfo: function getUserInfo(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    console.log("decoded.email=>", decoded.email);
    _usersModel2.default.find({
      'email': decoded.email
    }, function (err, users) {
      if (err) return res.json({
        isError: true,
        data: err
      });
      console.log("users==>", users);
      if (users) {
        res.json({
          isError: false,
          data: users
        });
      } else {
        res.redirect('/#/login');
      }
    });
  },

  acceptFriendRequest: function acceptFriendRequest(req, res, next) {

    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    var senderEmail = req.body.senderEmail;
    console.log("acceptFriendRequest senderEmail==>", senderEmail);

    var query = {
      'email': decoded.email
    };
    _usersModel2.default.find(query, function (err, result) {
      if (!err) {
        console.log("friends list", result);
        var friendsList = result[0].friends;
        friendsList.forEach(function (item, index) {
          if (item.senderEmail == senderEmail) {
            _usersModel2.default.findOneAndUpdate(_defineProperty({}, 'friends.' + index + '.senderEmail', item.senderEmail), {
              $set: _defineProperty({}, 'friends.' + index + '.status', 'Friend')
            }, function (errFriend, resultFriend) {

              if (errFriend) return res.json({
                isError: true,
                data: err
              });
              // res.json({
              //   isError: false,
              //   data: resultFriend
              // });

              var dataObj = {
                senderEmail: decoded.email,
                senderFirstName: decoded.first_name,
                status: 'Friend'
              };

              _usersModel2.default.findOneAndUpdate({
                'email': senderEmail
              }, { $push: { friends: dataObj } }, {
                upsert: true
              }, function (err, users) {
                if (err) return res.json({
                  isError: true,
                  data: err
                });
                res.json({
                  isError: false,
                  data: users
                });
              });
            });
          }
        });
      }
    });
  },

  addUserProfilePic: function addUserProfilePic(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    var imgURL = req.body.imgURL;
    _usersModel2.default.findOneAndUpdate({
      'email': decoded.email
    }, {
      $set: {
        imgURL: imgURL
      }
    }, function (err, data) {
      if (err) return res.json({
        isError: true,
        data: err
      });else {
        res.json({
          isError: false,
          data: data
        });
      }
    });
  },
  addMessage: function addMessage(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    var sender = decoded.email;
    var data = req.body;
    data.sender = sender;
    data.date = new Date();
    console.log("Data for message==>", data);
    _messagesModel2.default.create(data, function (err, message) {
      if (err) return res.json(err);
      res.json({
        isError: false,
        data: message
      });
    });
  },

  friendReq: function friendReq(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    var to = req.body.To;
    console.log("To  Details=>", to);

    var dataObj = {
      senderEmail: decoded.email,
      senderFirstName: decoded.first_name,
      status: 'Pending'
    };
    console.log("Senders Details=>", dataObj);
    _usersModel2.default.find({ 'email': to }, function (errParent, resultParent) {
      if (!errParent) {
        var friendsList = resultParent[0].friends || [];
        console.log("friendList==>", friendsList);
        var isFound = friendsList.find(function (item) {
          return item.senderEmail == decoded.email;
        });
        if (isFound) {
          res.json({
            isError: false,
            isFound: true
          });
        }
        console.log("isfound==>", isFound);
        if (!isFound || friendsList.length === 0) {
          console.log("not found");
          _usersModel2.default.findOneAndUpdate({
            'email': to
          }, { $push: { friends: dataObj } }, {
            upsert: true
          }, function (err, users) {
            if (err) return res.json({
              isError: true,
              data: err
            });
            res.json({
              isError: false,
              data: users
            });
          });
        }
      }
    });
  },

  getAll: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _usersModel2.default.find({}, function (err, users) {
                if (err) return res.json({
                  isError: true,
                  data: err
                });
                res.json({
                  isError: false,
                  data: users
                });
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
  addUserInfo: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
      var decoded;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);

              _usersModel2.default.findOneAndUpdate({

                'email': decoded.email
              }, req.body, {
                new: true
              }, function (err, user) {
                if (err) return res.json({
                  success: false,
                  data: err
                });
                res.json({
                  success: true,
                  data: user
                });
              });

            case 2:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function addUserInfo(_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }(),
  userProfile: function userProfile(req, res, next) {
    // var _id = Number(req.query.id);

    var _id = mongoose.Types.ObjectId(req.query.id);
    console.log("id=>", _id);
    _usersModel2.default.findOne({
      _id: _id
    }, function (err, user) {

      if (err) {
        res.json({
          isError: true,
          data: err
        });
      } else {
        var email = user.email;
        console.log("Email==>", email);
        _tokenModel2.default.findOne({ 'email': email }, function (err, tokenData) {
          res.json({
            isError: false,
            data: { user: user, tokenData: tokenData }
          });
        }).sort({ _id: -1 }).limit(1);
      }
    });
  },

  getOne: function getOne(req, res, next) {
    // console.log("------------",next);
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    _usersModel2.default.findOne({
      'email': decoded.email
    }, function (err, user) {
      if (err) {
        res.json({
          isError: true,
          data: err
        });
      } else {
        res.json({
          isError: false,
          data: user
        });
      }
    });
  },

  create: function create(req, res, next) {
    _usersModel2.default.create(req.body, function (err, user) {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: user
      });
    });
  },

  update: function update(req, res, next) {
    // var id = mongoose.Types.ObjectId(req.body.id);
    _usersModel2.default.findOneAndUpdate({
      '_id': req.body.id
    }, req.body, {
      new: true
    }, function (err, user) {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: user
      });
    });
  },

  delete: function _delete(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    _usersModel2.default.findOneAndUpdate({
      'email': decoded.email
    }, {
      isActive: 'inactive'
    }, function (err, ok) {
      if (err) return res.json({
        isError: true,
        data: err
      });else {
        res.json({
          isError: true,
          data: true
        });
      }
    });
  },
  forgetPassword: function forgetPassword(req, res, next) {
    var email = req.body.email;
    var host = req.headers.host;

    _usersModel2.default.find({
      'email': req.body.email
    }, function (err, result) {
      if (err) {
        res.json({
          isError: true,
          data: err
        });
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
                user: 'itstechinvento@gmail.com',
                pass: 'techinvento123'
              }
            });

            // setup email data with unicode symbols
            var mailOptions = {
              from: 'itstechinvento@gmail.com', // sender address
              to: email, // list of receivers
              subject: 'Create New Password', // Subject line
              text: 'As requested,here is a link to allow you to select a new password', // plain text body
              html: '<a href=http://' + host + '/recover?accessToken=' + token + '>Click to recover password</a>' // html body

              // html: '<a href=http://localhost:3000/recover?accessToken=' + token + '>Click to recover password</a>' // html body
            };
            console.log("Mailoptions", mailOptions);

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function (error, info) {
              var information = JSON.stringify(info);

              console.log('Transporter', err, information);
              _mail_responseModel2.default.create({
                'email': email,
                'error': error,
                'info': information
              }, function (err, mail_response) {
                if (err) {
                  console.log("mail_responseModel error=>", err);
                } else {
                  console.log("mail_responseModel No error", mail_response);
                }
              });

              if (error) {
                return console.log("error--11--", error);
                res.json({
                  isError: true,
                  data: error
                });
              } else {
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                res.json({
                  isError: false,
                  data: 'Please check your Email'
                });
              }

              // Preview only available when sending through an Ethereal account
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });

            // res.json({ isError: false, data: 'Please check your Email' });

            //    res.json(mailOptions);
          });
        } else {
          res.json({
            isError: true,
            data: 'please provide a valid mail'
          });
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
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: user
      });
    });
  },

  isVerified: function isVerified(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.query.token, _env2.default.App_key);
    _usersModel2.default.findOneAndUpdate({
      'email': decoded.email
    }, function (err, user) {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: user
      });
    });
  },

  emailVerification: function emailVerification(req, res, next) {
    var host = req.headers.host;
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    console.log("Emailverification==>", decoded.email);
    _usersModel2.default.find({
      'email': decoded.email
    }, function (err, result) {
      if (err) {
        res.json({
          isError: true,
          data: err
        });
      } else {
        if (result != "") {
          var d = new Date();
          var v = new Date();
          v.setMinutes(d.getMinutes() + 30);
          var token = _jsonwebtoken2.default.sign({
            exp: Math.floor(v),
            email: decoded.email
          }, _env2.default.App_key);
          console.log(result);
          nodemailer.createTestAccount(function (err, account) {
            // create reusable transporter object using the default SMTP transport
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'itstechinvento@gmail.com',
                pass: 'techinvento123'
              }
            });
            var htmlforemail = '';
            var mailOptions = {
              from: 'itstechinvento@gmail.com', // sender address
              to: decoded.email, // list of receivers
              subject: 'Email Verification', // Subject line
              text: 'Please Click below link to Verify Your Email address', // plain text body
              html: 'Please<a id ="varified"href=http://' + host + '/ev/' + token + '>Click Here to processed email verification</a>'
            };
            transporter.sendMail(mailOptions, function (error, info) {
              // mail_responseModel.create({
              //   'email': decoded.email,
              //   'error': error,
              //   'info': info
              // }, function(err, mail_response) {
              //   if (err) {
              //     console.log("mail_responseModel error=>", err);
              //   } else {
              //     console.log("mail_responseModel ", mail_response);
              //   }
              // })
              if (error) {
                res.json({
                  isError: true,
                  data: error
                });
                return console.log("error--11--", error);
              } else {
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                res.json({
                  isError: false,
                  data: 'Please check your email'
                });
              }
            });
          });
        } else {
          res.json({
            isError: true,
            data: 'please provide a valid mail'
          });
        }
      }
    });
  },

  emailVerified: function emailVerified(req, res, next) {
    var decoded = _jsonwebtoken2.default.verify(req.params.token, _env2.default.App_key);
    var dt = new Date();
    var checkDate = new Date(decoded.exp);
    if (dt < checkDate) {
      console.log("----------");
      _usersModel2.default.findOneAndUpdate({
        "email": decoded.email
      }, {
        $set: {
          "verification.email_verified": true
        }
      }, function (err, user) {
        if (err) return res.json({
          isError: true,
          data: err
        });
        res.redirect('/#/profile');
        // res.send('verified')
        //res.json({ isError: false, data: "your E-Mail address is verified sucessfully" });
      });
    } else {
      res.json({
        isError: true,
        data: "session expire"
      });
    }
  },

  varifyToken: function varifyToken(req, res, next) {
    console.log("in verify Token=>");
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
      res.json({
        isError: true,
        data: "session expire"
      });
    }
  },
  changePassword: function changePassword(req, res, next) {
    // console.log("req.headers--->", req.headers['authorization'], req.body);
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
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: user
      });
      console.log("user=>", user);
    });
  },
  recoverPassword: function recoverPassword(req, res, next) {
    console.log("req in recover password api=>", req.body, req.query, req.params);
    var decoded = _jsonwebtoken2.default.verify(req.headers['authorization'], _env2.default.App_key);
    if (req.body.password != "" && req.body.password.length > 6) {
      req.body.password = encode().value(req.body.password);
      var checkDate = new Date(decoded.exp);
      var dt = new Date();
      console.log(dt, "------", checkDate);
      if (dt < checkDate) {
        _usersModel2.default.findOneAndUpdate({
          "email": decoded.email
        }, {
          $set: {
            "password": req.body.password
          }
        }, function (err, user) {
          if (err) return res.json(err);
          res.json({
            isError: false,
            data: user
          });
        });
      } else {
        res.json({
          isError: true,
          data: "session expire"
        });
      }
    } else {
      res.json({
        isError: true,
        data: "Please provide valid password"
      });
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
        if (err) return res.json({
          isError: true,
          data: err
        });
        res.json({
          isError: false,
          data: user
        });
      });
    } else {
      res.json({
        isError: true,
        data: "NULL"
      });
    }
  }

};

exports.default = usersController;
//# sourceMappingURL=usersController.js.map