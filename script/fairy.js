/**
 * fairy.js
 *
 * Copyright 2015-2016 Xu Xiaomeng(@sekaiamber)
 *
 * Released under the MIT and GPL Licenses.
 *
 * ------------------------------------------------
 *  author:  Xu Xiaomeng
 *  version: 0.4.1
 *  source:  github.com/sekaiamber/fairy.js
 */
(function (document, window) {
    // face the future
    'use strict';

    // get selector
    var $$ = (function (document) {
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
            // class operatings copy from jQuery
            this.uc = /[\t\r\n\f]/g;
            this.E = /\S+/g;
            this._hasClass = function(dom, name) {
                if((" "+dom.className+" ").replace(this.uc," ").indexOf(" " + name + " ")>=0)
                    return!0;
                return!1;
            };
            this.hasClass = function(name) {
                if (this.doms.length > 0) {
                    return this._hasClass(this.doms[0], name);
                };
                return false;
            };
            this.addClass = function(name) {
                var b,c,d,e,f,g,h=0,
                i=this.doms.length;
                for(b=(name||"").match(this.E)||[];i>h;h++)
                    c=this.doms[h];
                    if(d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(this.uc," "):" ")){
                        f=0;
                        while(e=b[f++])
                            d.indexOf(" "+e+" ")<0&&(d+=e+" ");
                        g=helper.trim(d),c.className!==g&&(c.className=g)
                    }
            };
            this.removeClass = function(name) {
                var b,c,d,e,f,g,h=0,
                i=this.doms.length;
                for(b=(name||"").match(this.E)||[];i>h;h++)
                    if(c=this.doms[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(this.uc," "):"")){
                        f=0;
                        while(e=b[f++])
                            while(d.indexOf(" "+e+" ")>=0)
                                d=d.replace(" "+e+" "," ");
                            g=name?helper.trim(d):"",c.className!==g&&(c.className=g)
                    }
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
        + '#fairy .fairy-camera{position:absolute;left:50%;top:50%;}'
        + '#fairy .fairy-step{position: absolute;}'
        + '#fairy .fairy-element{position: absolute;}';

    function transData() {
        this.transData = true;
        this.X = 0;
        this.Y = 0;
        this.Z = 0;
        this.rX = 0;
        this.rY = 0;
        this.rZ = 0;
        this.scale = 1;
        this.perspective = 1000;
        this.clone = function() {
            var ret = new transData();
            ret.X = this.X;
            ret.Y = this.Y;
            ret.Z = this.Z;
            ret.rX = this.rX;
            ret.rY = this.rY;
            ret.rZ = this.rZ;
            ret.scale = this.scale;
            ret.perspective = this.perspective;
            return ret;
        };
    };

    // here is the helper
    var helper = {
        reach: /[^, ]+/g,
        rtrim: /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        cssprefix: '-ms-,-moz-,-webkit-,-o-',
        // convert a array-like element to a real array
        arrayify: function (a) {
            return [].slice.call(a);
        },
        trim: function (a){return null==a?"":(a+"").replace(helper.rtrim,"")},
        // throttling function calls, by Remy Sharp
        // http://remysharp.com/2010/07/21/throttling-function-calls/
        throttle: function (fn, delay) {
            var timer = null;
            return function () {
                var context = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            };
        },
        // using `cssprefix` to set a list of css
        getSpecificCss: function(name, value) {
            var ret = {};
            helper.cssprefix.replace(helper.reach, function (prefix) {
                ret[prefix + name] = value;
            });
            ret[name] = value;
            return ret;
        },
        // get a `transform` value
        getTransformString: function(trans, reverse) {
            reverse = reverse || false;
            var ret = [
                'translate3d(' + trans.X + 'px,' + trans.Y + 'px,' + trans.Z +'px)',
                'rotateX(' + trans.rX + 'deg)',
                'rotateY(' + trans.rY + 'deg)',
                'rotateZ(' + trans.rZ + 'deg)'
            ];
            if (reverse) {
                ret.reverse()
            };
            return ret.join(' ');
        },
        getCameraCssValue: function(perspective, scale) {
            return 'perspective(' + perspective + 'px) scale(' + scale + ')'
        },
        // https://github.com/JordanDelcros/Jo/blob/master/jo/jo.js
        // matrix3d
        // 0:m11, 4:m12, 8 :m13, 12:m14
        // 1:m21, 5:m22, 9 :m23, 13:m24
        // 2:m31, 6:m32, 10:m33, 14:m34
        // 3:m41, 7:m42, 11:m43, 15:m44
        readDomTransformRotate: function(value) {
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
            ret.X = ret.X * 180 / Math.PI;
            ret.Y = ret.Y * 180 / Math.PI;
            ret.Z = ret.Z * 180 / Math.PI;
            return ret;
        },
        readDomTransformTranslate: function(value) {
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
                    ret.X = vs[12];
                    ret.Y = vs[13];
                    ret.Z = vs[14];
                } else {
                    // matrix, only translateX and translateY
                    ret.X = vs[4];
                    ret.Y = vs[5];
                };
            };
            return ret;
        },
        readDomCenter: function(dom) {
            dom = $$(dom);
            var ret = dom.offset();
            ret.top += dom.outerHeight() / 2;
            ret.left += dom.outerWidth() / 2;
            return ret;
        },
        readDomTransform: function(dom) {
            dom = $$(dom);
            var t = helper.getSpecificCss('transform');
            var value = undefined;
            for(var name in t) {
                value = dom.css(name);
                if (value) {
                    break;
                };
            };
            var rotate = helper.readDomTransformRotate(value);
            var translate = helper.readDomTransformTranslate(value);
            var center = helper.readDomCenter(dom);
            var trans = new transData();
            trans.X = parseInt(center.left + translate.X);
            trans.Y = parseInt(center.top + translate.Y);
            trans.Z = parseInt(translate.Z);
            trans.rX = Math.round(rotate.X);
            trans.rY = Math.round(rotate.Y);
            trans.rZ = Math.round(rotate.Z);
            return trans;
        },
        readDomScale: function(dom, trans) {
            dom = $$(dom);
            var value = dom.attr('fairy-scale');
            if (value) {
                trans.scale = Number(value);
            }
            return trans;
        },
        buildItemCss: function(dom) {
            var trans = new helper.readDomTransform(dom);
            trans = helper.readDomScale(dom, trans);
            var css = 'translate(-50%, -50%) ' + helper.getTransformString(trans) + ' scale(' + trans.scale + ')';
            css = helper.getSpecificCss('transform', css);
            dom.css('position', 'absolute');
            dom.css('left', '0px');
            dom.css('top', '0px');
            dom.css(css);
            return trans;
        },
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
            suitableWidth: 0.9,
            perspective: 1000,
            scale: 1,
            transitionDuration: 1000,
            scaleChangeTransitionDelay: 500,
            current: 0,
            root: '#fairy'
        },
        presentation: [],
        indices: {},
        staticApis: [
            'init', 'support'
        ],
        steps: null,
        events: {},
        stepEnterTimeout: null,
        cssstr: _css,
        init: function(opts) {
            if (!this.support()) {
                throw new Error("[fairy.js]: Your broswer is not support fairy.");
            };
            // init data
            this._initData(opts);
            // add css
            var css = document.createElement('style');
            if (css.styleSheet) {
                css.styleSheet.cssText = this.cssstr;
            } else {
                css.appendChild(document.createTextNode(this.cssstr));
            };
            document.getElementsByTagName('head')[0].appendChild(css);
            // set root
            this.root = $$(this.data.root).first();
            // set canvas
            this.canvas = document.createElement("div");
            this.canvas.className = 'fairy-canvas';
            // set camera
            this.camera = document.createElement("div");
            this.camera.className = 'fairy-camera';
            // sort out step-index
            this.steps = $$('.fairy-step');
            this.steps.each(function(i) {
                var $this = $$(this);
                var sia = $this.attr('step-index').split(',');
                for (var i = 0; i < sia.length; i++) {
                    sia[i] = Number(helper.trim(sia[i]));
                    if (isNaN(sia[i])) {
                        throw new Error("[fairy.js]: `step-index` should be a number.");
                    };
                };
                apis.canvas.appendChild(this);
                for (var i = 0; i < sia.length; i++) {
                    var si = sia[i];
                    apis.presentation.push({
                        index: si,
                        dom: $this,
                        id: this.id,
                        event: $this.attr('fairy-event'),
                        inited: false,
                        same: sia
                    });
                };
            });
            this.presentation.sort(function (a, b){
                return a['index'] - b['index'];
            });
            for (var i = 0; i < this.presentation.length; i++) {
                var presentation = this.presentation[i];
                if (this.indices[presentation.index] != undefined) {
                    throw new Error("[fairy.js]: duplicate index.");
                };
                this.indices[presentation.index] = i;
            };
            // append canvas to camera, append camera to root
            this.root.doms[0].appendChild(this.camera);
            this.camera.appendChild(this.canvas);
            this.camera = $$(this.camera);
            this.canvas = $$(this.canvas);
            // css
            var orignCss = helper.getSpecificCss('transform-origin', 'left top 0px');
            this.canvas.css(orignCss);
            this.camera.css(orignCss);
            var transStyleCss = helper.getSpecificCss('transform-style', 'preserve-3d');
            this.canvas.css(transStyleCss);
            this.camera.css(transStyleCss);
            for (var i = 0; i < this.presentation.length; i++) {
                if (this.presentation[i].inited) {
                    continue;
                };
                var $this = this.presentation[i].dom;
                $this.css(transStyleCss);
                var trans = helper.buildItemCss($this);
                trans.perspective = this.data.perspective;
                for (var j = 0; j < this.presentation[i].same.length; j++) {
                    this.presentation[this.indices[this.presentation[i].same[j]]].inited = true;
                    this.presentation[this.indices[this.presentation[i].same[j]]].trans = trans;
                };
            };
            // deal with fairy-element
            var elems = $$('.fairy-element');
            elems.each(function(){
                apis.canvas.doms[0].appendChild(this);
                var $this = $$(this);
                $this.css(transStyleCss);
                helper.buildItemCss($this);
            });
            // goto 1st presentation
            this.goto(0, true);
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
        prev: function() {
            var current = this.data.current;
            if (current == 0) {
                return;
            } else {
                current--;
                this.data.current = current;
                this.goto(current);
            }
        },
        goto: function(trans, noTransitionChange) {
            var index = null;
            if (typeof trans === 'number') {
                index = trans;
            }
            if (index != null) {
                var dom = this.presentation[index].dom;
                trans = this.presentation[index].trans.clone();
                // negative the transform
                trans.X = 0 - trans.X;
                trans.Y = 0 - trans.Y;
                trans.Z = 0 - trans.Z;
                trans.rX = 0 - trans.rX;
                trans.rY = 0 - trans.rY;
                trans.rZ = 0 - trans.rZ;
                trans.scale = 1 / trans.scale;
                trans.perspective = this.data.perspective / trans.scale;
            };
            // change transition when scale changes
            var transitionCss = helper.getSpecificCss('transition', '');
            if (noTransitionChange) {
                this.canvas.css(transitionCss);
                this.camera.css(transitionCss);
            } else {
                if (this.data.scale === trans.scale) {
                    transitionCss = helper.getSpecificCss('transition', 'all ' + this.data.transitionDuration + 'ms ease-in-out 0ms');
                    this.canvas.css(transitionCss);
                    this.camera.css(transitionCss);
                } else if (this.data.scale > trans.scale) {
                    transitionCss = helper.getSpecificCss('transition', 'all ' + this.data.transitionDuration + 'ms ease-in-out ' + this.data.scaleChangeTransitionDelay + 'ms');
                    this.canvas.css(transitionCss);
                    transitionCss = helper.getSpecificCss('transition', 'all ' + this.data.transitionDuration + 'ms ease-in-out 0ms');
                    this.camera.css(transitionCss);
                } else if (this.data.scale < trans.scale) {
                    transitionCss = helper.getSpecificCss('transition', 'all ' + this.data.transitionDuration + 'ms ease-in-out ' + this.data.scaleChangeTransitionDelay + 'ms');
                    this.camera.css(transitionCss);
                    transitionCss = helper.getSpecificCss('transition', 'all ' + this.data.transitionDuration + 'ms ease-in-out 0ms');
                    this.canvas.css(transitionCss);
                }
            }
            var canvasCss = helper.getSpecificCss('transform', helper.getTransformString(trans, true));
            this.canvas.css(canvasCss);
            if (index != null) {
                // calculate the perspective and scale
                var scaling = Math.min(this.data.width * this.data.suitableWidth / dom.outerWidth(), this.data.height * this.data.suitableWidth / dom.outerHeight(), 1);
                trans.perspective = trans.perspective / scaling;
                trans.scale = this.data.perspective / trans.perspective;
            };
            var cameraCss = helper.getSpecificCss('transform', helper.getCameraCssValue(trans.perspective, trans.scale));
            this.camera.css(cameraCss);
            this.data.scale = trans.scale;
            this.data.currentTrans = trans;

            if (index != null) {
                // class
                dom.addClass('showed');
                this.steps.removeClass('current');
                dom.addClass('current');
                for (var i = 0; i < this.presentation.length; i++) {
                    var id = 'fairy-on-' + this.presentation[i].id;
                    this.root.removeClass(id);
                };
                if (this.presentation[index].id) {
                    this.root.addClass('fairy-on-' + this.presentation[index].id);
                };
                window.clearTimeout(this.stepEnterTimeout);
                this.stepEnterTimeout = window.setTimeout(function() {
                    apis.steps.removeClass('trans-finish');
                    apis.presentation[apis.data.current].dom.addClass('trans-finish');
                }, this.data.transitionDuration);
                
                // event
                if (this.events[this.presentation[index].event]) {
                    this.events[this.presentation[index].event](dom.doms[0]);
                };
                if (this.events.change) {
                    this.events.change(dom.doms[0], this.presentation[index].index);
                };
            };
        },
        support: function() {
            // ==TODO==
            var s = true;
            this.supported = s;
            return s;
        },
        _initData: function(opts) {
            // ==TODO==
            this.data.width = document.body.clientWidth;
            this.data.height = document.body.clientHeight;

            // merge options
            if (opts) {
                for(var name in opts) {
                    if (this.data[name]) {
                        this.data[name] = opts[name];
                    };
                }
                if (opts.events) {
                    this.events = opts.events;
                };
            };
            // rescale presentation when window is resized
            window.addEventListener("resize", helper.throttle(function () {
                apis.data.width = document.body.clientWidth;
                apis.data.height = document.body.clientHeight;
                apis.goto(apis.data.current);
            }, 250), false);
            // Prevent default keydown action when one of supported key is pressed.
            document.addEventListener("keydown", function ( event ) {
                if (( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40) ) {
                    event.preventDefault();
                }
            }, false);
            document.addEventListener("keyup", function ( event ) {
                if (( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40) ) {
                    switch( event.keyCode ) {
                        case 33: // pg up
                        case 37: // left
                        case 38: // up
                                 apis.prev();
                                 break;
                        case 32: // space
                        case 34: // pg down
                        case 39: // right
                        case 40: // down
                                 apis.next();
                                 break;
                    }
                    
                    event.preventDefault();
                }
            }, false);
            // touch handler to detect taps on the left and right side of the screen
            // based on awesome work of @hakimel: https://github.com/hakimel/reveal.js
            document.addEventListener("touchstart", function ( event ) {
                if (event.touches.length === 1) {
                    var x = event.touches[0].clientX, width = window.innerWidth * 0.3;
                    if ( x < width ) {
                        apis.prev();
                    } else if ( x > window.innerWidth - width ) {
                        apis.next();
                    }
                }
            }, false);
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

    fairy.apis = apis;
    fairy.helper = helper;
    fairy._selector = $$;

    window.fairy = fairy;
})(document, window)
