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
    return prismic.preview(api, configuration.linkResolver, req, res)
  }).catch(function(err) {
    handleError(err, req, res)
  })
})


// Route for the product pages
app.route('/product/:uid').get(function(req, res) {

  api(req, res)
  .then(function(api) {
    // Get the page url needed for snipcart
    var pageUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    // Define the UID from the url
    var uid = req.params.uid;


    // Query the product by its UID
    api.getByUID('product', uid).then(function(productContent) {

        console.log(productContent)
      // Render the 404 page if this uid is found
      if (!productContent) {
        render404(req, res);
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

// Route for the home page
app.route('/').get(function(req, res){

  api(req, res)
  .then(function(api) {

    var footerDefered =  api.getByUID('footer', 'footer')
    var hpDefered = Q.defer()

    api.query( prismic.Predicates.at('document.type', 'home-page') )
    .then((pageContent) => {
        if (pageContent) {
        console.log(pageContent.results[0].getSliceZone('home-page.body').slices)

        res.render('index', {
          pageContent : pageContent.results[0],
        });
      } else {
        res.status(404).send('404 not found');
      }
    })

  })

})


