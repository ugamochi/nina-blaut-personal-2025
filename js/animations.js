/**
 * GSAP Webflow Animation System for Nina Blaut Portfolio
 * Modern animations with performance optimization and responsive design
 * Created following gsap-webflow-animator.md specifications
 */

// Console identification
console.log('Nina Blaut GSAP Animations: Script loaded');

// Animation configuration
const ANIMATION_CONFIG = {
  // Performance settings
  performance: {
    respectReducedMotion: true,
    optimizeMemory: true,
    lazyLoad: true
  },
  
  // Timing settings
  timing: {
    fast: 0.3,
    medium: 0.6,
    slow: 1.2,
    extraSlow: 1.8
  },
  
  // Easing presets
  easing: {
    smooth: "power2.out",
    bounce: "back.out(1.7)",
    elastic: "elastic.out(1, 0.3)",
    sharp: "power3.inOut"
  }
};

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// GSAP Registration and Setup
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Performance optimization
gsap.config({ 
  nullTargetWarn: false,
  trialWarn: false
});

// Utility Functions
const utils = {
  // Element detection
  detectElements() {
    console.log('GSAP Animations: Detecting elements for animation');
    
    return {
      // Navigation elements
      navigation: {
        topNav: '.top-nav',
        navBar: '.nav-bar',
        topNavText: '.top-nav-text',
        line: '.line.topanima'
      },
      
      // Project elements
      projects: {
        projNav: '.proj-nav',
        selectedProjects: '.selected-projects',
        projectsMenu: '.projects-menu',
        projectItem: '.project-item',
        projectFlex: '.hack4-cms-anchor-section',
        leftSection: '.left-section',
        projHeading: '.proj-heading',
        projDescrip: '.proj-descrip',
        richDescProj: '.rich-desc-proj'
      },
      
      // Image and slider elements
      media: {
        swiperContainer: '.swiper-container',
        swiperSlide: '.swiper-slide',
        card: '.card',
        img: '.img',
        bioImg: '.bio-img'
      },
      
      // Bio and footer elements
      content: {
        bioSection: '#bio',
        bioText: '.bio-text',
        bioPic: '.bio-pic',
        hiHeading: '.hi',
        footer: '.footer',
        publicLinks: '.public-link'
      },
      
      // Utility elements
      utils: {
        sectionLine: '.section-line',
        projectLine: '.project-line',
        pageWrapper: '.page-wrapper'
      }
    };
  },

  // Responsive breakpoints
  isDesktop: () => window.innerWidth >= 992,
  isTablet: () => window.innerWidth >= 768 && window.innerWidth < 992,
  isMobile: () => window.innerWidth < 768,

  // Animation helper
  createTimeline(options = {}) {
    return gsap.timeline({
      paused: false,
      ...options
    });
  }
};

// Animation Classes
class NavigationAnimations {
  constructor(elements) {
    this.elements = elements.navigation;
    this.init();
  }

  init() {
    if (prefersReducedMotion) return this.initReducedMotion();
    
    console.log('GSAP Animations: Initializing navigation animations');
    this.animateNavEntry();
    this.setupHoverEffects();
  }

  initReducedMotion() {
    gsap.set([this.elements.topNav, this.elements.navBar], { opacity: 1 });
  }

  animateNavEntry() {
    const tl = utils.createTimeline();
    
    // Set initial states
    gsap.set(this.elements.topNav, { y: -50, opacity: 0 });
    gsap.set(this.elements.line, { scaleX: 0, transformOrigin: "left center" });
    
    tl.to(this.elements.topNav, {
      y: 0,
      opacity: 1,
      duration: ANIMATION_CONFIG.timing.medium,
      ease: ANIMATION_CONFIG.easing.smooth
    })
    .to(this.elements.line, {
      scaleX: 1,
      duration: ANIMATION_CONFIG.timing.slow,
      ease: ANIMATION_CONFIG.easing.smooth
    }, "-=0.3");
  }

