# Uber Cache Express
A connect style route caching middleware for express using [Uber Cache](https://github.com/serby/uber-cache)

## Usage
```js
var expressCache = new require('uber-cache-express')
  , uberCacheOptions = {}
  , cache = expressCache(uberCacheOptions)

app.get('/', cache(5000), function (req, res) {
  console.log('I should only be called once every 5 seconds')
  res.send('Hai World')
})
```
