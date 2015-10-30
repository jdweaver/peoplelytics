// JavaScript Document
jQuery(document).ready(function($) {
 	"use strict"; 

/* Youtube Player */
jQuery(".player").mb_YTPlayer();

/* Video Fit Div */
 $(".fitvideo").fitVids();


/* parallax
================================================== */
   
   	if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	
	$('.parallax-bg').parallax("50%", 0.1);
	
	}

/* Magnific Popup
================================================== */
$('.image-link').magnificPopup({
	type:'image',
	// Delay in milliseconds before popup is removed
	removalDelay: 300,
	});
	
$('.open-popup').magnificPopup({
  type:'inline',
  // Delay in milliseconds before popup is removed
  removalDelay: 300,
  mainClass: 'mfp-fade',
  midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
});


	/* animated
================================================== */
	
	 $('*[data-animated]').addClass('animated');
            function animated_contents() {
                $(".animated:appeared").each(function (i) {
                    var $this    = $(this),
                        animated = $(this).data('animated');

                    setTimeout(function () {
                        $this.addClass(animated);
                    }, 50 * i);

                });
            }

            animated_contents();
            $(window).scroll(function () {
                animated_contents();
            });
			
			

	
/* chart
================================================== */ 
 function initPieCharts() {

        var chart = $('.chart');
        chart.appear();
        chart.each(function() {
        $(this).on('appear', function() {
		var $this = $(this);
		if( !$this.hasClass('pie-chart-loaded') ) {
                    $this.easyPieChart({
                    animate: 2000,
					barColor: '#3498db',
					trackColor: '#CCCCCC',
					scaleColor: '',
					scaleLength: 5,
					lineCap: 'square',
					lineWidth: 10,
					size: 140,
					rotate: 10,
					onStep: function(from, to, percent) {
					$(this.el).find('.percent').text(Math.round(percent));
					}
                    }).addClass('pie-chart-loaded');
                }
            });
        });
    }
  initPieCharts();

  
  
/* //Skill Bar Filling
================================================== */   
	function scrollBarFiller(){
		var scrollTop = $(window).scrollTop();
		var bars = $('.not-loaded');
		bars.each(function(){
			var offsetTop = $(this).offset().top;
			var evenThem = offsetTop - scrollTop - $(window).height() + $(this).height();
			if(evenThem <= 0){
				$(this).removeClass('not-loaded');
				$(this).css('width', $(this).data('width')+'%');
			}

		});
	}
	
	$(window).scroll(function(){
		var scrolling;
		scrolling = setInterval(function(){
			scrollBarFiller();
			clearInterval(scrolling);
		},100);
	});
	
  
/* //count to
================================================== */   
  		 
		 // custom formatting example
		  $('.count').data('countToOptions', {
			formatter: function (value, options) {
			  return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
			}
		  });
		  
		// start a timer when on appear
		var counter = $('.count');
        counter.appear();
		counter.each(function() {
		$(this).on('appear', function() {
		var $this = $(this);
				if( !$this.hasClass('counter-loaded') ) {
					$('.timer').each(count);
					$this.addClass('counter-loaded');
                }
        
      });
	  });

		  
		  function count(options) {
			var $this = $(this);
			options = $.extend({}, options || {}, $this.data('countToOptions') || {});
			$this.countTo(options);
		  }
		  


		  

 /* Owl Carsouel
================================================== */  		  
// Testimonial		
		var testimonial = $(".clients");
		testimonial.each(function () {
			var $that = $(this);

			$that.owlCarousel({
			slideSpeed : 200,
			pagination : false,
			paginationSpeed : 400,
			autoPlay : true,
			lazyLoad : true,
			singleItem:true
		}); 
	
								
	});
	
// Logos		
		var testimonial = $(".logos-carousel");
		testimonial.each(function () {
			var $that = $(this);

			$that.owlCarousel({
			slideSpeed : 200,
			pagination : false,
			paginationSpeed : 400,
			autoPlay : true,
			lazyLoad : true,
			items :4,
		}); 
	
								
	});
		
	

// Portfolio		
		var portfolio = $(".folio");
		portfolio.each(function () {
			var $that = $(this);

			$that.owlCarousel({
			slideSpeed : 200,
			paginationSpeed : 400,
			autoPlay : true,
			lazyLoad : true,
			singleItem:true
		}); 
	
								
	});
						
// Banner Text Slider
	$(".text-slider").owlCarousel({
      navigation : false, // Show next and prev buttons
      slideSpeed : 400,
      paginationSpeed : 500,
      singleItem:true,
	  pagination:false,
	  autoPlay : 5000,
	  transitionStyle : "fade"
  }); 

  
    // Banner juicyslider
    $(function() {
    $('#myslider').juicyslider({
	  mask: 'square',
      autoplay: 5000,
      show: {effect: 'puff', duration: 2000},
      hide: {effect: 'puff', duration: 2000},
      width: '100%',
      height: null,
       });
      });
	  
	  


  
 /* Portfolio Grid
================================================== */  
  		
		//new GridScrollFx( document.getElementById( 'grid' ), {
			//	viewportFactor : 0.4
			//} );
			

		
		// init Isotope
		//isotope Grid	
			var $isotopeContainer = $('#grid');
			$isotopeContainer.isotope();
			$('#filters a').click(function(){
			$('#filters a.active').removeClass('active');
			var selector = $(this).attr('data-filter');
			$isotopeContainer.isotope({
					filter: selector,
					itemSelector: '.item',
					animationOptions:{
					duration: 750,
					easing: 'linear',
					queue: false,
				}
			});
			$(this).addClass('active');
		  return false;
		});
		


	

 /* Screw slider
================================================== */ 
// Home slider	 
            $('#homeslider').skewSlider({
                 speed: 1300,
                 centered: true,
                 slidePercent: 90,
                // ratio: 40/11,
				 ratio: false,
				 height: 600,
                 itemPadding: true,
                 breakpoints: {
                    tablet: {
                        maxWidth : 1024,
                        slidePercent : 95,
                        ratio : 40/20,
                        moveOnHover: 3,
                        skew: -20,
                        itemPadding: false
                    },
                    phone: {
                        maxWidth : 600,
                        slidePercent : 100,
                        ratio : 40/28,
                        skew: -15
                    }
                }
             });


			 
			 
// Gallery slider	 
            $('#galleryslider').skewSlider({
                 speed: 1300,
                 centered: true,
                 slidePercent: 70,
                 ratio: 40/12,
                 itemPadding: true,
                 breakpoints: {
                    tablet: {
                        maxWidth : 1024,
                        slidePercent : 95,
                        ratio : 40/20,
                        moveOnHover: 3,
                        skew: -20,
                        itemPadding: false
                    },
                    phone: {
                        maxWidth : 600,
                        slidePercent : 100,
                        ratio : 40/28,
                        skew: -15
                    }
                }
             });			 
			 
// Team Slider		 
			 
 			 $('#teamslider').skewSlider({
				 speed: 850,
                 easing: 'ease',
                 skew: 0,
                 delay: 300,
                 speedDiference: 150,
                 slidePercent: 32,
                 height: 320,
                 centered: true,
                 preloadCount: 4,
                 setCurrent: 0,
                 moveFx: false,
                 navDots: true,
                 infiniteSlide: true,
                 itemPadding: false,
                 clickOnSiblings: true,
                 moveOnHover: 4,
                 ratio: 40/10,
                 slideshow: false,
                 showCaption: true,
                 breakpoints: {
                    tablet: {
                        maxWidth : 1024,
                        slidePercent : 65,
                        ratio : 40/15,
                        moveOnHover: 3,
                        moveFx: false,
                        showCaption: false,
                        skew: 0,
                    },
                    phone: {
                        maxWidth : 600,
                        ratio : 40/15,
                        slidePercent : 40,
                        skew: 0
                    }
                }
             });
			 
 
//====================== Team Slider EXAMPLE OF CUSTOM BEHAVIOR USING THE API ===================== // 

           // slide container
           var $parent = $('.cont'),
               $team = $('#teamslider');

         
                   // on each slide mouseenter event
                   $parent.find('.skw-list li').on('mouseenter', function(){
                        var $this = $(this),
                            // index of the active slide, if infiniteslide is true, we have to deduct the preloadCount val 
                            index = $this.index()-4;

                        // making sure we only trigger the update once
                        if ( !$parent.hasClass('opened') ) {
                            
                            // triguering css animations
                            $parent.addClass('opened'); 

                            // apply the update method using the api
                            $team.skewSlider('update', 
                            {
                                slidePercent: 100,
                                setCurrent: index,
                                speed: 1200,
                                breakpoints: {
                                    tablet: {
                                        maxWidth : 1024,
                                        slidePercent : 95,
                                        ratio: 40/20
                                    },
                                    phone: {
                                        maxWidth : 600,
                                        slidePercent : 95,
                                        ratio: 40/20
                                    }
                                }

                            }, function(success){
                                 if(!success){
                                    $parent.removeClass('opened');
                                }   
                            }, 600, true);
                         } 
                    });

                    $parent.on('mouseleave', function(){
                        var $this = $(this);

                        $parent.removeClass('opened');

                        // calling update method without options (or null) will restore the original options    
                        $team.skewSlider('update', null, 
                         function(success){
                            if(!success){
                                $parent.addClass('opened');
                            }
                        }, 600, true);
                    });
					
	
	

	
});
//End Document.ready   

/* preloader
================================================== */ 
$(window).load(function() { // makes sure the whole site is loaded
	'use strict';
	$('#status').fadeOut(); // will first fade out the loading animation
	$('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
	$('body').delay(350).css({'overflow':'visible'});
})

