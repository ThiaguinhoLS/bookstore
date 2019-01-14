const Book = require('../models/book')

function getBooks (req, res) {
  Book.find({}).exec()
    .then(books => {
      res.json(books)
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

function postBook (req, res) {
  const newBook = new Book(req.body)
  newBook.save()
    .then(book => {
      res.json({ message: 'Book successfully added!', book })
    })
    .catch(err => {
      res.status(206).send(err)
    })
}

function getBook (req, res) {
  Book.findById(req.params.id)
    .then(book => {
      res.json({ book })
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

function deleteBook (req, res) {
  Book.findByIdAndDelete(req.params.id)
    .then(result => {
      res.json({ message: 'Book successfully deleted', result })
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

function updateBook (req, res) {
  Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(book => {
      res.json({ message: 'Book updated', book })
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

module.exports = { getBooks, postBook, getBook, deleteBook, updateBook }
