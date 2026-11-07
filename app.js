/**
 * FORMA — Luxury Architectural Residences
 * Interactive Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initHeroCarousel();
  initResidencesFilter();
  initGallerySwap();
  initBookingModal();
  initQuickViewModal();
  initSmoothScroll();
});

/* ==========================================================================
   1. HEADER SCROLL & ACTIVE STATES
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('drawerClose');
  const drawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => drawer.classList.add('open');
  const closeDrawer = () => drawer.classList.remove('open');

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   3. HERO CAROUSEL (01 / 03)
   ========================================================================== */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const counter = document.getElementById('carouselCounter');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');

  if (slides.length === 0) return;

  let currentIndex = 0;
  const total = slides.length;
  let autoplayTimer = null;

  const updateSlide = (newIndex) => {
    slides[currentIndex].classList.remove('active');
    currentIndex = (newIndex + total) % total;
    slides[currentIndex].classList.add('active');
    
    if (counter) {
      const formattedCur = String(currentIndex + 1).padStart(2, '0');
      const formattedTot = String(total).padStart(2, '0');
      counter.textContent = `${formattedCur} / ${formattedTot}`;
    }
  };

  const nextSlide = () => updateSlide(currentIndex + 1);
  const prevSlide = () => updateSlide(currentIndex - 1);

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }

  const startAutoplay = () => {
    autoplayTimer = setInterval(nextSlide, 7000);
  };

  const resetAutoplay = () => {
    clearInterval(autoplayTimer);
    startAutoplay();
  };

  startAutoplay();
}

/* ==========================================================================
   4. RESIDENCES CATALOG FILTERING & SORTING
   ========================================================================== */
function initResidencesFilter() {
  const filterLocation = document.getElementById('filterLocation');
  const filterType = document.getElementById('filterType');
  const filterBedrooms = document.getElementById('filterBedrooms');
  const filterAvailability = document.getElementById('filterAvailability');
  const applyBtn = document.getElementById('applyFiltersBtn');
  const resetBtn = document.getElementById('resetFiltersBtn');
  const sortSelect = document.getElementById('sortSelect');
  const resultsCount = document.getElementById('resultsCount');
  const grid = document.getElementById('residencesGrid');

  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.residence-card'));

  const applyFiltersAndSort = () => {
    const locVal = filterLocation ? filterLocation.value : 'all';
    const typeVal = filterType ? filterType.value : 'all';
    const bedVal = filterBedrooms ? filterBedrooms.value : 'all';
    const sortVal = sortSelect ? sortSelect.value : 'featured';

    let visibleCount = 0;

    // Filter
    cards.forEach(card => {
      const cLoc = card.dataset.location;
      const cType = card.dataset.type;
      const cBeds = parseInt(card.dataset.bedrooms, 10);

      let matchLoc = (locVal === 'all') || (cLoc === locVal);
      let matchType = (typeVal === 'all') || (cType === typeVal);
      let matchBed = true;
      if (bedVal !== 'all') {
        const bedNum = parseInt(bedVal, 10);
        matchBed = (bedNum === 5) ? (cBeds >= 5) : (cBeds === bedNum);
      }

      if (matchLoc && matchType && matchBed) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update count display
    if (resultsCount) {
      const padded = String(visibleCount).padStart(2, '0');
      resultsCount.textContent = `${padded} AVAILABLE RESIDENCES`;
    }

    // Sort visible cards
    const sortedCards = [...cards].sort((a, b) => {
      const priceA = parseInt(a.dataset.price || '0', 10);
      const priceB = parseInt(b.dataset.price || '0', 10);
      const areaA = parseInt(a.dataset.area || '0', 10);
      const areaB = parseInt(b.dataset.area || '0', 10);

      if (sortVal === 'price-asc') return priceA - priceB;
      if (sortVal === 'price-desc') return priceB - priceA;
      if (sortVal === 'area-desc') return areaB - areaA;
      return 0; // Default featured order
    });

    sortedCards.forEach(card => grid.appendChild(card));
  };

  if (applyBtn) applyBtn.addEventListener('click', applyFiltersAndSort);
  if (sortSelect) sortSelect.addEventListener('change', applyFiltersAndSort);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (filterLocation) filterLocation.value = 'all';
      if (filterType) filterType.value = 'all';
      if (filterBedrooms) filterBedrooms.value = 'all';
      if (filterAvailability) filterAvailability.value = 'available';
      if (sortSelect) sortSelect.value = 'featured';
      applyFiltersAndSort();
    });
  }
}

