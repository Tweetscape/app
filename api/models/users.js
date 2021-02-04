const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
})

const findOrCreate = async ({ id, username, displayName }) => {
  try {
    const existingUser = await getUserByTwitterId(id)
  
    if (existingUser) {
      console.log('existing user: ', existingUser)
      return existingUser
    }
  
    const params = {
      TableName: "users-table-dev-twitter-users",
      Item: {
        twitter_id: id,
        user_id: uuidv4(),
        username,
        display_name: displayName,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    }

    console.log('creating user with twitter_id: ', id)  
    return await dynamodb.put(params).promise()     
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
    return result.Item 
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  findOrCreate,
  getUserByTwitterId
}
