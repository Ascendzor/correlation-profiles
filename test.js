const handler = require('./handler')

handler.create({body: JSON.stringify({password: 'abc', email: 'wow.troymare@gmail.com'})}, null, (err, res) => {
  console.log(err)
  console.log(res)

  handler.get({body: JSON.stringify({password: 'abc'})}, null, (err, res) => {
    console.log(err)
    console.log(res)
  })
})