/* ==========================================================================
   5. GALLERY IMAGE SWAPPER
   ========================================================================== */
function initGallerySwap() {
  window.swapMainImage = function(thumbElement) {
    const mainImg = document.getElementById('galleryMainImage');
    const thumbImg = thumbElement.querySelector('img');
    if (!mainImg || !thumbImg) return;

    // Smooth transition
    mainImg.style.opacity = '0.4';
    setTimeout(() => {
      const tempSrc = mainImg.src;
      const tempAlt = mainImg.alt;

      mainImg.src = thumbImg.src;
      mainImg.alt = thumbImg.alt;

      thumbImg.src = tempSrc;
      thumbImg.alt = tempAlt;

      mainImg.style.opacity = '1';
    }, 200);
  };
}

/* ==========================================================================
   6. BOOKING MODAL & FORM LOGIC
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('closeBookingModal');
  const form = document.getElementById('viewingForm');
  const successState = document.getElementById('modalSuccessState');
  const successDoneBtn = document.getElementById('successDoneBtn');
  const successMsg = document.getElementById('successSummaryMessage');
  const resSelect = document.getElementById('residenceSelect');
  const modalBreadcrumb = document.getElementById('modalBreadcrumbResidence');

  if (!modal) return;

  // Open modal triggers
  const openButtons = document.querySelectorAll('.open-booking-btn');
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const residenceName = btn.dataset.residence || 'Casa Oliva';
      
      // Sync form and breadcrumb
      if (resSelect) {
        for (let i = 0; i < resSelect.options.length; i++) {
          if (resSelect.options[i].value.includes(residenceName)) {
            resSelect.selectedIndex = i;
            break;
          }
        }
      }

      if (modalBreadcrumb) {
        modalBreadcrumb.textContent = residenceName.toUpperCase();
      }

      // Reset form view
      if (form) form.style.display = 'flex';
      if (successState) successState.classList.remove('active');

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (successDoneBtn) successDoneBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const firstName = document.getElementById('firstName');
      const lastName = document.getElementById('lastName');
      const email = document.getElementById('emailAddress');
      const phone = document.getElementById('phoneNumber');
      const privacy = document.getElementById('privacyConsent');

      // Validation
      const checkField = (field, condition) => {
        const parent = field.closest('.form-field');
        if (!condition) {
          parent.classList.add('has-error');
          isValid = false;
        } else {
          parent.classList.remove('has-error');
        }
      };

      if (firstName) checkField(firstName, firstName.value.trim().length > 0);
      if (lastName) checkField(lastName, lastName.value.trim().length > 0);
      if (email) checkField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
      if (phone) checkField(phone, phone.value.trim().length >= 7);
      
      const privacyParent = privacy ? privacy.closest('.form-field') : null;
      if (privacy && !privacy.checked) {
        if (privacyParent) privacyParent.classList.add('has-error');
        isValid = false;
      } else if (privacyParent) {
        privacyParent.classList.remove('has-error');
      }

      if (!isValid) return;

      // Success
      const chosenRes = resSelect ? resSelect.value.split('·')[0].trim() : 'Casa Oliva';
      const userFirstName = firstName ? firstName.value.trim() : 'Guest';

      if (successMsg) {
        successMsg.textContent = `Thank you, ${userFirstName}. We have received your viewing request for ${chosenRes}.`;
      }

      form.style.display = 'none';
      if (successState) successState.classList.add('active');
    });
  }
}

/* ==========================================================================
   7. QUICK VIEW MODAL (FOR CAN TERRA, SA ROCA, CAN SERRA)
   ========================================================================== */
