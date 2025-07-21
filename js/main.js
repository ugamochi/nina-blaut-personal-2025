// Performance optimization: Cache DOM elements
const cache = {
  projectsContainer: null,
  menuContainer: null,
  projectsList: null
};

// Performance optimization: Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Load projects data with caching and error handling
async function loadProjects() {
  // Check if already cached
  if (window.projectsCache) {
    return window.projectsCache;
  }

  try {
    // Performance mark
    if (performance && performance.mark) {
      performance.mark('projects-fetch-start');
    }

    const response = await fetch('./data/projects.json', {
      cache: 'default',
      mode: 'same-origin'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the result
    window.projectsCache = data.projects;
    
    // Performance mark
    if (performance && performance.mark) {
      performance.mark('projects-fetch-end');
      performance.measure('projects-fetch', 'projects-fetch-start', 'projects-fetch-end');
    }
    
    // Dispatch event for other modules
    document.dispatchEvent(new CustomEvent('projectsLoaded', { 
      detail: { projects: data.projects } 
    }));
    
    return data.projects;
  } catch (error) {
    console.error('Error loading projects:', error);
    
    // Display a user-friendly error message on the page
    const projectsContainer = cache.projectsContainer || document.getElementById('projects-wrapper');
    if (projectsContainer) {
      projectsContainer.innerHTML = '<p style="color: red; text-align: center; padding: 2rem;">Error: Could not load project data. Please refresh the page.</p>';
    }
    
    return [];
  }
}

// Create project menu items with performance optimizations
function createProjectMenu(projects) {
  const menuContainer = cache.menuContainer || document.getElementById('projects-menu');
  if (!menuContainer) return;
  
  cache.menuContainer = menuContainer;
  
  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();
  const menuList = document.createElement('div');
  menuList.className = 'anchor-data-feed';

  // Batch DOM operations
  projects.forEach(project => {
    const menuItem = document.createElement('div');
    menuItem.className = 'collection-item';
    menuItem.innerHTML = `
      <a href="#${project.id}" class="hack4-filter-button w-inline-block">
        <div class="proj-number">${project.number}</div>
        <div>${project.title}</div>
      </a>
    `;
    menuList.appendChild(menuItem);
  });

  fragment.appendChild(menuList);
  menuContainer.appendChild(fragment);
}

// Create project sections with lazy loading for images
function createProjectSections(projects) {
  const projectsContainer = cache.projectsContainer || document.getElementById('projects-wrapper');
  if (!projectsContainer) return;
  
  cache.projectsContainer = projectsContainer;
  
  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();
  const projectsList = document.createElement('div');
  projectsList.className = 'projects-list';

  projects.forEach(project => {
    const projectSection = document.createElement('section');
    projectSection.className = 'hack4-cms-anchor-section';
    projectSection.id = project.id;
    
    // Create project content with lazy loading
    projectSection.innerHTML = `
      <div class="container">
        <div class="proj-descrip">
          <div class="proj-descrip-group">
            <div class="proj-descrip-content">
              <div class="proj-heading">
                <div class="proj-number">${project.number}</div>
                <h1 class="hack4-proj-head">${project.title}</h1>
              </div>
              <div class="proj-descrip-paragraph">
                <p class="hack4-proj-paragraph">${project.description}</p>
                <div class="rich-text w-richtext">
                  ${project.richDescription}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="project-images">
          <div class="swiper" data-project-id="${project.id}">
            <div class="swiper-wrapper">
              ${createImageSlides(project.images)}
            </div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
          </div>
        </div>
      </div>
    `;

    projectsList.appendChild(projectSection);
  });

  fragment.appendChild(projectsList);
  projectsContainer.appendChild(fragment);
  
  cache.projectsList = projectsList;
  
  // Initialize intersection observer for lazy loading
  initLazyLoading();
}

// Create image slides with lazy loading
function createImageSlides(images) {
  return images.map((image, index) => {
    const imageName = image.url.split('/').pop();
    const imagePath = `images/${imageName}`;
    
    return `
      <div class="swiper-slide">
        <img 
          ${index === 0 ? 'src' : 'data-src'}="${imagePath}" 
          alt="${image.alt}" 
          class="${index === 0 ? '' : 'swiper-lazy'}"
          loading="lazy"
          width="800"
          height="600"
        />
        ${index === 0 ? '' : '<div class="swiper-lazy-preloader"></div>'}
      </div>
    `;
  }).join('');
}

// Lazy loading for images
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('swiper-lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Initialize Swiper with performance optimizations
function initSliders() {
  // Only initialize if Swiper is available
  if (!window.Swiper) {
    console.warn('Swiper not loaded yet, deferring initialization');
    return;
  }

  const swipers = document.querySelectorAll('.swiper');
  
  swipers.forEach(swiperEl => {
    const swiper = new Swiper(swiperEl, {
      loop: true,
      lazy: {
        loadPrevNext: true,
        loadOnTransitionStart: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      // Performance optimizations
      observer: true,
      observeParents: true,
      watchSlidesVisibility: true,
      preloadImages: false,
      // Reduce resource usage
      resistanceRatio: 0.85,
      threshold: 5,
      speed: 400,
      // Mobile optimizations
      touchRatio: 1,
      touchAngle: 45,
      grabCursor: true
    });
    
    // Store swiper instance for potential cleanup
    swiperEl.swiper = swiper;
  });
}

// Optimized intersection observer for active states
function initIntersectionObserver() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(debounce((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 1) {
        // Remove active class from all buttons
        document.querySelectorAll('.hack4-filter-button')
          .forEach(btn => btn.classList.remove('hack4-active'));
        
        // Add active class to current button
        const currentButton = document.querySelector(`.hack4-filter-button[href='#${entry.target.id}']`);
        if (currentButton) {
          currentButton.classList.add('hack4-active');
        }
      }
    });
  }, 100), { 
    threshold: 1,
    rootMargin: '0px 0px -50% 0px'
  });

  // Observe all project sections
  document.querySelectorAll('.hack4-cms-anchor-section')
    .forEach(section => observer.observe(section));
}

