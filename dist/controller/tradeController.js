'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postatrade = require('../models/postatrade');

var _postatrade2 = _interopRequireDefault(_postatrade);

var _tradeMoreInfo = require('../models/tradeMoreInfo');

var _tradeMoreInfo2 = _interopRequireDefault(_tradeMoreInfo);

var _usersModel = require('../models/usersModel');

var _usersModel2 = _interopRequireDefault(_usersModel);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mongoose = require('mongoose');

var tradeController = _defineProperty({

  getAll: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _postatrade2.default.find({}, function (err, trade) {
                if (err) return res.json({ isError: true, data: err });
                res.json({ isError: false, data: trade });
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

  getByCurrencyLoc: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
      var cryptocurrency, location, tradeMethod, traderType;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // console.log("req==>", req.body, req.params, req.query);
              cryptocurrency = req.query.currency;
              location = req.query.location;
              tradeMethod = req.query.tradeMethod;
              traderType = req.query.traderType;

              // console.log("req", req.query);
              // console.log("cryptocurrency in trade controller=>", cryptocurrency);
              // console.log("Location in trade controller=>", location);

              _postatrade2.default.find({
                "cryptoCurrency": req.query.currency,
                "location": req.query.location,
                "traderType": req.query.traderType,
                "tradeMethod": req.query.tradeMethod
              }, function (err, trade) {
                if (err) return res.json({ isError: true, data: err });
                // console.log("data", data)
                //var userId = trade[0].user;
                // console.log("trade", trade)
                var tradeArr = [];

                for (var i = 0; i < trade.length; i++) {

                  console.log("trade array", i);
                  // var userId = 'user' in item ? item.user : '';
                  // console.log("uer id=>", userId)
                  // const userData = await usersModel.findOne({ '_id': trade[i].user });
                  // item.user = userData;
                  // item.userInfo = userData;
                  trade[i].user = "";

                  tradeArr.push(trade[i]);
                  // res.json({ isError: false, data: tradeArr })
                  // console.log("trade item", index, trade.length)
                  // if (index + 1 == trade.length) {

                  // }
                };
                res.json({ isError: false, data: tradeArr });

                // res.json({ isError: false, data: trade });
              });

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function getByCurrencyLoc(_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }(),

  getOne: function getOne(req, res, next) {
    _postatrade2.default.findById(req.params.id, function (err, trade) {
      if (err) {

        res.json({ isError: true, data: err });
      }
      res.json({ isError: false, data: trade });
    });
  },

  create: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
      var params, userObj;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              params = req.body;
              _context3.next = 3;
              return _usersModel2.default.find({ '_id': req.body.user }, { _id: 0, first_name: 1 });

            case 3:
              userObj = _context3.sent;


              /*  params.firstName = await usersModel.findOne({ '_id': req.body.user }, { _id: 0, first_name: 1 }, (err, user) => {
                 if (err) {
                   res.json({ isError: true, data: err });
                 } else { res.json({ isError: false, data: user }); }
               }); */
              params.firstName = userObj[0].first_name;
              console.log("params name =", params.firstName);

              _postatrade2.default.create(params, function (err, trade) {
                if (err) return res.json({ isError: true, data: err });else {
                  _tradeMoreInfo2.default.create({ 'trade_id': trade._id, 'user_id': trade.user }, function (err, tradeInfo) {
                    if (err) return res.json({ isError: true, data: err });else {
                      _usersModel2.default.findOneAndUpdate({ '_id': tradeInfo.user_id }, { "trade_info": tradeInfo._id }, function (err, UpdateUser) {
                        if (err) return res.json({ isError: true, data: err });
                        res.json({ isError: false, data: UpdateUser });
                      });
                    }
                  });
                }
              });

            case 7:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    return function create(_x7, _x8, _x9) {
      return _ref3.apply(this, arguments);
    };
  }(),

  update: function update(req, res, next) {
    _postatrade2.default.findOneAndUpdate(req.params.id, req.body, { new: true }, function (err, trade) {
      if (err) return res.json({ isError: true, data: err });
      res.json({ isError: false, data: trade });
    });
  },

  delete: function _delete(req, res, next) {
    _postatrade2.default.remove({ _id: req.params.id }, function (err, ok) {
      if (err) return res.json({ isError: true, data: err });
    });
    res.json({ isError: false, data: true });
  }

}, 'update', function update(req, res, next) {
  var id = mongoose.Types.ObjectId(req.body.id);
  _postatrade2.default.findOneAndUpdate({ '_id': id }, req.body, { new: true }, function (err, user) {
    if (err) return res.json({ isError: true, data: err });
    res.json({ isError: false, data: user });
  });
});

exports.default = tradeController;
//# sourceMappingURL=tradeController.js.map