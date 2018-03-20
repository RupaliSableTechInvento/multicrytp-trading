import usersController from './controller/usersController';
import tradeController from './controller/tradeController';
import authController from './controller/authController';
import path from 'path';
const routes = (route) => {
    route.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname+'/../client/'+'index.html'));
    });
    route.route('/login')
    .post(authController.login);

    route.route('/register')
    .post(authController.register);

    route.route('/users')
    .get(usersController.getAll)
    .put(usersController.update);

    route.route('/users/changePassword')
    .post(usersController.changePassword);

    route.route('/users/changeEmail')
    .post(usersController.changeEmail);

    route.route('/users/:id')
    .get(usersController.getOne)
    .delete(usersController.delete);

    route.route('/seller')
    .get(usersController.getOne)
    .put(usersController.update)
    .delete(usersController.delete);

    route.route('/trade')
    .get(tradeController.getAll)
    .post(tradeController.create)
    .patch(tradeController.update);

};

export default routes;
