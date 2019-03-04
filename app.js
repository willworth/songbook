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
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: db,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');


const authRoutes = require('./routes/auth');
// const defaultRoutes = require('./routes/default');
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


app.use('/', authRoutes);
app.use('/music', songRoutes);

const PORT = process.env.PORT || 3001;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log(chalk.gray.bgGreen.bold('MongoDB Connected Successfully')))
  .then(result => {
    app.listen(PORT, 
      console.log(chalk.bgBlue.black(`STARTING SONGBOOK `)), 
      console.log(chalk.bgYellow.black(`Express Server now running → PORT ${PORT}`)));
  })
  .catch(err => {
    console.log(err);
  });
