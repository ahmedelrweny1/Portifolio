document.addEventListener('DOMContentLoaded', () => {
  const d = window.PORTFOLIO_DATA;
  console.log('Portfolio data:', d); // Debug log
  if (!d) {
    console.error('Portfolio data not found!');
    return;
  }

  // Meta: title + favicon
  if (d.meta?.siteTitle) {
    document.title = d.meta.siteTitle;
  }
  if (d.meta?.favicon) {
    const link = document.querySelector('link[rel="icon"]') || document.createElement('link');
    link.rel = 'icon';
    link.href = d.meta.favicon;
    document.head.appendChild(link);
  }

  const normalizeUrl = (url) => {
    if (!url) return '#';
    const trimmed = String(url).trim().replace(/^@+/, '');
    return trimmed || '#';
  };

  // Hero
  const nameEl = document.getElementById('hero-name');
  const imgEl = document.getElementById('profile-image');
  const socialEl = document.getElementById('social-links');
  const ctaPrimary = document.getElementById('cta-primary');
  const ctaSecondary = document.getElementById('cta-secondary');

  nameEl.textContent = d.basics.name;
  roleEl.textContent = d.basics.role + (d.basics.location ? ` · ${d.basics.location}` : '');
  imgEl.src = d.basics.profileImage || imgEl.src;
  imgEl.addEventListener('error', () => { imgEl.src = 'assets/profile-placeholder.svg'; }, { once: true });
  ctaPrimary.textContent = d.basics.ctaPrimaryText || ctaPrimary.textContent;
  ctaSecondary.textContent = d.basics.ctaSecondaryText || ctaSecondary.textContent;

  // Social
  socialEl.innerHTML = '';
  (d.social || []).forEach(s => {
    const a = document.createElement('a');
    a.href = normalizeUrl(s.url);
    a.target = '_blank'; a.rel = 'noopener'; a.textContent = s.label;
    socialEl.appendChild(a);
  });

  // About (preserve newlines)
  const aboutEl = document.getElementById('about-text');
  aboutEl.innerHTML = (d.basics.about || '').replace(/\n/g, '<br>');

  // Skills with categories and animations
  const categoriesEl = document.getElementById('skills-categories');
  const skillsContainerEl = document.getElementById('skills-container');
  
  console.log('Skills categories element:', categoriesEl);
  console.log('Skills container element:', skillsContainerEl);
  console.log('Skills categories data:', d.skillCategories);
  
  if (categoriesEl && skillsContainerEl && d.skillCategories) {
    categoriesEl.innerHTML = '';
    skillsContainerEl.innerHTML = '';
    
    // Create category tabs
    d.skillCategories.forEach((category, categoryIndex) => {
      // Create category tab
      const tab = document.createElement('button');
      tab.className = `category-tab ${categoryIndex === 0 ? 'active' : ''}`;
      tab.textContent = category.name;
      tab.dataset.category = categoryIndex;
      categoriesEl.appendChild(tab);
      
      // Create skills grid for this category
      const skillsGrid = document.createElement('ul');
      skillsGrid.className = `skills-grid ${categoryIndex === 0 ? 'active' : ''}`;
      skillsGrid.id = `skills-category-${categoryIndex}`;
      
      // Add skills to this category grid
      category.skills.forEach(skill => {
        const li = document.createElement('li');
        li.className = 'skill-item reveal';
        
        // Convert level to percentage
        const levelMap = {
          'Beginner': 25,
          'Intermediate': 65,
          'Advanced': 90,
          'Expert': 100
        };
        const progress = levelMap[skill.level] || 50;
        
        li.style.setProperty('--progress-width', `${progress}%`);
        li.innerHTML = `
          <div class="skill-header">
            <div class="skill-name">${skill.name}</div>
            <div class="skill-level">${skill.level}</div>
          </div>
          <div class="skill-progress">
            <div class="skill-progress-bar"></div>
          </div>
        `;
        skillsGrid.appendChild(li);
      });
      
      skillsContainerEl.appendChild(skillsGrid);
    });
    
    // Add click handlers to category tabs
    const tabs = categoriesEl.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding skills grid
        const categoryIndex = tab.dataset.category;
        const skillsGrids = skillsContainerEl.querySelectorAll('.skills-grid');
        skillsGrids.forEach(grid => grid.classList.remove('active'));
        document.getElementById(`skills-category-${categoryIndex}`).classList.add('active');
        
        // Trigger reveal animations for newly visible skills
        const visibleSkills = document.querySelectorAll(`#skills-category-${categoryIndex} .skill-item`);
        visibleSkills.forEach(skill => {
          skill.classList.add('visible');
        });
      });
    });
    
    // Initialize first category as visible
    setTimeout(() => {
      const firstCategorySkills = document.querySelectorAll('#skills-category-0 .skill-item');
      firstCategorySkills.forEach(skill => {
        skill.classList.add('visible');
      });
    }, 500);
  }

  // Projects - Normal Grid
  const projEl = document.getElementById('projects-grid');
  console.log('Projects element:', projEl);
  console.log('Projects data:', d.projects);
  
  if (projEl && d.projects) {
    projEl.innerHTML = '';
    d.projects.forEach(p => {
      console.log('Creating project card:', p.title);
      const card = document.createElement('article');
      card.className = 'project-card reveal';
      const link = normalizeUrl(p.url);
      card.innerHTML = `
        <h3 class="project-title"><a href="${link}" target="_blank" rel="noopener">${p.title}</a></h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-meta">${(p.tech||[]).map(t => `<span class='tag'>${t}</span>`).join('')}</div>
      `;
      projEl.appendChild(card);
    });
    console.log('Projects loaded:', projEl.children.length);
  }
  
  // Project Gallery with animations
  const gallerySlider = document.getElementById('gallery-slider');
  const galleryDots = document.getElementById('gallery-dots');
  const galleryPrev = document.getElementById('gallery-prev');
  const galleryNext = document.getElementById('gallery-next');
  
  if (gallerySlider && galleryDots && d.projects && d.projects.length > 0) {
    let currentSlide = 0;
    const totalSlides = d.projects.length;
    
    // Create slides
    d.projects.forEach((project, index) => {
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';
      
      const slideInner = document.createElement('div');
      slideInner.className = 'gallery-slide-inner';
      
      const link = normalizeUrl(project.url);
      
      // Use random image if project doesn't have one
      const imageUrl = project.image || `https://picsum.photos/800/450?random=${index + 1}`;
      
      slideInner.innerHTML = `
        <div class="gallery-image" style="background-image: url('${imageUrl}')"></div>
        <div class="gallery-content">
          <h3 class="gallery-title">${project.title}</h3>
          <p class="gallery-description">${project.description}</p>
          <div class="gallery-tags">
            ${(project.tech || []).map(tech => `<span class="gallery-tag">${tech}</span>`).join('')}
          </div>
        </div>
      `;
      
      // Make slide clickable
      slideInner.addEventListener('click', () => {
        if (link !== '#') {
          window.open(link, '_blank', 'noopener');
        }
      });
      
      slide.appendChild(slideInner);
      gallerySlider.appendChild(slide);
      
      // Create dot for this slide
      const dot = document.createElement('button');
      dot.className = `gallery-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to project ${index + 1}`);
      dot.dataset.slide = index;
      
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
      
      galleryDots.appendChild(dot);
    });
    
    // Navigation functions
    function goToSlide(index) {
      currentSlide = index;
      gallerySlider.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update dots
      document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }
    
    function goToNextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      goToSlide(currentSlide);
    }
    
    function goToPrevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      goToSlide(currentSlide);
    }
    
    // Add navigation event listeners
    galleryNext.addEventListener('click', goToNextSlide);
    galleryPrev.addEventListener('click', goToPrevSlide);
    
    // Auto-advance slides every 5 seconds
    let slideInterval = setInterval(goToNextSlide, 5000);
    
    // Pause auto-advance on hover/focus
    gallerySlider.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    gallerySlider.addEventListener('mouseleave', () => {
      slideInterval = setInterval(goToNextSlide, 5000);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'ArrowRight') {
        goToNextSlide();
      }
    });
  }

  // Experience
  const expEl = document.getElementById('experience-timeline');
  console.log('Experience element:', expEl);
  console.log('Experience data:', d.experience);
  
  if (expEl && d.experience) {
    expEl.innerHTML = '';
    d.experience.forEach(e => {
      console.log('Creating experience item:', e.role);
      const li = document.createElement('li');
      li.className = 'reveal';
      li.innerHTML = `
        <div class="role">${e.role}</div>
        <div class="company">${e.company}</div>
        <div class="period">${e.period}</div>
        <p>${e.summary}</p>
      `;
      expEl.appendChild(li);
    });
    console.log('Experience loaded:', expEl.children.length);
  }

  // Contact
  const contactText = document.getElementById('contact-text');
  const contactEmail = document.getElementById('contact-email');
  const contactResume = document.getElementById('contact-resume');
  contactText.textContent = d.contact.blurb;
  contactEmail.href = `mailto:${d.basics.email}`;
  
  // Setup fizzy download button
  const fizzyInput = document.getElementById('fizzy-download');
  const resumeUrl = normalizeUrl(d.basics.resumeUrl);
  
  contactResume.addEventListener('click', (e) => {
    e.preventDefault();
    fizzyInput.checked = true;
    
    // Start download after animation
    setTimeout(() => {
      window.open(resumeUrl, '_blank');
      // Reset button after download
      setTimeout(() => {
        fizzyInput.checked = false;
      }, 1000);
    }, 1000);
  });

  // Footer year
  const yearEl = document.getElementById('year');
  yearEl.textContent = new Date().getFullYear();

  // Intersection observer for reveals
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Hide loading screen after everything is loaded
  const loadingScreen = document.getElementById('loading-screen');
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.remove();
      }, 800);
    }
  }, 1500); // Show loading for at least 1.5 seconds

  // Mobile nav toggle
  const nav = document.querySelector('.site-nav');
  const navBtn = document.querySelector('.nav-toggle');
  const menu = document.getElementById('site-menu');
  if (navBtn && nav && menu) {
    navBtn.addEventListener('click', () => {
      const expanded = navBtn.getAttribute('aria-expanded') === 'true';
      navBtn.setAttribute('aria-expanded', String(!expanded));
      nav.setAttribute('aria-expanded', String(!expanded));
    });
    // Close menu on link click
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navBtn.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-expanded', 'false');
    }));
  }
});



