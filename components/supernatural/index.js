var gsap = require('gsap')
var swiper = require('swiper')
var scrollMonitor = require('scrollmonitor')

module.exports = {
    init: init
}


function init() {
  var component = document.querySelector('.supernatural')

  var splash = component.querySelector('.wrapper .swiper-container')
  var splash_swiper = new swiper (splash, {
    loop: false,
    effect: "fade",
    autoplay: 4000,
    speed: 2000,
    nextButton: '.supernatural .prompt-right',
    prevButton: '.supernatural .prompt-left'
  })

  var elementWatcher = scrollMonitor.create( splash )

  elementWatcher.enterViewport(function() {
      splash_swiper.startAutoplay()
  })
  elementWatcher.exitViewport(function() {
      splash_swiper.stopAutoplay()
  })

  var products = component.querySelector('.collection-products .swiper-container')
  var products_swiper = new swiper (products, {
    loop: true,
    autoHeight: true,
    pagination: '.supernatural .swiper-pagination',
    paginationClickable : true,
    paginationBulletRender: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>'
    },
  })

}
