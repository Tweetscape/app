const cookieSession = require("cookie-session")
const express = require('express')
const session = require('express-session')
const bodyparser = require('body-parser')
const cors = require('cors')
const app = express()
const cookieParser = require("cookie-parser");
const passport = require('passport')
const passportSetup = require("./config/passport-setup");

const {
  users,
  lists,
  auth
} = require('./controllers')

const authRoutes = require('./routes/auth-routes')
const COOKIE_KEY = "thisappisawesome"
const CLIENT_HOME_PAGE_URL = "http://localhost:3000/dashboard";

app.use(
  cookieSession({
    name: "twitter-auth-session",
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 100
  })
);

app.use(cookieParser())
app.use(bodyparser())

app.use(passport.initialize())
app.use(passport.session())

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  })
);

app.use(express.json())

const asyncHandler = fn => (req, res, next) => {
  return Promise
    .resolve(fn(req, res, next))
    .catch(next);
};

app.options(`*`, (req, res) => {
  res.status(200).send()
})

app.use('/auth', authRoutes)

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
  } else {
    next();
  }
};

app.get("/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies
  });
});

app.get(`/list/:list_id/`, asyncHandler(lists.getListData))
app.get(`/tweets/:list_id`, asyncHandler(lists.getTweetsForList))
app.get(`/featuredLists`, asyncHandler(lists.getFeaturedLists))
app.get(`/mylists`, asyncHandler(lists.getMyLists))

app.get(`/*`, (req, res) => {
  res.status(404).send('Route not found')
})

app.use(function (err, req, res, next) {
  console.error(err)
  res.status(500).json({ error: `Internal Serverless Error - "${err.message}"` })
})

module.exports = app