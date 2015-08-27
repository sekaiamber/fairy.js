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

    // get selector
    var $ = (function (document) {
        // just like jQuery Dom object, our rule is `get first, set all` :)
        function DOMelements (doms) {
            this.doms = doms;
            this.DOMelements = true;
            this.css = function(prep, value) {
                var name = prep;
                if (typeof prep == 'string') {
                    prep = {};
                    prep[name] = value;
                };
                for (name in prep) {
                    value = prep[name];
                    if (value == '' || value) {
                        for (var i = 0; i < this.doms.length; i++) {
                            this.doms[i].style[name] = value;
                        };
                    } else {
                        if (this.doms.length > 0) {
                            return this.doms[0].style[name];
                        } else {
                            return undefined;
                        };
                    };
                };
                return this;
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
            this.first = function() {
                return new DOMelements(this.doms.length > 0 ? [this.doms[0]] : []); 
            };
            this.each = function(call) {
                for (var i = 0; i < this.doms.length; i++) {
                    call.call(this.doms[i], i);
                };
            };
            // http://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html
            this.offset = function() {
                if (this.doms.length > 0) {
                    return {
                        left: this.doms[0].offsetLeft,
                        top: this.doms[0].offsetTop
                    };
                } else {
                    return undefined;
                };
            };
            // http://www.cnblogs.com/dolphinX/archive/2012/11/19/2777756.html
            this.width = function() {
                if (this.doms.length > 0) {
                    return this.doms[0].clientWidth;
                } else {
                    return undefined;
                };
            };
        };
        return function(selector, context) {
            if (selector.DOMelements) {
                return selector;
            };
            if (typeof selector == 'object') {
                return new DOMelements([selector]);
            };
            context = context ? (context.doms.length > 0 ? context.doms[0] : undefined) : document;
            if (context) {
                return new DOMelements(context.querySelectorAll(selector));
            } else {
                return new DOMelements([]);
            };
        }
    })(document);

    // css
    var _css = '#fairy{overflow:hidden;position:relative;margin:0;padding:0;height:100%;width:100%;}#fairy .fairy-canvas{position:relative;}';

    // here is the helper
    var helper = {
        reach: /[^, ]+/g,
        cssprefix: '-ms-,-moz-,-webkit-,-o-',
        arrayify: function (a) {
            return [].slice.call(a);
        },
        getSpecificCss: function(name, value) {
            var ret = {};
            ret[name] = value;
            helper.cssprefix.replace(helper.reach, function (prefix) {
                ret[prefix + name] = value;
            });
            return ret;
        },
        getDomCenter: function(dom) {
            dom = $(dom);
            var ret = dom.offset();

            return ret;
        }
    };

    // here is all apis we use
    var apis = {
        root: undefined,
        canvas: undefined,
        supported: false,
        inited: false,
        data: {
            width: 1024,
            height: 768,
            scale: 1,
            perspective: 1000,
            transitionDuration: 1000,
            current: -1
        },
        presentation: [],
        staticApis: [
            'init', 'support'
        ],
        init: function(root) {
            if (!this.support()) {
                throw new Error("[fairy.js]: Your broswer is not support fairy.");
            };
            // init data
            this._initData();
            // add css
            var css = document.createElement('style');
            if (css.styleSheet) {
                css.styleSheet.cssText = _css;
            } else {
                css.appendChild(document.createTextNode(_css));
            };
            document.getElementsByTagName('head')[0].appendChild(css);
            // set root
            root = root || '#fairy';
            this.root = $(root).doms[0];
            // set canvas
            this.canvas = document.createElement("div");
            this.canvas.className = 'fairy-canvas';
            // sort out step-index
            $('.step').each(function(i) {
                var $this = $(this);
                var si = Number($this.attr('step-index'));
                if (isNaN(si)) {
                    throw new Error("[fairy.js]: `step-index` should be a number.");
                };
                apis.canvas.appendChild(this);
                apis.presentation.push({
                    index: si,
                    dom: $this
                });
            });
            this.presentation.sort(function (a, b){
                return a['index'] - b['index'];
            });
            // append canvas to root
            this.root.appendChild(this.canvas);

            // we set `inited` to `true`
            this.inited = true;
        },
        start: function(current) {
            current = current || 0;
            this.data.current = current;
            this.goto(current);
        },
        next: function() {
            var current = this.data.current;
            if (current == this.presentation.length - 1) {
                return;
            } else {
                current++;
                this.data.current = current;
                this.goto(current);
            }
        },
        prep: function() {
            var current = this.data.current;
            if (current == 0) {
                return;
            } else {
                current--;
                this.data.current = current;
                this.goto(current);
            }
        },
        goto: function(index) {
            var dom = this.presentation[index].dom;
            var center = helper.getDomCenter(dom);
            console.log(center);
        },
        support: function() {
            // ==TODO==
            var s = true;
            this.supported = s;
            return s;
        },
        _initData: function() {
            this.data['width'] = document.body.clientWidth;
            this.data['height'] = document.body.clientHeight;
        },
    };

    // fairy start here :)
    // I love the single entry of a library
    var fairy = function(api) {
        if (apis[api] && typeof apis[api] == 'function') {
            if (apis.staticApis.indexOf(api) == -1 && !apis.inited) {
                throw new Error("[fairy.js]: You should init fairy first.");
            };
            var args = helper.arrayify(arguments);
            args.shift();
            var r = apis[api].apply(apis, args);
            if (r) {
                // if the api have a return value, return it.
                return r;
            } else {
                // make chain, we can use like `fairy('api', args)('api2', args2)`
                return fairy;
            };
        } else {
            throw new Error("[fairy.js]: No such api named '" + api + "'.");
        };
    };

    window.fairy = fairy;


    // ==TODO==
    // delete if complate
    window.$ = $;

})(document, window)