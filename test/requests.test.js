var request = require('supertest')
  , express = require('express')
  , middleware = require('../cache')()
  , app = express()
  , index = 0

require('should')

before(function () {
  // Register the testing routes
  app.get('/todays-date', middleware(20), function (req, res) {
    index++
    res.send(200, 'Index: ' + index)
  })
})

describe('#Testing middleware', function () {

  it('should return the same string', function (done) {
    request(app)
      .get('/todays-date')
      .expect(200)
      .end(function (error, res) {
        res.text.should.equal('Index: 1')

        request(app)
          .get('/todays-date')
          .expect(200)
          .end(function (error, res) {
            res.text.should.equal('Index: 1')

            done(error)
          })
      })
  })

  it('should make a new request', function (done) {
    setTimeout(function () {
      request(app)
        .get('/todays-date')
        .expect(200)
        .end(function (error, res) {
          res.text.should.equal('Index: 2')

          done(error)
        })
    }, 50)
  })

})
