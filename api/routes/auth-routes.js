const express = require('express')
const passport = require('passport')
const authRoutes = express.Router()
const { auth } = require('../controllers')

const asyncHandler = fn => (req, res, next) => {
    return Promise
      .resolve(fn(req, res, next))
      .catch(next);
  };

// authRoutes.get('/twitter', asyncHandler(auth.authenticate))
authRoutes.get('/twitter', passport.authenticate('twitter'))

authRoutes.get('/login/success', asyncHandler(auth.loginSuccess))
authRoutes.get('/login/failed', asyncHandler(auth.loginFailure))


authRoutes.get('/twitter/redirect', asyncHandler(auth.redirect))

authRoutes.use(function (req, res, next) {
    console.log(req.protocol)     // "https"
    console.log(req.hostname)     // "example.com"
    console.log(req.path)         // "/creatures"
    console.log(req.originalUrl)  // "/creatures?filter=sharks"
    console.log(req.subdomains)   // "['ocean']"    
})

authRoutes.get('/twitter/callback', function(req, res, next) {
    console.log('request to - /twitter/callback')
    console.log(req.protocol)     // "https"
    console.log(req.hostname)     // "example.com"
    console.log(req.path)         // "/creatures"
    console.log(req.originalUrl)  // "/creatures?filter=sharks"
    console.log(req.subdomains)   // "['ocean']" 
    console.log('end of request')  
    next()    
})

// authRoutes.get('/twitter/callback', 
//     passport.authenticate('twitter', {
//         successRedirect: '/',
//         failureRedirect: '/auth/login/failed'
//     }))

// authRoutes.get('/twitter/callback', asyncHandler(auth.loginSuccess))

module.exports = authRoutes



// auth/twitter => authenticate with passport
// auth/login/success => returns login success response  with user info
// auth/login/failed => failed message 
// auth/logout => logout & redirect 
// auth/twitter/redirect => redirect to home page if login succeeded