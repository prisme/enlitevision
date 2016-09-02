var gsap = require('gsap')
var swiper = require('swiper')
var scrollMonitor = require('scrollmonitor')

module.exports = {
    init: init
}


function init() {

  var products
  var products_swiper
  var splash
  var splash_swiper
  var elementWatcher

  var component = document.querySelector('.supernatural')
  if(component == null) return


  splash = component.querySelector('.wrapper .swiper-container')
  if(splash == null) return


  splash_swiper = new swiper (splash, {
    loop: false,
    effect: "fade",
    autoplay: 4000,
    speed: 2000,
    nextButton: '.supernatural .prompt-right',
    prevButton: '.supernatural .prompt-left'
  })

  elementWatcher = scrollMonitor.create( splash )

  elementWatcher.enterViewport(function() {
      splash_swiper.startAutoplay()
  })
  elementWatcher.exitViewport(function() {
      splash_swiper.stopAutoplay()
  })

  products = component.querySelector('.collection-products .swiper-container')
  if(products == null) return

  products_swiper = new swiper (products, {
    loop: true,
    autoHeight: true,
    pagination: '.supernatural .swiper-pagination',
    paginationClickable : true,
    paginationBulletRender: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>'
    },
  })

}
