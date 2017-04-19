var docReady = require('doc-ready')
var gsap = require('gsap')
var split = require('./public/lib/SplitText')
var scrollMonitor = require('scrollmonitor')
var swiper = require('swiper')

docReady( function() {

  // Resize
  var isPortrait,
      isSmall

  function resizeHandler(){
    isPortrait = (window.innerWidth / window.innerHeight) < 1
    isSmall = window.innerWidth < 700

    var orientation = isPortrait ? 'portrait' : 'landscape'
    var size = isSmall ? 'small' : 'large'

    document.body.classList.remove('portrait', 'landscape', 'small', 'large')
    document.body.classList.add(orientation)
    document.body.classList.add(size)
  }
  resizeHandler()

  window.addEventListener('resize', resizeHandler)
  window.addEventListener('focus', resizeHandler)
  window.addEventListener('orientationchange', resizeHandler)


  // HOME
  if(document.querySelector('.home') !== null) {

    var swipers = document.querySelectorAll('.swiper-container')
    swipers.forEach(function(element, index){
      var pag = element.querySelector('.swiper-pagination')

      if(element.querySelectorAll('.swiper-slide').length < 2) return

      new swiper (element, {
        loop: true,
        autoHeight: true,
        effect: 'slide',
        speed: 1000,
        pagination: pag,
      })
    })

  }


})
