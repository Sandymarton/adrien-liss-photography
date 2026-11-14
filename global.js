// Reusable Global Scripts for Adrien Liss Photography Portfolio

let lenis;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject Page Transition Overlay Programmatically
  const transitionOverlay = document.createElement('div');
  transitionOverlay.id = 'page-transition';
  transitionOverlay.className = 'fixed inset-0 bg-[#0B0B0B] z-[1000] pointer-events-none transition-opacity duration-300';
  transitionOverlay.style.opacity = '1';
  document.body.prepend(transitionOverlay);

  // Fade out page transition overlay promptly without blocking on heavy image downloads
  const fadeOutOverlay = () => {
    transitionOverlay.style.opacity = '0';
    setTimeout(() => {
      transitionOverlay.style.display = 'none';
    }, 320);
  };

  setTimeout(fadeOutOverlay, 80);
  window.addEventListener('load', fadeOutOverlay);
  window.addEventListener('pageshow', fadeOutOverlay);

  // Intercept internal page navigations for smooth page transition fade-out
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const anchor = e.target.closest('a');
    if (!anchor) return;
    if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    const isSamePageAnchor = href.startsWith('#');
    const isExternalOrProtocol = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:');
    const isInternal = !isExternalOrProtocol && !isSamePageAnchor && (href.endsWith('.html') || href.includes('.html?') || href.includes('.html#') || href.startsWith('/') || href.startsWith('./'));

    if (isInternal) {
      e.preventDefault();
      transitionOverlay.style.display = 'block';
      requestAnimationFrame(() => {
        transitionOverlay.style.opacity = '1';
      });
      setTimeout(() => {
        window.location.href = href;
      }, 180);
    }
  });

  // 2. Initialize Lenis Smooth Scroll (Single RAF loop — synced with GSAP ticker when available)
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // Smooth anchor hash scrolling on current page (works with Lenis or native fallback)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, {
            offset: -90,
            duration: 1.1,
          });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Check for hash on load
  if (window.location.hash && window.location.hash.length > 1) {
    try {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          if (lenis) {
            lenis.scrollTo(target, { offset: -90, duration: 1.2 });
          } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 450);
      }
    } catch (_) {}
  }

  // 3. Reusable Lightbox Setup
  initLightbox();

  // 4. Header Dynamic Style on Scroll (Passive listener for 60fps mobile & desktop scroll)
  const header = document.querySelector('header');
  if (header) {
    const updateHeaderScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('nav-blur', 'py-4', 'shadow-lg');
        header.classList.remove('py-6');
      } else {
        const mobileMenu = document.getElementById('mobile-menu');
        const isMenuOpen = mobileMenu && !mobileMenu.classList.contains('hidden');
        if (!isMenuOpen) {
          header.classList.remove('nav-blur', 'py-4', 'shadow-lg');
          header.classList.add('py-6');
        }
      }
    };
    window.addEventListener('scroll', updateHeaderScroll, { passive: true });
    updateHeaderScroll();
  }

  // 5. Unified Mobile Menu Controller (Handles toggle, close button, link clicks, Escape, and resize)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  const closeMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    if (mobileMenuBtn) mobileMenuBtn.classList.remove('open');
    if (header) {
      header.classList.remove('menu-open');
      if (window.scrollY <= 50) {
        header.classList.remove('nav-blur', 'py-4', 'shadow-lg');
        header.classList.add('py-6');
      }
    }
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  };

  const openMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('hidden');
    if (mobileMenuBtn) mobileMenuBtn.classList.add('open');
    if (header) {
      header.classList.add('menu-open', 'nav-blur');
    }
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  };

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        closeMobileMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && !mobileMenu.classList.contains('hidden')) {
        closeMobileMenu();
      }
    }, { passive: true });
  }
});

