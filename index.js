var docReady = require('doc-ready')
var gsap = require('gsap')
var split = require('lib/SplitText')
var scrollMonitor = require('scrollmonitor')
var swiper = require('swiper')

docReady( function() {

  function initSection( section ){

    var tl = new TimelineMax({paused: true})
    var collection,
      splash,
      splash_swiper,
      title,
      titleText,
      titleIn,
      splashIn,

    splash = section.querySelector('.wrapper .swiper-container')
    collection = section.querySelector('.collection-products .swiper-container')

    // swipers
    if (splash !== null) {
      splash_swiper = new swiper (splash, {
        loop: true,
        autoHeight: true,
        effect: 'slide',
        autoplay: 4000,
        speed: 2000,
        nextButton: section.querySelector('.prompt-right'),
        prevButton: section.querySelector('.prompt-left')
      })

      splashIn = scrollMonitor.create( splash )
      splashIn.enterViewport( splash_swiper.startAutoplay )
      splashIn.exitViewport( splash_swiper.stopAutoplay )
    }

    if (collection !== null) {
      new swiper (collection, {
        loop: true,
        autoHeight: true,
        pagination: section.querySelector('.swiper-pagination'),
        paginationClickable : true,
        paginationBulletRender: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + '</span>'
        }
      })
    }

    // title animation
    title = section.querySelector('.title')
    titleText = new split(title, {type: 'words, chars'})
    tl.staggerFrom(titleText.words, 2.0, { alpha:0, rotationY:-15, rotationX: -20 }, 0.3)

    titleIn = scrollMonitor.create( title )
    titleIn.enterViewport(function(){ tl.restart() })
  }

  var sections = document.querySelectorAll('.home-section')
  for(var i = 0 ; i < sections.length ; i++) {
    initSection( sections[i] )
  }


  // logo animation
  var  logo = document.querySelector('.logo img')
  TweenLite.set(logo, {y: -150, alpha: 0})
  TweenLite.to(logo, 0.8, {
      y: 0,
      alpha : 1,
      ease: Power1.easeOut,
      force3D:true,
      clearProps: 'all',
      delay: 1
  })


  // scrollto btn
  var scrollTo = require('lib/scrollTo')
  var scrolltop = require('simple-scrolltop')
  var next = document.querySelector('.home-section + .home-section')
  var promptDown = document.querySelector('.prompt-down')
  var scrolledAway

  var promptDownListener = function() {
    scrollTo(next, 0.8)
    TweenLite.to(promptDown, 0.6, {autoAlpha: 0, y: 50})

    title = next.querySelector('.title')
    titleText = new split(title, {type: 'words, chars'})
    TweenMax.staggerFrom(titleText.words, 2.0, { alpha:0, rotationY:-15, rotationX: -20 }, 0.3)
  }

  window.onload = function(){
    if( scrolltop() !== 0 ) return

    TweenLite.to(promptDown, 0.8, {autoAlpha: 1, delay: 2.5})
    promptDown.addEventListener('click', promptDownListener)

    // hide prompt if user scrolled to next
    scrolledAway = scrollMonitor.create( next )
    scrolledAway.enterViewport(function(){
      TweenLite.to(promptDown, 0.6, {autoAlpha: 0, y: 50})
      promptDown.removeEventListener('click', promptDownListener)
    })
  }





  // home video
  var Vimeo = require('@vimeo/player')
  function initVideo(){
      var videoPrompt = document.querySelector('.video-prompt')
      var videoContainer = document.querySelector('.video-player')
      if (videoContainer==null) return

      var closePrompt = videoContainer.querySelector('.close-prompt')
      var iframe = videoContainer.querySelector('iframe');
      var player = new Vimeo(iframe);

      videoPrompt.addEventListener('click', videoOpen)
      closePrompt.addEventListener('click', videoClose)

      function videoOpen(){
        TweenLite.to(videoContainer, 1, {autoAlpha: 1})
        document.body.classList.add('noscroll')
        player.on('ended', videoClose)
        player.play()

        document.addEventListener('keydown', function(event) {
          if(event.which == 27) {
            videoClose()
            document.removeEventListener('keydown')
          }
        })
      }

      function videoClose(){
        TweenLite.to(videoContainer, .5, {autoAlpha: 0})
        document.body.classList.remove('noscroll')
        player.off('ended', videoClose)
        player.pause()
        player.setCurrentTime(0)
      }
  }
  initVideo()


  // Resize
  var portrait = false
  var ratio = 1.4

  var resizeHandler = function(){
    portrait = (window.innerWidth / window.innerHeight) < ratio

    flag = portrait ? 'portrait' : 'landscape'
    if(document.body.classList.contains(flag)) return

    document.body.classList.remove('portrait', 'landscape')
    document.body.classList.add(flag)
  }

  window.addEventListener('resize', resizeHandler)
  resizeHandler()

})
