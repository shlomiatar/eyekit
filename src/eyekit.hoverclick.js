/***
 * HoverClick
 * ==========
 *
 * On hover, show a radial progress bar over the element, and send a click event when
 * The progress bar loading is completed.
 *
 */

(function ($, window, _) {

    var TOTAL_TIME = 2500;
    var CLICK_DELAY = 2000;
    var LOADING_DELAY = TOTAL_TIME - CLICK_DELAY;
    var HIDE_DELAY = 500;

    /***
     *
     * @param {jQuery} el
     * @param {object} options
     */
    function hoverClick(el, options) {

        var _wrap;


        // Generate the progress wrapper
        function _setupWrap() {
            var d = $('<div class="eyekit-hover-progress">' +
                '<div class="eyekit-circle-fill">' +
                '<span class="eyekit-tick">&#10004;</span>' +
                '</div>' +
                '' +
                '</div>').hide();


            return d;
        }


        /**
         * Handle mouse move and relocate the wrap according to the mouse
         * @param event
         */
        function positionWithMouse(event) {
            if (_completed) {
                return;
            }

            var x = event.pageX;
            var y = event.pageY;

            // Coerce the position

            x = Math.max(x, _elOffset.left);
            x = Math.min(x, _elOffset.right);

            y = Math.max(y, _elOffset.top);
            y = Math.min(y, _elOffset.bottom);


            // Progress element size
            var wrapSize = $.extend({
                width: _wrap.outerWidth(),
                height: _wrap.outerHeight()
            }, _wrap.offset());


            // element center
            var top = y - (wrapSize.height / 2);
            var left = x - (wrapSize.width / 2);


            _wrap.css({
                top: Math.round(top),
                left: Math.round(left)
            });
        }


        var _clickTimeout, _inProgress, _elOffset, _completed, _loadingDelay;


        function start(event) {
            if (_inProgress) {
                return;
            }

            if (_elOffset && isInside(event.pageX, event.pageY, _elOffset)){
                _elOffset = false;
                return;
            }

                el.addClass('eyekit-active');


            _inProgress = true;
            _completed = false;

            clear();

            // Store the offset
            _elOffset = elOffset(el);
            positionWithMouse(event);

            _wrap.show();
            _loadingDelay = window.setTimeout(function () {
                _wrap.addClass('loading');
            }, LOADING_DELAY);


            _clickTimeout = window.setTimeout(onWaitCompleted, CLICK_DELAY);
        }


        /***
         * Checks if the point x,y is inside the offset dict ({top,left,width,height)
         *
         * @param {Number} x
         * @param {Number} y
         * @param {object} offsetDict
         *
         * @returns {Boolean}
         */
        function isInside(x, y, offsetDict) {
            if (!offsetDict) {
                return false;
            }

            if (x < offsetDict.left || x > offsetDict.right) {
                return false;
            }

            if (y < offsetDict.top || y > offsetDict.bottom) {
                return false;
            }

            return true;
        }

        /***
         * Generate the offset dict for the element
         *
         * @param {jQuery} el
         * @returns {object}
         */
        function elOffset(el) {
            var o = $.extend({
                width: el.outerWidth(),
                height: el.outerHeight()
            }, el.offset());

            o.right = o.left + o.width;
            o.bottom = o.top + o.height;

            return o;
        }


        function clear() {
            window.clearTimeout(_clickTimeout);
            window.clearTimeout(_loadingDelay);

            el.removeClass('eyekit-active');
        }

        function onWaitCompleted() {

            // Hide
            hide();
            _wrap.addClass('completed');
            _completed = true;

            // Trigger click
            el.click();
        }

        /***
         * When the user clicks on the progress item
         */
        function onClick() {
            // Quickly hide the element
            _wrap.hide();
            el.click();

            cleanup();
        }

        function tryStop() {
            if (_completed) {
                return;
            }
            clear();
            _wrap.removeClass('loading');
            hide();
        }

        function hide() {
            _wrap.addClass('hiding');

            window.setTimeout(cleanup, HIDE_DELAY);
        }

        function cleanup() {
            _wrap.
                hide().
                removeClass('hiding loading completed');
            _inProgress = false;
        }


        function setup() {
            // Add the eyekit class
            el.addClass('eyekit-hover-button');


            _wrap = _setupWrap();
            el.after(_wrap);

            el.on('mouseenter', start);

            _wrap.on('mousemove', _.debounce(positionWithMouse, 10));
            el.on('mousemove', _.debounce(positionWithMouse, 10));
            _wrap.on('mouseleave', tryStop);
            _wrap.on('click', onClick);
        }


        setup();
    }

    // Hookup the jquery plugin
    $.fn.hoverClick = function (options) {
        this.each(function () {
            hoverClick($(this), options);
        });

        return this;
    }
})
($, window, _);


