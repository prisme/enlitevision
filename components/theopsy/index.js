var gsap = require('gsap')
var swiper = require('swiper')

module.exports = {
    init: init
}

function init() {
  var component = document.querySelector('.theopsy')

  var products = component.querySelector('.collection-products .swiper-container')
  var products_swiper = new swiper (products, {
    loop: true,
    autoHeight: true,
    pagination: '.theopsy .swiper-pagination',
    paginationClickable : true,
    paginationBulletRender: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>'
    }
  })

}
