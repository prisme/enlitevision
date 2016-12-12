module.exports = {

  apiEndpoint: 'https://enlitevision.prismic.io/api',

  // -- Access token if the Master is not open
  // accessToken: 'xxxxxx',

  // OAuth
  // clientId: 'xxxxxx',
  // clientSecret: 'xxxxxx',

  snipcartKey: 'ST_NmQ1M2M0ZTUtZDE5Ni00MTdmLWI0YTEtMjc2OTlkNjU5NTIxNjM2MTcxNDgwMDMyMDM5ODEw',


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
