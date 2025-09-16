/**
 * KOICA ICT Class September Project - Main Application
 * Single-page application with hash routing and slideshow functionality
 */

// Utility function to create DOM elements
function el(tag, attrs = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else if (key === 'textContent') {
            element.textContent = value;
        } else if (key === 'onclick') {
            element.onclick = value;
        } else if (key === 'oninput') {
            element.oninput = value;
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Append children
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    
    return element;
}

// Slideshow functionality
class Slideshow {
    constructor(container, images, interval = 2500) {
        this.container = container;
        this.images = images;
        this.interval = interval;
        this.currentIndex = 0;
        this.slides = [];
        this.timer = null;
        
        this.init();
    }
    
    init() {
        console.log('Initializing slideshow with images:', this.images);
        
        // Create slides
        this.images.forEach((image, index) => {
            const slide = el('div', {
                className: 'hero-slide',
                style: `background-image: url('${image}')`
            });
            
            if (index === 0) {
                slide.classList.add('active');
            }
            
            this.slides.push(slide);
            this.container.appendChild(slide);
        });
        
        console.log('Created', this.slides.length, 'slides');
        
        // Preload images
        this.preloadImages();
        
        // Start slideshow
        this.start();
    }
    
    preloadImages() {
        this.images.forEach(image => {
            const img = new Image();
            img.src = image;
        });
    }
    
    start() {
        this.timer = setInterval(() => {
            this.next();
        }, this.interval);
    }
    
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    next() {
        console.log('Slideshow next() called. Current index:', this.currentIndex);
        
        // Remove active class from current slide
        if (this.slides[this.currentIndex]) {
            this.slides[this.currentIndex].classList.remove('active');
        }
        
        // Move to next slide
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        
        // Add active class to new slide
        if (this.slides[this.currentIndex]) {
            this.slides[this.currentIndex].classList.add('active');
        }
        
        console.log('Switched to slide', this.currentIndex, 'Image:', this.images[this.currentIndex]);
    }
    
    destroy() {
        this.stop();
        this.slides.forEach(slide => slide.remove());
        this.slides = [];
    }
}

// Page Background Slideshow
class PageSlideshow {
    constructor(container, images, interval = 2500) {
        this.container = container;
        this.images = images;
        this.interval = interval;
        this.currentIndex = 0;
        this.slides = [];
        this.timer = null;
        
        this.init();
    }
    
    init() {
        // Create slides
        this.images.forEach((image, index) => {
            const slide = el('div', {
                className: 'page-background-slide',
                style: `background-image: url('${image}')`
            });
            
            if (index === 0) {
                slide.classList.add('active');
            }
            
            this.slides.push(slide);
            this.container.appendChild(slide);
        });
        
        // Start slideshow
        this.start();
    }
    
    start() {
        this.timer = setInterval(() => {
            this.next();
        }, this.interval);
    }
    
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    next() {
        this.slides[this.currentIndex].classList.remove('active');
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.slides[this.currentIndex].classList.add('active');
    }
    
    destroy() {
        this.stop();
        this.slides.forEach(slide => slide.remove());
        this.slides = [];
    }
}

// Global slideshow instances
let slideshow = null;
let pageSlideshow = null;

// Route definitions
const routes = {
    "": renderHome,
    "#/project1": () => renderProject(1),
    "#/project2": () => renderProject(2),
    "#/project1/group1": () => renderGroup(1, 1),
    "#/project1/group2": () => renderGroup(1, 2),
    "#/project2/group1": () => renderGroup(2, 1),
    "#/project2/group2": () => renderGroup(2, 2)
};

// Modal functionality
function createModal(student) {
    const modalOverlay = el('div', { className: 'modal-overlay', id: 'modalOverlay' });
    
    const modalContainer = el('div', { className: 'modal-container' });
    
    const modalHeader = el('div', { className: 'modal-header' });
    const modalTitle = el('h2', { className: 'modal-title', textContent: `${student.name}'s Project` });
    const modalClose = el('button', { 
        className: 'modal-close', 
        textContent: '✕',
        onclick: closeModal
    });
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(modalClose);
    
    const modalContent = el('div', { className: 'modal-content' });
    const modalIframe = el('iframe', {
        className: 'modal-iframe',
        src: student.url,
        title: `${student.name}'s Project`
    });
    
    modalContent.appendChild(modalIframe);
    modalContainer.appendChild(modalHeader);
    modalContainer.appendChild(modalContent);
    modalOverlay.appendChild(modalContainer);
    
    document.body.appendChild(modalOverlay);
    
    // Show modal with animation
    setTimeout(() => {
        modalOverlay.classList.add('show');
    }, 10);
    
    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('show');
        setTimeout(() => {
            modalOverlay.remove();
        }, 300);
    }
}

