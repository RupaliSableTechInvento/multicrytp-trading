import usersController from './controller/usersController';
import authController from './controller/authController';
import path from 'path';
const routes = (route) => {
    route.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname+'/../client/'+'index.html'));
    });

    route.route('/login')
    .get(authController.login); 

    route.route('/register')
    .post(authController.register);

    route.route('/users')
    .get(usersController.getAll)
    .post(usersController.create);

    route.route('/users/:id')
    .get(usersController.getOne)
    .put(usersController.update)
    .delete(usersController.delete)
};

export default routes;