// Optimized initialization with performance monitoring
async function init() {
  try {
    // Performance mark
    if (performance && performance.mark) {
      performance.mark('init-start');
    }

    const projects = await loadProjects();
    
    if (projects.length > 0) {
      // Batch DOM operations
      requestAnimationFrame(() => {
        createProjectMenu(projects);
        createProjectSections(projects);
        
        // Initialize features after DOM is ready
        requestAnimationFrame(() => {
          initIntersectionObserver();
          
          // Initialize sliders if Swiper is available, otherwise wait for it
          if (window.Swiper) {
            initSliders();
          } else {
            document.addEventListener('projectsLoaded', () => {
              setTimeout(initSliders, 100);
            });
          }
          
          // GSAP integration
          if (window.NinaBlautAnimations && window.NinaBlautAnimations.animations) {
            setTimeout(() => {
              if (window.NinaBlautAnimations.animations.scroll && 
                  window.NinaBlautAnimations.animations.scroll.bindSmoothScroll) {
                window.NinaBlautAnimations.animations.scroll.bindSmoothScroll();
                console.log('GSAP: Smooth scroll re-initialized after projects loaded');
              }
            }, 100);
          }
          
          // Performance mark
          if (performance && performance.mark) {
            performance.mark('init-end');
            performance.measure('init-duration', 'init-start', 'init-end');
          }
        });
      });
    }
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Optimized event binding
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM is already ready
  init();
}

// Cleanup function for better memory management
window.addEventListener('beforeunload', () => {
  // Clean up Swiper instances
  document.querySelectorAll('.swiper').forEach(swiperEl => {
    if (swiperEl.swiper) {
      swiperEl.swiper.destroy(true, true);
    }
  });
  
  // Clear cache
  window.projectsCache = null;
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { loadProjects, createProjectMenu, createProjectSections, initSliders };
} 