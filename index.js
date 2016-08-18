var gsap = require('gsap')


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

var _sections = [
  featured,
  supernatural,
  optical,
  theopsy,
]

// Initialise each section
for (var i=0; i < _sections.length; i++) {
  _sections[i].init()
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
