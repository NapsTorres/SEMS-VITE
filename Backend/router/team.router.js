const multer = require('multer');
const { AddTeam, TeamsList, EditTeam, DeleteTeam, CoachList, AddPlayerInTeam, DeletePlayer, TeamInfo, UpdatePlayerStatus, UpdatePlayer } = require('../controller/teams/teams.controller');
const verifyToken = require('../middleware/verifyToken');

const router = require('express').Router();
const upload = multer();

router.post('/add', upload.single('teamLogo'), verifyToken, AddTeam);
router.get('/list', upload.none(), TeamsList);
router.put('/edit/:teamId', upload.single('teamLogo'), verifyToken, EditTeam);
router.delete('/delete/:teamId', upload.none(), verifyToken, DeleteTeam);
router.get('/coach-list', upload.none(), CoachList);
router.post('/add-player', upload.single('medicalCertificate'), verifyToken, AddPlayerInTeam);
router.delete('/delete-player/:playerId', upload.none(), verifyToken, DeletePlayer);
router.get('/info/:teamId', upload.none(), TeamInfo);
router.post('/update-player-status', upload.none(), verifyToken, UpdatePlayerStatus);
router.post('/edit-player', upload.single('medicalCertificate'), verifyToken, UpdatePlayer);

module.exports = router;