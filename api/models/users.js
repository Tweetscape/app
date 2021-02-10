const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
})

const findOrCreate = async ({ id, username, displayName }) => {
  // step 1: set all the users as not current user
  // step 2: set current user as "currentUser = true"

  console.log('does find or create even run?')
  
  try {
    const existingUser = await getUserByTwitterId(id)
    console.log('existing user: ', existingUser)

    const scanParams = {
      TableName: "users-table-dev-twitter-users"
    }

    const users = (await dynamodb.scan(scanParams).promise())
    console.log('users: ', users)
    
    if (users && users.Items) {
      Promise.all(
        users.Items.map(async (user) => {
          const userId = user.user_id 

          const updateParam = {
            TableName: "users-table-dev-twitter-users",
            Item: {
              ...user,
              currentUser: user.twitter_id === id 
            }
          }

          console.log('update param: ', updateParam)
          let result = await dynamodb.put(updateParam).promise()
          console.log('update result: ', result)
        })
      )
    }
  
    if (existingUser) {

      const updateCurrent = {
        TableName: "users-table-dev-twitter-users",
        Item: {
          ...existingUser,
          currentUser: true
        }
      }
      console.log('update current params: ', updateCurrent)
      const updateExistingUser = await dynamodb.put(updateCurrent).promise()
      console.log('update existing user: ', updateExistingUser)
      return existingUser;

    } else {
      // User does not exist 

      const params = {
        TableName: "users-table-dev-twitter-users",
        Item: {
          twitter_id: id,
          user_id: uuidv4(),
          username,
          display_name: displayName,
          currentUser: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      }
  
      console.log('creating user with twitter_id: ', id)  
      console.log('creating user params: ', params)
      const newUser = await dynamodb.put(params).promise()     
      console.log('new user created: ', newUser)
    }
  } catch (error) {
    console.log('error with findOrCreate: ', error)
  }
}

const getUserByTwitterId = async (userId) => {
  try {
    if (!userId) {
      throw new Error('error no userid provided')
    }

    const params = {
      TableName: "users-table-dev-twitter-users",
      Key: { twitter_id: userId }
    }

    console.log('getting user by twitter_id!: ', params)

    const result = await dynamodb.get(params).promise()    
    console.log('result getting user by twitter: ', result)

    if (result.Item) {
      console.log('result: ', result.Item)
      const updateParams = {
        TableName: "users-table-dev-twitter-users",
        Item: {
          ...result.Item,
          currentUser: true
        }
      }

      console.log('update params getUserBTid: ', updateParams)
      const updatedItem = await dynamodb.put(updateParams).promise()         
      return result.Item 
    }
    return result.Item 
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  findOrCreate,
  getUserByTwitterId
}
