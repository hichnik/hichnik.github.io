(function($) {
    "use strict";
    var pluginName = 'piRotate';
    var pluginDefaults = {
        preloaderSelector: '.pi-preloader',
        imageSelector: '.pi-image',
        spriteSelector: '.pi-sprite',
        closeSelector: '.pi-close',
        keyboard: true,
        preload: true
    };

    function Plugin(element, options) {
        this.init(pluginName, element, options);
    }
    Plugin.prototype = {
        constructor: Plugin,
        init: function(name, element, options) {
            this.name = name;
            this.$element = $(element);
            this.options = $.extend({}, $.fn[this.name].defaults, this.$element.data(), options);
            this.$element.attr('data-pi-rotate-element', 'root');
            this.$element.find(this.options.closeSelector).attr('data-pi-rotate-element', 'close');
            this.$preloader = this.$element.find(this.options.preloaderSelector);
            this.$image = this.$element.find(this.options.imageSelector).attr('data-pi-rotate-element', 'image');
            this.$sprite = this.$element.find(this.options.spriteSelector);
        },
        toggle: function() {
            return this[!this._shown ? 'show' : 'hide']();
        },
        show: function() {
            var event = $.Event('show.rotate');
            this.$element.trigger(event);
            if (this._shown || event.isDefaultPrevented()) return;
            this._shown = true;
            this.escape();
            this.$element.on('click.dismiss.rotate', '[data-pi-rotate-element="close"]', $.proxy(this.hide, this));
            this.$element.on('click.dismiss.rotate', $.proxy(function(event) {
                if (event.target !== event.currentTarget) return;
                this.hide(this);
            }, this));
            var transition = $.support.transition && this.$element.hasClass('fade');
            if (!this.$element.parent().length) this.$element.appendTo(document.body);
            this.$element.show().scrollTop(0);
            if (transition) this.$element[0].offsetWidth;
            this.$element.addClass('in').attr('aria-hidden', false);
            this.enforceFocus();
            var fn_onshow = $.proxy(function(e) {
                if (!e || !this.$element.is(e.target)) return true;
                this.$element.trigger('focus');
                if (this.options.preload && !this._loaded) this.preload($.proxy(function() {
                    this.$element.trigger('shown.rotate');
                }, this));
                else this.$element.trigger('shown.rotate');
            }, this);
            transition ? this.$element.one($.support.transition.end, fn_onshow).emulateTransitionEnd(300) : fn_onshow();
        },
        hide: function() {
            var event = $.Event('hide.rotate');
            this.$element.trigger(event);
            if (!this._shown || event.isDefaultPrevented()) return;
            this._shown = false;
            this.escape();
            var transition = $.support.transition && this.$element.hasClass('fade');
            $(document).off('focusin.rotate');
            this.$element.removeClass('in').attr('aria-hidden', true).off('click.dismiss.rotate');
            var fn_onhide = $.proxy(function() {
                this.$element.hide();
                this.reset();
                this.$element.trigger('hidden.rotate');
            }, this);
            transition ? this.$element.one($.support.transition.end, fn_onhide).emulateTransitionEnd(300) : fn_onhide();
        },
        reset: function() {
            this._rotatePosition = 0;
            this.$sprite.css('background-position', '0 0');
        },
        preload: function(callback) {
            if (this._loaded) {
                callback && callback();
                return;
            }
            var url = this.$sprite.css('background-image');
            url = /^url\((['"]?)(.*)\1\)$/.exec(url);
            url = url ? url[2] : '';
            var img = new Image(),
                promise = $.Deferred();
            img.onload = function() {
                promise.resolve();
            };
            img.onabort = img.onerror = function() {
                promise.reject();
            };
            img.src = url;
            promise.done($.proxy(function() {
                this._loaded = true;
               // img.naturalWidth = img.naturalWidth || img.width;
                this.options.length = img.naturalWidth / this.$sprite.width();
                this.$sprite.css('background-size', img.naturalWidth + 'px ' + this.$sprite.height() + 'px');
                var transition = $.support.transition && this.$preloader.hasClass('fade');
                var fn = $.proxy(function() {
                    this.$preloader.removeClass('active');
                    this.$image.addClass('active');
                    if (transition) {
                        this.$image[0].offsetWidth;
                        this.$image.addClass('in');
                    } else this.$image.removeClass('fade');
                    callback && callback();
                }, this);
                transition ? this.$preloader.one($.support.transition.end, fn).emulateTransitionEnd(150) : fn();
                this.$preloader.removeClass('in');
            }, this));
        },
        enforceFocus: function() {
            $(document).off('focusin.product').on('focusin.product', $.proxy(function(e) {
                if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                    this.$element.trigger('focus');
                }
            }, this));
        },
        escape: function() {
            if (this._shown && this.options.keyboard) {
                this.$element.on('keyup.dismiss.product', $.proxy(function(e) {
                    e.which == 27 && this.hide();
                }, this));
            } else if (!this._shown) {
                this.$element.off('keyup.dismiss.product');
            }
        },
        imageRotate: function(delta) {
            var length = this.options.length,
                pos = this._rotatePosition || 0,
                index = pos + delta;
            if (index >= length) index = index % length;
            if (index < 0) index = length + index;
            this._rotatePosition = index;
            var width = this.$sprite.innerWidth(),
                x = width * index;
            this.$sprite.css('background-position', -x + 'px 0');
        }
    };
    $.fn[pluginName] = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data(pluginName),
                options = typeof option == 'object' && option;
            if (!data) $this.data(pluginName, (data = new Plugin(this, options)));
            if (typeof option == 'string') data[option]();
            else data.show();
        });
    };
    $.fn[pluginName].Constructor = Plugin;
    $.fn[pluginName].defaults = pluginDefaults;
    $(document).on('click', '[data-toggle="pi-rotate"]', function(event) {
        var $this = $(this),
            href = $this.attr('href'),
            $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))),
            option = $target.data(pluginName) ? 'toggle' : {};
        if ($this.is('a')) event.preventDefault();
        $target[pluginName](option).one('hide', function() {
            $this.is(':visible') && $this.focus();
        });
    });
    var _drag = null;
    $(document).on('mousedown touchstart', '[data-pi-rotate-element="image"]', function(event) {
        if (event.type == 'touchstart' && event.originalEvent.touches.length > 1) return true;
        if (_drag !== null) return true;
        var $element = $(this).closest('[data-pi-rotate-element="root"]');
        if ($element.length < 1) return true;
        var data = $element.data(pluginName);
        if (!data) return true;
        var e = event.type == 'touchstart' ? event.originalEvent.touches[0] : event;
        _drag = {
            start: e.pageX,
            $target: $element,
            offset: data._dragOffset || 0
        };
    });
    $(document).on('mousemove touchmove', function(event) {
        if (_drag === null) return true;
        if (event.type == 'touchmove' && event.originalEvent.touches.length > 1) return true;
        var data = _drag.$target.data(pluginName);
        if (!data) return true;
        event.preventDefault();
        var e = event.type == 'touchmove' ? event.originalEvent.touches[0] : event;
        var delta = Math.round((e.pageX - _drag.start) / 20);
        if (delta !== 0) _drag.start = e.pageX;
        return (data.imageRotate(delta) || true);
    });
    $(document).on('mouseup touchend', function(event) {
        if (_drag === null) return true;
        _drag = null;
    });
})(window.jQuery);
