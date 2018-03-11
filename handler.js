const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'})
const dynamoDb = new AWS.DynamoDB.DocumentClient()
const uuid = require('uuid')

// const body = {
//   password: 'abceasyas123',
//   email: 'abc@easy.as'
// }
module.exports.create = function(event, context, callback) {
  const {password, email} = JSON.parse(event.body)
  const params = {
    TableName: 'correlation-profiles',
    Item: {password, email}
  }

  dynamoDb.put(params, err => {
    if(err) return callback(err)
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({message: 'your food has been saved'})
    })
  })
}

// const body = {
//   password: 'abceasyas123'
// }
module.exports.get = function(event, context, callback) {
  const {password} = JSON.parse(event.body)
  console.log(event)
  if(!password) return callback({statusCode: 500, body: 'password was incorrect'})

  dynamoDb.scan({TableName: 'correlation-profiles'}, (err, res) => {
    if(err) return callback(err)
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(res.Items)
    })
  })
}