function initQuickViewModal() {
  const modal = document.getElementById('quickViewModal');
  const closeBtn = document.getElementById('closeQuickView');
  const container = document.getElementById('quickViewContent');

  if (!modal || !container) return;

  const residencesData = {
    'can-terra': {
      title: 'Can Terra',
      location: 'SANTA MARIA, MALLORCA',
      price: '€3,250,000',
      specs: '3 bedrooms / 3 bathrooms / 290 m²',
      plot: '4,500 m²',
      tag: 'COUNTRYSIDE ESTATE',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      description: 'Surrounded by ancient olive groves and peaceful Mallorcan vineyards, Can Terra balances traditional stone masonry with expansive contemporary interiors and natural light.'
    },
    'sa-roca': {
      title: 'Sa Roca',
      location: 'PORT DE SÓLLER, MALLORCA',
      price: '€5,400,000',
      specs: '5 bedrooms / 5 bathrooms / 460 m²',
      plot: '1,850 m²',
      tag: 'CLIFFSIDE PANORAMA',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      description: 'Sculpted into the sea cliffs above Port de Sóller, Sa Roca provides uninterrupted open Mediterranean horizon views, cantilevered terraces, and a private wellness suite.'
    },
    'can-serra': {
      title: 'Can Serra',
      location: 'VALLDEMOSSA, MALLORCA',
      price: '€2,950,000',
      specs: '3 bedrooms / 3 bathrooms / 265 m²',
      plot: '2,100 m²',
      tag: 'HERITAGE FINCA',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      description: 'Located in the historic village of Valldemossa, Can Serra preserves hand-chiseled sandstone arches and warm oak carpentry with a serene private courtyard and pool.'
    }
  };

  const openQuickView = (id) => {
    const data = residencesData[id];
    if (!data) return;

    container.innerHTML = `
      <div class="quickview-wrapper">
        <div class="card-image-box" style="height: 340px; margin-bottom: 2rem;">
          <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover;">
          <div class="card-tags">
            <span class="card-tag">${data.tag}</span>
          </div>
        </div>
        <div class="card-header-row">
          <span class="card-location">${data.location}</span>
          <span class="card-price" style="font-size: 1.8rem;">${data.price}</span>
        </div>
        <h2 class="card-title" style="font-size: 2.6rem; margin-bottom: 0.5rem;">${data.title}</h2>
        <p class="card-specs" style="margin-bottom: 1.25rem;">${data.specs} &nbsp;·&nbsp; Plot: ${data.plot}</p>
        <p style="font-size: 1.02rem; line-height: 1.8; color: var(--color-muted); margin-bottom: 2.5rem;">
          ${data.description}
        </p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button class="btn btn-primary open-booking-btn" data-residence="${data.title}">BOOK A VIEWING</button>
          <button class="btn btn-outline" onclick="document.getElementById('quickViewModal').classList.remove('active')">CLOSE</button>
        </div>
      </div>
    `;

    // Re-bind booking buttons inside quickview
    const btn = container.querySelector('.open-booking-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        modal.classList.remove('active');
        const bookingBtn = document.querySelector(`.open-booking-btn[data-residence="Casa Oliva"]`);
        if (bookingBtn) {
          const customBtn = document.createElement('button');
          customBtn.dataset.residence = data.title;
          customBtn.classList.add('open-booking-btn');
          document.body.appendChild(customBtn);
          initBookingModal();
          customBtn.click();
          customBtn.remove();
        }
      });
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  document.querySelectorAll('.open-quickview-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openQuickView(btn.dataset.id);
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   8. SMOOTH SCROLL FOR NAVIGATION
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
