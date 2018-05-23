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

  /*  getByCurrencyLoc: async(req, res, next) => {
     var searchQ = {
       cryptoCurrency: req.query.datatable.query.cryptoCurrency,
       location: req.query.datatable.query.location,
       tradeMethod: req.query.datatable.query.tradeMethod,
       traderType: req.query.datatable.query.traderType
     }
     postatrade.find(searchQ).limit(parseInt(req.query.datatable.query.limit)).toArray(function(err, data) {
         res.send({
           isError: false,
           data: { 'success': true, 'data': data },
           count: postatrade.find(searchQ).count()
         })
       })
   }, */

  getByCurrencyLoc: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
      var perpage, page, skip, request, cryptoCurrency, location, tradeMethod, traderType;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              perpage = req.query.pagination.perpage;
              page = req.query.pagination.page;
              /*   req.query.pagination.page = 0;
                req.query.pagination.pages = 0;
                req.query.pagination.perpage = 0;
                req.query.pagination.total = 0; */
              // console.log("perpage , page ,total , pages", perpage, page, req.query.pagination.total, req.query.pagination.pages);

              skip = 0;

              if (page > 1) {
                skip = perpage * page;
              }
              request = req.query.query;
              cryptoCurrency = req.query.query.cryptoCurrency;
              location = req.query.query.location;
              tradeMethod = req.query.query.tradeMethod;
              traderType = req.query.query.traderType;

              _postatrade2.default.find({
                cryptoCurrency: cryptoCurrency,
                location: location,
                tradeMethod: tradeMethod,
                traderType: traderType
              }, function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(err, trade) {
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          if (!err) {
                            _context2.next = 2;
                            break;
                          }

                          return _context2.abrupt('return', res.json({ isError: true, data: err }));

                        case 2:
                          _context2.t0 = res;
                          _context2.t1 = req.query.pagination.page;
                          _context2.next = 6;
                          return _postatrade2.default.find({
                            cryptoCurrency: cryptoCurrency,
                            location: location,
                            tradeMethod: tradeMethod,
                            traderType: traderType
                          }).count();

                        case 6:
                          _context2.t2 = _context2.sent;
                          _context2.t3 = _context2.t2 / 10;
                          _context2.next = 10;
                          return _postatrade2.default.find({
                            cryptoCurrency: cryptoCurrency,
                            location: location,
                            tradeMethod: tradeMethod,
                            traderType: traderType
                          }).count();

                        case 10:
                          _context2.t4 = _context2.sent;
                          _context2.t5 = {
                            page: _context2.t1,
                            pages: _context2.t3,
                            perpage: 10,
                            total: _context2.t4,
                            sort: "asc",
                            field: "_id"
                          };
                          _context2.t6 = trade;
                          _context2.t7 = {
                            isError: false,
                            meta: _context2.t5,
                            data: _context2.t6
                          };

                          _context2.t0.json.call(_context2.t0, _context2.t7);

                        case 15:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, undefined);
                }));

                return function (_x7, _x8) {
                  return _ref3.apply(this, arguments);
                };
              }()).limit(parseInt(req.query.pagination.perpage) || '').skip(skip || '');

            case 10:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    return function getByCurrencyLoc(_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }(),
  getOne: function getOne(req, res, next) {
    console.log("req=> for get One tradeController", req.body, req.params, req.query);
    _postatrade2.default.findById(req.query.id, function (err, trade) {
      if (err) {
        res.json({ isError: true, data: err });
      }
      res.json({ isError: false, data: trade });
    });
  },

  create: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
      var params, userObj;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              params = req.body;
              _context4.next = 3;
              return _usersModel2.default.find({ '_id': req.body.user }, { _id: 0, first_name: 1 });

            case 3:
              userObj = _context4.sent;


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
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    }));

    return function create(_x9, _x10, _x11) {
      return _ref4.apply(this, arguments);
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