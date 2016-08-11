var gsap = require('gsap')
var timelineControls = require('lib/timelineControls')

var _content = document.querySelector('.content')

// main timeline
var _tlMain = new TimelineMax({paused: true})
var _snap = []

// Sections components
var featured = require('components/featured')
var capsule = require('components/capsule')

var _sections = [
    featured,
    capsule
]

// Initialise each section
for (var i=0; i < _sections.length; i++) {
    _sections[i].init()
}

// Construct main timeline
_sections.forEach(function(section, i) {
    section.startTime = _tlMain.totalDuration() - section.introLength.duration

    var snap = section.snap
    snap.forEach(function(t) {
        _snap.push(_tlMain.totalDuration() - section.introLength.duration + t)
    })

    _tlMain.add(section.tl, '-=' + section.introLength.duration)
})

// console.log(_tlMain.totalDuration())

// _tlMain.play()
// console.log(_content)
// _tlMain.time(0, true);

// Start site interaction controls
console.log(_snap)
timelineControls.init(_content, _tlMain, _snap);


// Resize
var portrait = false
var ratio = 1.3

var resizeHandler = function(){
    portrait = (window.innerWidth / window.innerHeight) < ratio

    flag = portrait ? 'portrait' : 'landscape'
    if(document.body.classList.contains(flag)) return

    document.body.classList= []
    document.body.classList.add(flag)
}

window.addEventListener('resize', resizeHandler)
resizeHandler()
