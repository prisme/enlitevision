var prismic = require('prismic-nodejs');
var app = require('./express-config');
var configuration = require('./prismic-config');
var PORT = app.get('port');

function api(req, res) {
  // So we can use this information in the views
  res.locals.ctx = {
    endpoint: configuration.apiEndpoint,
    linkResolver: configuration.linkResolver
  };
  return prismic.api(configuration.apiEndpoint, {
    accessToken: configuration.accessToken,
    req: req
  });
}

function handleError(err, req, res) {
  if (err.status == 404) {
    res.status(404).send("404 not found");
  } else {
    res.status(500).send("Error 500: " + err.message);
  }
}

app.listen(PORT, function() {
  console.log('Express server listening on port ' + PORT);
});

// preview functionality
app.route('/preview').get(function(req, res) {
  api(req, res).then(function(api) {
    return Prismic.preview(api, configuration.linkResolver, req, res);
  }).catch(function(err) {
    handleError(err, req, res);
  });
});


// homepage
app.route('/').get(function(req, res){
  api(req, res).then(function(api) {
    // api.getByUID("homepage", "homepage").then(function(pageContent) {
      api.getByUID("footer", "footer").then(function(footerContent) {
        // console.log(footerContent.getGroup('footer.footerColumns').toArray()[0].getStructuredText("column"))

        res.render('index', {
          // pageContent: pageContent,
          footerContent: footerContent
        });
      }).catch(function(err) {
        handleError(err, req, res);
      });
    // }).catch(function(err) {
    //   handleError(err, req, res);
    // });
  });
});


