const express = require('express')
const passport = require('passport')
const authRoutes = express.Router()
const { auth } = require('../controllers')

const asyncHandler = fn => (req, res, next) => {
    return Promise
      .resolve(fn(req, res, next))
      .catch(next);
  };

authRoutes.get('/twitter', passport.authenticate('twitter'))

authRoutes.get('/twitter/redirect', asyncHandler(auth.redirect))

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

module.exports = authRoutes