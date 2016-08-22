var gsap = require('gsap')
var Vimeo = require('@vimeo/player')

// Prismic
var Prismic = require('prismic.io')
var endpoint = 'https://enlite.prismic.io/api'

Prismic.api(endpoint).then(function(api) {
  return api.query('[[:d = at(document.type, "product")]]')
}).then(function(response) {
  console.log("Documents: ", response.results)
}, function(err) {
  console.log("Something went wrong: ", err)
})


// Sections components
var featured = require('components/featured')
var supernatural = require('components/supernatural')
var optical = require('components/optical')
var theopsy = require('components/theopsy')
var corsocomo = require('components/corsocomo')

var _sections = [
  featured,
  supernatural,
  optical,
  theopsy,
  corsocomo,
]

// Initialise each section
for (var i=0; i < _sections.length; i++) {
  _sections[i].init()
}

// temp : home video
var videoPrompt = document.querySelector('.video-prompt')
var videoContainer = document.querySelector('.video-player')
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


// Resize
var portrait = false
var ratio = 1.4

var resizeHandler = function(){
  portrait = (window.innerWidth / window.innerHeight) < ratio

  flag = portrait ? 'portrait' : 'landscape'
  if(document.body.classList.contains(flag)) return

  document.body.classList= []
  document.body.classList.add(flag)
}

window.addEventListener('resize', resizeHandler)
resizeHandler()
