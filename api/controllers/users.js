const users = require('../models/users')

const getUserByTwitterId = async (user) => {
  try {
    return await users.getUserByTwitterId(user)
  } catch (error) {
    console.log('error fetching user by twitter id: ', error)
  }
}

const findOrCreate = async ({ id, username, displayName }) => {
  try {
    if (!id) {
      throw new Error("user not provided")
    }

    console.log('typeof id: ', typeof id)
    const result = await users.findOrCreate({ id, username, displayName })
    console.log('findOrCreate result: ', JSON.stringify(result))
  } catch (error) {
    console.log("error finding or creating user: (user)", error)
  }
}

module.exports = {
  getUserByTwitterId,
  findOrCreate
}

// /**
//  * Controllers: Users
//  */

// const jwt = require('jsonwebtoken')
// const { users } = require('../models')
// const { comparePassword } = require('../utils')

// /**
//  * Save
//  * @param {*} req 
//  * @param {*} res 
//  * @param {*} next
//  */
// const register = async (req, res, next) => {

//   try {
//     await users.register(req.body)
//   } catch (error) {
//     return res.status(400).json({ error: error.message })
//   }

//   let user
//   try {
//     user = await users.getByEmail(req.body.email)
//   } catch (error) {
//     console.log(error)
//     return next(error, null)
//   }

//   const token = jwt.sign(user, process.env.tokenSecret, {
//     expiresIn: 604800 // 1 week
//   })

//   res.json({ message: 'Authentication successful', token })
// }

// /**
//  * Sign a user in
//  * @param {*} req 
//  * @param {*} res 
//  * @param {*} next 
//  */
// const login = async (req, res, next) => {

//   let user
//   try { user = await users.getByEmail(req.body.email) }
//   catch (error) { return done(error, null) }

//   if (!user) {
//     return res.status(404).send({ error: 'Authentication failed. User not found.' })
//   }

//   const isCorrect = comparePassword(req.body.password, user.password)
//   if (!isCorrect) {
//     return res.status(401).send({ error: 'Authentication failed. Wrong password.' })
//   }

//   const token = jwt.sign(user, process.env.tokenSecret, {
//     expiresIn: 604800 // 1 week
//   })

//   res.json({ message: 'Authentication successful', token })
// }

// /**
//  * Get a user
//  * @param {*} req 
//  * @param {*} res 
//  * @param {*} next 
//  */
// const get = async (req, res, next) => {
//   const user = users.convertToPublicFormat(req.user)
//   res.json({ user })
// }

// const findOrCreate = ({ twitterId }, cb) => {
//   const obj = (
//     {
//       username: "Test the Auth",
//       id: twitterId,
//       twitterId
//     }
//   )

//   cb(null, obj)
// }


// const findById = (twitterId, cb) => {
//   const obj = (
//     {
//       username: "Test the Auth",
//       id: 0,
//       twitterId
//     }
//   )

//   cb(null, obj)
// }

// module.exports = {
//   register,
//   login,
//   get,
//   findOrCreate,
//   findById
// }