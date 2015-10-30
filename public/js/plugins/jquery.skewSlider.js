/**
 * jquery.skewSlider.js v1.0.0
 *
 
 * Copyright 2014, Hector Mancera.
 * 
 */
;( function( $, window, undefined ) {

	'use strict';

	// global
	var Modernizr = window.Modernizr;

	$.SKEWSlider = function( options, element ) {
		this.$el = $( element );
		this._init( options );
	};

	// the options
	$.SKEWSlider.defaults = {
		// default transition speed (ms)
		speed : 1000,
		// default transition easing
		easing : 'ease',
        // default skew degrees
		skew : -25,
        // default slider width
		width: '100%',
		// default slider height
		height: '100%',
		// default item percent width
		slidePercent: 75,
		// center current item?
		centered: true,
		// number of images to pre-load
		preloadCount: 2,
		// movement effects
		moveFx: false,
		// default animation delay (stack) requires moveFx
		delay: 0,
		// represents the speed difference between slides 
		speedDifference: 150,
		// infinite slide loop,
		infiniteSlide: true,
		// navigation dots
		navDots: true,
		// automatic horizontal padding
		itemPadding: false,
		// percent of movement on hover active item siblings 
		moveOnHover: 4,
		// speed of hover movement
		hoverSpeed: 600,
		// enable / disable click event on adjacent items 
		clickOnSiblings: true,
		// aspect ratio
		ratio: 40/11,
		// slideshow time 
		slideshow: 8000,
        // breakpoints
		breakpoints: false,
		// hide or show captions
		showCaption: true,
		// default current slide
		setCurrent: 0,
		// skw-itemPrev and skw-itemNext states distance from current slide
		NextPrevDistance: 1,
		// how many items do you want to slide per click
		itemsToslide : 1
	};

    $.SKEWSlider.prototype = {

         _init : function ( options ) {
              this.options = $.extend( true, {}, $.SKEWSlider.defaults, options );
              this.optionsBackup = $.extend( true, {}, $.SKEWSlider.defaults, options );
              this._config();
              this.options.slideshow && this._slideShow();
         },
         _config : function () {

         	  // local var to init
         	  var skew = this.options.skew,
         	      proto = this;

              this.$el.addClass('skw-container');
		      // the list of items
			  this.$list = this.$el.children( 'ul' ).addClass('skw-list');    
              // list of items
		      this.$items = this.$list.children('li');
		      // initially move on hover siblings	
		      this.HoverSiblings = true;
		       // total number of items
			  this.itemsCount = this.$items.length;
              // is there updates waiting to complete ?
			  this.updateDelay = false;

			  this.breakpoint = false;

			  this.updateTimeout;

			  this.captionTimeout;
              // hovering animation is complete?
			  this.isHovering = false;

			  this.current = this.options.setCurrent;
		     
		      this.$items.each(function(){
		      	  var $this = $(this);

		      	  $this.css('transform', 'skew('+skew+'deg, 0)');
		      	  $this.append('<div class="skw-loader" />'); 
		      });

              // support for CSS Transitions & transforms
			  this.support = Modernizr.csstransitions && Modernizr.csstransforms;
			  this.support3d = Modernizr.csstransforms3d;      
		      // transition end event name and transform name
			  // transition end event name
		      var transEndEventNames = {
						'WebkitTransition' : 'webkitTransitionEnd',
						'MozTransition' : 'transitionend',
						'OTransition' : 'oTransitionEnd',
						'msTransition' : 'MSTransitionEnd',
						'transition' : 'transitionend'
					},
					transformNames = {
						'WebkitTransform' : '-webkit-transform',
						'MozTransform' : '-moz-transform',
						'OTransform' : '-o-transform',
						'msTransform' : '-ms-transform',
						'transform' : 'transform'
					};

				if( this.support ) {
					this.transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ] + '.skewSlider';
					this.transformName = transformNames[ Modernizr.prefixed( 'transform' ) ];
				}
              // apply the transition
		      if( this.support ) {
                   this.$items.css( 'transition', this.transformName + ' ' + this.options.speed + 'ms ' + this.options.easing );
                   this.$list.css( 'transition', this.transformName + ' ' + this.options.speed + 'ms ' + this.options.easing );
		      }

		      this.$el.css({
		      	'overflow': 'hidden',
		      	'position': 'relative'
		      });

		      // check if the list is currently moving
			  this.isAnimating = false;
              // check if the list is currently moving from cloned items
			  this.isAnimatingInf = false;

		      // add navigation arrows and the navigation dots if there is more than 1 item
			  if( this.itemsCount > 1 ) {

					// add navigation arrows:
					this.$navPrev = $( '<span class="skw-prev">&lt;</span>' );
					this.$navNext = $( '<span class="skw-next">&gt;</span>' );

					// hide initial left arrow if not infinteslide
					!this.options.infiniteSlide && this.$navPrev.addClass('skw-trans');
					// add navigation dots
					var dots = '';
					for( var i = 0; i < this.itemsCount; ++i ) {
						// current dot will have the class skw-current
						var dot = i === this.current ? '<span class="skw-current"></span>' : '<span></span>';
						dots += dot;
					}
					var navDots = $( '<div class="skw-dots"/>' ).append( dots ),
					    skewNav = $( '<nav class="skw-nav" />' ).append( navDots )
					              .prepend( this.$navPrev ).append( this.$navNext ).appendTo( this.$el );
					
					this.$navDots = skewNav.find('.skw-dots span');
					this.$mainNav = this.$el.children('.skw-nav');
					this.$mainNav.css('marginLeft', -this.$mainNav.width()/2);

				}
                
                this.$caption = $('<div class="skw-caption" />');

                this.$items.eq(this.current).addClass('skw-animate');

				this.$caption = this.$caption.appendTo( this.$el );

				this.$nav = this.$el.find('.skw-nav');

				this._update(true);

         },
         _update : function(firstTime, options, speed) {

         	var w_w = $(window).width(),
         	    self = this,
         	    moveFx = this.options.moveFx,
         	    $itemstomove =  this.options.infiniteSlide ? this.$items.add(this.$infItems) : this.$item,
         	    fixPos = this.options.infiniteSlide ? this.options.preloadCount : 0;
            
            if (!firstTime && this.options.breakpoints){
            	for (var key in self.optionsBackup) {
            		self.options[key] = self.optionsBackup[key];
            	}
            }

            this.old = this.current;

            if(options) {
				for (var prop in options) {
					self.options[prop] = options[prop];
				}
			}
              
            if(this.options.breakpoints){
            	self.breakpoint = false;
	         	for (var key in this.options.breakpoints) {
				    var obj = this.options.breakpoints[key];
				    for (var prop in obj) {
				        if(obj.hasOwnProperty(prop)){
				           if(prop=='maxWidth') {
				        	    if(w_w <= obj[prop]) {
	  						       var breakArray = this.options.breakpoints[key];
	  							   for (var key in breakArray) {
					 				self.options[key] = breakArray[key]	
								   }
				        	    }
				            }
				        }
				    }
			    }
			}

			if ( firstTime ) {
				this.current = this.options.setCurrent;
			} 

			else if ( options ) {
				if(options['setCurrent'] || options['setCurrent'] == 0){
				  this.current = this.options.setCurrent;
				}
			}

			if(this.options.navDots) {
				this.$nav.addClass('show');
			} else {
				this.$nav.removeClass('show');
			}

			this._loadCaption();

         	var parent_w = this.options.width;
            
            // if width is set in percent, we have to calcule the real value
         	if( typeof parent_w != 'number' ) {
         		var parent_wP = parent_w.substring(0, parent_w.length-1);
         		parent_w = this.$el.parent().width() * (parent_wP/100);
         	}

         	var percentWidth = this.options.slidePercent/100,
         	    parent_h = Math.abs( this.options.ratio ? parent_w/this.options.ratio : this.options.height );

         	this.$el.css({
         		'height': parent_h,
         		'width': parent_w 
         	});
            
             // if height is set in percent, we have to calcule the real value 
         	if( typeof parent_h != 'number' ) {
         		var parent_hP = parent_h.substring(0, parent_h.length-1);
         		parent_h = Math.abs( this.$el.parent().height() * (parent_hP/100) );
         	}
        	
        	 // angles to radians
             function toRadians (angle) {
				 return angle * (Math.PI / 180);
			 } 
             

             // geeky math - calculating sizes
             var corner = (parent_h/2) * Math.tan(toRadians( Math.abs( this.options.skew) ) ),
                 resizefactor = parent_w-(corner*2),
                 resize = resizefactor/parent_w,
                 firstLeft = (1 - resize)/2,
                 calculatedWidth =  parent_w*resize,
                 marginLeft = this.options.centered ? ( parent_w*firstLeft )+( ( calculatedWidth*Math.abs( 1-percentWidth) )/2 ) : ( parent_w*firstLeft ),
                 list_w = ((this.itemsCount+this.options.preloadCount)*2) * Math.round( calculatedWidth*percentWidth ),
                 item_w = Math.round( calculatedWidth*percentWidth ),
                 item_wPercent = (item_w * 100)/list_w; 

              function getPercent (val, val2) {
			 	return (val * 100)/val2;
			 } 

			 this._updatePos(speed, item_w, list_w);    

         	 // setting container's dimensions
		      this.$list.css({
		      	'height' : '100%',
		      	'width' : list_w
		      });
		      // seting item's width
		      this.$items.css({
		      	'width':  getPercent(item_w, list_w) + '%',
                'display' : 'block',
                'z-index' : 7 
		      });
              // automatic padding if true
		      if(this.options.itemPadding){
		      	 this.$items.find('.skw-content').css({
		      	 	'paddingLeft': corner*2,
		      	 	'paddingRight': corner*2
		      	 }); 
		      } else {
		      	 this.$items.find('.skw-content').css({
		      	 	'paddingLeft': '',
		      	 	'paddingRight': ''
		      	 }); 
		      }

		      

				      var itemWidth = list_w * (getPercent(item_w, list_w) / 100);
				
		              var bgWidth = Math.round(itemWidth + corner*2),
		                  bgLeft = Math.round((((itemWidth*(bgWidth/100)-(itemWidth))/2)/parent_w)*100); 

		 			   this.$items.find('.skw-content').add(this.$el.find('.skw-loader')).css({
							'transform' : 'skew('+ this.options.skew*-1 +'deg, 0) translate(-'+ Math.round(corner) +'px, 0)',
							'width' : bgWidth
						});

					    if(!firstTime && this.options.infiniteSlide) {
					      	 this.$infItems.css({
					      	 	 'width': getPercent(item_w, list_w) + '%',
					      	 	 'z-index' : 7 
					      	 }).find('.skw-content').css({
								'transform' : 'skew('+ this.options.skew*-1 +'deg, 0) translate(-'+ corner +'px, 0)',
								'width' : bgWidth
							 });

							 for (var i = 0; i < this.options.preloadCount; i++) { 
		          				  this.$infItems.eq(i).css({
		          				  	'left':  Math.round(-(itemWidth*(this.options.preloadCount-i)))
		          				  });
		          			 }
					     } 
		 				

		                if(firstTime && this.options.infiniteSlide) {
		                        
		          				for (var i = 1; i <= this.options.preloadCount; i++) { 

		          				  this.$items.eq(this.itemsCount-i).clone()
		          				  .removeClass().addClass('skw-infLeft skw-infItem').css({
		          				  	'left':  Math.round(-(itemWidth*i))
		          				  }).prependTo(this.$list);

		          				   this.$items.eq(i-1).clone().removeClass().addClass('skw-infRight skw-infItem').appendTo(this.$list);
		          				}
		          			    this.$infItems = this.$list.find('.skw-infItem');
						}

						if ( firstTime ) {
						   this._loadImages(); 
						}

					    this.$list.css('marginLeft', Math.round(marginLeft));
					     
					    this._toggleNavControls();

					    this._initEvents();
 
         },
         _updatePos : function(speed, item_w, list_w) {
         	     // get item's and list's width
				 var curr_w = item_w,
 					 list_w = list_w,
 					 self = this,
 					 // calculate the translate val to show current item 
				     listTranslateVal = -1*((curr_w/list_w)*100)*this.current,
				     itemTranslateVal = -1 * this.current * 100,
				     $itemstomove =  this.options.infiniteSlide ? this.$items.add(this.$infItems) : this.$items,
				     fixPos = this.options.infiniteSlide ? this.options.preloadCount : 0;

				     self.$list.css( 'transform', self.support3d ? 'translate3d(' + listTranslateVal + '%,0,0)' : 'translate(' + listTranslateVal + '%)' );
					 $itemstomove.css( 'transform', self.support3d ? 'translate3d(0,0,0) skew('+self.options.skew+'deg, 0)' : 'translate(0) skew('+self.options.skew+'deg, 0)' );
					 
					 if(self.options.moveFx) {
					 	setTimeout(function(){
			                 $itemstomove.css( 'transform', self.support3d ? 'translate3d(' + itemTranslateVal + '%,0,0) skew('+self.options.skew+'deg, 0)' : 'translate(' + itemTranslateVal + '%) skew('+self.options.skew+'deg, 0)' );
							 self.$list.css( 'transform', self.support3d ? 'translate3d(0,0,0)' : 'translate(0)' );
					    },speed);
					 }

					 if (this.current < 0 || this.current > this.itemsCount - 1){
					 	  $itemstomove.eq(self.current + fixPos).addClass('skw-itemActive skw-visible');
					 	  this.$infItems.removeClass('skw-itemActive skw-visible');
					 	  this.isAnimatingInf = speed;
	                      this._toggleNavControls();
						  this.old = this.current;
	                      // calculate the slide to jumb after slide to a inf item
						  var fixedCurrent = this.current < 0 ? self.itemsCount+self.current : Math.abs(self.itemsCount-self.current);
						  self.current = fixedCurrent;
						  this._fakeStates(fixedCurrent, speed);
							        
					 }
         },
         _initEvents : function() {
			
			var self = this,
			    timer;

			if( this.itemsCount > 1 ) {
				this.$navPrev.on( 'click.skewSlider', $.proxy( this._navigate, this, 'previous' ) );
				this.$navNext.on( 'click.skewSlider', $.proxy( this._navigate, this, 'next' ) );
				this.$navDots.on( 'click.skewSlider', function() { self._jump( $( this ).index() ); } );
			}
			
            // hover event on siblings
			if ( this.options.moveOnHover ) {
				// On mouse enter
				$(this.$el).on('mouseenter.skewSlider', '.skw-itemNext, .skw-itemPrev', function(){
					self._hoverItem(true ,$(this));
				});
                
                // On mouse out
				$(this.$el).on('mouseleave.skewSlider', '.skw-itemNext, .skw-itemPrev', function(){
					self._hoverItem(false ,$(this));
				});
			}

			$(this.$el).on('click', '.skw-list > li.skw-itemNext > a, .skw-list > li.skw-itemPrev > a', function(e){
                 e.preventDefault();
			});

			// click event on siblings trigguer navigate
			if ( this.options.clickOnSiblings ) {
				$(this.$el).on('click.skewSlider', '.skw-itemNext', function(){
					var $this = $(this);

                    if(!self.options.moveFx){
					    $this.css('transform', self.support3d ? 'translate3d(0,0,0) skew('+self.options.skew+'deg, 0)' : 'translate(0) skew('+self.options.skew+'deg, 0)');
                    }
					self._navigate('next');
					setTimeout(function(){
	                   $this.css('z-index', self.itemsCount+1);
	                }, self.options.speed);  
				});

				$(this.$el).on('click.skewSlider', '.skw-itemPrev', function(){
					var $this = $(this);

                    if(!self.options.moveFx){
					  $this.css('transform', self.support3d ? 'translate3d(0,0,0) skew('+self.options.skew+'deg, 0)' : 'translate(0) skew('+self.options.skew+'deg, 0)');
                    }
					self._navigate('previous');
					setTimeout(function(){
	                   $this.css('z-index', self.itemsCount+1);
	                }, self.options.speed);
				});
			}

            // slideshow events
			if ( this.options.slideshow ) {
				$(this.$el).on('mouseenter.skewSlider', function(){
					clearInterval(self.slideShow);
				});

				$(this.$el).on('mouseleave.skewSlider', function(){
					self._slideShow();
				});
			}

			// update on resize window
			$(window).on('resize', function(){
		         timer && clearTimeout(timer);
		         timer = setTimeout(function(){
		         	self._update();
		         }, 500);
		    });

		},
		_hoverItem : function ( pos, item ) {

			var $this = item,
			    hoverTimeout,
			    self = this;

			// do nothing if animation isn't over or hoverSiblings isn't activated
            if (this.isAnimating || !this.HoverSiblings){
            	return false;
            }     

			this.$items.eq(this.current).removeClass('skw-visible');
			// On mouse enter
			if (pos) {

				if (this.options.moveFx) {
					 var translateVal = $this.hasClass('skw-itemNext') ? -1 * this.current * 100 - this.options.moveOnHover : -1 * this.current * 100 + this.options.moveOnHover;
				} else {
					 var translateVal = $this.hasClass('skw-itemNext') ? -1 * this.options.moveOnHover : this.options.moveOnHover;
				}
				this.isHovering = true;
				$this.css({
					'transform': this.support3d ? 'translate3d(' + translateVal + '%,0,0) skew('+this.options.skew+'deg, 0)' : 'translate(' + translateVal + '%) skew('+this.options.skew+'deg, 0)', 
					'transition': this.transformName + ' ' + this.options.hoverSpeed + 'ms ' + this.options.easing,
					'z-index': 99 
				});

			// On mouse leave	
			} else {
				if (this.options.moveFx) {
					$this.css({
						'transform': this.support3d ? 'translate3d(' + -1 * this.current * 100 + '%,0,0) skew('+this.options.skew+'deg, 0)' : 'translate(' + -1 * this.current * 100 + '%) skew('+this.options.skew+'deg, 0)', 
						'transition': this.transformName + ' ' + this.options.hoverSpeed + 'ms ' + this.options.easing
					});
				} else {
					$this.css({
						'transform': this.support3d ? 'translate3d(0,0,0) skew('+this.options.skew+'deg, 0)' : 'translate(0) skew('+this.options.skew+'deg, 0)', 
						'transition': this.transformName + ' ' + this.options.hoverSpeed + 'ms ' + this.options.easing
					});
				}
	
			}
		},
         _navigate : function( direction ) {

			// do nothing if the list is currently moving
			if( this.isAnimating ) {
				return false;
			}

			this.isAnimating = true;
			// update old and current values
			this.old = this.current;
			if( direction === 'next' ) {
				this.current += this.options.itemsToslide;
			}
			else if( direction === 'previous' ) {
				this.current -= this.options.itemsToslide;
			}

			this._slide();

		},
		_slideShow: function() {
			var self = this;
			clearInterval(self.slideShow);
			this.slideShow = setInterval(function(){
				self._navigate('next');
			}, self.options.slideshow);
		},
		_jump : function( position ) {

		    // do nothing if clicking on the current dot, or if the list is currently moving
			if( position === this.current || this.isAnimating ) {
				return false;
			}
            
			this.isAnimating = true;
			// update old and current values
			this.old = this.current;
			this.current = position;
			// slide
			this._slide();

		},
		_loadCaption: function () {

			var $this = this.$items.eq(this.current),
			    caption = $this.find('.skw-content').data('caption'),
			    self = this;

			clearTimeout(this.captionTimeout);


			if ( caption && this.options.showCaption ) { 
				self.$caption.html(caption).css({
					'opacity': 1,
					'pointerEvents': ''
				});
			} else {

				self.$caption.css({
					'opacity': 0,
					'pointerEvents': 'none'
				});

				this.captionTimeout = setTimeout(function(){
					self.$caption.html('');
				}, 1000);
			}

		},
         _slide: function (position) {

         	     var $itemstomove =  this.options.infiniteSlide ? this.$items.add(this.$infItems) : this.$item,
         	         fixPos = this.options.infiniteSlide ? this.options.preloadCount : 0,
         	         self = this;

                // manage active status
                if (position !== 'no-trans'){
                   this.$infItems.removeClass('skw-itemActive');	
         	       this._toggleNavControls();
         	    }

         	    // hide caption
         	    this.$caption.css('opacity', 0);

         	    var actualCurrent = this.current;

         	    var transitionendfn = $.proxy( function() {
				     this.isAnimating = false;
				     this.isAnimatingInf = false;
				     this._loadCaption();

				     this.$items.eq(this.current).addClass('skw-animate').siblings('.skw-animate').removeClass('skw-animate');
				     //$itemstomove.not('.skw-itemPrev').not('.skw-itemNext').css('z-index', 6);
				  }, this );

         	     var proto = this;

         	     // preloading images
				 this._loadImages();

				  if(!this.options.moveFx && this.options.moveOnHover){
					  this.$items.eq(this.current).css( 'transform', this.support3d ? 'translate3d(0,0,0) skew('+this.options.skew+'deg, 0)' : 'translate(0) skew('+this.options.skew+'deg, 0)' );
					  if(this.options.infiniteSlide ){ 
						  var infIndex;

						  if( this.current > this.itemsCount-1 ) {
	                          infIndex = this.options.preloadCount;
						  } else if ( this.current < 0 ) {
	                          infIndex = this.options.preloadCount-1;
						  }
						  this.$infItems.eq(infIndex).css( 'transform', this.support3d ? 'translate3d(0,0,0) skew('+this.options.skew+'deg, 0)' : 'translate(0) skew('+this.options.skew+'deg, 0)' );
				      }
				  } 

 				 // if dont support transitions or movement effects are off	
         	     if(!this.support || !this.options.moveFx) {
						       
				        // get item's and list's width
				        var curr_w = this.$items.outerWidth(true),
 							list_w = this.$list.width(),
 							// calculate the translate val to show current item 
				            translateVal = -1*((curr_w/list_w)*100)*this.current;

						if( this.support ) {
							// apply the transform to the entire list
							this.$list.css({
								'transform' : this.support3d ? 'translate3d(' + translateVal + '%,0,0)' : 'translate(' + translateVal + '%)',
								'transition' : this.transformName + ' '+ this.options.speed + 'ms ' + this.options.easing 
							});
						    
						} else {
							// fallback to margin-left
							this.$list.animate( 'margin-left', translateVal+'%' );	
						}

						this.maxTime = this.options.speed;
				  // if fullsupport transitions and movement effects are on			
				  } else {

						// translate val to show current item 
				        var translateVal = -1 * this.current * 100,
						    // storing direction 
							direction = proto.old < proto.current ? 1 : -1;
                            this.maxTime = 0;

	                    // iterating each item
				        $itemstomove.each(function(){

				        	var $this = $(this),
				        	    // item's index
				        	    index = proto.options.infiniteSlide ? $this.index()-proto.options.preloadCount : $this.index(),
				        	    // get number of positions to move
				        	    distance = Math.abs(proto.current - index);

							    // calculate items's transitions time based on its position
	                            var computedSpeed = proto.options.speedDifference;
	                            for(var i = 1; i <= distance; i++){
	                            	computedSpeed +=( ( proto.options.speedDifference/((Math.pow( 1.2,i ))*2 ) ) );
	                            }
	                            computedSpeed -= proto.options.speedDifference;

	                            if(computedSpeed > self.maxTime){
	                                self.maxTime = computedSpeed;
	                            }

	                            // add or dedduct transition time based on direction
	                            var totalSpeed = index > proto.current ? proto.options.speed-(computedSpeed*direction) : proto.options.speed+(computedSpeed*direction);
						        
								// apply the transtion to the item
								$this.css('transition', proto.transformName + ' '+ totalSpeed + 'ms ' + proto.options.easing);

								// if delay > 0 make calculations and apply it
								if(proto.options.delay>0) {	
									var delayBreak = proto.old; 

									// if we are going forward
									if(direction>0) {

										// if item position is before current
										if( index <= delayBreak ) {
											$this.css({
												'transitionDelay': proto.options.delay+'ms',
												'z-index': proto.itemsCount
											});
										// if item position is after current
										} else {
											$this.css({
												'transitionDelay': 0,
												'z-index': proto.itemsCount+1
											});
									    }

									// if we are going backwards    		
									} else {

										if ( index >= delayBreak ) {
											$this.css({
												'transitionDelay': proto.options.delay+'ms',
												'z-index': proto.itemsCount- Math.abs(index-delayBreak)
											});
										// if item position is before current	
										} else {
											$this.css({
												'transitionDelay': 0,
												'z-index': proto.itemsCount+1
											});
										}
									}
								} // close delay

								// apply the transform to the item
								$this.css( 'transform', this.support3d ? 'translate3d(' + translateVal + '%,0,0) skew('+proto.options.skew+'deg, 0)' : 'translate(' + translateVal + '%) skew('+proto.options.skew+'deg, 0)' );
							
						   });
							 
						  self.maxTime += proto.options.speed;
						      
						} // movement effects

						var timeoutDelay = proto.options.speed;

						if( this.current < 0 || this.current > this.itemsCount-1 ){
							  this.isAnimating = true;
							  this.old = this.current;
                              // calculate the slide to jumb after slide to a inf item
							  var fixedCurrent = this.current < 0 ? proto.itemsCount+proto.current : Math.abs(proto.itemsCount-proto.current);

							  timeoutDelay = this.current < 0 ? this.maxTime + proto.options.delay : timeoutDelay + proto.options.delay;
							  this._fakeStates(fixedCurrent, timeoutDelay);
      					}

      					if (position == 'no-trans') {
      						 proto.isAnimating = true;
      					     timeoutDelay = 0;
      					     console.log('inf');
	      					 setTimeout(function(){
	      					   proto.$el.removeClass('skw-noTransition');
	      					   proto.HoverSiblings = true;
	      					   proto.$el.removeClass('skw-noEvents');
	      					 }, 100);  
      					} 

      					setTimeout(function(){
							transitionendfn.call();
						}, timeoutDelay);
	               
          },
          _fakeStates : function(pos, delay) {
                 var self = this;

                 this.isAnimatingInf = delay;
				 this.current = pos;
				 this.$el.addClass('skw-noEvents');
				 setTimeout(function(){
				  self.HoverSiblings = false;
				  self.$el.addClass('skw-noTransition');
				  self._slide('no-trans');
				}, delay);  

          },
          _toggleNavControls : function() {

			// if the current item is the first one in the list, the left arrow is not shown
			// if the current item is the last one in the list, the right arrow is not shown
			if(!this.options.infiniteSlide) {
				switch( this.current ) {
					case 0 : this.$navNext.removeClass('skw-trans'); this.$navPrev.addClass('skw-trans'); break;
					case this.itemsCount - 1 : this.$navNext.addClass('skw-trans'); this.$navPrev.removeClass('skw-trans'); break;
					default : this.$navNext.removeClass('skw-trans'); this.$navPrev.removeClass('skw-trans'); break;
				}
			}
	
			// highlight navigation dot
			this.$navDots.eq( this.old ).removeClass( 'skw-current' ).end().eq( this.current ).addClass( 'skw-current' );

			var $itemstomove =  this.options.infiniteSlide ? this.$items.add(this.$infItems) : this.$items,
			    fixPos = this.options.infiniteSlide ? this.options.preloadCount : 0,
			    self = this;
			// set current and next status to $items

			$itemstomove.eq( this.old + fixPos ).not('.skw-infItem').removeClass('skw-itemActive');

			var $active = $itemstomove.eq( self.current + fixPos );

			$itemstomove.filter('.skw-itemNext').removeClass('skw-itemNext');
			$itemstomove.filter('.skw-itemPrev').removeClass('skw-itemPrev');
			$active.addClass('skw-itemActive');

			if( this.current >= 0 && this.current < this.itemsCount ){
				$itemstomove.eq(this.current + fixPos+ this.options.NextPrevDistance).addClass('skw-itemNext');
				$itemstomove.eq(this.options.centered ? this.current + fixPos- this.options.NextPrevDistance : this.current + fixPos - 1).addClass('skw-itemPrev');
			}	

            if( this.current < 0 ){
			   $itemstomove.eq(this.current + this.itemsCount + fixPos).addClass('skw-itemActive');
			   $itemstomove.eq(this.current + this.itemsCount + fixPos + 1).addClass('skw-animate');
			   $itemstomove.eq(this.current + this.itemsCount + fixPos + this.options.NextPrevDistance).addClass('skw-itemNext');
			   $itemstomove.eq(this.options.centered ? this.current + this.itemsCount + fixPos - this.options.NextPrevDistance : this.current + this.itemsCount + fixPos - 1).addClass('skw-itemPrev');
		    }

		     if( this.current >= this.itemsCount ){
			   $itemstomove.eq(this.current - this.itemsCount + fixPos).addClass('skw-itemActive');
			   $itemstomove.eq(this.current - this.itemsCount + fixPos -1).addClass('skw-animate');
			   $itemstomove.eq(this.current - this.itemsCount + fixPos + this.options.NextPrevDistance).addClass('skw-itemNext');
			   $itemstomove.eq(this.options.centered ? this.current - this.itemsCount + fixPos - this.options.NextPrevDistance : this.current - this.itemsCount + fixPos - 1).addClass('skw-itemPrev');
			   this.$navDots.eq( this.old ).removeClass( 'skw-current' ).end().eq( this.current - this.itemsCount ).addClass( 'skw-current' );
		    }

		   
		},
		_loadImages : function () {
			   var self = this,
			       $itemstomove =  this.options.infiniteSlide ? this.$items.add(this.$infItems) : this.$items,
			       fixPos = this.options.infiniteSlide ? this.options.preloadCount : 0;
 
			   for(var i = self.current - self.options.preloadCount; i <= self.current + self.options.preloadCount; i++) {
			   	     var $this = $itemstomove.eq(i + fixPos),
                         $content = $this.find('.skw-content'),
                         bg = $content.data('bg');

				     if( bg && !$content.hasClass('charged') ) $content.css("background-image", "url("+bg+")").addClass('charged');    
			   }

  		},
  		 // public methods
         update : function( options, callback, speed, stack ) {

         	    var transitionDelay = 0,
         	        self = this,
         	        applyUpdate = true;

         	    if(this.updateDelay) {    
                    applyUpdate = false;
                }     

         	    // if list is moving from cloned items, wait until animation is complete
				if( this.isAnimatingInf ) {
					if(!stack) {
						if(callback){
						   setTimeout(function(){
	                    		 callback(false);
	                       }, speed);
	                     }  	
					     return false;
					}
					transitionDelay = this.isAnimatingInf+100;
					this.updateDelay = true;
				}

				this.updateTimeout = setTimeout(function(){
                
	                // moving cloned items ?
	         	    var $itemstomove =  self.options.infiniteSlide ? self.$items.add(self.$infItems) : self.$items;

	         	    // default update transition time
	         	    speed = speed || 600;
	                
	                // seting transitions
	                self.$list.parent().css('transition', 'all '+ speed +'ms');
	                self.$list.css('transition', 'all '+ speed +'ms');
			    	$itemstomove.css('transition', 'all '+ speed +'ms');
			    	$itemstomove.find('.skw-content').css('transition', 'all '+ speed +'ms');
	                
	                if(!this.updateDelay) {
		                // apply update and refresh nav controls active states
				    	self._update(false, options, speed);
				    	self._toggleNavControls();
			        }
                    
                    if(callback){
                    	setTimeout(function(){
                    		 callback(applyUpdate);
                    	}, speed);
                    }

                    self.updateDelay = false;

			    }, transitionDelay); 

         },
         navigate : function(index, callback) {

         	var self = this;

         	if(index == 'next' || index == 'previous'){
                 var nextIndex = index == 'next' ? this.current+1 : this.current-1; 
                 this._jump(nextIndex);
         	} else {
         		 this._jump(index);
         	}

         	console.log(self.maxTime);

         	if(callback){
                setTimeout(function(){
                    callback();
                }, self.maxTime+200);
             }
         } 

    }

    $.fn.skewSlider = function( options ) {
		if ( typeof options === 'string' ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			this.each(function() {
				var instance = $.data( this, 'skewSlider' );
				if ( !instance ) {
					logError( "cannot call methods on cbpFWSlider prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				}
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
					logError( "no such method '" + options + "' for cbpFWSlider instance" );
					return;
				}
				instance[ options ].apply( instance, args );
			});
		} 
		else {
			this.each(function() {	
				var instance = $.data( this, 'skewSlider' );
				if ( instance ) {
					instance._init();
				}
				else {
					instance = $.data( this, 'skewSlider', new $.SKEWSlider( options, this ) );
				}
			});
		}
		return this;
	};


})( jQuery, window );	