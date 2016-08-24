var gsap = require('gsap')
var swiper = require('swiper')
var scrollMonitor = require('scrollmonitor')

module.exports = {
    init: init
}

function init() {
  var component = document.querySelector('.corsocomo')

  var splash = component.querySelector('.wrapper .swiper-container')
  var splash_swiper = new swiper (splash, {
    loop: false,
    effect: "fade",
    autoplay: 4000,
    speed: 2000,
    nextButton: '.corsocomo .prompt-right',
    prevButton: '.corsocomo .prompt-left'
  })

  var elementWatcher = scrollMonitor.create( splash )

  elementWatcher.enterViewport(function() {
      splash_swiper.startAutoplay()
  })
  elementWatcher.exitViewport(function() {
      splash_swiper.stopAutoplay()
  })

}
