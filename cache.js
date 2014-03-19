var uberCache = require('uber-cache')

module.exports = function (options) {
  var uberCached = uberCache(options)

  function cache(ttl) {

    return function (req, res, next) {
      uberCached.get(req.url, function (error, cached) {
        if (error) return next(error)

        if (cached) {
          res.statusCode = cached.statusCode

          if (cached.headers) res.set(cached.headers)

          return res.send(cached.body)
        }

        res.orignalSend = res.send

        res.send = function (body) {
          var statusCode = res.statusCode

          // https://github.com/visionmedia/express/blob/master/lib/response.js#L90-L98
          if (2 === arguments.length) {
            if ('number' !== typeof body && 'number' === typeof arguments[1]) {
              statusCode = arguments[1]
            } else {
              statusCode = body
              body = arguments[1]
            }
          }

          var response = { body: body, statusCode: statusCode }

          if (res.headers) response.headers = res.headers

          uberCached.set(req.url, response, ttl)

          return res.orignalSend(statusCode, body)
        }

        next()
      })
    }
  }

  return cache

}
