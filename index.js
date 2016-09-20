var docReady = require('doc-ready')
var gsap = require('gsap')
var split = require('lib/SplitText')
var scrollMonitor = require('scrollmonitor')
var swiper = require('swiper')

docReady( function() {

  function initSection( section ){

    /*
    // naive lazy load
    var imgDefer = section.querySelectorAll('.splash')
    for (var i = 0 ; i < imgDefer.length ; i++) {
      if (imgDefer[i].dataset.src)
        imgDefer[i].src = imgDefer[i].dataset.src
    }
    */

    // title animation
    var titleText, titleTl, titleMonitor,
    title = section.querySelector('.title')

    if ( title !== null ) {
      titleTl = new TimelineMax({paused: true})
      titleText = new split(title, {type: 'words, chars'})
      titleTl.staggerFrom(titleText.words, 2.0, { alpha:0, rotationY:-15, rotationX: -20 }, 0.3)
      titleMonitor = scrollMonitor.create( title )
      titleMonitor.enterViewport(function(){ titleTl.restart() })
    }

    // subtitle animation
    var subTl, subtitleMonitor,
    subtitle = section.querySelector('.subtitle')

    if ( subtitle !== null ) {
      subTl = new TimelineMax({paused: true})
      subTl.from(subtitle, 0.6, { alpha:0, y : 30, ease: Power1.easeOut })
      subtitleMonitor = scrollMonitor.create( subtitle )
      subtitleMonitor.enterViewport(function(){ subTl.restart() })
    }

    // swipers
    var splash_swiper_el = section.querySelector('.wrapper .swiper-container')
    if ( splash_swiper_el !== null ) {
      new swiper (splash_swiper_el, {
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

    var prod_swiper
    var prod_swiper_el = section.querySelector('.collection-products .swiper-container')
    if ( prod_swiper_el !== null ) {
      prod_swiper = new swiper (prod_swiper_el, {
        loop: true,
        autoHeight: true,
        pagination: section.querySelector('.swiper-pagination'),
        paginationClickable : true,
        paginationBulletRender: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + '</span>'
        }
      })

      window.addEventListener('load', prod_swiper.slideReset)

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
  window.addEventListener('beforeunload', function(){
    window.scrollTo(0,0)
  })

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

  //  menu scrollTo
  var menuLinks = document.querySelectorAll('.menu a')
  for (var i = 0; i < menuLinks.length; i++) {
    menuLinks[i].addEventListener('click', function(event){
      event.preventDefault()

      var scrollToEl = document.querySelector('.'+ event.target.href.split('#').pop() )
      if (scrollToEl)
        scrollTo(scrollToEl)

    })
  }


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
  var ratio = 1.5

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
