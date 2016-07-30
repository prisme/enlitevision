var featured = require('./featured/index')
featured.init()


var raf = require('raf')
var gsap = require('gsap')
var split = require('./SplitText')

TweenMax.globalTimeScale(1.0)
var timeline = new TimelineMax({paused: true})

var logo = document.querySelector('.logo img')
timeline.set(logo, {y: -150, alpha: 0})
timeline.to( logo, 0.8, {
    y: 0,
    alpha : 1,
    ease: Power1.easeOut,
    force3D:true,
    clearProps: 'all'
})


var title = document.querySelector('.title')
var titleText = new split('.title', {type: "words, chars"})
timeline.set(title, {alpha:1})

timeline.staggerFrom(titleText.words, 2.0, { alpha:0, rotationY:-10, rotationX: -20 }, 0.3)



timeline.play()
