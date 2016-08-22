var gsap = require('gsap')
var swiper = require('swiper')

module.exports = {
    init: init
}

function init() {
  var component = document.querySelector('.optical')

  var splash_swiper = new swiper ('.optical .wrapper .swiper-container', {
    loop: true,
    effect: "fade",
    autoplayDisableOnInteraction: false,
    autoplay: 5000,
    speed: 2500
  })

  var products_swiper = new swiper ('.optical .collection-products .swiper-container', {
    loop: true,

    pagination: '.optical .swiper-pagination',
    paginationClickable : true,
    paginationBulletRender: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>'
    },
  })

}
