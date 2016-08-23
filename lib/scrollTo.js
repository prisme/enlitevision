var gsap = require('gsap');

module.exports = function (element, duration, offset, callback) {
    // element  : DOM element
    // duration : in seconds, bool => bypass, 0 => calculate
    // offset   : in pixels, 0 => bypass
    // callback : function

    var dummy = document.createElement('div');
    var isSafari = document.documentElement.classList.contains('safari'); // depends on detectizr
    var scroller = isSafari ? document.body : document.documentElement;
    var minDuration = 0.2;
    var offset = offset || 0;
    var callback = callback || function(){};
    var distance = Math.abs( element.offsetTop - scroller.scrollTop + offset );
    var duration = duration > 0 ? duration : (minDuration + distance / 3000).toFixed(2);

    TweenLite.set(dummy, { x: scroller.scrollTop });
    TweenLite.to(dummy, duration, {
        x: element.offsetTop + offset,
        ease: Power2.easeInOut,
        onUpdate: function() {
            scroller.scrollTop = (dummy._gsTransform.x).toFixed(2);
        },
        onComplete: callback
    });

    console.log(element, scroller)
}
