'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _env = require('../env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authenticated = function authenticated(req, res, next) {
    var token = req.headers['authorization'];
    _jsonwebtoken2.default.verify(token, _env2.default.App_key, function (err, decode) {
        if (err) {
            res.json("Token not provided");
        } else {
            next();
        }
    });
};

exports.default = authenticated;
//# sourceMappingURL=authenticated.js.map