function createComingSoonModal(studentName) {
    const modalOverlay = el('div', { className: 'modal-overlay', id: 'modalOverlay' });
    
    const modalContainer = el('div', { className: 'modal-container coming-soon-modal' });
    
    const modalHeader = el('div', { className: 'modal-header' });
    const modalTitle = el('h2', { className: 'modal-title', textContent: `${studentName}'s Project` });
    const modalClose = el('button', { 
        className: 'modal-close', 
        textContent: '✕',
        onclick: closeModal
    });
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(modalClose);
    
    const comingSoonContent = el('div', { className: 'coming-soon-content' });
    const comingSoonIcon = el('div', { 
        className: 'coming-soon-icon',
        textContent: '🚧'
    });
    const comingSoonTitle = el('h3', { 
        className: 'coming-soon-title',
        textContent: 'Coming Soon'
    });
    const comingSoonMessage = el('p', { 
        className: 'coming-soon-message',
        textContent: `${studentName}'s project is currently under development. Please check back later!`
    });
    
    comingSoonContent.appendChild(comingSoonIcon);
    comingSoonContent.appendChild(comingSoonTitle);
    comingSoonContent.appendChild(comingSoonMessage);
    
    modalContainer.appendChild(modalHeader);
    modalContainer.appendChild(comingSoonContent);
    modalOverlay.appendChild(modalContainer);
    
    document.body.appendChild(modalOverlay);
    
    // Show modal with animation
    setTimeout(() => {
        modalOverlay.classList.add('show');
    }, 10);
    
    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// Search functionality
function createSearchInput(onSearch) {
    const searchContainer = el('div', { className: 'search-container' });
    const searchInput = el('input', {
        className: 'search-input',
        type: 'text',
        placeholder: 'Search students...',
        oninput: (e) => onSearch(e.target.value)
    });
    
    searchContainer.appendChild(searchInput);
    return searchContainer;
}

// Router function
function router() {
    const hash = window.location.hash;
    const route = routes[hash] || routes[""];
    
    console.log('Router called with hash:', hash);
    
    // Clear existing content
    const app = document.getElementById('app');
    app.innerHTML = '';
    
    // Stop existing slideshows
    if (slideshow) {
        slideshow.destroy();
        slideshow = null;
    }
    
    if (pageSlideshow) {
        pageSlideshow.destroy();
        pageSlideshow = null;
    }
    
    // Render new content
    try {
        route();
        console.log('Route rendered successfully');
    } catch (error) {
        console.error('Error rendering route:', error);
    }
}

// Breadcrumb component
function breadcrumb(items) {
    const breadcrumbEl = el('nav', {
        className: 'breadcrumb',
        'aria-label': 'Breadcrumb navigation'
    });
    
    items.forEach((item, index) => {
        if (index > 0) {
            breadcrumbEl.appendChild(el('span', {
                className: 'breadcrumb-separator',
                textContent: '›'
            }));
        }
        
        if (item.url) {
            const link = el('a', {
                className: 'breadcrumb-item',
                href: item.url,
                textContent: item.text
            });
            breadcrumbEl.appendChild(link);
        } else {
            const span = el('span', {
                className: 'breadcrumb-item',
                textContent: item.text
            });
            breadcrumbEl.appendChild(span);
        }
    });
    
    return breadcrumbEl;
}

// Home page renderer
function renderHome() {
    const app = document.getElementById('app');
    
    // Hero section
    const hero = el('section', { className: 'hero' });
    
    // Slideshow container
    const slideshowContainer = el('div', { className: 'hero-slideshow' });
    hero.appendChild(slideshowContainer);
    
    // Overlay
    const overlay = el('div', { className: 'hero-overlay' });
    hero.appendChild(overlay);
    
    // Hero content
    const heroContent = el('div', { className: 'hero-content' });
    
    const title = el('h1', {
        className: 'hero-title',
        textContent: 'KOICA ICT Class September Project – Creating Web with HTML/CSS/AI'
    });
    
    const cta = el('p', {
        className: 'hero-cta',
        textContent: 'Use the menu above to explore projects'
    });
    
    heroContent.appendChild(title);
    heroContent.appendChild(cta);
    hero.appendChild(heroContent);
    
    app.appendChild(hero);
    
    // Initialize slideshow
    const images = [
        'back1.jpg',
        'back2.jpg',
        'back3.jpg',
        'back4.jpg',
        'back5.jpg',
        'back6.jpg',
        'back7.jpg'
    ];
    
    slideshow = new Slideshow(slideshowContainer, images, 2500);
}

// Add background slideshow to non-home pages
function addPageBackground() {
    const app = document.getElementById('app');
    
    // Create background slideshow container
    const backgroundContainer = el('div', { className: 'page-background' });
    app.appendChild(backgroundContainer);
    
    // Initialize page background slideshow
    const images = [
        'back1.jpg',
        'back2.jpg',
        'back3.jpg',
        'back4.jpg',
        'back5.jpg',
        'back6.jpg',
        'back7.jpg'
    ];
    
    pageSlideshow = new PageSlideshow(backgroundContainer, images, 2500);
}

// Project page renderer
function renderProject(projectNumber) {
    const app = document.getElementById('app');
    
    // Add background slideshow
    addPageBackground();
    
    // Breadcrumb
    const breadcrumbEl = breadcrumb([
        { text: 'Home', url: '#' },
        { text: `Project ${projectNumber}` }
    ]);
    app.appendChild(breadcrumbEl);
    
    // Group cards
    const groupCards = el('div', { className: 'group-cards' });
    
    const group1Card = el('div', {
        className: 'group-card',
        onclick: () => {
            window.location.hash = `#/project${projectNumber}/group1`;
        },
        'aria-label': `Navigate to Project ${projectNumber} Group 1`,
        tabIndex: 0
    });
    
    const group1Button = el('div', {
        className: 'group-button'
    });
    
    const group1Text = el('div', {
        className: 'group-button-text',
        textContent: 'Group 1'
    });
    
    const group1Subtitle = el('div', {
        className: 'group-button-subtitle',
        textContent: 'click to view'
    });
    
    group1Button.appendChild(group1Text);
    group1Button.appendChild(group1Subtitle);
    
    group1Card.appendChild(group1Button);
    
    const group2Card = el('div', {
        className: 'group-card',
        onclick: () => {
            window.location.hash = `#/project${projectNumber}/group2`;
        },
        'aria-label': `Navigate to Project ${projectNumber} Group 2`,
        tabIndex: 0
    });
    
    const group2Button = el('div', {
        className: 'group-button'
    });
    
    const group2Text = el('div', {
        className: 'group-button-text',
        textContent: 'Group 2'
    });
    
    const group2Subtitle = el('div', {
        className: 'group-button-subtitle',
        textContent: 'click to view'
    });
    
    group2Button.appendChild(group2Text);
    group2Button.appendChild(group2Subtitle);
    
    group2Card.appendChild(group2Button);
    
    groupCards.appendChild(group1Card);
    groupCards.appendChild(group2Card);
    
    app.appendChild(groupCards);
}

function renderGroup(project, group){
  const app = document.querySelector('#app');
  const section = el('section',{class:'section'});

  // Support both old/new router helpers
  const parsed = typeof parseHash === 'function' ? parseHash() : { params: new URLSearchParams() };
  const params = parsed.params || new URLSearchParams();
  const initial = params.get('search') || '';

  const data = (project===1 ? Data.project1 : Data.project2)[`group${group}`];

  // Dynamic title per project
  const titleMap = {
    1: 'My Self Introduction Page',
    2: 'Hun Sen Serey Pheap High School Page'
  };
  const headerTitle = titleMap[project] || `Project ${project}`;

  // Header: breadcrumb + dynamic title + sub (group info)
  section.append(
    breadcrumb([['#','Home'], [`#/project${project}`, `Project ${project}`], [null, `Group ${group}`]]),
    el('h2',{}, headerTitle),
    el('p',{class:'sub'}, `Group ${group} • Click an available result to open in a new tab.`)
  );

  // Search UI
  const total = data.length;
  const count = el('span',{class:'search-count', 'aria-live':'polite'});
  const input = el('input',{
    class:'search-input',
    type:'search',
    placeholder:'Search student name…',
    value: initial,
    'aria-label':'Search students by name',
    oninput: (e)=>{
      const term = e.target.value;
      const visible = renderStudents(grid, data, term);
      count.textContent = `${visible}/${total}`;
      if (typeof setHashParam === 'function') setHashParam('search', term);
    }
  });
  const searchbar = el('div',{class:'searchbar'}, [input, count]);
  section.append(searchbar);

  // Grid
  const grid = el('div',{class:'grid'});
  const visible0 = renderStudents(grid, data, initial);
  count.textContent = `${visible0}/${total}`;

  section.append(grid);
  app.append(section);

  // Keyboard UX: "/" focuses search, "Esc" clears
  window.addEventListener('keydown', (e)=>{
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (e.key === '/' && tag !== 'input' && tag !== 'textarea'){
      e.preventDefault(); input.focus();
    } else if (e.key === 'Escape' && document.activeElement === input){
      input.value = '';
      const v = renderStudents(grid, data, '');
      count.textContent = `${v}/${total}`;
      if (typeof setHashParam === 'function') setHashParam('search','');
    }
  }, { once:false });
}

// Keyboard navigation support
function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        const target = event.target;
        if (target.classList.contains('card') && target.onclick) {
            event.preventDefault();
            target.onclick();
        }
    }
}

