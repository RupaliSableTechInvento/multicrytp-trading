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

  /*   route.get('/recover', (req, res) => {
      console.log("req", req.query.accessToken)
      res.redirect('/#/resetpassword?accessToken=' + req.query.accessToken);
    }); */
  route.get('/recover', function (req, res) {
    console.log("req=> in recover", req.query.accessToken);
    res.sendFile(_path2.default.resolve(__dirname + '/../client/' + 'recover.html'));
  });

  route.route('/login').post(_authController2.default.login);

  route.route('/register').post(_authController2.default.register);

  // route.route('/users')
  // .get(usersController.getAll)
  // .put(usersController.update);

  route.route('/forgetPassword').post(_usersController2.default.forgetPassword);

  route.route('/users/changeEmail').post(_usersController2.default.changeEmail);

  route.route('/users')
  //console.log("user=>>", req)
  .get(_usersController2.default.getAll);
  //.get(usersController.getOne)
  //.delete(usersController.delete);

  route.route('/seller').get(_usersController2.default.getOne).put(_usersController2.default.update).delete(_usersController2.default.delete);

  route.route('/cp/:token').get(_usersController2.default.varifyToken);

  route.route('/emailvarification').post(_usersController2.default.emailVarification);

  route.route('/ev/:token').get(_usersController2.default.emailVarified);

  route.route('/trade').get(_tradeController2.default.getAll).post(_tradeController2.default.create).patch(_tradeController2.default.update);

  route.route('/tradeByCurrencyLoc').get(_tradeController2.default.getByCurrencyLoc);

  route.route('/recoverPassword').post(_usersController2.default.recoverPassword);

  route.route('/users/storeBasicUserInfo').post(_usersController2.default.storeBasicUserInfo);

  route.route('/users/changePassword').post(_usersController2.default.changePassword);
  route.route('/logout').get(_authController2.default.logout);
};

exports.default = routes;
//# sourceMappingURL=routes.js.map