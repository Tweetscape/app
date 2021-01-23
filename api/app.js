const express = require('express')
const session = require('express-session')
const app = express()
const passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy

const {
  users,
  lists,
  auth
} = require('./controllers')

const authRoutes = require('./routes/auth-routes')

app.use(session({ 
  saveUninitialized: true,
  secret: 'melody hensley is my spirit animal' 
}));

passport.serializeUser(function(user, done) {
  console.log('serialize user: ', user)
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserialize user: ', id)
  users.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new TwitterStrategy({
  consumerKey: process.env.twitterKey,
  consumerSecret: process.env.twitterSecret,
  callbackURL: process.env.twitterCallback
},
function(token, tokenSecret, profile, done) {
    console.log('profile: ', profile)

    users.findOrCreate({ twitterId: profile.id }, function(err, user) {
      if (err) { 
        console.log('err finding or creating user: ', err)
        return done(err) 
      }
      console.log('user has authenticated: ', user)
      return done(err, user)
    })
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
        successRedirect: '/auth/login/success',
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