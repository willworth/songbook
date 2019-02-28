const express = require('express');
const router = express.Router();


// Welcome Page
router.get('/', (req, res) => {
    console.log(req.body);
  res.render('index')
  }
);


// Dashboard
router.get('/dashboard',  (req, res) =>
  res.render('dashboard', {
  })
);

module.exports = router;
