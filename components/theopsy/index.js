var gsap = require('gsap')
var swiper = require('swiper')

module.exports = {
    init: init
}

function init() {
  var products
  var products_swiper
  var splash
  var splash_swiper
  var elementWatcher

  var component = document.querySelector('.theopsy')
  if(component == null) return

  products = component.querySelector('.collection-products .swiper-container')
  products_swiper = new swiper (products, {
    loop: true,
    autoHeight: true,
    pagination: '.theopsy .swiper-pagination',
    paginationClickable : true,
    paginationBulletRender: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>'
    }
  })

}
