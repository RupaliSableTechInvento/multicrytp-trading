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

    getOne: function getOne(req, res, next) {
        _postatrade2.default.findById(req.params.id, function (err, trade) {
            if (err) {

                res.json({ isError: true, data: err });
            }
            res.json({ isError: false, data: trade });
        });
    },

    create: function create(req, res, next) {
        _postatrade2.default.create(req.body, function (err, trade) {
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
    },

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