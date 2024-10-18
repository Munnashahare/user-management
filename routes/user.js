const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user');
const {registerValidator, loginValidator, roleValidator, editRoleValidator, assignRoleValidator } = require('../utils/validator')

// user routes
userRouter.post('/register', registerValidator, userController.register);
userRouter.post('/login', loginValidator, userController.login);
userRouter.post('/fetch-users', userController.fetchAllUsers);
userRouter.get('/fetch-user/:id', userController.fetchUserDetails);
userRouter.put('/edit-user', userController.updateUserDetails);
userRouter.put('/assign-role', assignRoleValidator, userController.assignRole);
userRouter.delete('/remove-user', userController.removeOrDisableUser);

// role routes
userRouter.post('/create-role', roleValidator, userController.addRole);
userRouter.get('/fetch-roles', userController.fetchAllRoles);
userRouter.get('/fetch-role/:id', userController.fetchRoleById);
userRouter.put('/edit-role', editRoleValidator, userController.updateRoleDetails);
userRouter.delete('/remove-role/:id', userController.removeRole);

module.exports = userRouter;