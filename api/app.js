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

/**
 * Configure Passport
 */

app.use(session({ 
  saveUninitialized: true,
  secret: 'melody hensley is my spirit animal' 
}));

// try { require('./config/passport')(passport) }
// catch (error) { console.log(error) }

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  users.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new TwitterStrategy({
  consumerKey: "m3nTmPs8UpxT9W2CWmtEZ6x8z", //TWITTER_CONSUMER_KEY,
  consumerSecret: "n7Kosz80d3MAfVs7nW2JYuBEMVM4vqAU3LvSh1E7KwzKPlrkYA", //TWITTER_CONSUMER_SECRET,
  callbackURL: "https://7ta28wx6t4.execute-api.us-east-1.amazonaws.com/auth/twitter/callback"
},
function(token, tokenSecret, profile, done) {
    // user ... find or create 
    console.log('passport initialization!')
    console.log('token: ', token)
    console.log('secret: ', tokenSecret)
    console.log('profile: ', profile)

    // return done(null, { twitterId: profile.id, name: "Ben" })

    users.findOrCreate({ twitterId: profile.id }, function(err, user) {
      if (err) { 
        console.log('err finding or creating user: ', err)
        return done(err) 
      }
      console.log('user has authenticating: ', user)
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

// Since Express doesn't support error handling of promises out of the box,
// this handler enables that
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
app.get(`/mylists`, passport.authenticate('twitter'), asyncHandler(lists.getMyLists))


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