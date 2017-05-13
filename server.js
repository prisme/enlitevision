var prismic = require('prismic-nodejs')
var app = require('./express-config')
var configuration = require('./prismic-config')
var PORT = app.get('port')
var Q = require('q')

function api(req, res) {
  res.locals.ctx = {
    endpoint: configuration.apiEndpoint,
    snipcartKey: configuration.snipcartKey,
    linkResolver: configuration.linkResolver
  }
  return prismic.api(configuration.apiEndpoint, {
    accessToken: configuration.accessToken,
    snipcartKey: configuration.snipcartKey,
    req: req
  })
}

app.listen(PORT, function() {
  console.log('Express server listening on port ' + PORT)
})


// Prismic Preview
app.route('/preview').get(function(req, res) {
  api(req, res).then(function(api) {
    return prismic.preview(api, configuration.linkResolver, req, res)
  }).catch(function(err) {
    if (err.status == 404) {
      res.status(404).send('404 not found')
    } else {
      res.status(500).send('Error 500: ' + err.message)
    }
  })
})


// Product pages Route
app.route('/product/:uid').get(function(req, res) {

  api(req, res)
  .then(function(api) {
    // for snipcart
    var pageUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var uid = req.params.uid;

    api.getByUID('product', uid).then(function(productContent) {

      var relatedProducts,
          relatedArray,
          relatedIDs

      if (productContent) {
        // Collect all the related product IDs for this product
        relatedProducts = productContent.getGroup('product.relatedProducts');
        relatedArray = relatedProducts ? relatedProducts.toArray() : [];
        relatedIDs = relatedArray.map((relatedProduct) => {
          var link = relatedProduct.getLink('link');
          return link ? link.id : null;
        }).filter((id) => id != null);

        // //Query the related products by their IDs
        api.getByIDs(relatedIDs).then(function(relatedProducts) {
          // Render the product page
          res.render('product', {
            // layoutContent: req.prismic.layoutContent,
            productContent: productContent,
            relatedProducts: relatedProducts,
            pageUrl: pageUrl
          })
        })

      } else {
        res.status(404).send('404 not found');
      }

      // Collect all the related product IDs for this product
      var relatedProducts = productContent.getGroup('product.relatedProducts');
      var relatedArray = relatedProducts ? relatedProducts.toArray() : [];
      var relatedIDs = relatedArray.map((relatedProduct) => {
        var link = relatedProduct.getLink('link');
        return link ? link.id : null;
      }).filter((id) => id != null);

      // //Query the related products by their IDs
      api.getByIDs(relatedIDs).then(function(relatedProducts) {

        // Render the product page
        res.render('product', {
          // layoutContent: req.prismic.layoutContent,
          productContent: productContent,
          relatedProducts: relatedProducts,
          pageUrl: pageUrl
        });
      });
    });
  })
});

// Route for the collection page
app.route('/collections').get(function(req, res) {
    api(req, res)
    .then(function(api) {

      var footerDefered =  api.getByUID('footer', 'footer')
      var hpDefered = Q.defer()

      api.query( prismic.Predicates.at('document.type', 'collection-page') )
      .then(function(collectionPage){
        var sections = collectionPage.results[0].getGroup('collection-page.body').toArray()
        var productsPromises = []

        sections.forEach(function(section) {
          var deferred = Q.defer()
          var uid = section.getLink('section').uid

          api.getByUID( 'collection', uid)
          .then(function(homeSection) {
            var collection = homeSection.tags
            if( collection.length == 0 ) deferred.resolve(homeSection)

            api.query([
              prismic.Predicates.at('document.tags', collection),
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

        res.render('collection', {
          pageContent: blocks[0],
          footerContent: blocks[1]
        })
      })

    })
});

// Home page Route
app.route('/').get(function(req, res){

  api(req, res)
  .then(function(api) {

    api.query( prismic.Predicates.at('document.type', 'home-page') )
    .then((pageContent) => {
      api.query( prismic.Predicates.at('document.type', 'layout') )
      .then(function(layoutContent) {
        if (pageContent && layoutContent) {
          console.log(layoutContent)

          res.render('index', {
            pageContent : pageContent.results[0],
            layoutContent: layoutContent.results[0]
          });

        } else {
          res.status(404).send('404 not found');
        }
       })
    })

  })

})


