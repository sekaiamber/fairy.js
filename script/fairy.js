/**
 * fairy.js
 *
 * Copyright 2015 Xu Xiaomeng(@sekaiamber)
 *
 * Released under the MIT and GPL Licenses.
 *
 * ------------------------------------------------
 *  author:  Xu Xiaomeng
 *  version: 0.0.1
 *  source:  github.com/sekaiamber/fairy.js
 */
(function (document, window) {
    // face the future
    'use strict';
    // convert a array-like element to a real array
    var arrayify = function (a) {
        return [].slice.call(a);
    };

    // get selector, we can use jQuery if there is :)
    var $ = window.jQuery || (function (document) {
        // just like jQuery Dom object, our rule is `get first, set all`
        function DOMelements (doms) {
            this.doms = doms;
            this.css = function(name, value) {
                if (value == '' || value) {
                    for (var i = 0; i < this.doms.length; i++) {
                        this.doms[i].style[name] = value;
                    };
                    return this;
                } else {
                    if (this.doms.length > 0) {
                        return this.doms[0].style[name];
                    } else {
                        return undefined;
                    };
                };
            };
            this.attr = function(name, value) {
                if (value == '') {
                    for (var i = 0; i < this.doms.length; i++) {
                        this.doms[i].removeAttribute(name);
                    };
                    return this;
                } else if (value) {
                    for (var i = 0; i < this.doms.length; i++) {
                        this.doms[i].setAttribute(name, value);
                    };
                    return this;
                } else {
                    if (this.doms.length > 0) {
                        return this.doms[0].getAttribute(name);
                    } else {
                        return undefined;
                    };
                };
            };
        };
        return function(selector, context) {
            context = context ? (context.doms.length > 0 ? context.doms[0] : undefined) : document;
            if (context) {
                return new DOMelements(context.querySelectorAll(selector));
            } else {
                return new DOMelements([]);
            };
        }
    })(document);

    window.$ = $;
})(document, window)