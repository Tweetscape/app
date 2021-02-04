const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
})

const findOrCreate = async ({ id, username, displayName }) => {
  try {
    console.log('find or create user of id: ', id)
    const existingUser = await getUserByTwitterId(id)
  
    if (existingUser) {
      console.log('existing user: ', existingUser)
      return existingUser
    }
  
    console.log('creating user with twitter_id: ', id)
  
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
  
    console.log('typeof: ', typeof userId)

    const params = {
      TableName: "users-table-dev-twitter-users",
      Key: { twitter_id: userId }
    }

    console.log('getting user by twitter_id!: ', params)

    const result = await dynamodb.get(params).promise()    
    console.log('result: ', result)
    return result 
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  findOrCreate,
  getUserByTwitterId
}
