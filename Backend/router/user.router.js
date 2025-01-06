const multer = require('multer');
const { Registration, Login, UserList, UpdateUser, CoachManagement } = require('../controller/user/user.controller');
const verifyToken = require('../middleware/verifyToken');

const router = require('express').Router();
const upload = multer();

router.post('/registration', upload.none(), verifyToken, Registration);
router.post('/login', upload.none(), Login);
router.get('/list', upload.none(), UserList);
router.post('/update', upload.none(), verifyToken, UpdateUser);
router.get('/coach/:coachId', upload.none(), CoachManagement);

module.exports = router;