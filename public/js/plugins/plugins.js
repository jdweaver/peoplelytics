// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

(function() {
    Math.toRad = function(d) {return d*0.0174532925;}
    Math.toDeg = function(r) {return r/0.0174532925;}
    function History() { return this; };

    //Not sure if history is the correct term for this guy anymore...
    History.prototype = {
        length: 0,
        add: function(t, m, s) {
            this[this.length] = {type: t, matrix: m, string: s};
            this.length++;
        },
        last: function(type) {
            var i = this.length;
            while(i--) {
                if(this[i].type === type) {
                    return this[i];
                }
            }
            return undefined;
        },
        empty: function() {
            for(var t in this) {
                delete this[t];
            }
            this.length = 0;
        }
    }

    function easyTransform(el){
        return new easyTransformEl(el);
    }

    function easyTransformEl(el) {
        this.el = el;
    }

    easyTransformEl.prototype = {
        current: [1,0,0,1,0,0],
        hist: new History(),
        saved: {},

        stopTransform: function() {
            this.el.style.MozTransform = this.getLiveTransform();
            this.el.style.webkitTransform = this.getLiveTransform();
            this.el.style.msTransform = this.getLiveTransform();
            this.el.style.Transform = this.getLiveTransform();
            return this;
        },

        //TODO: Make adding of rotations and other transforms optional.
        rotate: function(a) {
            var last = this.hist.last('rotate'),
                r = (last ? Math.acos(last.matrix[0]) + Math.toRad(a) : Math.toRad(a)),
                m;

            if(r.toString().split('.')[1].length > 4) r = Math.round(r*10000)/10000
            
            if(last) {
                m = [Math.cos(r),Math.sin(r),-Math.sin(r),Math.cos(r), 0, 0];
             } else {
                m = [Math.cos(r),Math.sin(r),-Math.sin(r),Math.cos(r), 0, 0];
            }
            
            //Check if rotation already in place...
            if(last) this.removeTransform(last.matrix);
            this.addTransform(m);

            this.hist.add('rotate', m, 'rotate(' + a + 'deg)');
            this.setStyle(this.current);

            return this;
        },

        translate: function(x, y) {
            var m = [1,0,0,1,x,y];

            this.current[4] = x;
            this.current[5] = y;

            this.hist.add('translate', m.toString(), 'translate(' + x + 'px, ' + y + 'px)');
            this.setStyle(this.current);

            return this;
        },

        scale: function(x, y) {
            if(!y) y = x;
            var m = [x,0,0,y,0,0];

            this.current[0] = m[0];
            this.current[3] = m[3];

            this.hist.add('scale', m, 'scale(' + m[0] + ', ' + m[3] + ')');
            console.log(this.current);
            this.setStyle(this.current);

            return this;
        },

        skew: function(x, y) {
            var m = [1,Math.tan(Math.toRad(y)),Math.tan(Math.toRad(x)),1,0,0];
            
            this.current[1] = m[1];
            this.current[2] = m[2];

            this.hist.add('skew', m, 'skew(' + x + 'deg, ' + y + 'deg)');
            this.setStyle(this.current);

            return this;
        },

        transform: function(t) {
            var t = t.match(/([a-z]+(?=\()|-?[0-9]+(deg|px)?(?=,)? ?)+/ig);
            console.log(t);
            return this;
        },

        reset: function() {
            this.current = [1,0,0,1,0,0];
            this.hist.empty();
            this.setStyle(this.current);

            return this;
        },

        //Since rotation affects all vectors, need to make check for rotation and deeeeeee-vide!
        getRotation: function(end) {
            if(end) return this.current;
            return Math.round(Math.toDeg(Math.acos(this.getLiveMatrix()[0])));
        },

        getTranslation: function(end) {
            if(end) return this.current;
            return [this.getLiveMatrix()[4], this.getLiveMatrix()[5]];
        },

        getXTranslation: function(end) {
            if(end) return this.current;
            return this.getLiveMatrix()[4];
        },

        getScale: function(end) {
            if(end) return this.current;
            return [this.getLiveMatrix()[0], this.getLiveMatrix()[3]];
        },

        getSkew: function(end) {
            if(end) return [Math.toDeg(Math.atan(this.current[1])), Math.toDeg(Math.atan(this.current[2]))];
            return [this.getLiveMatrix()[1], this.getLiveMatrix()[2]];
        },

        getTransform: function(live, asMatrix) {
            if(asMatrix) return this.current;
            
            var r = this.hist.last('rotate'),
                sk = this.hist.last('skew'),
                sc = this.hist.last('scale'),
                t = this.hist.last('translate'),
                transform = (r ? r.string + ' ' : '') + (sk ? sk.string + ' ' : '') + (sc ? sc.string + ' ' : '') + (t ? t.string : '');

            return transform;
        },

        getLiveMatrix: function(asArray) {

            if(window.getComputedStyle(this.el, null).webkitTransform != undefined) {
                return window.getComputedStyle(this.el, null).webkitTransform.match(/-?[\d\.]+(?=,)?/g);
            }

            if(window.getComputedStyle(this.el, null).MozTransform != undefined) {
                return window.getComputedStyle(this.el, null).MozTransform.match(/-?[\d\.]+(?=,)?/g);
            }

            if(window.getComputedStyle(this.el, null).msTransform != undefined) {
                return window.getComputedStyle(this.el, null).msTransform.match(/-?[\d\.]+(?=,)?/g);
            }

            if(window.getComputedStyle(this.el, null).Transform != undefined) {
                return window.getComputedStyle(this.el, null).Transform.match(/-?[\d\.]+(?=,)?/g);
            }

            
        },

        addTransform: function(m) {
            //assuming 2d for now...yeah, yeah.
            //Sorts array so we're in order of matrix rows, rather than vectors
            for(var i = 1, len = 3, tmp; i < len; i++) {
                tmp = m[i];
                m[i] = m[i+1];
                m[i+=1] = tmp;
            }
            
            var c = this.current.concat([]),
                nm = m.concat([]),
                n = [],
                v = 0;

            while(nm.length > 2) {
                var cm = (m[0] == 0 ? nm.shift() + 1 : nm.shift()),
                    cc = (c[0] == 0 ? c.shift() + 1 : c.shift());
                
                //Reminder for 3d...things'll have to change :(
                //v += cm*cc;
                n.push(cm*cc);
                //v = 0;
            }

            this.hist.add('transform', c, 'matrix(' + c.toString() + ')');
            this.current = n.concat(c);
        },

        removeTransform: function(m) {
            //THIS AIN'T DRY, YO! Fix it.
            //Instead, take the matrix and divide each point to remove...
            for(var i = 1, len = 3, tmp; i < len; i++) {
                tmp = m[i];
                m[i] = m[i+1];
                m[i+=1] = tmp;
            }
            
            var c = this.current.concat([]),
                nm = m.concat([]),
                n = [];

            while(nm.length > 2) {
                var cm = (m[0] == 0 ? nm.shift() + 1 : nm.shift()),
                    cc = (c[0] == 0 ? c.shift() + 1 : c.shift());
                
                n.push(cc/cm);
            }

            this.current = n.concat(c);
        },

        setStyle: function(m) {
            this.el.style.webkitTransform = 'matrix(' + m.toString() + ')';
            this.el.style.MozTransform = 'matrix(' + m.toString() + ')';
            this.el.style.msTransform = 'matrix(' + m.toString() + ')';
            this.el.style.Transform = 'matrix(' + m.toString() + ')';
        },

        save: function(name, m) {
            if(!m) {
                this.saved[name] = this.current;
            } else {
                this.save[name] = m;
            }

            return this;
        }
    }

    window.ezt = easyTransform;
})();

/*! waitForImages jQuery Plugin 2013-07-20 */
!function(a){var b="waitForImages";a.waitForImages={hasImageProperties:["backgroundImage","listStyleImage","borderImage","borderCornerImage","cursor"]},a.expr[":"].uncached=function(b){if(!a(b).is('img[src!=""]'))return!1;var c=new Image;return c.src=b.src,!c.complete},a.fn.waitForImages=function(c,d,e){var f=0,g=0;if(a.isPlainObject(arguments[0])&&(e=arguments[0].waitForAll,d=arguments[0].each,c=arguments[0].finished),c=c||a.noop,d=d||a.noop,e=!!e,!a.isFunction(c)||!a.isFunction(d))throw new TypeError("An invalid callback was supplied.");return this.each(function(){var h=a(this),i=[],j=a.waitForImages.hasImageProperties||[],k=/url\(\s*(['"]?)(.*?)\1\s*\)/g;e?h.find("*").addBack().each(function(){var b=a(this);b.is("img:uncached")&&i.push({src:b.attr("src"),element:b[0]}),a.each(j,function(a,c){var d,e=b.css(c);if(!e)return!0;for(;d=k.exec(e);)i.push({src:d[2],element:b[0]})})}):h.find("img:uncached").each(function(){i.push({src:this.src,element:this})}),f=i.length,g=0,0===f&&c.call(h[0]),a.each(i,function(e,i){var j=new Image;a(j).on("load."+b+" error."+b,function(a){return g++,d.call(i.element,g,f,"load"==a.type),g==f?(c.call(h[0]),!1):void 0}),j.src=i.src})})}}(jQuery);
