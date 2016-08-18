var gsap = require('gsap')
var split = require('lib/SplitText')

var component

module.exports = {
    init: init
}

function init() {

  component = document.querySelector('.featured')

  var introTL = new TimelineMax({paused: false})

  var splash = component.querySelector('.splash')
  introTL.to(splash, 0.8, {alpha: 1})

  var logo = document.querySelector('.logo img')
  TweenLite.set(logo, {y: -150, alpha: 0})
  var tweenLogo = TweenLite.to(logo, 0.8, {
      y: 0,
      alpha : 1,
      ease: Power1.easeOut,
      force3D:true,
      clearProps: 'all'
  })
  introTL.add( tweenLogo, 0.4)


  var title = component.querySelector('.title')
  var titleText = new split(title, {type: "words, chars"})
  TweenLite.set(title, {alpha:1})
  introTL.staggerFrom(titleText.words, 2.0, { alpha:0, rotationY:-15, rotationX: -20 }, 0.3)
}