  setupHoverEffects() {
    // Contact link hover animation
    const contactLink = document.querySelector('.top-nav-text.right').parentElement;
    if (contactLink) {
      contactLink.addEventListener('mouseenter', () => {
        gsap.to(contactLink, {
          scale: 1.05,
          duration: ANIMATION_CONFIG.timing.fast,
          ease: ANIMATION_CONFIG.easing.smooth
        });
      });

      contactLink.addEventListener('mouseleave', () => {
        gsap.to(contactLink, {
          scale: 1,
          duration: ANIMATION_CONFIG.timing.fast,
          ease: ANIMATION_CONFIG.easing.smooth
        });
      });
    }
  }
}

class ProjectAnimations {
  constructor(elements) {
    this.elements = elements.projects;
    this.init();
  }

  init() {
    if (prefersReducedMotion) return this.initReducedMotion();
    
    console.log('GSAP Animations: Initializing project animations');
    this.animateProjectNav();
    this.setupProjectReveal();
    this.setupMenuInteractions();
  }

  initReducedMotion() {
    gsap.set([this.elements.projNav, this.elements.projectItem], { opacity: 1 });
  }

  animateProjectNav() {
    const tl = utils.createTimeline();
    
    gsap.set(this.elements.projNav, { y: 30, opacity: 0 });
    
    tl.to(this.elements.projNav, {
      y: 0,
      opacity: 1,
      duration: ANIMATION_CONFIG.timing.medium,
      ease: ANIMATION_CONFIG.easing.smooth,
      delay: 0.3
    });
  }

  setupProjectReveal() {
    // Animate project items on scroll
    gsap.utils.toArray(this.elements.projectFlex).forEach((project, index) => {
      const leftSection = project.querySelector(this.elements.leftSection);
      const swiperContainer = project.querySelector('.swiper-container');
      
      // Set initial states
      gsap.set([leftSection, swiperContainer], { 
        y: 50, 
        opacity: 0 
      });
      
      ScrollTrigger.create({
        trigger: project,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          const tl = utils.createTimeline();
          
          tl.to(leftSection, {
            y: 0,
            opacity: 1,
            duration: ANIMATION_CONFIG.timing.medium,
            ease: ANIMATION_CONFIG.easing.smooth
          })
          .to(swiperContainer, {
            y: 0,
            opacity: 1,
            duration: ANIMATION_CONFIG.timing.medium,
            ease: ANIMATION_CONFIG.easing.smooth
          }, "-=0.4");
        },
        once: true
      });
    });
  }

  setupMenuInteractions() {
    // Enhanced menu button animations
    gsap.utils.toArray('.hack4-filter-button').forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          duration: ANIMATION_CONFIG.timing.fast,
          ease: ANIMATION_CONFIG.easing.bounce
        });
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: ANIMATION_CONFIG.timing.fast,
          ease: ANIMATION_CONFIG.easing.smooth
        });
      });

      // Active state animation
      const observer = new MutationObserver(() => {
        if (button.classList.contains('hack4-active')) {
          gsap.to(button, {
            backgroundColor: '#303030',
            color: '#f7f4ef',
            duration: ANIMATION_CONFIG.timing.fast,
            ease: ANIMATION_CONFIG.easing.smooth
          });
        } else {
          gsap.to(button, {
            backgroundColor: 'transparent',
            color: '#303030',
            duration: ANIMATION_CONFIG.timing.fast,
            ease: ANIMATION_CONFIG.easing.smooth
          });
        }
      });
      
      observer.observe(button, { attributes: true, attributeFilter: ['class'] });
    });
  }
}

class MediaAnimations {
  constructor(elements) {
    this.elements = elements.media;
    this.init();
  }

  init() {
    if (prefersReducedMotion) return this.initReducedMotion();
    
    console.log('GSAP Animations: Initializing media animations');
    this.setupImageReveal();
    this.setupSliderAnimations();
    this.setupBioImageAnimation();
  }

  initReducedMotion() {
    gsap.set([this.elements.img, this.elements.bioImg], { opacity: 1 });
  }

