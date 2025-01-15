const express = require('express');
const controller = require('./../controllers/taskcontrollers');
const conn = require('./../utils/dbconn');
const router = express.Router();

router.get('/', controller.getHome);
router.get('/taskboard', controller.getTaskBoard);
router.get('/tasktable', controller.getTaskTable);
router.get('/edittask/:id', controller.getTask);
router.get('/completetask/:id', controller.completeTask);
router.get('/login', controller.getLogin);
router.get('*', controller.get404);

router.post('/addtask', controller.addTask);
router.post('/completetask/:id', controller.completeTask);
router.post('/edittask/:id', controller.editTask);
router.post('/deletetask/:id', controller.deleteTask);

module.exports = router;
