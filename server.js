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


// Product Page Route
app.route('/product/:uid').get(function(req, res) {

  api(req, res)
  .then(function(api) {
    // for snipcart
    var pageUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var uid = req.params.uid;

    api.query( prismic.Predicates.at('document.type', 'layout') )
    .then(function(layoutContent) {
      api.getByUID('product', uid)
      .then(function(productContent) {

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
              layoutContent: layoutContent.results[0],
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
      })
    })
  })
});

// All Collections Page Route
app.route('/collections').get(function(req, res) {
    api(req, res)
    .then(function(api) {

      var layoutDefered =  api.query( prismic.Predicates.at('document.type', 'layout') )
      var collectionsPageDefered = Q.defer()

      api.query( prismic.Predicates.at('document.type', 'collection-page') )
      .then(function(collectionPage){
        var sections = collectionPage.results[0].getGroup('collection-page.collections').toArray()
        var productsPromises = []

        sections.forEach(function(section) {
          var deferred = Q.defer()
          var uid = section.getLink('collection').uid

          api.getByUID( 'collection', uid)
          .then(function(collectionSection) {
            var collectionTags = collectionSection.tags

            if( collectionTags.length == 0 ) deferred.resolve(collectionSection)

            // get collection products by tag
            api.query([
              prismic.Predicates.at('document.type', 'product'),
              prismic.Predicates.at('document.tags', collectionTags)
            ])
            .then(function(products){
              collectionSection.products = products.results
              deferred.resolve(collectionSection)
            })
          })

          productsPromises.push(deferred.promise)
        })

        Q.all(productsPromises).then(function(pageContent){
          collectionsPageDefered.resolve( pageContent )
        })

      })

      Q.all([ collectionsPageDefered.promise, layoutDefered ]).then(function(blocks){
        // console.log(blocks[0])

        res.render('collection', {
          pageContent: blocks[0],
          layoutContent: blocks[1].results[0]
        })
      })

    })
});

// Unique Collection Page
app.route('/collection/:uid').get(function(req, res) {
});

// Home Page Route
app.route('/').get(function(req, res){

  api(req, res)
  .then(function(api) {

    api.query( prismic.Predicates.at('document.type', 'layout') )
    .then(function(layoutContent) {
      api.query( prismic.Predicates.at('document.type', 'home-page') )
      .then((pageContent) => {
        if (pageContent && layoutContent) {
          console.log(pageContent)

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


