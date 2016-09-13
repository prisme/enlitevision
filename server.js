var prismic = require('prismic-nodejs')
var app = require('./express-config')
var configuration = require('./prismic-config')
var PORT = app.get('port')
var Q = require('q')

function api(req, res) {
  res.locals.ctx = {
    endpoint: configuration.apiEndpoint,
    linkResolver: configuration.linkResolver
  }
  return prismic.api(configuration.apiEndpoint, {
    accessToken: configuration.accessToken,
    req: req
  })
}

function handleError(err, req, res) {
  if (err.status == 404) {
    res.status(404).send('404 not found')
  } else {
    res.status(500).send('Error 500: ' + err.message)
  }
}

app.listen(PORT, function() {
  console.log('Express server listening on port ' + PORT)
})

// preview functionality
app.route('/preview').get(function(req, res) {
  api(req, res).then(function(api) {
    return Prismic.preview(api, configuration.linkResolver, req, res)
  }).catch(function(err) {
    handleError(err, req, res)
  })
})


app.route('/').get(function(req, res){

  api(req, res)
  .then(function(api) {

    var footerDefered =  api.getByUID('footer', 'footer')
    var hpDefered = Q.defer()

    api.query( prismic.Predicates.at('document.type', 'homepage') )
    .then(function(homepage){
      var sections = homepage.results[0].getGroup('homepage.body').toArray()
      var productsPromises = []

      sections.forEach( function(section) {
        var deferred = Q.defer()
        var uid = section.getLink('section').uid

        api.getByUID( 'home-section', uid)
        .then(function(homeSection) {
          var collection = homeSection.getText('home-section.collection')
          if( collection === null ) deferred.resolve(homeSection)

          api.query([
            // prismic.Predicates.any('document.tags', [collection]),
            prismic.Predicates.any('my.product.collection', [collection]),
            prismic.Predicates.at('document.type', 'product')
          ])
          .then(function(products){
            homeSection.products = products.results
            deferred.resolve(homeSection)
          })

        })

        productsPromises.push(deferred.promise)
      })

      Q.all(productsPromises).then(function(pageContent){
        hpDefered.resolve( pageContent )
      })

    })

    Q.all([ hpDefered.promise, footerDefered ]).then(function(blocks){
      console.log(blocks[0])

      res.render('index', {
        pageContent: blocks[0],
        footerContent: blocks[1]
      })
    })

  })

})


