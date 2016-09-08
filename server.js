var prismic = require('prismic-nodejs')
var app = require('./express-config')
var configuration = require('./prismic-config')
var PORT = app.get('port')

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
    res.status(404).send("404 not found")
  } else {
    res.status(500).send("Error 500: " + err.message)
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


// homepage
app.route('/').get(function(req, res){
  api(req, res).then(function(api) {

    api.query( prismic.Predicates.at('document.type', 'homepage'))
    .then(function(content) {
      var pageContent = []
      var sections = content.results[0].getGroup('homepage.body').toArray()
      var uid

      sections.forEach( function(section, index) {
        uid = section.getLink('section').uid

        api.getByUID( 'home-section', uid)
        .then(function(homeSection) {
          var collection = homeSection.getText('home-section.collection')

          if( collection === null ){
            homeSection.products = null
            pageContent.push(homeSection)
          } else {

            api.query([
              // prismic.Predicates.any('document.tags', [collection]),
              prismic.Predicates.any('my.product.collection', [collection]),
              prismic.Predicates.at('document.type', 'product')
            ])
            .then(function(products){

              console.log( products.results )

              homeSection.products = products.results
              pageContent.push(homeSection)
              // console.log(homeSection.products)
            })
            .catch(function(err) {
              handleError(err, req, res)
            })
          }


          // last loop
          if(index == sections.length - 1){

            api.getByUID("footer", "footer")
            .then(function(footerContent) {

              // console.log(pageContent)

              res.render('index', {
                pageContent: pageContent,
                footerContent: footerContent
              })

            })
            .catch(function(err) {
              handleError(err, req, res)
            })

          }

        })
      })
    })
    .catch(function(err) {
      handleError(err, req, res)
    })

  })
})