  setupImageReveal() {
    // Lazy loading image animation
    gsap.utils.toArray(this.elements.img).forEach(img => {
      gsap.set(img, { scale: 1.1, opacity: 0 });
      
      ScrollTrigger.create({
        trigger: img,
        start: "top 90%",
        onEnter: () => {
          gsap.to(img, {
            scale: 1,
            opacity: 1,
            duration: ANIMATION_CONFIG.timing.slow,
            ease: ANIMATION_CONFIG.easing.smooth
          });
        },
        once: true
      });
    });
  }

  setupSliderAnimations() {
    // Enhanced slider interactions
    gsap.utils.toArray(this.elements.swiperSlide).forEach(slide => {
      const card = slide.querySelector(this.elements.card);
      if (!card) return;

      slide.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.02,
          duration: ANIMATION_CONFIG.timing.medium,
          ease: ANIMATION_CONFIG.easing.smooth
        });
      });

      slide.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          duration: ANIMATION_CONFIG.timing.medium,
          ease: ANIMATION_CONFIG.easing.smooth
        });
      });
    });
  }

  setupBioImageAnimation() {
    const bioImg = document.querySelector(this.elements.bioImg);
    if (!bioImg) return;

    gsap.set(bioImg, { scale: 0.8, opacity: 0, rotation: -5 });
    
    ScrollTrigger.create({
      trigger: bioImg,
      start: "top 80%",
      onEnter: () => {
        gsap.to(bioImg, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: ANIMATION_CONFIG.timing.extraSlow,
          ease: ANIMATION_CONFIG.easing.bounce
        });
      },
      once: true
    });
  }
}

class TextAnimations {
  constructor(elements) {
    this.elements = elements.content;
    this.init();
  }

  init() {
    if (prefersReducedMotion) return this.initReducedMotion();
    
    console.log('GSAP Animations: Initializing text animations');
    this.setupHeadingAnimations();
    this.setupBioTextAnimation();
    this.setupFooterAnimations();
  }

  initReducedMotion() {
    gsap.set([this.elements.hiHeading, this.elements.bioText], { opacity: 1 });
  }

  setupHeadingAnimations() {
    // Project headings stagger animation
    gsap.utils.toArray('.proj-heading').forEach(heading => {
      gsap.set(heading, { y: 30, opacity: 0 });
      
      ScrollTrigger.create({
        trigger: heading,
        start: "top 85%",
        onEnter: () => {
          gsap.to(heading, {
            y: 0,
            opacity: 1,
            duration: ANIMATION_CONFIG.timing.medium,
            ease: ANIMATION_CONFIG.easing.smooth
          });
        },
        once: true
      });
    });
  }

  setupBioTextAnimation() {
    const hiHeading = document.querySelector(this.elements.hiHeading);
    if (!hiHeading) return;

    // Split text for character animation
    const text = hiHeading.textContent;
    const chars = text.split('');
    hiHeading.innerHTML = chars.map(char => 
      char === ' ' ? ' ' : `<span style="display: inline-block;">${char}</span>`
    ).join('');

    const charElements = hiHeading.querySelectorAll('span');
    gsap.set(charElements, { y: 50, opacity: 0 });
    
    ScrollTrigger.create({
      trigger: hiHeading,
      start: "top 80%",
      onEnter: () => {
        gsap.to(charElements, {
          y: 0,
          opacity: 1,
          duration: ANIMATION_CONFIG.timing.fast,
          ease: ANIMATION_CONFIG.easing.smooth,
          stagger: 0.03
        });
      },
      once: true
    });
  }

