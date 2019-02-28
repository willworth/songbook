const path = require('path');
require('dotenv').load();  //dev only!  #TODO if (process.env.NODE_ENV !== 'production') {require('dotenv').load();}

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const chalk = require('chalk');
const db = process.env.dbstring;
const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: db,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');


// const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const defaultRoutes = require('./routes/default');
const songRoutes = require('./routes/songs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'khjlshhhhhhe',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);
// app.use('/', require('./routes/default.js'));

app.use('/', authRoutes);
app.use('/music', songRoutes);
// app.use('/music', require('./routes/songs.js'));


// app.get('/500', errorController.get500);

// app.use(errorController.get404);

// app.use((error, req, res, next) => {

//   res.status(500).render('500', {
//     pageTitle: 'Error!',
//     path: '/500',
//     isAuthenticated: req.session.isLoggedIn
//   });
// });
const PORT = process.env.PORT || 3001;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log(chalk.gray.bgGreen.bold('MongoDB Connected Successfully')))
  .then(result => {
    app.listen(PORT, 
      console.log(chalk.bgBlue.black(`STARTING CRUDAUTHRESTART `)), 
      console.log(chalk.bgYellow.black(`Express Server now running → PORT ${PORT}`)));
  })
  .catch(err => {
    console.log(err);
  });
