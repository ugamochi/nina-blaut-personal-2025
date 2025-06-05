// Load projects data
async function loadProjects() {
  try {
    const response = await fetch('/data/projects.json');
    const data = await response.json();
    return data.projects;
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

// Create project menu items
function createProjectMenu(projects) {
  const menuContainer = document.getElementById('projects-menu');
  const menuList = document.createElement('div');
  menuList.className = 'anchor-data-feed';

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

  menuContainer.appendChild(menuList);
}

// Create project sections
function createProjectSections(projects) {
  const projectsContainer = document.getElementById('projects-wrapper');
  const projectsList = document.createElement('div');
  projectsList.className = 'projects-list';

  projects.forEach(project => {
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';
    projectItem.innerHTML = `
      <div id="${project.id}" class="hack4-cms-anchor-section">
        <div class="left-section">
          <div class="left-top">
            <h2 class="proj-heading">${project.title}</h2>
            <div class="proj-descrip">${project.description}</div>
          </div>
          <div class="left-bottom">
            <div class="rich-desc-proj w-richtext">${project.richDescription}</div>
          </div>
        </div>
        <div class="swiper slider1">
          <div class="swiper-wrapper">
            ${project.images.map(image => `
              <div class="swiper-slide">
                <div class="card">
                  <img src="${image.url}" loading="lazy" alt="${image.alt}" class="img">
                </div>
              </div>
            `).join('')}
          </div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>
      <div class="line"></div>
    `;
    projectsList.appendChild(projectItem);
  });

  projectsContainer.appendChild(projectsList);
}

// Initialize Swiper sliders
function initSliders() {
  const sliders = document.querySelectorAll('.slider1');
  sliders.forEach(slider => {
    new Swiper(slider, {
      slidesPerView: 2,
      spaceBetween: 20,
      loop: true,
      speed: 1000,
      grabCursor: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        }
      }
    });
  });
}

// Initialize intersection observer for menu highlighting
function initIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.hack4-filter-button.hack4-active')
          .forEach(btn => btn.classList.remove('hack4-active'));
        document.querySelector(`.hack4-filter-button[href='#${entry.target.id}']`)
          ?.classList.add('hack4-active');
      }
    });
  }, { threshold: 1 });

  document.querySelectorAll('.hack4-cms-anchor-section')
    .forEach(section => observer.observe(section));
}

// Initialize animations
function initAnimations() {
  // Add animation classes to elements
  document.querySelector('.top-nav').classList.add('animate-in');
  document.querySelector('.page-wrapper').classList.add('animate-in');
  document.querySelector('.proj-nav').classList.add('animate-in');
  document.querySelector('.bio-text').classList.add('animate-in');
  document.querySelector('.bio-img').classList.add('animate-in');
  document.querySelector('.public').classList.add('animate-in');
}

// Main initialization
async function init() {
  const projects = await loadProjects();
  createProjectMenu(projects);
  createProjectSections(projects);
  initSliders();
  initIntersectionObserver();
  initAnimations();
}

// Start the application
document.addEventListener('DOMContentLoaded', init); 