  setupFooterAnimations() {
    // Footer links animation
    gsap.utils.toArray(this.elements.publicLinks).forEach((link, index) => {
      gsap.set(link, { x: -30, opacity: 0 });
      
      ScrollTrigger.create({
        trigger: link,
        start: "top 90%",
        onEnter: () => {
          gsap.to(link, {
            x: 0,
            opacity: 1,
            duration: ANIMATION_CONFIG.timing.medium,
            ease: ANIMATION_CONFIG.easing.smooth,
            delay: index * 0.1
          });
        },
        once: true
      });

      // Hover animation
      const arrow = link.querySelector('.arrow-image-link');
      if (arrow) {
        link.addEventListener('mouseenter', () => {
          gsap.to(arrow, {
            x: 5,
            duration: ANIMATION_CONFIG.timing.fast,
            ease: ANIMATION_CONFIG.easing.smooth
          });
        });

        link.addEventListener('mouseleave', () => {
          gsap.to(arrow, {
            x: 0,
            duration: ANIMATION_CONFIG.timing.fast,
            ease: ANIMATION_CONFIG.easing.smooth
          });
        });
      }
    });
  }
}

class ScrollAnimations {
  constructor(elements) {
    this.elements = elements.utils;
    this.init();
  }

  init() {
    if (prefersReducedMotion) return;
    
    console.log('GSAP Animations: Initializing scroll animations');
    this.setupParallax();
    this.setupSectionLines();
    this.setupScrollProgress();
  }

  setupParallax() {
    // Subtle parallax for bio image
    const bioImg = document.querySelector('.bio-img');
    if (bioImg) {
      gsap.to(bioImg, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: bioImg,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }

  setupSectionLines() {
    // Animate section lines
    gsap.utils.toArray(this.elements.sectionLine).forEach(line => {
      gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
      
      ScrollTrigger.create({
        trigger: line,
        start: "top 95%",
        onEnter: () => {
          gsap.to(line, {
            scaleX: 1,
            duration: ANIMATION_CONFIG.timing.slow,
            ease: ANIMATION_CONFIG.easing.smooth
          });
        },
        once: true
      });
    });
  }

  setupScrollProgress() {
    // Scroll progress indicator (optional)
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 2px;
      background: #303030;
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: self => {
        progressBar.style.width = (self.progress * 100) + '%';
      }
    });
  }
}

// Main Animation Controller
class NinaBlautAnimations {
  constructor() {
    this.elements = null;
    this.animations = {};
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    
    console.log('GSAP Animations: Initializing Nina Blaut animation system');
    
    // Wait for DOM and GSAP
    await this.waitForDependencies();
    
    // Detect elements
    this.elements = utils.detectElements();
    
    // Initialize animation classes
    this.animations = {
      navigation: new NavigationAnimations(this.elements),
      projects: new ProjectAnimations(this.elements),
      media: new MediaAnimations(this.elements),
      text: new TextAnimations(this.elements),
      scroll: new ScrollAnimations(this.elements)
    };
    
    // Setup responsive handling
    this.setupResponsiveAnimations();
    
    // Performance monitoring
    this.setupPerformanceMonitoring();
    
    this.initialized = true;
    console.log('GSAP Animations: System initialized successfully');
  }

  async waitForDependencies() {
    // Wait for GSAP
    while (typeof gsap === 'undefined') {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Wait for DOM
    if (document.readyState !== 'complete') {
      await new Promise(resolve => {
        window.addEventListener('load', resolve);
      });
    }
  }

  setupResponsiveAnimations() {
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    });
  }

  setupPerformanceMonitoring() {
    if (ANIMATION_CONFIG.performance.optimizeMemory) {
      // Memory cleanup on page unload
      window.addEventListener('beforeunload', () => {
        ScrollTrigger.killAll();
        gsap.globalTimeline.clear();
      });
    }
  }

  // Public methods for external control
  pause() {
    gsap.globalTimeline.pause();
  }

  resume() {
    gsap.globalTimeline.resume();
  }

  refresh() {
    ScrollTrigger.refresh();
  }
}

// Auto-initialization
let ninaAnimations;

// Wait for GSAP to be available
function initWhenReady() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    ninaAnimations = new NinaBlautAnimations();
    ninaAnimations.init();
  } else {
    setTimeout(initWhenReady, 100);
  }
}

// Start initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWhenReady);
} else {
  initWhenReady();
}

// Export for external use
window.NinaBlautAnimations = ninaAnimations;

console.log('Nina Blaut GSAP Animations: Script setup complete'); 