// Lightbox logic (Namespaced IDs to prevent collisions with page-specific modals)
function initLightbox() {
  const lightboxHTML = `
    <div id="global-lightbox-overlay" class="fixed inset-0 bg-[#0B0B0BBF] backdrop-blur-xl z-[999] justify-center items-center select-none" style="display: none;">
      <!-- Close Button -->
      <button id="global-lightbox-close" class="lightbox-btn fixed top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-warm-white z-50" aria-label="Close Lightbox">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      <!-- Prev Button -->
      <button id="global-lightbox-prev" class="lightbox-btn fixed left-4 sm:left-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-warm-white z-50" aria-label="Previous Image">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      <!-- Next Button -->
      <button id="global-lightbox-next" class="lightbox-btn fixed right-4 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-warm-white z-50" aria-label="Next Image">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"></path></svg>
      </button>
      <!-- Image Wrapper -->
      <div id="global-lightbox-content" class="w-full h-full max-w-5xl max-h-[85vh] px-4 flex flex-col justify-center items-center relative">
        <img id="global-lightbox-img" class="max-w-full max-h-full object-contain select-none transition-transform duration-300 pointer-events-auto" src="" alt="">
        <p id="global-lightbox-caption" class="text-white/60 text-xs mt-4 uppercase tracking-widest font-sans text-center px-4"></p>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);

  const overlay = document.getElementById('global-lightbox-overlay');
  const lightboxImg = document.getElementById('global-lightbox-img');
  const lightboxCaption = document.getElementById('global-lightbox-caption');
  const closeBtn = document.getElementById('global-lightbox-close');
  const prevBtn = document.getElementById('global-lightbox-prev');
  const nextBtn = document.getElementById('global-lightbox-next');

  let images = [];
  let currentIndex = 0;

  function updateGalleryList(clickedImg) {
    const parentGrid = clickedImg.closest('.masonry-grid, .gallery-grid, .ribbon-track');
    const imgElements = parentGrid 
      ? parentGrid.querySelectorAll('img') 
      : document.querySelectorAll('.masonry-grid img, .gallery-grid img, img.zoomable');

    images = Array.from(imgElements).map((img, index) => {
      img.setAttribute('data-lightbox-index', index);
      const captionText = img.getAttribute('data-caption') || img.getAttribute('alt') || 'Adrien Liss Photography';
      return {
        src: img.getAttribute('src'),
        caption: captionText
      };
    });
  }

  // Open Lightbox
  document.addEventListener('click', (e) => {
    const triggerImg = e.target.closest('.masonry-grid img, .gallery-grid img, img.zoomable');
    if (!triggerImg) return;
    // Skip if element has its own inline onclick lightbox handler
    if (triggerImg.closest('[onclick*="Lightbox"]')) return;

    e.preventDefault();
    updateGalleryList(triggerImg);

    const idxAttr = triggerImg.getAttribute('data-lightbox-index');
    currentIndex = idxAttr !== null ? parseInt(idxAttr, 10) : 0;

    showImage(currentIndex);
    overlay.style.display = 'flex';
    setTimeout(() => {
      overlay.classList.add('active');
    }, 10);

    if (lenis) lenis.stop();
  });

  function showImage(index) {
    if (images.length === 0) return;
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    currentIndex = index;

    lightboxImg.style.transform = 'scale(0.95)';
    lightboxImg.style.opacity = '0';

    setTimeout(() => {
      lightboxImg.src = images[currentIndex].src;
      lightboxCaption.textContent = images[currentIndex].caption;
      lightboxImg.style.transform = 'scale(1)';
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  function closeLightbox() {
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.style.display = 'none';
      if (lenis) lenis.start();
    }, 300);
  }

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === document.getElementById('global-lightbox-content')) {
      closeLightbox();
    }
  });

  let startX = 0;
  overlay.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  overlay.addEventListener('touchend', (e) => {
    const diffX = e.changedTouches[0].clientX - startX;
    if (diffX > 50) {
      showImage(currentIndex - 1);
    } else if (diffX < -50) {
      showImage(currentIndex + 1);
    }
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}

// Unified Direct Form Submission Helper (FormSubmit AJAX + Mailto Fallback)
window.submitAdrienInquiry = async function({ subject, fields, feedbackEl, submitBtn, formEl }) {
  if (feedbackEl) {
    feedbackEl.classList.remove('hidden');
    feedbackEl.textContent = 'Sending your inquiry directly to Adrien Liss...';
  }
  const origBtnText = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
  }

  const bodyLines = Object.entries(fields)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  try {
    const response = await fetch('https://formsubmit.co/ajax/adrienliss@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        ...fields
      })
    });

    if (response.ok) {
      if (feedbackEl) {
        feedbackEl.textContent = 'Thank you. Your inquiry has been sent to adrienliss@gmail.com. Adrien will respond within 24 hours.';
      }
      if (formEl) formEl.reset();
    } else {
      throw new Error('Fallback to mailto');
    }
  } catch (err) {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(bodyLines);
    if (feedbackEl) {
      feedbackEl.innerHTML = `Your inquiry is ready — opening your mail app, or click <a href="mailto:adrienliss@gmail.com?subject=${encodedSubject}&body=${encodedBody}" class="underline font-semibold">adrienliss@gmail.com</a> to send.`;
    }
    window.location.href = `mailto:adrienliss@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.innerHTML = origBtnText;
    }
  }
};
