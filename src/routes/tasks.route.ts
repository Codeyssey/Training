import express from 'express';
import taskMethods from '../controllers/task.controller';
import authorize_LoggedIn_User from '../middleWare/authorize.middleware';
import validateTask from '../middleWare/validateTask.middleware';
import validateEmail from '../middleWare/validateEmail.middleware';


const router = express.Router();
// Get All Tasks
router.get('/', authorize_LoggedIn_User, taskMethods.getTasks);
// Add a Task
router.post('/add', authorize_LoggedIn_User, validateTask, taskMethods.addTask);
// Delete a Task
router.post('/delete', authorize_LoggedIn_User, taskMethods.deleteTask);
// Add Collab
router.post('/addCollab', validateEmail, taskMethods.addCollaborator);
// Edit a Task
router.put('/:editTask', taskMethods.editTask);

export default router;