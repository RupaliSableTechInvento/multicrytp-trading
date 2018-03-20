'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _usersModel = require('./../models/usersModel');

var _usersModel2 = _interopRequireDefault(_usersModel);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _env = require('../env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authController = {
    login: function login(req, res, next) {
        var credential = req.query;
        _usersModel2.default.findOne({ email: credential.email, password: credential.password }, function (err, user) {
            if (err) res.json(err);
            if (user !== null) {
                var token = _jsonwebtoken2.default.sign({
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name
                }, _env2.default.App_key);
                res.json({ token: token });
            } else {
                res.json("email or password incorrect !");
            }
        });
    },

    register: function register(req, res, next) {
        console.log("req.body", req.body, req.params, req.query);
        var user = new _usersModel2.default(req.body);
        user.save(req.body, function (err, user) {
            if (err) return res.json(err);
            res.json(user);
        });
    }
};

exports.default = authController;
//# sourceMappingURL=authController.js.map