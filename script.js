document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. DATA BINDING FROM CONFIG.JS
    // ==========================================
    if (typeof siteConfig !== 'undefined') {
        const updateElementText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };
        const updateElementLink = (id, link, prefix = '') => {
            const el = document.getElementById(id);
            if (el) {
                if(link) {
                    el.href = prefix + link;
                } else {
                    el.style.display = 'none'; // Hide button if no link
                }
            }
        };

        // Hero & General
        updateElementText('hero-date', siteConfig.tripDate);
        updateElementText('hero-seats', siteConfig.seatsAvailable);
        updateElementText('hero-seats-total', siteConfig.seatsTotal);
        updateElementText('hero-city', siteConfig.departureCity);
        updateElementText('hero-badge-transport', siteConfig.transport);
        updateElementText('hero-route-badge', siteConfig.route);
        updateElementLink('hero-call-btn', siteConfig.phoneLink, 'tel:');
        
        // Summary Block
        updateElementText('summary-date', siteConfig.tripDate);
        updateElementText('summary-city', siteConfig.departureCity);
        updateElementText('summary-seats', siteConfig.seatsAvailable + ' з ' + siteConfig.seatsTotal);
        updateElementText('summary-transport', siteConfig.transport);
        updateElementText('summary-route', siteConfig.route);
        updateElementText('summary-price', siteConfig.price);
        updateElementText('summary-duration', siteConfig.estimatedDuration);
        updateElementText('summary-notes', siteConfig.tripNotes);

        // Next Trip
        updateElementText('trip-date', siteConfig.tripDate);
        updateElementText('trip-seats', siteConfig.seatsAvailable);
        updateElementText('trip-seats-total', siteConfig.seatsTotal);
        updateElementText('trip-transport', siteConfig.transport);
        updateElementText('trip-route', siteConfig.route);

        // Transport Info
        updateElementText('transport-name', siteConfig.transport);
        updateElementText('transport-seats', siteConfig.seatsTotal);

        // Important Info
        updateElementText('info-city', siteConfig.departureCity);
        updateElementText('info-duration', siteConfig.estimatedDuration);
        updateElementText('info-price', siteConfig.price);

        // FAQ
        updateElementText('faq-city', siteConfig.departureCity);

        // Contacts Info
        updateElementText('contact-driver', siteConfig.driverName);
        updateElementText('contact-phone-display', siteConfig.phoneDisplay);
        updateElementText('contact-time', siteConfig.callTime);

        // Contact Links (Hide if empty)
        updateElementLink('contact-phone-display', siteConfig.phoneLink, 'tel:');
        updateElementLink('btn-phone', siteConfig.phoneLink, 'tel:');
        
        // Update all messenger buttons by class
        document.querySelectorAll('.viber-btn').forEach(btn => {
            if(siteConfig.viberLink) btn.href = siteConfig.viberLink;
            else btn.style.display = 'none';
        });
        document.querySelectorAll('.tg-btn').forEach(btn => {
            if(siteConfig.telegramLink) btn.href = siteConfig.telegramLink;
            else btn.style.display = 'none';
        });
        document.querySelectorAll('.wa-btn').forEach(btn => {
            if(siteConfig.whatsappLink) btn.href = siteConfig.whatsappLink;
            else btn.style.display = 'none';
        });

        // Mobile Bar Links
        updateElementLink('mobile-btn-phone', siteConfig.phoneLink, 'tel:');
        
        // If all messengers are empty, hide the "Write" button
        if (!siteConfig.viberLink && !siteConfig.telegramLink && !siteConfig.whatsappLink) {
            const btnWrite = document.getElementById('mobile-btn-write');
            if (btnWrite) btnWrite.style.display = 'none';
        }
    }

    // ==========================================
    // 2. SMOOTH SCROLLING
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('#modal-')) return;
            
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

    // ==========================================
    // 3. FAQ ACCORDION
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all others
            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ==========================================
    // 4. MOBILE MENU & BOTTOM SHEET
    // ==========================================
    
    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
        
        // Close menu on link click
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
            });
        });
    }

    // Bottom Sheet
    const contactSheet = document.getElementById('contact-sheet');
    const openSheetBtn = document.getElementById('mobile-btn-write');
    const closeSheetBtn = document.getElementById('close-sheet');

    const openBottomSheet = () => {
        if (contactSheet) {
            contactSheet.classList.add('active');
            contactSheet.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeBottomSheet = () => {
        if (contactSheet) {
            contactSheet.classList.remove('active');
            contactSheet.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    if (openSheetBtn) openSheetBtn.addEventListener('click', (e) => { e.preventDefault(); openBottomSheet(); });
    if (closeSheetBtn) closeSheetBtn.addEventListener('click', closeBottomSheet);
    
    if (contactSheet) {
        contactSheet.addEventListener('click', (e) => {
            if (e.target === contactSheet) closeBottomSheet();
        });
    }

    // ==========================================
    // 5. MODALS (Legal pages)
    // ==========================================
    const modals = {
        terms: document.getElementById('modal-terms'),
        privacy: document.getElementById('modal-privacy'),
        rules: document.getElementById('modal-rules')
    };

    const openBtns = {
        terms: document.getElementById('open-terms'),
        privacy: document.getElementById('open-privacy'),
        rules: document.getElementById('open-rules')
    };

    let previouslyFocusedElement = null;

    const openModal = (modalName) => {
        const modal = modals[modalName];
        if (modal) {
            previouslyFocusedElement = document.activeElement;
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Focus on close button for accessibility
            const closeBtn = modal.querySelector('.close-modal');
            if(closeBtn) closeBtn.focus();
        }
    };

    const closeModal = () => {
        Object.values(modals).forEach(modal => {
            if (modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
        document.body.style.overflow = '';
        
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
            previouslyFocusedElement = null;
        }
    };

    if (openBtns.terms) openBtns.terms.addEventListener('click', (e) => { e.preventDefault(); openModal('terms'); });
    if (openBtns.privacy) openBtns.privacy.addEventListener('click', (e) => { e.preventDefault(); openModal('privacy'); });
    if (openBtns.rules) openBtns.rules.addEventListener('click', (e) => { e.preventDefault(); openModal('rules'); });

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    Object.values(modals).forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // ==========================================
    // 6. COPY PHONE & TOAST
    // ==========================================
    const copyBtn = document.getElementById('btn-copy-phone');
    const toast = document.getElementById('toast');
    
    if (copyBtn && typeof siteConfig !== 'undefined') {
        copyBtn.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(siteConfig.phoneLink).then(() => {
                    if (toast) {
                        toast.classList.add('show');
                        setTimeout(() => {
                            toast.classList.remove('show');
                        }, 2500);
                    }
                }).catch(err => {
                    console.error('Помилка копіювання: ', err);
                });
            }
        });
    }

    // ==========================================
    // 7. CAROUSEL SCROLL LOGIC
    // ==========================================
    const sightsCarousel = document.getElementById('sights-carousel');
    const sightsPrev = document.getElementById('sights-prev');
    const sightsNext = document.getElementById('sights-next');

    if (sightsCarousel && sightsPrev && sightsNext) {
        const getScrollAmount = () => {
            const item = sightsCarousel.querySelector('.carousel-item');
            return item ? item.offsetWidth + 20 : 300;
        };

        sightsPrev.addEventListener('click', () => {
            sightsCarousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        sightsNext.addEventListener('click', () => {
            sightsCarousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });
    }

    // ==========================================
    // 8. TABS LOGIC
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active to current
            btn.classList.add('active');
            const targetElement = document.getElementById(target);
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });

    // ==========================================
    // 9. ROUTE ACCORDION
    // ==========================================
    const routeBtn = document.getElementById('route-toggle-btn');
    const routeSteps = document.getElementById('route-steps');
    
    // Only show button if route is tall enough on mobile/desktop
    if (routeBtn && routeSteps) {
        // If content height is > 350px, it needs an accordion
        if (routeSteps.scrollHeight > 350) {
            routeBtn.style.display = 'block';
        }
        
        routeBtn.addEventListener('click', () => {
            if (routeSteps.classList.contains('collapsed')) {
                routeSteps.classList.remove('collapsed');
                routeSteps.style.maxHeight = routeSteps.scrollHeight + 'px';
                routeBtn.textContent = 'Приховати маршрут';
            } else {
                routeSteps.classList.add('collapsed');
                routeSteps.style.maxHeight = ''; // falls back to css 320px
                routeBtn.textContent = 'Показати весь маршрут';
                
                // Scroll slightly up so user doesn't lose context
                const offset = routeSteps.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    }

});

