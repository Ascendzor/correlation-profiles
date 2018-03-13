const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'})
const secrets = require('./secrets')
const Mailjet = require('node-mailjet').connect(secrets.thingy, secrets.thingy2);
const jsonwebtoken = require('jsonwebtoken')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

// const body = {
//   password: 'abceasyas123',
//   email: 'abc@easy.as'
// }
module.exports.signin = function(event, context, callback) {
  const {email} = JSON.parse(event.body)
  const token = jsonwebtoken.sign({profileId: email}, secrets.privateKey)

  Mailjet.post("send").request({
    	FromEmail: 'development@bitbybit.nz',
    	FromName: 'bitbybit',
    	Subject: 'Sign in to Correlations',
    	'Text-part': 'Hello, here is your sign in url https://ascendzor.github.io/correlation-app/#jwt='+token,
    	Recipients: [{'Email': email}]
  }).then(res => {
    callback(null, {statusCode: 200})
  }).catch(err => {
    console.log(err)
    callback(null, {statusCode: 500})
  })
}

module.exports.get = function(event, context, callback) {
  const {password} = event.queryStringParameters

  if(!password) return callback(null, {statusCode: 500, body: 'password was incorrect'})

  dynamoDb.scan({TableName: 'correlation-profiles'}, (err, res) => {
    if(err) return callback(err)
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(res.Items)
    })
  })
}
