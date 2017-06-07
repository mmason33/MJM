/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Sage = {
    // All pages
    'common': {
      init: function() {
        // JavaScript to be fired on all pages

          // $('.nav-list li a').click(function(){
          //   $('a.active-item').removeClass('active-item');
          //   $(this).addClass('active-item');
          // });



          $('.nav-list li a').click(function(e){

            e.preventDefault();

            var active_tab_selector = $('.nav-list li a.active-item').attr('href');

            var active_nav = $('.nav-list li a.active-item');
            active_nav.removeClass('active-item');

            $(this).addClass('active-item');

            $(active_tab_selector).removeClass('active');
            $(active_tab_selector).addClass('hide');

            var target_tab_selector = $(this).attr('href');
            $(target_tab_selector).removeClass('hide');
            $(target_tab_selector).addClass('active');

            console.log($(this).attr('href'));


          });



          $( '#my-slider' ).sliderPro({
              width: '100%',
              height: '80vh',
              arrows: false,
              buttons: false,
              autoplay: false,
              loop: false
          });

          AOS.init({
            offset: 200,
            duration: 600,
            easing: 'ease-in-sine',
            delay: 400,
          });

          var c = document.getElementById("c");
          var ctx = c.getContext("2d");
          var cH;
          var cW;
          var bgColor = "#e5f2d5";
          var animations = [];
          var circles = [];

          var colorPicker = (function() {
            var colors = ["#e5f2d5", "#a1cf95", "#6ab8a4", "#269487", "#0c889c"];
            var index = 0;
            function next() {
              index = index++ < colors.length-1 ? index : 0;
              return colors[index];
            }
            function current() {
              return colors[index];
            }
            return {
              next: next,
              current: current
            };
          })();

          function removeAnimation(animation) {
            var index = animations.indexOf(animation);
            if (index > -1){
             animations.splice(index, 1);
            }          
          }

          function calcPageFillRadius(x, y) {
            var l = Math.max(x - 0, cW - x);
            var h = Math.max(y - 0, cH - y);
            return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
          }

          function addClickListeners() {
            document.addEventListener("touchstart", handleEvent);
            document.addEventListener("mousedown", handleEvent);
          }

          function handleEvent(e) {
              if (e.touches) { 
                e.preventDefault();
                e = e.touches[0];
              }
              var currentColor = colorPicker.current();
              var nextColor = colorPicker.next();
              var targetR = calcPageFillRadius(e.pageX, e.pageY);
              var rippleSize = Math.min(200, (cW * 0.4));
              var minCoverDuration = 750;
              
              var pageFill = new Circle({
                x: e.pageX,
                y: e.pageY,
                r: 0,
                fill: nextColor
              });
              var fillAnimation = anime({
                targets: pageFill,
                r: targetR,
                duration:  Math.max(targetR / 2 , minCoverDuration ),
                easing: "easeOutQuart",
                complete: function(){
                  bgColor = pageFill.fill;
                  removeAnimation(fillAnimation);
                }
              });
              
              var ripple = new Circle({
                x: e.pageX,
                y: e.pageY,
                r: 0,
                fill: currentColor,
                stroke: {
                  width: 3,
                  color: currentColor
                },
                opacity: 1
              });
              var rippleAnimation = anime({
                targets: ripple,
                r: rippleSize,
                opacity: 0,
                easing: "easeOutExpo",
                duration: 900,
                complete: removeAnimation
              });
              
              var particles = [];
              for (var i=0; i<32; i++) {
                var particle = new Circle({
                  x: e.pageX,
                  y: e.pageY,
                  fill: currentColor,
                  r: anime.random(24, 48)
                });
                particles.push(particle);
              }
              var particlesAnimation = anime({
                targets: particles,
                x: function(particle){
                  return particle.x + anime.random(rippleSize, -rippleSize);
                },
                y: function(particle){
                  return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
                },
                r: 0,
                easing: "easeOutExpo",
                duration: anime.random(1000,1300),
                complete: removeAnimation
              });
              animations.push(fillAnimation, rippleAnimation, particlesAnimation);
          }

          function extend(a, b){
            for(var key in b) {
              if(b.hasOwnProperty(key)) {
                a[key] = b[key];
              }
            }
            return a;
          }

          var Circle = function(opts) {
            extend(this, opts);
          };

          Circle.prototype.draw = function() {
            ctx.globalAlpha = this.opacity || 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            if (this.stroke) {
              ctx.strokeStyle = this.stroke.color;
              ctx.lineWidth = this.stroke.width;
              ctx.stroke();
            }
            if (this.fill) {
              ctx.fillStyle = this.fill;
              ctx.fill();
            }
            ctx.closePath();
            ctx.globalAlpha = 1;
          };

          var animate = anime({
            duration: Infinity,
            update: function() {
              ctx.fillStyle = bgColor;
              ctx.fillRect(0, 0, cW, cH);
              animations.forEach(function(anim) {
                anim.animatables.forEach(function(animatable) {
                  animatable.target.draw();
                });
              });
            }
          });

          var resizeCanvas = function() {
            cW = window.innerWidth;
            cH = window.innerHeight;
            c.width = cW * devicePixelRatio;
            c.height = cH * devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
          };

          (function init() {
            resizeCanvas();
            if (window.CP) {
              // CodePen's loop detection was causin' problems
              // and I have no idea why, so...
              window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 6000; 
            }
            window.addEventListener("resize", resizeCanvas);
            addClickListeners();
            if (!!window.location.pathname.match(/fullcpgrid/)) {
              startFauxClicking();
            }
            handleInactiveUser();
          })();

          function handleInactiveUser() {
            var inactive = setTimeout(function(){
              fauxClick(cW/2, cH/2);
            }, 2000);
            
            function clearInactiveTimeout() {
              clearTimeout(inactive);
              document.removeEventListener("mousedown", clearInactiveTimeout);
              document.removeEventListener("touchstart", clearInactiveTimeout);
            }
            
            document.addEventListener("mousedown", clearInactiveTimeout);
            document.addEventListener("touchstart", clearInactiveTimeout);
          }

          function startFauxClicking() {
            setTimeout(function(){
              fauxClick(anime.random( cW * 0.2, cW * 0.8), anime.random(cH * 0.2, cH * 0.8));
              startFauxClicking();
            }, anime.random(200, 900));
          }

          function fauxClick(x, y) {
            var fauxClick = new Event("mousedown");
            fauxClick.pageX = x;
            fauxClick.pageY = y;
            document.dispatchEvent(fauxClick);
          }
      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    },
    // Home page
    'home': {
      init: function() {
        // JavaScript to be fired on the home page
      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
      }
    },
    // About us page, note the change from about-us to about_us.
    'about_us': {
      init: function() {
        // JavaScript to be fired on the about us page
      }
    }
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Sage;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