// Menu functionality
function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const expandableMenu = document.getElementById('expandableMenu');
    
    if (menuToggle && expandableMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            expandableMenu.classList.toggle('show');
            
            // Update button text and icon
            const menuText = menuToggle.querySelector('.menu-text');
            const menuIcon = menuToggle.querySelector('.menu-icon');
            
            if (expandableMenu.classList.contains('show')) {
                menuText.textContent = 'Close';
                menuIcon.textContent = '✕';
            } else {
                menuText.textContent = 'Project';
                menuIcon.textContent = '☰';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !expandableMenu.contains(e.target)) {
                expandableMenu.classList.remove('show');
                
                // Reset button text and icon
                const menuText = menuToggle.querySelector('.menu-text');
                const menuIcon = menuToggle.querySelector('.menu-icon');
                menuText.textContent = 'Project';
                menuIcon.textContent = '☰';
            }
        });
        
        // Close menu when clicking on menu links
        const menuLinks = expandableMenu.querySelectorAll('.menu-section-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                expandableMenu.classList.remove('show');
                
                // Reset button text and icon
                const menuText = menuToggle.querySelector('.menu-text');
                const menuIcon = menuToggle.querySelector('.menu-icon');
                menuText.textContent = 'Project';
                menuIcon.textContent = '☰';
            });
        });
    }
}

// Initialize application
function init() {
    // Set up event listeners
    window.addEventListener('hashchange', router);
    document.addEventListener('keydown', handleKeydown);
    
    // Initialize menu
    initMenu();
    
    // Initial route
    router();
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
