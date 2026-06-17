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
        updateElementText('hero-transport-text', siteConfig.transport);
        
        // Benefits & About
        updateElementText('benefit-transport', siteConfig.transport);
        updateElementText('about-transport', siteConfig.transport);

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

        // FAQ
        updateElementText('faq-city', siteConfig.departureCity);
        updateElementText('faq-transport', siteConfig.transport);
        updateElementText('faq-seats', siteConfig.seatsTotal);

        // Contacts Info
        updateElementText('contact-driver', siteConfig.driverName);
        updateElementText('contact-phone-display', siteConfig.phoneDisplay);
        updateElementText('contact-time', siteConfig.callTime);

        // Contact Links
        updateElementLink('contact-phone-display', siteConfig.phoneLink, 'tel:');
        updateElementLink('btn-phone', siteConfig.phoneLink, 'tel:');
        updateElementLink('btn-viber', siteConfig.viberLink);
        updateElementLink('btn-tg', siteConfig.telegramLink);
        updateElementLink('btn-wa', siteConfig.whatsappLink);

        // Mobile Sheet Links
        updateElementLink('sheet-btn-viber', siteConfig.viberLink);
        updateElementLink('sheet-btn-tg', siteConfig.telegramLink);
        updateElementLink('sheet-btn-wa', siteConfig.whatsappLink);

        // Mobile Bar Links
        updateElementLink('mobile-btn-phone', siteConfig.phoneLink, 'tel:');
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


});
