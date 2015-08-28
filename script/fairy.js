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
                        // set css
                        for (var i = 0; i < this.doms.length; i++) {
                            this.doms[i].style[name] = value;
                        };
                    } else {
                        // read css
                        if (this.doms.length > 0) {
                            var v = this.doms[0].style[name];
                            if (v) {
                                return v;    
                            };
                            v = window.getComputedStyle(this.doms[0], "")[name];
                            return v;
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
            this.height = function() {
                if (this.doms.length > 0) {
                    return this.doms[0].clientHeight;
                } else {
                    return undefined;
                };
            };
            this.outerWidth = function() {
                if (this.doms.length > 0) {
                    return this.doms[0].offsetWidth;
                } else {
                    return undefined;
                };
            };
            this.outerHeight = function() {
                if (this.doms.length > 0) {
                    return this.doms[0].offsetHeight;
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
    var _css = '#fairy{overflow:hidden;position:relative;margin:0;padding:0;height:100%;width:100%;}'
        + '#fairy .fairy-canvas{position:relative;}'
        + '#fairy .fairy-camera{position:absolute;left:50%;top:50%;}';

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
            ret.top += dom.outerHeight() / 2;
            ret.left += dom.outerWidth() / 2;
            return ret;
        },
        getTransform: function(center, width, height, winWidth, winHeight, trans, rotate) {
            var ret = {
                X: 0,
                Y: 0,
                Z: 0,
                rX: 0,
                rY: 0,
                rZ: 0,
                scale: 1
            };
            ret.X = Math.floor(0 - center.left);
            ret.Y = Math.floor(0 - center.top);
            ret.scale = Math.min(winWidth * 0.9 / width, winHeight * 0.9 / height);
            rotate = rotate || {X: 0, Y: 0, Z: 0};
            ret.rX = 0 - rotate.X;
            ret.rY = 0 - rotate.Y;
            ret.rZ = 0 - rotate.Z;
            return ret;
        },
        getCanvasCssValue: function(trans) {
            return 'rotateX(' + trans.rX + 'deg) rotateY(' + trans.rY + 'deg) rotateZ(' + trans.rZ + 'deg) translate3d(' + trans.X + 'px, ' + trans.Y + 'px, ' + trans.Z + 'px)'
        },
        getCameraCssValue: function(trans) {
            return 'scale(' + trans.scale + ')'
        },
        // https://github.com/JordanDelcros/Jo/blob/master/jo/jo.js
        readTransformRotate: function(dom) {
            var t = helper.getSpecificCss('transform');
            dom = $(dom);
            var value = undefined;
            for(var name in t) {
                value = dom.css(name);
                if (value) {
                    break;
                };
            };
            var ret = {
                X: 0,
                Y: 0,
                Z: 0
            };
            if (value && value.indexOf('matrix') != -1) {
                value = value.toLowerCase();
                value = value.replace(' ', '');
                var vs = value.split('(')[1].split(')')[0].split(',');
                for (var i = 0; i < vs.length; i++) {
                    vs[i] = Number(vs[i]);
                };
                if (value.indexOf('matrix3d') != -1) {
                    // matrix3d
                    // 0:m11, 4:m12, 8 :m13, 12:m14
                    // 1:m21, 5:m22, 9 :m23, 13:m24
                    // 2:m31, 6:m32, 10:m33, 14:m34
                    // 3:m41, 7:m42, 11:m43, 15:m44
                    // x = atan2(m23, m33)
                    // y = asin(-m13)
                    // z = atan2(m12, m11)
                    // if cos(y) = 0:
                    //     x = atan2(-m31, m22)
                    //     z = 0
                    ret.X = -Math.atan2(vs[9], vs[10]);
                    ret.Y = -Math.asin(-vs[8]);
                    ret.Z = -Math.atan2(vs[4], vs[0]);

                    if (Math.cos(ret.Y) === 0) {
                        ret.X = -Math.atan2(vs[2], vs[5]);
                        ret.Z = 0;
                    };
                } else {
                    // matrix, only rotateZ
                    ret.Z = Math.asin(vs[1]);
                };
            };
            ret.X = (ret.X * 180 / Math.PI).toFixed(4);
            ret.Y = (ret.Y * 180 / Math.PI).toFixed(4);
            ret.Z = (ret.Z * 180 / Math.PI).toFixed(4);
            return ret;
        }
    };

    // here is all apis we use
    var apis = {
        root: undefined,
        camera: undefined,
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
            this.root = $(root).first();
            // set canvas
            this.canvas = document.createElement("div");
            this.canvas.className = 'fairy-canvas';
            // set camera
            this.camera = document.createElement("div");
            this.camera.className = 'fairy-camera';
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
            // append canvas to camera, append camera to root
            this.root.doms[0].appendChild(this.camera);
            this.camera.appendChild(this.canvas);
            this.camera = $(this.camera);
            this.canvas = $(this.canvas);

            // debug
            var arc = document.createElement("div");
            arc.className = 'fairy-arc';
            this.canvas.doms[0].appendChild(arc);


            // css
            var orignCss = helper.getSpecificCss('transform-origin', 'left top 0px');
            this.canvas.css(orignCss);
            this.camera.css(orignCss);
            var transStyleCss = helper.getSpecificCss('transform-style', 'preserve-3d');
            this.canvas.css(transStyleCss);
            this.camera.css(transStyleCss);
            $('.step').css(transStyleCss);
            // var transitionCss = helper.getSpecificCss('transition', 'all 1000ms ease-in-out 500ms');
            // this.canvas.css(transitionCss);
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
            var rotate = helper.readTransformRotate(dom);
            console.log(rotate);
            var trans = helper.getTransform(center, dom.outerWidth(), dom.outerHeight(), this.data.width, this.data.height, rotate);
            console.log(trans);
            
            var transCanvasCss = helper.getSpecificCss('transform', helper.getCanvasCssValue(trans));
            var transCameraCss = helper.getSpecificCss('transform', helper.getCameraCssValue(trans));
            this.canvas.css(transCanvasCss);
            this.camera.css(transCameraCss);
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