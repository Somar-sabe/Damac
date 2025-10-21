// Swiper initialization script
// This file loads after swiper-bundle.min.js and handles all Swiper functionality

(function() {
    'use strict';
    
    // Initialize Swiper when the script loads
    function initSwiper() {
        // Check if Swiper is available
        if (typeof Swiper === 'undefined') {
            console.warn('Swiper not loaded yet, retrying in 100ms...');
            setTimeout(initSwiper, 100);
            return;
        }
        
        // Initialize all slider classes
        const sliderClasses = ['.slider-1', '.slider-2', '.slider-3', '.slider-4', '.slider-5', '.slider-6'];
        const swiperInstances = {};

        // Initialize each slider individually
        sliderClasses.forEach((sliderClass, index) => {
            const container = document.querySelector(sliderClass);
            
            if (container) {
                const swiper = new Swiper(sliderClass, {
                    pagination: {
                        el: `${sliderClass} .swiper-pagination`,
                        clickable: true,
                    },
                    navigation: {
                        nextEl: `${sliderClass} .swiper-button-next`,
                        prevEl: `${sliderClass} .swiper-button-prev`,
                    },
                    loop: true,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false,
                    },
                });
                
                swiperInstances[sliderClass] = swiper;
                setupHoverZones(swiper, container, sliderClass);
            }
        });

        // Setup hover zones functionality for specific swiper
        function setupHoverZones(swiperInstance, swiperContainer, sliderClass) {
            const hoverZones = swiperContainer.querySelectorAll('.hover-zone');
            
            hoverZones.forEach((zone, index) => {
                zone.addEventListener('mouseenter', () => {
                    const newZone = swiperContainer.querySelectorAll('.hover-zone')[index];
                    newZone.classList.add('active');
                    
                    if (swiperInstance && typeof swiperInstance.slideTo === 'function') {
                        swiperInstance.slideTo(index, 600);
                    }
                    
                    const slides = swiperContainer.querySelectorAll('.swiper-slide');
                    const wrapper = swiperContainer.querySelector('.swiper-wrapper');
                    
                    slides.forEach((slide, i) => {
                        slide.classList.toggle('active', i === index);
                    });
                    
                    const bullets = swiperContainer.querySelectorAll('.swiper-pagination-bullet');
                    bullets.forEach((bullet, i) => {
                        bullet.classList.toggle('swiper-pagination-bullet-active', i === index);
                    });
                });
            });
        }

        // Optional: Expose swiper instances globally for debugging
        window.swiperInstances = swiperInstances;
        
        // Initialize carousel swipers
        initCarouselSwipers();
        
        console.log('Swiper initialized successfully');
    }
    
    // Initialize carousel swipers
    function initCarouselSwipers() {
        // Check if Swiper is available
        if (typeof Swiper === 'undefined') {
            console.warn('Swiper not available for carousels, retrying in 100ms...');
            setTimeout(initCarouselSwipers, 100);
            return;
        }
        
        // Initialize both swipers with unique selectors
        const interiorSwiper = new Swiper('#interior-carousel .swiper', {
            slidesPerView: 1.1,         // Show 1 full slide + 10% of next
            spaceBetween: 20,           // Gap between slides
            centeredSlides: false,      
            loop: true,                 // Optional: loop slides
            grabCursor: true,           // Show hand cursor
        });

        const exteriorSwiper = new Swiper('#exterior-carousel .swiper', {
            slidesPerView: 1.1,         // Show 1 full slide + 10% of next
            spaceBetween: 20,           // Gap between slides
            centeredSlides: false,      
            loop: true,                 // Optional: loop slides
            grabCursor: true,           // Show hand cursor
        });

        // Function to handle navigation
        function handleNavigation(direction) {
            const activeCarousel = document.querySelector('.carousel-container.active');
            if (activeCarousel.id === 'interior-carousel') {
                if (direction === 'prev') {
                    interiorSwiper.slidePrev();
                } else {
                    interiorSwiper.slideNext();
                }
            } else {
                if (direction === 'prev') {
                    exteriorSwiper.slidePrev();
                } else {
                    exteriorSwiper.slideNext();
                }
            }
        }
        
        // Add event listeners to all prev buttons
        document.querySelectorAll('.prev').forEach(button => {
            button.addEventListener('click', () => {
                handleNavigation('prev');
            });
        });
        
        // Add event listeners to all next buttons
        document.querySelectorAll('.next').forEach(button => {
            button.addEventListener('click', () => {
                handleNavigation('next');
            });
        });
        
        // Handle mobile image switching
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.swiper-slide img').forEach(function (img) {
                const mobileSrc = img.getAttribute('data-mobile');
                if (mobileSrc) {
                    img.setAttribute('src', mobileSrc);
                }
            });
        }
        
        // Add tab button functionality
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Remove active class from all tabs and containers
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.carousel-container').forEach(container => container.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding container
                this.classList.add('active');
                document.getElementById(targetTab + '-carousel').classList.add('active');
            });
        });
        
        console.log('Carousel Swipers initialized successfully');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSwiper);
    } else {
        initSwiper();
    }
})(); 