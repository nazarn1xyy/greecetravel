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
        const isValidLink = (link) => link && link.trim() !== '' && !link.includes('username');
        const isValidPhone = siteConfig.phoneLink && siteConfig.phoneLink.trim() !== '';
        
        updateElementLink('contact-phone-display', siteConfig.phoneLink, 'tel:');
        updateElementLink('btn-phone', siteConfig.phoneLink, 'tel:');
        
        const hasViber = isValidLink(siteConfig.viberLink);
        const hasTg = isValidLink(siteConfig.telegramLink);
        const hasWa = isValidLink(siteConfig.whatsappLink);

        document.querySelectorAll('.viber-btn').forEach(btn => {
            if(hasViber) { btn.href = siteConfig.viberLink; btn.style.display = ''; } else { btn.style.display = 'none'; }
        });
        document.querySelectorAll('.tg-btn').forEach(btn => {
            if(hasTg) { btn.href = siteConfig.telegramLink; btn.style.display = ''; } else { btn.style.display = 'none'; }
        });
        document.querySelectorAll('.wa-btn').forEach(btn => {
            if(hasWa) { btn.href = siteConfig.whatsappLink; btn.style.display = ''; } else { btn.style.display = 'none'; }
        });

        // Mobile Bar Links
        updateElementLink('mobile-btn-phone', siteConfig.phoneLink, 'tel:');
        if (!isValidPhone) {
            const btnPhone = document.getElementById('mobile-btn-phone');
            if (btnPhone) btnPhone.style.display = 'none';
        }
        
        if (!hasViber && !hasTg && !hasWa) {
            const noMsg = document.getElementById('sheet-no-messengers');
            if (noMsg) noMsg.style.display = 'block';
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
    
    document.querySelectorAll('.open-messenger-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openBottomSheet();
        });
    });
    if (closeSheetBtn) closeSheetBtn.addEventListener('click', closeBottomSheet);
    
    if (contactSheet) {
        contactSheet.addEventListener('click', (e) => {
            if (e.target === contactSheet) closeBottomSheet();
        });
    }

    // Countdown Timer Logic
    function initCountdown() {
        const timerEl = document.getElementById('countdown-timer');
        if (!timerEl || !siteConfig.tripDate) return;
        
        // Parse Ukrainian date like "21 червня 2026"
        const months = {
            'січня': 0, 'лютого': 1, 'березня': 2, 'квітня': 3, 'травня': 4, 'червня': 5,
            'липня': 6, 'серпня': 7, 'вересня': 8, 'жовтня': 9, 'листопада': 10, 'грудня': 11
        };
        
        const dateParts = siteConfig.tripDate.toLowerCase().split(' ');
        if (dateParts.length < 3) return;
        
        const day = parseInt(dateParts[0]);
        const month = months[dateParts[1]];
        const year = parseInt(dateParts[2]);
        
        if (isNaN(day) || month === undefined || isNaN(year)) return;
        
        const targetDate = new Date(year, month, day, 6, 0, 0).getTime(); // assume 06:00 AM departure
        
        function updateTimer() {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                timerEl.style.display = 'none';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            timerEl.textContent = ''; // clear previous content
            
            const createItem = (value, label) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'countdown-item';
                
                const valSpan = document.createElement('span');
                valSpan.className = 'countdown-value';
                valSpan.textContent = value;
                
                const labelSpan = document.createElement('span');
                labelSpan.className = 'countdown-label';
                labelSpan.textContent = label;
                
                itemDiv.appendChild(valSpan);
                itemDiv.appendChild(labelSpan);
                return itemDiv;
            };

            timerEl.appendChild(createItem(days, 'Днів'));
            timerEl.appendChild(createItem(hours, 'Годин'));
            timerEl.appendChild(createItem(minutes, 'Хвилин'));
            
            timerEl.style.display = 'inline-flex';
        }
        
        updateTimer();
        setInterval(updateTimer, 60000); // update every minute
    }
    
    initCountdown();

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
            closeBottomSheet();
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
    const carouselContainers = document.querySelectorAll('.carousel-container');
    carouselContainers.forEach(container => {
        const carousel = container.querySelector('.carousel') || container.querySelector('.scrollable-cards');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');

        if (carousel) {
            const getScrollAmount = () => {
                const item = carousel.querySelector('.carousel-item') || carousel.querySelector('.step-card');
                return item ? item.offsetWidth + 20 : 300;
            };

            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', () => carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' }));
                nextBtn.addEventListener('click', () => carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' }));
            }

            // Keyboard navigation
            carousel.setAttribute('tabindex', '0');
            carousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
                else if (e.key === 'ArrowRight') carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            });

            // Pagination Dots
            const dotsContainer = container.querySelector('.carousel-dots');
            if (dotsContainer) {
                const items = carousel.querySelectorAll('.carousel-item');
                items.forEach((_, i) => {
                    const dot = document.createElement('button');
                    dot.className = i === 0 ? 'dot active' : 'dot';
                    dot.setAttribute('aria-label', `Slide ${i + 1}`);
                    dot.addEventListener('click', () => {
                        carousel.scrollTo({ left: i * getScrollAmount(), behavior: 'smooth' });
                    });
                    dotsContainer.appendChild(dot);
                });

                // Update active dot on scroll
                carousel.addEventListener('scroll', () => {
                    const index = Math.round(carousel.scrollLeft / getScrollAmount());
                    const dots = dotsContainer.querySelectorAll('.dot');
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                });
            }
        }
    });

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

    // ==========================================
    // 10. CAROUSEL SWIPE HINT ANIMATION
    // ==========================================
    const carousels = document.querySelectorAll('.carousel');
    
    if ('IntersectionObserver' in window && carousels.length > 0) {
        const carouselObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const carousel = entry.target;
                    // Animate only if the carousel is actually scrollable on this screen
                    if (carousel.scrollWidth > carousel.clientWidth) {
                        // Delay slightly so the user notices it after scrolling stops
                        setTimeout(() => {
                            carousel.scrollTo({ left: 60, behavior: 'smooth' });
                            
                            // Scroll back to start
                            setTimeout(() => {
                                carousel.scrollTo({ left: 0, behavior: 'smooth' });
                            }, 600);
                        }, 500);
                    }
                    // Only do this once per carousel
                    observer.unobserve(carousel);
                }
            });
        }, {
            threshold: 0.7 // Trigger when 70% visible
        });

        carousels.forEach(carousel => {
            carouselObserver.observe(carousel);
        });
    }

});

