'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _postatrade = require('../models/postatrade');

var _postatrade2 = _interopRequireDefault(_postatrade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var tradeController = {

    getAll: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _postatrade2.default.find({}, function (err, trade) {
                                if (err) return res.json(err);
                                res.json(trade);
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
            res.json(trade || {});
        });
    },

    create: function create(req, res, next) {
        _postatrade2.default.create(req.body, function (err, trade) {
            if (err) return res.json(err);
            res.json(trade);
        });
    },

    update: function update(req, res, next) {
        _postatrade2.default.findOneAndUpdate(req.params.id, req.body, { new: true }, function (err, trade) {
            if (err) return res.json(err);
            res.json(trade);
        });
    },

    delete: function _delete(req, res, next) {
        _postatrade2.default.remove({ _id: req.params.id }, function (err, ok) {
            if (err) return res.json(err);
        });
        res.json(true);
    }
};

exports.default = tradeController;
//# sourceMappingURL=tradeController.js.map