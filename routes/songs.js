const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const songController = require('../controllers/songController');
const isAuth = require('../middleware/is-auth');


router.get('/test', songController.test);


//////////////////

const { check, body } = require('express-validator/check');


const User = require('../models/user');
///////////////////





router.get('/addsong', function (req, res, next) {
    console.log(chalk.yellow('addsong get route'));
    res.render('addsong', {
      pageTitle: "Add Song",
      user: "manolo",
      age: 23
    });
  });


router.post('/addsong',isAuth,  songController.createSong);


router.get('/allsongs', isAuth, songController.getSongs);

//this needs to change to GET editsong to differentiante 
router.get('/songs/:songId/edit',isAuth,  songController.editSong);

router.post('/updatesong',isAuth,  songController.postUpdateSong);


router.post('/delete-song',isAuth,  songController.postDeleteSong);

//this must be last, as it'll trigger before others and they'll never run.  Thus /songs/delete must be above in this list
router.get('/songs/:songId',isAuth,  songController.getSong);

module.exports = router;