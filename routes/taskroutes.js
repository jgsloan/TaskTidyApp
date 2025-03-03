const express = require('express');
const controller = require('./../controllers/taskcontrollers');
const router = express.Router();

router.get('/', controller.getHome);
router.get('/taskboard', controller.getTaskBoard);
router.get('/tasktable', controller.getTaskTable);
router.get('/edittask/:id', controller.getTask);
router.get('/completetask/:id', controller.completeTask);
router.get('/login', controller.getLogin);
router.get('/logout', controller.getLogout);
router.get('/register', controller.getRegister);
router.get('/sort/:id', controller.getSortedTasks);
router.get('/filter/:id', controller.filterTasks);
router.get('/error', controller.geterror);
router.get('*', controller.get404);

router.post('/addtask', controller.addTask);
router.post('/completetask/:id', controller.completeTask);
router.post('/edittask/:id', controller.editTask);
router.post('/deletetask/:id', controller.deleteTask);
router.post('/login', controller.postLogin);
router.post('/register', controller.postRegister);

module.exports = router;
