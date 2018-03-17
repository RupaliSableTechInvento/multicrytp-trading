'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _usersModel = require('../models/usersModel');

var _usersModel2 = _interopRequireDefault(_usersModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
        _usersModel2.default.findOneAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
            if (err) return res.json(err);
            res.json(user);
        });
    },

    delete: function _delete(req, res, next) {
        _usersModel2.default.remove({ _id: req.params.id }, function (err, ok) {
            if (err) return res.json(err);
        });
        res.json(true);
    }
};

exports.default = usersController;
//# sourceMappingURL=usersController.js.map