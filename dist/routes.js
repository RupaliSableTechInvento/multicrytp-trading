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

var _messagesController = require('./controller/messagesController');

var _messagesController2 = _interopRequireDefault(_messagesController);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = function routes(route) {

  route.get('/', function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname + '/../client/' + 'index.html'));
  });
  route.get('#/', function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname + '/../client/' + 'index.html'));
  });

  /*   route.get('/recover', (req, res) => {
      console.log("req", req.query.accessToken)
      res.redirect('/#/resetpassword?accessToken=' + req.query.accessToken);
    }); */
  route.get('/recover', function (req, res) {
    // console.log("router.js in recover access token", req.query.accessToken)
    res.redirect('/#/recoverPassword?accessToken=' + req.query.accessToken);

    // res.sendFile(path.resolve(__dirname + '/../client/assets/snippets/pages/user/' + 'recover.html'));
  });

  route.route('/login').post(_authController2.default.login);

  route.route('/register').post(_authController2.default.register);

  // route.route('/users')
  // .get(usersController.getAll)
  // .put(usersController.update);

  route.route('/forgetPassword').post(_usersController2.default.forgetPassword);

  // route.route('/friendReq')
  //   .post(messagesController.friendReq);
  route.route('/friendReq').post(_usersController2.default.friendReq);

  route.route('/addMessage').post(_usersController2.default.addMessage);

  route.route('/getUserInfo').get(_usersController2.default.getUserInfo);

  route.route('/addUserProfilePic').post(_usersController2.default.addUserProfilePic);

  route.route('/getAllMessagesWithFriend').get(_usersController2.default.getAllMessagesWithFriend);
  route.route('/getAllUnreadMessages').get(_usersController2.default.getAllUnreadMessages);
  route.route('/getFriendsList').get(_usersController2.default.getFriendsList);

  route.route('/acceptFriendRequest').post(_usersController2.default.acceptFriendRequest);

  route.route('/users/changeEmail').post(_usersController2.default.changeEmail);

  route.route('/setMsgRead').post(_usersController2.default.setMsgRead);

  route.route('/userProfile').get(_usersController2.default.userProfile);

  route.route('/users')
  //console.log("user=>>", req)
  .get(_usersController2.default.getAll);
  //.delete(usersController.delete);

  route.route('/seller').get(_usersController2.default.getOne).put(_usersController2.default.update).delete(_usersController2.default.delete);

  route.route('/sellerBuyerInfo').get(_tradeController2.default.getOne);

  route.route('/cp/:token').get(_usersController2.default.varifyToken);

  route.route('/isVerified').get(_usersController2.default.isVerified);

  route.route('/getPriceEquation').get(_tradeController2.default.getPriceEquation);
  route.route('/emailverification').post(_usersController2.default.emailVerification);

  route.route('/ev/:token').get(_usersController2.default.emailVerified);

  route.route('/trade').get(_tradeController2.default.getAll).post(_tradeController2.default.create).patch(_tradeController2.default.update);

  route.route('/tradeByCurrencyLoc').get(_tradeController2.default.getByCurrencyLoc);

  route.route('/getTrade').get(_tradeController2.default.getTrade);

  route.route('/unfriend').post(_usersController2.default.unfriend);

  route.route('/unblockUser').post(_usersController2.default.unblockUser);

  route.route('/blockUser').post(_usersController2.default.blockUser);
  route.route('/turstUser').post(_usersController2.default.turstUser);
  route.route('/getQuickByCryptocurrency').get(_tradeController2.default.getQuickByCryptocurrency);

  route.route('/recoverPassword').post(_usersController2.default.recoverPassword);

  route.route('/users/addUserInfo').post(_usersController2.default.addUserInfo);

  route.route('/users/storeBasicUserInfo').post(_usersController2.default.storeBasicUserInfo);

  route.route('/users/changePassword').post(_usersController2.default.changePassword);

  route.route('/getActiveUser').get(_authController2.default.getActiveUser);

  route.route('/logout').get(_authController2.default.logout);
};

exports.default = routes;
//# sourceMappingURL=routes.js.map