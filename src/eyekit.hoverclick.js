/***
 * HoverClick
 * ==========
 *
 * On hover, show a radial progress bar over the element, and send a click event when
 * The progress bar loading is completed.
 *
 */

(function ($, window, _) {

    var CLICK_DELAY = 1200;
    var HIDE_DELAY = 400;

    /***
     *
     * @param {jQuery} el
     * @param {object} options
     */
    function hoverClick(el, options) {

        var _progressWrap;


        // Generate the progress wrapper
        function _setupWrap() {
            var d = $('<div class="eyekit-hover-progress">' +
                '<div class="eyekit-circle-fill"/>' +
                '' +
                '</div>').hide();


            return d;
        }


        /***
         * Position the wrap
         */
        function position() {
            // Target element size
            var elSize = $.extend({
                width: el.outerWidth(),
                height: el.outerHeight()
            }, el.offset());

            // Progress element size
            var wrapSize = $.extend({
                width: _progressWrap.outerWidth(),
                height: _progressWrap.outerHeight()
            }, _progressWrap.offset());


            // element center
            var top = (elSize.top + (elSize.height / 2)) - (wrapSize.height / 2);
            var left = (elSize.left + (elSize.width / 2)) - (wrapSize.width / 2);


            _progressWrap.show().css({
                top: Math.round(top),
                left: Math.round(left)
            });
        }

        var _stopMouseTracking = false;

        /**
         * Handle mouse move and relocate the wrap according to the mouse
         * @param event
         */
        function positionWithMouse(event) {
            if (_stopMouseTracking) {
                return;
            }
            // Progress element size
            var wrapSize = $.extend({
                width: _progressWrap.outerWidth(),
                height: _progressWrap.outerHeight()
            }, _progressWrap.offset());


            // element center
            var top = event.clientY - (wrapSize.height / 2);
            var left = event.clientX - (wrapSize.width / 2);


            _progressWrap.css({
                top: Math.round(top),
                left: Math.round(left)
            });
        }

        function stopMouseTracking() {
            _stopMouseTracking = true;
        }

        var _counter, _inProgress;

        function start() {
            if (_inProgress) {
                return;
            }

            _inProgress = true;

            clear();

            window.setTimeout(function () {
                _progressWrap.addClass('loading');
            }, 10);


            // Position
            position();
            _counter = window.setTimeout(onWaitCompleted, CLICK_DELAY);
        }

        function clear() {
            if (_counter) {
                window.clearTimeout(_counter);
                _counter = null;
            }
            _stopMouseTracking = false;
        }

        function onWaitCompleted() {

            // Hide
            hide();

            // Trigger click
            el.click();
        }

        /***
         * When the user clicks on the progress item
         */
        function onClick() {
            // Quickly hide the element
            _progressWrap.hide();
            el.click();

            cleanup();
        }

        function tryStop() {
            clear();
            _progressWrap.removeClass('loading');
            hide();
        }

        function hide() {
            _progressWrap.addClass('hiding');

            window.setTimeout(cleanup, HIDE_DELAY);
        }

        function cleanup() {
            _progressWrap.
                hide().
                removeClass('hiding loading');
            _inProgress = false;
        }


        function setup() {
            // Add the eyekit class
            el.addClass('eyekit-hover-button');


            _progressWrap = _setupWrap();
            el.after(_progressWrap);

            el.on('mouseenter', start);
            el.on('mouseleave', stopMouseTracking);
            _progressWrap.on('mousemove', _.debounce(positionWithMouse, 10));


            _progressWrap.on('mouseleave', tryStop);
            _progressWrap.on('click', onClick);
        }


        setup();
    }


    window.hoverClick = hoverClick;
})($, window, _);


