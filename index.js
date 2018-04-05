var docReady = require('doc-ready')
var gsap = require('gsap')
var split = require('./public/lib/SplitText')
// var scrollMonitor = require('scrollmonitor')
var swiper = require('swiper')

docReady( function() {

  // Resize
  var isPortrait,
      isSmall

  function resizeHandler(){
    isPortrait = (window.innerWidth / window.innerHeight) < 1
    isSmall = window.innerWidth < 832

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

  // dropdown Menu
  var menuToggle = document.querySelector('.Menu-toggle')
  var menuList = document.querySelector('.Menu-list')

  if( menuToggle && menuList ){
    menuToggle.addEventListener('click', function(e){
      e.preventDefault()
      menuList.classList.toggle('Menu-list--closed')
      menuList.classList.toggle('Menu-list--open')
    })
  }

  // HOME
  var videos
  var swipers_home

  if(document.querySelector('.Home') !== null) {

    swipers_home = document.querySelectorAll('.swiper-container')
    swipers_home.forEach(function(element, index){

      var paginElement = element.previousElementSibling

      if(element.querySelectorAll('.swiper-slide').length < 2) return

      new swiper (element, {
        loop: true,
        // autoHeight: true,
        autoplay: 3500 + (Math.random() * 1000),
        effect : 'fade',
        speed: 800,
        pagination: paginElement,
        paginationClickable: true
      })
    })


    if( document.querySelector('.mobile') == null ){
        videos = document.querySelectorAll('.cinemagraph')
        videos = Array.apply(null, videos)

        videos.forEach(function(video){
          var source = document.createElement('source')
          source.src = video.dataset["url"]
          video.appendChild(source)
        })
    }

  }

  // PRODUCT
  var zoomPrompt
  if(document.querySelector('.Product') !== null){

    if(document.querySelectorAll('.swiper-slide').length > 1) {

      new swiper ('.swiper-container', {
        autoplay: 6000,
        loop: true,
        speed: 600,
        effect : 'fade',
        pagination: '.swiper-pagination',
        paginationClickable: true
      })
    }


    zoomPrompt = document.querySelector('.Product-gallery-zoom')
    if (zoomPrompt == null) return;


    zoomPrompt.addEventListener('click', function(e){
      e.preventDefault();

      var tohide = document.querySelector('.Product')
      var parent = document.querySelector('.Product-zoom')
      var img = parent.querySelector('img')

      if (img != null)
          show()

      else {
          img = new Image()
          img.src = this.href
          parent.appendChild(img)

          img.addEventListener('load', show)
      }

      img.addEventListener("click", hide)


      function hide(){
        tohide.classList.remove('hidden')
        parent.classList.remove('active')
        document.body.style.overflow = 'visible'
        document.removeEventListener('keydown', escKey)
      }

      function show(){
        tohide.classList.add('hidden')
        parent.classList.add('active')
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', escKey)
      }

      function escKey(event){
        console.log("escKey")
        if (event.key === 'Escape' || event.keyCode === 27)
          hide()
      }

    })

  }

  // SNIPCART
  var shoppingCart = document.querySelector('.shopping-cart')
  var cartCount = document.querySelector('.cart-count')

  // Function to remove the cart count and reset the cart color
  function defaultCart() {
      cartCount.classList.remove('active')
      shoppingCart.classList.remove('active')
  }

  // Function to show the cart count and change the color of the cart to green
  function highlightCart() {
      cartCount.classList.add('active')
      shoppingCart.classList.add('active')
  }

  // If there is nothing in the cart on page load, don't display a number
  Snipcart.subscribe('cart.ready', function (data) {
    var cartCount = data.order ? data.order.items.length : 0;
    if (cartCount > 0) {
      highlightCart()
    }
  });

  // If an item is added to the cart, set to highlighted cart
  Snipcart.subscribe('item.added', function (ev, item, items) {
    highlightCart()
    // $("html, body").animate({ scrollTop: 0 }, "slow");
    // $('.added-to-cart').stop(true, false).slideDown('slow').delay(2000).slideUp('slow');
    return false;
  });

  // If all items are removed, set to default cart
  Snipcart.subscribe('item.removed', function (ev, item, items) {
    var cartCount = Snipcart.api.items.count();
    if (cartCount == 0) {
      defaultCart()
    }
  });

  // If an order is completed, set to default cart
  Snipcart.subscribe('order.completed', function (data) {
    defaultCart()
  });



})
