const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const config = require('config')
const book = require('./app/routes/book')
const app = express()
const port = 8080

// database connection
const options = {
  keepAlive: true,
  connectTimeoutMS: 30000,
  useNewUrlParser: true
}
mongoose.connect(config.db, options)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection Error:'))

if (config.util.getEnv('NODE_ENV') !== 'test') {
  app.use(morgan('combined'))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/json' }))

app.get('/', (req, res) => res.json({ message: 'Welcome to our bookstore' }))

app.route('/book')
  .get(book.getBooks)
  .post(book.postBook)

app.route('/book/:id')
  .get(book.getBook)
  .delete(book.deleteBook)
  .put(book.updateBook)

app.listen(port, () => console.log('Application running'))

module.exports = app
