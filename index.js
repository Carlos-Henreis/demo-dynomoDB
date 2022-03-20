const express = require('express')
const app = express()

const AWS = require("aws-sdk")
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ 
  extended: false 
}))

const { PORT = '3000' } = process.env

app.get('/', (req, res) => {
  res.send('Hello teste!')
})


app.get('/tabelas', (req, res) => {
  const { REGION = 'us-east-1' } = process.env
  AWS.config.update({region: REGION})

  var dynamodb = new AWS.DynamoDB()

  var params = {}
  dynamodb.listTables(params, function(err, data) {
    if (err) console.error(err, err.stack) // an error occurred
    else res.send(data)
  });

})

app.post('/client', 
    body('email').isEmail().normalizeEmail(),
    body('name').exists(),
    body('salary').isCurrency(),
(req, res) => {
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      return res.status(400).json({
          success: false,
          errors: errors.array()
      });
  }
      
  const { REGION = 'us-east-1' } = process.env
  AWS.config.update({region: REGION})

  var params = {
    TableName: 'client',
    Item: {
      email: req.body.email,
      name: req.body.name,
      salary: req.body.salary
    }
  }

  var client = new AWS.DynamoDB.DocumentClient();
  client.put(params, function(err, data){
    if (err) {
      res.status(500).json({
        success: false,
        error: err,
        stack: err.stack
      });
    }
    else res.status(201).send()
  })
})

app.put('/client',
    body('email').isEmail().normalizeEmail(),
    body('name').exists(),
    body('salary').isCurrency(),
(req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
        success: false,
        errors: errors.array()
    });
  }
  const { REGION = 'us-east-1' } = process.env
  AWS.config.update({region: REGION})

  var params = {
    TableName: 'client',
    Key: {
      email: req.body.email,
      name: req.body.name 
    },
    UpdateExpression: 'set #s = :y',
    ExpressionAttributeNames: {
      '#s': 'salary'
    },
    ExpressionAttributeValues: {
      ':y': req.body.salary
    }
  }

  var client = new AWS.DynamoDB.DocumentClient();
  client.update(params, function(err, data){
    if (err) {
      res.status(500).json({
        success: false,
        error: err,
        stack: err.stack
      });
    }
    else res.status(204).send()
  })
})

app.delete('/client',
    body('email').isEmail().normalizeEmail(),
    body('name').exists(),
(req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
        success: false,
        errors: errors.array()
    });
  }
  const { REGION = 'us-east-1' } = process.env
  AWS.config.update({region: REGION})

  var params = {
    TableName: 'client',
    Key: {
      email: req.body.email,
      name: req.body.name 
    }
  }

  var client = new AWS.DynamoDB.DocumentClient();
  client.delete(params, function(err, data){
    if (err) {
      res.status(err.code).json({
        success: false,
        error: err,
        stack: err.stack
      });
    }
    else res.status(204).send()
  })
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})