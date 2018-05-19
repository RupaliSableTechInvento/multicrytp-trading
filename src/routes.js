import usersController from './controller/usersController';
import tradeController from './controller/tradeController';
import authController from './controller/authController';
import path from 'path';
const routes = (route) => {
  route.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../client/' + 'index.html'));
  });
  route.get('#/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../client/' + 'index.html'));
  });

  /*   route.get('/recover', (req, res) => {
      console.log("req", req.query.accessToken)
      res.redirect('/#/resetpassword?accessToken=' + req.query.accessToken);
    }); */
  route.get('/recover', (req, res) => {
    // console.log("router.js in recover access token", req.query.accessToken)
    res.redirect('/#/recoverPassword?accessToken=' + req.query.accessToken);

    // res.sendFile(path.resolve(__dirname + '/../client/assets/snippets/pages/user/' + 'recover.html'));
  });


  route.route('/login')
    .post(authController.login);

  route.route('/register')
    .post(authController.register);

  // route.route('/users')
  // .get(usersController.getAll)
  // .put(usersController.update);

  route.route('/forgetPassword')
    .post(usersController.forgetPassword);


  route.route('/users/changeEmail')
    .post(usersController.changeEmail);

  route.route('/users')
    //console.log("user=>>", req)
    .get(usersController.getAll)
    //.get(usersController.getOne)
    //.delete(usersController.delete);

  route.route('/seller')
    .get(usersController.getOne)
    .put(usersController.update)
    .delete(usersController.delete);

  route.route('/cp/:token')
    .get(usersController.varifyToken);

  route.route('/emailvarification')
    .post(usersController.emailVarification);

  route.route('/ev/:token')
    .get(usersController.emailVarified);

  route.route('/trade')
    .get(tradeController.getAll)
    .post(tradeController.create)
    .patch(tradeController.update);

  route.route('/tradeByCurrencyLoc')
    .get(tradeController.getByCurrencyLoc)

  route.route('/recoverPassword')
    .post(usersController.recoverPassword);

  route.route('/users/storeBasicUserInfo')
    .post(usersController.storeBasicUserInfo);

  route.route('/users/changePassword')
    .post(usersController.changePassword);
  route.route('/logout')
    .get(authController.logout)
};

export default routes;