/* globals describe beforeEach it */
const Book = require('../app/models/book')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const expect = chai.expect

chai.use(chaiHttp)

describe('Books', () => {
  beforeEach(done => {
    Book.deleteMany({})
      .then(() => done())
  })

  describe('/GET book', () => {
    it('Get all books', done => {
      chai.request(server)
        .get('/book')
        .end((err, res) => {
          if (err) done(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('array')
          expect(res.body.length).to.equal(0)
          done()
        })
    })
  })

  describe('/POST book', () => {
    it('It should not POST a book without pages field', done => {
      const book = {
        title: 'The Lord of the Rings',
        author: 'J.R.R Tolkien',
        year: 1954
      }
      chai.request(server)
        .post('/book')
        .send(book)
        .end((err, res) => {
          if (err) done(err)
          expect(res).to.have.status(206)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('errors')
          expect(res.body.errors).to.have.property('pages')
          expect(res.body.errors.pages).to.have.property('kind').equal('required')
          done()
        })
    })

    it('It should POST a book', done => {
      const book = {
        title: 'The Lord of the Rings',
        author: 'J.R.R Tolkien',
        year: 1954,
        pages: 1170
      }
      chai.request(server)
        .post('/book')
        .send(book)
        .end((err, res) => {
          if (err) done(err)
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('Book successfully added!')
          expect(res.body.book).to.have.property('title')
          expect(res.body.book).to.have.property('author')
          expect(res.body.book).to.have.property('year')
          expect(res.body.book).to.have.property('pages')
          done()
        })
    })
  })

  describe('/GET/:id book', () => {
    it('It should GET a book by the given id', done => {
      const book = new Book({
        title: 'The Lord of the Rings',
        author: 'J.R.R Tolkien',
        year: 1954,
        pages: 1170
      })
      book.save()
        .then(book => {
          chai.request(server)
            .get(`/book/${book.id}`)
            .end((err, res) => {
              if (err) done(err)
              expect(res).to.have.status(200)
              expect(res.body).to.be.a('object')
              expect(res.body.book).to.have.property('_id').equal(book.id)
              expect(res.body.book).to.have.property('title')
              expect(res.body.book).to.have.property('author')
              expect(res.body.book).to.have.property('pages')
              expect(res.body.book).to.have.property('year')
              done()
            })
        })
    })
  })

  describe('/PUT/:id book', () => {
    it('It should UPDATE a book given the id', done => {
      const book = new Book({
        title: 'The Chronicles of Narnia',
        author: 'C.S Lewis',
        year: 1948,
        pages: 778
      })
      book.save()
        .then(book => {
          chai.request(server)
            .put(`/book/${book.id}`)
            .send({ year: 1950 })
            .end((err, res) => {
              if (err) done(err)
              expect(res).to.have.status(200)
              expect(res).to.be.a('object')
              expect(res.body).to.have.property('message').equal('Book updated')
              expect(res.body.book).to.have.property('year').equal(1950)
              done()
            })
        })
    })
  })

  describe('/DELETE/:id book', () => {
    it('It should DELETE a book given the id', done => {
      const book = new Book({
        title: 'The Chronicles of Narnia',
        author: 'C.S Lewis',
        year: 1948,
        pages: 778
      })
      book.save()
        .then(book => {
          chai.request(server)
            .delete(`/book/${book.id}`)
            .end((err, res) => {
              if (err) done(err)
              expect(res).to.have.status(200)
              expect(res.body).to.be.a('object')
              expect(res.body).to.have.property('message').equal('Book successfully deleted')
              done()
            })
        })
    })
  })
})
