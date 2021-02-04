const cookieSession = require("cookie-session")
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const app = express()
const cookieParser = require("cookie-parser");
const passportSetup = require("./config/passport-setup");
const passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy

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
    name: "session",
    keys: [COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100
  })
);

app.use(cookieParser())

// initialize passport
app.use(passport.initialize())
// deserialize cookie from the browser
app.use(passport.session())

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  })
);

// Enable CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('x-powered-by', 'serverless-express')
  console.log('request object: ', req)
  next()
})

// Enable JSON use
app.use(express.json())

const asyncHandler = fn => (req, res, next) => {
  return Promise
    .resolve(fn(req, res, next))
    .catch(next);
};

app.options(`*`, (req, res) => {
  res.status(200).send()
})

app.get(`/list/:list_id/:count`, asyncHandler(lists.getListData))
app.get(`/featuredLists`, asyncHandler(lists.getFeaturedLists))
app.get(`/mylists`, asyncHandler(lists.getMyLists))
app.use('/auth', authRoutes)

/**
 * Routes - Catch-All
 */

app.get(`/*`, (req, res) => {
  res.status(404).send('Route not found')
})

/**
 * Error Handler
 */
app.use(function (err, req, res, next) {
  console.error(err)
  res.status(500).json({ error: `Internal Serverless Error - "${err.message}"` })
})

module.exports = app