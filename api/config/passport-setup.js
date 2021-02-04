const passport = require("passport");
const TwitterStrategy = require("passport-twitter");
const users = require('../controllers/users')

passport.serializeUser(function(user, done) {
    console.log('serialize user: ', user)
    done(null, user.twitter_id);
  });
  
  passport.deserializeUser(async function(id, done) {
    console.log('deserialize user: ', id)
  
    let user
  
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
        const userResult = await users.findOrCreate({ id, username, displayName })
        console.log('findOrCreateUser: ', userResult)
        done(null, userResult)
      } catch (error) {
        console.log('error fetching user stuff: ', error)
      }
  
    }
  ))