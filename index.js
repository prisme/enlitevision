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

    // title animation
    title = section.querySelector('.title')
    titleText = new split(title, {type: 'words, chars'})
    tl.staggerFrom(titleText.words, 2.0, { alpha:0, rotationY:-15, rotationX: -20 }, 0.3)

    titleIn = scrollMonitor.create( title )
    titleIn.enterViewport(function(){ tl.restart() })

    // swipers
    splash = section.querySelector('.wrapper .swiper-container')
    collection = section.querySelector('.collection-products .swiper-container')

    if (splash !== null) {
      splash_swiper = new swiper (splash, {
        loop: true,
        autoHeight: true,
        effect: 'slide',
        speed: 1000,
        nextButton: section.querySelector('.prompt-right'),
        prevButton: section.querySelector('.prompt-left'),
        onSlideChangeStart : function(swiper){
          var darkText = swiper.slides[ swiper.activeIndex ].classList.contains('dark')
          if (darkText)
            title.classList.add ('dark')
          else
            title.classList.remove('dark')
        }
      })
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
  window.onbeforeunload = function(){
    window.scrollTo(0,0)
  }

  var scrollTo = require('lib/scrollTo')
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

  TweenLite.to(promptDown, 0.8, {autoAlpha: 1, delay: 2.5})
  promptDown.addEventListener('click', promptDownListener)

  // hide prompt when user scrolls
  TweenLite.delayedCall(1, function(){

    scrolledAway = scrollMonitor.create( next )
    scrolledAway.enterViewport(function(){
      TweenLite.to(promptDown, 0.6, {autoAlpha: 0, y: 50})
      promptDown.removeEventListener('click', promptDownListener)
    })
  })


  // home video
  var Vimeo = require('@vimeo/player')
  function initVideo(){
    var player
    var videoPrompt = document.querySelector('.video-prompt')
    var videoContainer = document.querySelector('.video-player')
    var closePrompt = document.querySelector('.close-prompt')
    var iframe = document.querySelector('iframe')

    if (videoContainer === null) return

    player = new Vimeo(iframe)
    videoPrompt.addEventListener('click', videoOpen)
    closePrompt.addEventListener('click', videoClose)

    function videoOpen(){
      TweenLite.to(videoContainer, 1, {autoAlpha: 1})
      document.body.classList.add('noscroll')
      player.on('ended', videoClose)
      player.play()

      function escKey(event) {
        if(event.which == 27) {
          videoClose()
          document.removeEventListener('keydown', escKey)
        }
      }
      document.addEventListener('keydown', escKey)
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
