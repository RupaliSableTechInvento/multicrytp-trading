'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _usersController = require('./controller/usersController');

var _usersController2 = _interopRequireDefault(_usersController);

var _tradeController = require('./controller/tradeController');

var _tradeController2 = _interopRequireDefault(_tradeController);

var _authController = require('./controller/authController');

var _authController2 = _interopRequireDefault(_authController);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = function routes(route) {
    route.get('/', function (req, res) {
        res.sendFile(_path2.default.resolve(__dirname + '/../client/' + 'index.html'));
    });

    route.get('/recover/*', function (req, res) {
        res.sendFile(_path2.default.resolve(__dirname + '/../client/' + 'recover.html'));
    });

    route.route('/login').post(_authController2.default.login);

    route.route('/register').post(_authController2.default.register);

    route.route('/users').get(_usersController2.default.getAll).put(_usersController2.default.update);

    route.route('/users/changePassword').post(_usersController2.default.changePassword);

    route.route('/users/changeEmail').post(_usersController2.default.changeEmail);

    route.route('/users/:id').get(_usersController2.default.getOne).delete(_usersController2.default.delete);

    route.route('/seller').get(_usersController2.default.getOne).put(_usersController2.default.update).delete(_usersController2.default.delete);

    route.route('/cp/:token').get(_usersController2.default.varifyToken);

    route.route('/emailvarification').post(_usersController2.default.emailVarification);

    route.route('/ev/:token').get(_usersController2.default.emailVarified);

    route.route('/trade').get(_tradeController2.default.getAll).post(_tradeController2.default.create).patch(_tradeController2.default.update);

    route.route('/recoverPassword').post(_usersController2.default.recoverPassword);

    route.route('/storeBasicUserInfo').post(_usersController2.default.storeBasicUserInfo);
};

exports.default = routes;
//# sourceMappingURL=routes.js.map