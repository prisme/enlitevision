module.exports = {

  apiEndpoint: 'https://enlitevision.prismic.io/api',

  // -- Access token if the Master is not open
  // accessToken: 'xxxxxx',

  snipcartKey: 'Y2MxYjkyOWMtMTQ2ZS00NTBkLTg4NTgtZTY0YWU3YTJiMzJhNjM2MDgwNzgwOTc2NzAxNDk3',


  // -- Links resolution rules
  // This function will be used to generate links to Prismic.io documents
  // As your project grows, you should update this function according to your routes
  linkResolver: function(doc, ctx) {
    if (doc.type == 'product') {
      return '/product/' + encodeURIComponent(doc.uid);
    }

    return '/';
  }
};
