const cookieSession = require("cookie-session")
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const app = express()
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

app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

app.use(session({ 
  saveUninitialized: true,
  secret: 'melody hensley is my spirit animal' 
}));

passport.serializeUser(function(user, done) {
  console.log('serialize user: ', user)
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  console.log('deserialize user: ', id)

  let user
  let err 

  try {
    user = await users.getUserByTwitterId(id)
    done(null, user)
  } catch (error) {
    console.log('error deserializing the user: ', error)
    done(new Error("Failed to deserialize an user"))
  }
});

passport.use(new TwitterStrategy({
  consumerKey: process.env.twitterKey,
  consumerSecret: process.env.twitterSecret,
  callbackURL: process.env.twitterCallback
},
async function(token, tokenSecret, profile, done) {
    const { id, username, displayName } = profile 
    
    try {
      const results = await users.findOrCreate({ id, username, displayName })
      console.log('result: ', results)
      done(null, profile)
    } catch (error) {
      console.log('error fetching user stuff: ', error)
    }

  }
))

// Enable CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('x-powered-by', 'serverless-express')
  console.log('request object: ', req)
  next()
})

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize())
app.use(passport.session())

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

app.post(`/users/login`, asyncHandler(users.login))
app.get(`/list/:list_id/:count`, asyncHandler(lists.getListData))
app.get(`/featuredLists`, asyncHandler(lists.getFeaturedLists))
app.get(`/mylists`, asyncHandler(lists.getMyLists))


app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', {
        successRedirect: CLIENT_HOME_PAGE_URL, //'/auth/login/success',
        failureRedirect: '/auth/login/failed'
    }))

app.get('/auth/login/success', asyncHandler(auth.loginSuccess))
app.get('/auth/login/failed', asyncHandler(auth.loginFailure))
    

app.use('/auth', authRoutes)

/**
 * Routes - Protected
 */

app.post(`/user`, passport.authenticate('jwt', { session: false }), asyncHandler(users.get))

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