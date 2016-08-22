var gsap = require('gsap')
var swiper = require('swiper')

module.exports = {
    init: init
}

function init() {
  var component = document.querySelector('.theopsy')

  var products_swiper = new swiper ('.theopsy .collection-products .swiper-container', {
    loop: true,

    pagination: '.theopsy .swiper-pagination',
    paginationClickable : true,
    paginationBulletRender: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>'
    }
  })

}
