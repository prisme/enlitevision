var gsap = require('gsap')

var _tl = new TimelineMax({paused: false});
var _snap = [];
var _introLength = {duration: 0};

module.exports = {
    init: init,
    tl: _tl,
    snap: _snap,
    introLength: _introLength
}

function init() {
  var component = document.querySelector('.capsule')

  TweenLite.set(component, { yPercent: 100})
  _tl.to(component, 1, { yPercent: 0, ease: Linear.easeNone }, 0);
  _tl.to(component, 1, { yPercent: -100, ease: Linear.easeNone }, _tl.totalDuration() );

  for (var i = 0; i < Math.round(_tl.totalDuration()) ; i++) {
      _snap[i] = i;
  };

  _introLength.duration = 1
}
