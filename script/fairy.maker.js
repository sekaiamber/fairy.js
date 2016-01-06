/**
 * fairy.js
 *
 * Copyright 2015-2016 Xu Xiaomeng(@sekaiamber)
 *
 * Released under the MIT and GPL Licenses.
 *
 * ------------------------------------------------
 *  author:  Xu Xiaomeng
 *  version: 0.3.2
 *  source:  github.com/sekaiamber/fairy.js
 */
 (function (fairy, document, window) {
    // hijack fairy
    var helper = fairy.helper;
    var apis = fairy.apis;
    var $$ = fairy._selector;

    // enhance helper
    // extend object a and b
    helper.extend = function(a, b, overwrite, doeach) {
        overwrite = overwrite || false;
        for(var e in b) {
            if (a[e]) {
                if (overwrite) {
                    if (doeach) doeach(a, b, e);
                    a[e] = b[e];
                };
            } else {
                a[e] = b[e];
            };
        }
    };
    helper.extend(helper, {
        log: function() {
            if (console && console.log)
                for (var i = 0; i < arguments.length; i++)
                    console.log('[fairy.js]: ' + arguments[i]);
        },
        getUrl: function(index, trans) {
            return index + ',' + trans.X + ',' + trans.Y + ',' + trans.Z + ',' + trans.rX + ',' + trans.rY + ',' + trans.rZ + ',' + trans.scale + ',' + trans.perspective;
        },
        upsetFromUrl: function(anchor) {
            if (anchor) {} else {
                anchor = window.location.href.split("#")[1];
                if (anchor) {
                    anchor = anchor.split('(')[1].split(')')[0].split(',');  
                };
            };
            apis.data.current = parseInt(anchor[0]);
            apis.data.currentTrans.X = parseInt(anchor[1]);
            apis.data.currentTrans.Y = parseInt(anchor[2]);
            apis.data.currentTrans.Z = parseInt(anchor[3]);
            apis.data.currentTrans.rX = parseInt(anchor[4]);
            apis.data.currentTrans.rY = parseInt(anchor[5]);
            apis.data.currentTrans.rZ = parseInt(anchor[6]);
            apis.data.currentTrans.scale = parseInt(anchor[7]);
            apis.data.currentTrans.perspective = parseInt(anchor[8]);
        },
        changeUrl: function(index, trans) {
            var anchor = this.getUrl(index, trans);
            var url = window.location.href.split("#")[0];
            url += '#(' + anchor + ')';
            window.location.href = url;
        }
    });

    // override functions in apis
    apis.cssstr = apis.cssstr
        + "#fairy .fairy-hover{border:1px solid rgba(143,199,76,1);border-radius:5px;box-shadow:0 0 10px rgba(143,199,76,1);}"
        + "#fairy.fairy-dragging{cursor:move;}";
    helper.extend(apis, {
        _: {},
        drag: {
            start: false,
            ing: false,
            position: {X: 0, Y: 0}
        },
        init: function(opts) {
            helper.log('You are using fairy.maker.js.', 'welcome :)');
            var anchor = window.location.href.split("#")[1];
            this._.init.call(this, opts);

            helper.log('disable transition.');
            var transitionCss = helper.getSpecificCss('transition', '');
            this.canvas.css(transitionCss);
            this.camera.css(transitionCss);

            this._initMakerData(opts);

            // upsetUrl
            if (anchor) {
                // events and index
                anchor = anchor.split('(')[1].split(')')[0].split(',');
                helper.upsetFromUrl(anchor);
                this.goto(apis.data.current);
                // canvas and camera
                helper.upsetFromUrl(anchor);
                this.goto(apis.data.currentTrans);
            };
        },
        goto: function(trans, updateUrl) {
            updateUrl = updateUrl || true;
            this._.goto.call(this, trans);
            if (updateUrl) {
                helper.changeUrl(apis.data.current, apis.data.currentTrans);
            };
        },
        start: function() {
            this.goto(apis.data.currentTrans);
        },
        _initMakerData: function(opts) {
            helper.log('add step event.');
            for (var i = 0; i < this.presentation.length; i++) {
                var dom = this.presentation[i].dom.doms[0];
                dom.addEventListener('mouseup', function (event) {
                    if (apis.drag.ing) {
                        return;
                    };
                    var target = event.target;
                    while(!$$(target).hasClass('fairy-step')) {
                        target = target.parentNode;
                    };
                    var $this = $$(target);
                    apis.data.current = apis.indices[helper.trim($this.attr('step-index').split(',')[0])];
                    apis.goto(apis.data.current);
                }, false);
                dom.addEventListener('mouseenter', function (event) {
                    var $this = $$(event.target);
                    $this.addClass('fairy-hover');
                }, false);
                dom.addEventListener('mouseleave', function (event) {
                    var $this = $$(event.target);
                    $this.removeClass('fairy-hover');
                }, false);
            };

            helper.log('add drag event.');
            this.root.doms[0].addEventListener('mousedown', function (event) {
                apis.drag.start = true;
            }, false);
            this.root.doms[0].addEventListener('mouseup', function (event) {
                apis.drag.start = apis.drag.ing = false;
                $$(apis.root).removeClass('fairy-dragging');
            }, false);
            this.root.doms[0].addEventListener('mousemove', function (event) {
                if (apis.drag.start) {
                    $$(apis.root).addClass('fairy-dragging');
                    event.preventDefault();
                    apis.drag.ing = true;
                    var dx = event.clientX - apis.drag.position.X;
                    var dy = event.clientY - apis.drag.position.Y;
                    apis.data.currentTrans.X += dx;
                    apis.data.currentTrans.Y += dy;
                    apis.goto(apis.data.currentTrans);
                };
                apis.drag.position.X = event.clientX;
                apis.drag.position.Y = event.clientY;
            }, false);
            helper.log('add scroll event.');
            var scroll = function (event) {
                event.preventDefault();
                var d;
                if (event.wheelDelta) {
                    d = event.wheelDelta;
                } else if (event.detail) {
                    d = event.detail;
                };
                if (d > 0) {
                    apis.data.currentTrans.Z += 100;
                } else {
                    apis.data.currentTrans.Z -= 100;
                };
                apis.goto(apis.data.currentTrans);
            };
            // firefox
            this.root.doms[0].addEventListener('DOMMouseScroll', scroll, false);
            this.root.doms[0].onmousewheel = scroll;
        }
    }, true, function(apis, newapis, fnName) {
        apis._[fnName] = apis[fnName];
    });

 })(fairy, document, window)