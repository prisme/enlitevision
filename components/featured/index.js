var gsap = require('gsap')
var split = require('lib/SplitText')

var _tl = new TimelineMax({paused: false})
var _snap = [];
var _introLength = {duration: 0};

var component

module.exports = {
    init: init,
    tl: _tl,
    snap: _snap,
    introLength: _introLength
}

function init() {

  // compileTemplate();
  ready()
  addHandlers()

  // Return for main.js to add to DOM
  // return _content;
}

function ready(){
  component = document.querySelector('.featured')

  introAnimation()

  // animate section container
  _tl.to(component, 1, {yPercent: -100, ease: Linear.easeNone}, _tl.totalDuration() );

  // local timeline pauses
  for (var i = 0; i < Math.round(_tl.totalDuration()) ; i++) {
      _snap[i] = i;
  }

  _introLength.duration = 0;
}

function addHandlers(){
}

function introAnimation(){
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
