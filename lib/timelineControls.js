var draggable = require('lib/Draggable');
var throwProps = require('lib/ThrowProps');
var lethargy = require('lib/lethargy')();

var controls = {};
var _tl, dragControl, dummy, isScroll, _snap;

// This is the scale/speed of the timeline dragging. Make negative/positive to reverse direction
var s = -0.001;

// This is the speed of the tweens, when scrolling or from links.
var auto = 0.7;

controls.init = function(element, tl, snap) {

    // Keep track of original snap points
    _snap = snap.slice(0);

    // Stock timeline for access in update
    _tl = tl;

    // Create element that is the holder of the timeline progress
    dummy = document.createElement('div');

    // Rescale snaps
    for (var i = 0; i < snap.length; i++) {
        snap[i] /= s;
    }

    // Let draggable do all the magic
    controls.dragControl = dragControl = Draggable.create(dummy, {

        // Change this to x if you want sideways dragging to advance the timeline
        type: 'y',

        // Removes a weird z-index thing
        zIndexBoost: false,

        // Allows the inertia for 'flicks' after dragging
        throwProps: true,

        // Removes the default 'move' cursor
        cursor: 'false',

        // Set the event catcher (where the dragging will occur)
        trigger: element,

        // Reduce to make the throw travel further in the timeline
        throwResistance: 10000,

        maxDuration: 5,

        onDragStart: start,
        onThrowUpdate: dragThrow,
        onDrag: drag,
        snap: snap
    });

    isScroll = false;

    ('mousewheel DOMMouseScroll wheel MozMousePixelScroll'.split(' ')).forEach(function(e) {
        window.addEventListener(e, onScroll, false);
    });
};

function start() {

    // If unbound, means current scroll is being cancelled, so rebind
    if (isScroll) isScroll = false;
}

function drag() {

    // using position of draggable, apply progress to timeline
    var dest = Math.max(0, s * dragControl[0].y);
    _tl.time(dest);
}

function dragThrow() {

    // While being flicked/thrown, if user scrolls, stop throwing tween
    if (isScroll) {
        this.tween.pause();
        return;
    }

    drag();
}

function onScroll(e) {
    e.preventDefault();
    e.stopPropagation();

    // Returns -1 or 1 depending on direction, or false if inertia
    var dir = lethargy.check(e);
    if (!dir) return;

    // Stop consecutive scrolls in the same direction only
    if (isScroll == dir) return;

    // Find the next/prev snap in the timeline - change '>' to swap direction of scroll
    var dest = findNearestSnap(dir < 0);

    // Boolean used to stop throwProps tween if active
    isScroll = dir;

    controls.to(dest, true);
}


controls.to = function(dest, fromScroll, duration) {

    // Auto duration if undefined
    if (!duration) duration = auto * Math.abs(dest - _tl.time());

    // Tween dummy object to required position in timeline
    TweenLite.to(dummy, duration, {y: dest / s,
        onUpdate: function() {

        // Update draggable position
        dragControl[0].update();

        // Update timeline
        drag();
    }, onComplete: function() {

        // Allow scroll once completed
        if (fromScroll) isScroll = false;
    }, ease: Power1.easeInOut});
};

window.goto = controls.to;

function findNearestSnap(forward) {
    // Change skip distance (must be greater than 1)
    var distance = 0.3;
    var time = _tl.time();
    var nearest;

    _snap.every(function(t) {

        if (t - time > (forward ? 1 : -1) * distance) {
            if (forward) nearest = t;
            return false;
        }
        if (!forward) nearest = t;

        return true;
    });

    // If no next, must be at end
    if (forward && !nearest) nearest = _snap[_snap.length - 1];

    // If no prev, must be at start
    if (!forward && !nearest) nearest = _snap[0];

    return nearest;
}

module.exports = controls;

