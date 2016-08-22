var gsap = require('gsap')
var swiper = require('swiper')

module.exports = {
    init: init
}

function init() {
  var component = document.querySelector('.corsocomo')

  var splash_swiper = new swiper ('.corsocomo .wrapper .swiper-container', {
    loop: true,
    effect: "fade",
    autoplayDisableOnInteraction: false,
    autoplay: 5000,
    speed: 2500
  })

}
