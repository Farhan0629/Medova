jQuery(document).ready(function($) {
    
    var wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: true,
        live: true
    });
    new WOW().init(); 

        
    
    /* Text Effect Animation */
    if ($('.text-anime-style-1').length) {
        let staggerAmount   = 0.05,
            translateXValue = 0,
            delayValue      = 0.5,
           animatedTextElements = document.querySelectorAll('.text-anime-style-1');
        
        animatedTextElements.forEach((element) => {
            let animationSplitText = new SplitText(element, { type: "chars, words" });
                gsap.from(animationSplitText.words, {
                duration: 1,
                delay: delayValue,
                x: 20,
                autoAlpha: 0,
                stagger: staggerAmount,
                scrollTrigger: { trigger: element, start: "top 85%" },
                });
        });     
    }
    
    if ($('.text-anime-style-2').length) {              
        let  staggerAmount      = 0.03,
             translateXValue    = 20,
             delayValue         = 0.1,
             easeType           = "power2.out",
             animatedTextElements = document.querySelectorAll('.text-anime-style-2');
        
        animatedTextElements.forEach((element) => {
            let animationSplitText = new SplitText(element, { type: "chars, words" });
                gsap.from(animationSplitText.chars, {
                    duration: 2,
                    delay: delayValue,
                    x: translateXValue,
                    autoAlpha: 0,
                    stagger: staggerAmount,
                    ease: easeType,
                    scrollTrigger: { trigger: element, start: "top 85%"},
                });
        });     
    }
    
    if ($('.text-anime-style-3').length) {      
        let animatedTextElements = document.querySelectorAll('.text-anime-style-3');
        
         animatedTextElements.forEach((element) => {
            //Reset if needed
            if (element.animation) {
                element.animation.progress(1).kill();
                element.split.revert();
            }

            element.split = new SplitText(element, {
                type: "lines,words,chars",
                linesClass: "split-line",
            });
            gsap.set(element, { perspective: 400 });

            gsap.set(element.split.chars, {
                opacity: 0,
                x: "50",
            });

            element.animation = gsap.to(element.split.chars, {
                scrollTrigger: { trigger: element,  start: "top 90%" },
                x: "0",
                y: "0",
                rotateX: "0",
                opacity: 1,
                duration: 1,
                ease: Back.easeOut,
                stagger: 0.02,
            });
        });     
    }


    /* Image Reveal Animation */
    if ($('.reveal').length) {
        gsap.registerPlugin(ScrollTrigger);
        let revealContainers = document.querySelectorAll(".reveal");
        revealContainers.forEach((container) => {
            let image = container.querySelector("img");
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    toggleActions: "play none none none"
                }
            });
            tl.set(container, {
                autoAlpha: 1
            });
            tl.from(container, 1, {
                xPercent: -100,
                ease: Power2.out
            });
            tl.from(image, 1, {
                xPercent: 100,
                scale: 1,
                delay: -1,
                ease: Power2.out
            });
        });
    }


});


jQuery(window).on('load', function() {
    // Delay refresh to ensure all images and layout are stable
    setTimeout(function() {
        ScrollTrigger.refresh();
    }, 500); // Adjust timing if needed
});

