/**
 * Ultimate Speed Limited - Main JavaScript
 * Ambient Luxury EV Website
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initVehicleGrid();
    initStatsCounter();
    initContactForm();
});

// ================================================
// Navigation
// ================================================

function initNavigation() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

// ================================================
// Mobile Menu
// ================================================

function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    const closeBtn = document.getElementById('mobileMenuClose');
    const links = menu.querySelectorAll('a');

    if (!toggle || !menu) return;

    const openMenu = () => {
        menu.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        menu.classList.remove('active');
        document.body.style.overflow = '';
    };

    toggle.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    
    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ================================================
// Scroll Animations
// ================================================

function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    elements.forEach(el => observer.observe(el));
}

// ================================================
// Vehicle Grid
// ================================================

// ================================================
// Collapsible vehicle grid state (global for reuse)
// ================================================
let vehicleGrid, vehicleToggleWrapper, vehicleToggleBtn;
let vehicleIsExpanded = false;
let vehicleCurrentFilter = 'all';
const INITIAL_VISIBLE = 6;

function applyVehicleCollapsibleState() {
    if (!vehicleGrid) return;
    const cards = vehicleGrid.querySelectorAll('.vehicle-card');
    const total = cards.length;

    // Only apply collapsible logic when on a page with the toggle button
    if (vehicleToggleWrapper) {
        const showToggle = vehicleCurrentFilter === 'all' && total > INITIAL_VISIBLE;
        vehicleToggleWrapper.style.display = showToggle ? 'flex' : 'none';
    }

    cards.forEach((card, i) => {
        // Only apply collapsible hiding when toggle button exists (index.html)
        // On vehicles.html there is no toggle, so show all vehicles
        if (vehicleToggleWrapper && vehicleCurrentFilter === 'all' && !vehicleIsExpanded && i >= INITIAL_VISIBLE) {
            card.classList.add('hidden-initial');
        } else {
            card.classList.remove('hidden-initial');
        }
    });

    if (vehicleToggleBtn) {
        if (vehicleIsExpanded) {
            vehicleToggleBtn.classList.add('expanded');
        } else {
            vehicleToggleBtn.classList.remove('expanded');
        }
    }
}

function initVehicleGrid() {
    vehicleGrid = document.getElementById('vehicleGrid');
    vehicleToggleWrapper = document.getElementById('vehicleToggleWrapper');
    vehicleToggleBtn = document.getElementById('vehicleToggleBtn');
    if (!vehicleGrid) return;

    vehicleIsExpanded = false;
    vehicleCurrentFilter = 'all';

    // Sample vehicle data
    const vehicles = [
        {
            id: 'VEH-001',
            make: 'Toyota',
            model: 'bZ4X',
            year: 2023,
            price: 'HK$289,000',
            type: 'suv',
            specs: ['續航510km', '四驅', '全景天窗'],
            badge: 'NEW',
            image: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&q=80'
        },
        {
            id: 'VEH-002',
            make: 'Lexus',
            model: 'RZ',
            year: 2023,
            price: 'HK$425,000',
            type: 'suv',
            specs: ['續航450km', '雙馬達', 'Mark Levinson'],
            badge: null,
            image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80'
        },
        {
            id: 'VEH-003',
            make: 'Nissan',
            model: 'Ariya',
            year: 2023,
            price: 'HK$319,000',
            type: 'suv',
            specs: ['續航480km', 'e-4ORCE', 'ProPILOT'],
            badge: null,
            image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'
        },
        {
            id: 'VEH-004',
            make: 'Toyota',
            model: 'bZ4X',
            year: 2024,
            price: 'HK$315,000',
            type: 'sedan',
            specs: ['續航500km', '單摩打', 'XLE配置'],
            badge: 'NEW',
            image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'
        },
        {
            id: 'VEH-005',
            make: 'Tesla',
            model: 'Model Y',
            year: 2023,
            price: 'HK$339,000',
            type: 'suv',
            specs: ['續航430km', '自動駕駛', '15"顯示屏'],
            badge: null,
            image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'
        },
        {
            id: 'VEH-006',
            make: 'Hyundai',
            model: 'Ioniq 6',
            year: 2024,
            price: 'HK$299,000',
            type: 'sedan',
            specs: ['續航430km', '800V架構', '家用充電'],
            badge: null,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
        },
        {
            id: 'VEH-007',
            make: 'Tesla',
            model: 'Model X',
            year: 2023,
            price: 'HK$638,000',
            type: 'suv',
            specs: ['續航560km', '雙摩打四驅', 'Falcon Wing'],
            badge: 'NEW',
            image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'
        },
        {
            id: 'VEH-008',
            make: 'Mercedes-Benz',
            model: 'EQE SUV',
            year: 2024,
            price: 'HK$598,000',
            type: 'suv',
            specs: ['續航480km', 'AIR BODY CONTROL', 'MBUX'],
            badge: null,
            image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'
        },
        {
            id: 'VEH-009',
            make: 'Volkswagen',
            model: 'ID. Buzz',
            year: 2024,
            price: 'HK$419,000',
            type: 'mpv',
            specs: ['續航400km', '七座', '圓角復古'],
            badge: 'NEW',
            image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'
        },
        {
            id: 'VEH-010',
            make: 'Kia',
            model: 'EV9',
            year: 2024,
            price: 'HK$478,000',
            type: 'mpv',
            specs: ['續航540km', '六座旋轉', '三排SUV'],
            badge: null,
            image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'
        },
        {
            id: 'VEH-011',
            make: 'Maxus',
            model: 'eDeliver 9',
            year: 2024,
            price: 'HK$328,000',
            type: 'lightgv',
            specs: ['續航280km', '貨容量 6.5m³', '商用'],
            badge: null,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
        },
        {
            id: 'VEH-012',
            make: 'BYD',
            model: 'EA1',
            year: 2024,
            price: 'HK$198,000',
            type: 'lightgv',
            specs: ['續航320km', '四四方方', '入門電車'],
            badge: 'NEW',
            image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'
        }
    ];
    allVehicles = vehicles;

    // Render vehicles
    const renderVehicles = (filter = 'all') => {
        vehicleCurrentFilter = filter;
        vehicleIsExpanded = false;

        const filtered = filter === 'all'
            ? vehicles
            : vehicles.filter(v => {
                if (filter === 'lightgoods') return v.type === 'lightgv';
                return v.type === filter;
            });

        vehicleGrid.innerHTML = filtered.map((v, i) => `
            <div class="vehicle-card animate-on-scroll" data-id="${v.id}" style="transition-delay: ${i * 100}ms">
                <div class="vehicle-image">
                    <img src="${v.image}" alt="${v.make} ${v.model}" loading="lazy">
                    ${v.badge ? `<span class="vehicle-badge ${v.badge === 'SOLD' ? 'sold' : ''}">${v.badge}</span>` : ''}
                </div>
                <div class="vehicle-content">
                    <h3 class="vehicle-title">${v.year} ${v.make} ${v.model}</h3>
                    <div class="vehicle-price">${v.price}</div>
                    <div class="vehicle-specs">
                        ${v.specs.map(s => `<span class="vehicle-spec">${s}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        // Re-observe new elements for scroll animation
        const newElements = vehicleGrid.querySelectorAll('.animate-on-scroll');
        newElements.forEach(el => {
            el.classList.remove('visible');
            setTimeout(() => {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('visible');
                                observer.unobserve(entry.target);
                            }
                        });
                    },
                    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
                );
                observer.observe(el);
            }, 50);
        });

        // Apply collapsible state after cards are added
        applyVehicleCollapsibleState();

        // Attach click handlers
        vehicleGrid.querySelectorAll('.vehicle-card').forEach(card => {
            card.addEventListener('click', () => {
                const vehicle = allVehicles.find(v => v.id === card.dataset.id);
                if (vehicle) openVehicleModal(vehicle);
            });
        });
    };

    // Toggle button handler
    if (vehicleToggleBtn) {
        vehicleToggleBtn.addEventListener('click', () => {
            vehicleIsExpanded = !vehicleIsExpanded;
            applyVehicleCollapsibleState();
        });
    }

    // Filter buttons
    const filters = document.querySelector('.vehicle-filters');
    if (filters) {
        filters.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                filters.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                renderVehicles(e.target.dataset.filter);
            }
        });
    }

    // Initial render
    renderVehicles();
}

// ================================================
// Stats Counter Animation
// ================================================

function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;

    const animateCounter = (element) => {
        // Skip if already animated
        if (element.classList.contains('counted')) return;
        element.classList.add('counted');

        const target = parseInt(element.dataset.target);
        if (isNaN(target)) return;

        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(update);
    };

    // Check if element is in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    };

    // Animate immediately if already in viewport
    stats.forEach(stat => {
        if (isInViewport(stat) && !stat.classList.contains('counted')) {
            // Small delay for visual effect
            setTimeout(() => animateCounter(stat), 100);
        }
    });

    // Use IntersectionObserver for elements not yet in viewport
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    // Observe stat-number elements that haven't been counted yet
    stats.forEach(stat => {
        if (!stat.classList.contains('counted')) {
            observer.observe(stat);
        }
    });

    // Final fallback: force animate all remaining after 2 seconds
    setTimeout(() => {
        stats.forEach(stat => {
            if (!stat.classList.contains('counted')) {
                animateCounter(stat);
            }
        });
    }, 2000);
}

// ================================================
// Contact Form
// ================================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    
    const validateField = (input) => {
        const value = input.value.trim();
        const errorEl = document.getElementById(input.id + 'Error');
        let error = '';

        if (input.required && !value) {
            error = '此欄位為必填';
        } else if (input.type === 'email' && value && !isValidEmail(value)) {
            error = '請輸入有效的電郵地址';
        } else if (input.type === 'tel' && value && !isValidPhone(value)) {
            error = '請輸入有效的電話號碼';
        }

        if (error) {
            input.classList.add('error');
            input.classList.remove('valid');
        } else if (value) {
            input.classList.remove('error');
            input.classList.add('valid');
        } else {
            input.classList.remove('error', 'valid');
        }

        if (errorEl) errorEl.textContent = error;
        return !error;
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isValidPhone = (phone) => {
        return /^[\d\s\-\+]{8,}$/.test(phone);
    };

    // Real-time validation on blur
    form.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all required fields
        let isValid = true;
        form.querySelectorAll('.form-input[required]').forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Log form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            console.log('Form submitted:', data);

            // Show success message
            formSuccess.classList.add('show');
            form.reset();
            form.querySelectorAll('.form-input').forEach(input => {
                input.classList.remove('valid', 'error');
            });

            // Hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.classList.remove('show');
            }, 5000);

        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// ================================================
// Smooth Scroll for Navigation Links
// ================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ================================================
// Firebase Vehicle Data (loaded from Firestore)
// ================================================

let vehiclesData = [];
let currentVehicle = null;
let currentGalleryIndex = 0;
let selectedDate = null;
let selectedTime = null;
let selectedColleague = null;
let colleagues = [];

// Load vehicles from Firestore
async function loadVehiclesFromFirestore() {
    const grid = document.getElementById('vehicleGrid');
    if (!grid) return;

    try {
        const snapshot = await db.collection('vehicles')
            .where('active', '==', true)
            .orderBy('createdAt', 'desc')
            .get();

        vehiclesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // If no vehicles in Firestore, use sample data
        if (vehiclesData.length === 0) {
            console.log('No vehicles in Firestore, using sample data');
            vehiclesData = getSampleVehicles();
        }

        renderVehicleGrid(vehiclesData);
    } catch (error) {
        console.error('Error loading vehicles:', error);
        vehiclesData = getSampleVehicles();
        renderVehicleGrid(vehiclesData);
    }
}

function getSampleVehicles() {
    return [
        {
            id: 'VEH-001',
            make: 'Toyota',
            model: 'bZ4X',
            year: 2023,
            price: 'HK$289,000',
            type: 'suv',
            specs: ['續航510km', '四驅', '全景天窗'],
            badge: 'NEW',
            images: ['https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&q=80'],
            status: 'new',
            description: 'Toyota bZ4X 是品牌首款全新電動 SUV，採用 e-TNGA 平台打造，續航力達 510km，標配四驅系統及全景天窗。'
        },
        {
            id: 'VEH-002',
            make: 'Lexus',
            model: 'RZ',
            year: 2023,
            price: 'HK$425,000',
            type: 'suv',
            specs: ['續航450km', '雙馬達', 'Mark Levinson'],
            badge: null,
            images: ['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80'],
            status: 'available',
            description: 'Lexus RZ 是品牌首款純電動 SUV，搭載雙摩打電動四驅系統，配备顶级 Mark Levinson 音響。'
        },
        {
            id: 'VEH-003',
            make: 'Nissan',
            model: 'Ariya',
            year: 2023,
            price: 'HK$319,000',
            type: 'suv',
            specs: ['續航480km', 'e-4ORCE', 'ProPILOT'],
            badge: null,
            images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'],
            status: 'available',
            description: 'Nissan Ariya 結合時尚轎跑車設計與實用 SUV 空間，e-4ORCE 四驅技術提供卓越穩定性。'
        },
        {
            id: 'VEH-004',
            make: 'Toyota',
            model: 'bZ4X',
            year: 2024,
            price: 'HK$315,000',
            type: 'sedan',
            specs: ['續航500km', '單摩打', 'XLE配置'],
            badge: 'NEW',
            images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'],
            status: 'new',
            description: '2024 年新版 Toyota bZ4X，續航力提升至 500km，單摩打前驅設定，XLE 高配版本。'
        },
        {
            id: 'VEH-005',
            make: 'Mazda',
            model: 'MX-30',
            year: 2023,
            price: 'HK$265,000',
            type: 'sedan',
            specs: ['續航256km', '對開門', 'eco內飾'],
            badge: null,
            images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'],
            status: 'available',
            description: 'Mazda MX-30 採用獨特的對開式車門設計，eco 環保內飾物料，續航 256km。'
        },
        {
            id: 'VEH-006',
            make: 'Subaru',
            model: 'Solterra',
            year: 2023,
            price: 'HK$359,000',
            type: 'suv',
            specs: ['續航465km', '四驅', 'X-MODE'],
            badge: null,
            images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
            status: 'available',
            description: 'Subaru Solterra 與 Toyota 共同開發，標配 X-MODE 越野模式及四驅系統。'
        },
        {
            id: 'VEH-007',
            make: 'Tesla',
            model: 'Model X',
            year: 2023,
            price: 'HK$638,000',
            type: 'suv',
            specs: ['續航560km', '雙摩打四驅', 'Falcon Wing'],
            badge: 'NEW',
            images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'],
            status: 'new',
            description: 'Tesla Model X 標配 Falcon Wing 車門，續航 560km，雙摩打四驅，鷹翼門設計極具未來感。'
        },
        {
            id: 'VEH-008',
            make: 'Mercedes',
            model: 'EQE SUV',
            year: 2024,
            price: 'HK$598,000',
            type: 'suv',
            specs: ['續航480km', 'AIR BODY CONTROL', 'MBUX'],
            badge: null,
            images: ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'],
            status: 'available',
            description: 'Mercedes-Benz EQE SUV 採用純電 EVA2 平台，AIR BODY CONTROL 氣壓懸掛，MBUX Hyperscreen 大面積屏幕。'
        },
        {
            id: 'VEH-009',
            make: 'Volkswagen',
            model: 'ID. Buzz',
            year: 2024,
            price: 'HK$419,000',
            type: 'mpv',
            specs: ['續航400km', '七座', '圓角復古'],
            badge: 'NEW',
            images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'],
            status: 'new',
            description: 'Volkswagen ID. Buzz 致敬經典 Microbus，方正車廂空間寬敞，七座佈局，續航 400km，適合家庭或商業用途。'
        },
        {
            id: 'VEH-010',
            make: 'Kia',
            model: 'EV9',
            year: 2024,
            price: 'HK$478,000',
            type: 'mpv',
            specs: ['續航540km', '六座旋轉', '三排SUV'],
            badge: null,
            images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'],
            status: 'available',
            description: 'Kia EV9 是品牌旗艦純電 SUV，六座佈局，第二排座椅可旋轉，續航 540km，適合大家庭。'
        },
        {
            id: 'VEH-011',
            make: 'Maxus',
            model: 'eDeliver 9',
            year: 2024,
            price: 'HK$328,000',
            type: 'lightgv',
            specs: ['續航280km', '貨容量 6.5m³', '商用'],
            badge: null,
            images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
            status: 'available',
            description: 'Maxus eDeliver 9 是純電動輕型客貨車，載貨容量達 6.5 立方米，續航 280km，適合物流或送貨用途。'
        },
        {
            id: 'VEH-012',
            make: 'BYD',
            model: 'EA1',
            year: 2024,
            price: 'HK$198,000',
            type: 'lightgv',
            specs: ['續航320km', '四四方方', '入門電車'],
            badge: 'NEW',
            images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'],
            status: 'new',
            description: '比亞迪 EA1 定位入門純電車，續航 320km，小巧實用，適合城市通勤或商業配送。'
        }
    ];
}

// Search functionality
const searchInput = document.getElementById('vehicleSearchInput');
const clearBtn = document.getElementById('searchClearBtn');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        clearBtn.style.display = query ? 'flex' : 'none';
        filterBySearch(query);
    });
}
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        filterBySearch('');
    });
}

function filterBySearch(query) {
    const cards = document.querySelectorAll('#vehicleGrid .vehicle-card');
    let visibleCount = 0;
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const match = !query || text.includes(query);
        card.style.display = match ? '' : 'none';
        if (match) visibleCount++;
    });
    // Hide toggle when searching
    const toggleWrapper = document.getElementById('vehicleToggleWrapper');
    if (toggleWrapper) {
        toggleWrapper.style.display = query ? 'none' : '';
    }
    // Show no results message
    let noResults = document.getElementById('searchNoResults');
    if (visibleCount === 0 && query) {
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.id = 'searchNoResults';
            noResults.className = 'search-no-results';
            noResults.textContent = '未找到符合的車款，請嘗試其他關鍵字';
            document.getElementById('vehicleGrid').after(noResults);
        }
        noResults.style.display = '';
    } else if (noResults) {
        noResults.style.display = 'none';
    }
}

function renderVehicleGrid(vehicles) {
    const grid = document.getElementById('vehicleGrid');
    if (!grid) return;

    // Clear search
    const searchInput = document.getElementById('vehicleSearchInput');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('searchClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';
    const noResults = document.getElementById('searchNoResults');
    if (noResults) noResults.style.display = 'none';

    // Auto-badge: vehicles listed within 7 days show "NEW"
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const vehiclesWithBadge = vehicles.map(v => {
        let badge = v.badge;
        if (!badge && v.listedAt) {
            const listedDate = new Date(v.listedAt).getTime();
            if (!isNaN(listedDate) && listedDate >= sevenDaysAgo) {
                badge = 'NEW';
            }
        }
        return { ...v, badge };
    });

    grid.innerHTML = vehiclesWithBadge.map((v, i) => `
        <div class="vehicle-card animate-on-scroll" data-id="${v.id}" data-type="${v.type || ''}" style="transition-delay: ${i * 100}ms">
            <div class="vehicle-image">
                <img src="${v.images?.[0] || v.image || ''}" alt="${v.make} ${v.model}" loading="lazy">
                ${v.badge ? `<span class="vehicle-badge ${v.status === 'sold' ? 'sold' : ''}">${v.badge}</span>` : ''}
            </div>
            <div class="vehicle-content">
                <h3 class="vehicle-title">${v.year} ${v.make} ${v.model}</h3>
                <div class="vehicle-price">${v.price}</div>
                <div class="vehicle-specs">
                    ${(v.specs || []).map(s => `<span class="vehicle-spec">${s}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');

    // Attach click handlers
    grid.querySelectorAll('.vehicle-card').forEach(card => {
        card.addEventListener('click', () => {
            const vehicle = vehiclesData.find(v => v.id === card.dataset.id);
            if (vehicle) openVehicleModal(vehicle);
        });
    });

    // Re-observe for scroll animation
    initScrollAnimations();

    // Apply collapsible state after rendering
    applyVehicleCollapsibleState();
}

// ================================================
// Vehicle Detail Modal
// ================================================

function openVehicleModal(vehicle) {
    currentVehicle = vehicle;
    currentGalleryIndex = 0;

    // Set badge
    const badgeEl = document.getElementById('vehicleBadge');
    badgeEl.textContent = vehicle.badge || (vehicle.status === 'available' ? 'AVAILABLE' : vehicle.status?.toUpperCase() || '');
    badgeEl.className = 'vehicle-detail-badge ' + (vehicle.status === 'sold' ? 'sold' : vehicle.status === 'available' ? 'available' : '');

    // Set title and price
    document.getElementById('vehicleTitle').textContent = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    document.getElementById('vehiclePrice').textContent = vehicle.price;

    // Set specs
    const specsEl = document.getElementById('vehicleSpecs');
    specsEl.innerHTML = (vehicle.specs || []).map(s => `<span class="vehicle-spec-tag">${s}</span>`).join('');

    // Set description
    document.getElementById('vehicleDescription').textContent = vehicle.description || '';

    // Initialize gallery
    initGallery(vehicle.images || [vehicle.image]);

    // Show modal
    document.getElementById('vehicleModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function initGallery(images) {
    const mainImage = document.getElementById('galleryMainImage');
    const thumbnails = document.getElementById('galleryThumbnails');

    mainImage.src = images[0] || '';

    thumbnails.innerHTML = images.map((img, i) => `
        <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
            <img src="${img}" alt="Thumbnail ${i + 1}">
        </div>
    `).join('');

    thumbnails.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            currentGalleryIndex = parseInt(thumb.dataset.index);
            mainImage.src = images[currentGalleryIndex];
            thumbnails.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
}

function navigateGallery(direction) {
    if (!currentVehicle) return;
    const images = currentVehicle.images || [currentVehicle.image];
    currentGalleryIndex = (currentGalleryIndex + direction + images.length) % images.length;

    document.getElementById('galleryMainImage').src = images[currentGalleryIndex];
    document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
        t.classList.toggle('active', i === currentGalleryIndex);
    });
}

function closeVehicleModal() {
    document.getElementById('vehicleModal').classList.remove('active');
    document.body.style.overflow = '';
    currentVehicle = null;
}

// ================================================
// Booking Modal
// ================================================

async function openBookingModal() {
    if (!currentVehicle) return;

    document.getElementById('bookingVehicleName').textContent = `${currentVehicle.year} ${currentVehicle.make} ${currentVehicle.model}`;

    // Set vehicle image in booking modal
    const vehicleImg = currentVehicle.images?.[0] || currentVehicle.image || '';
    const imgEl = document.getElementById('bookingVehicleImage');
    imgEl.src = vehicleImg;
    imgEl.style.display = vehicleImg ? 'block' : 'none';

    // Populate vehicle card info
    document.getElementById('bookingVehicleCardName').textContent = `${currentVehicle.year} ${currentVehicle.make} ${currentVehicle.model}`;
    document.getElementById('bookingVehiclePrice').textContent = currentVehicle.price || '';

    const specsEl = document.getElementById('bookingVehicleSpecs');
    const specs = currentVehicle.specs || [];
    specsEl.innerHTML = specs.map(s => `<span class="vehicle-spec">${s}</span>`).join('');

    const descEl = document.getElementById('bookingVehicleDesc');
    const desc = currentVehicle.description || '';
    descEl.textContent = desc;
    descEl.style.display = desc ? 'block' : 'none';

    // Reset selections
    selectedDate = null;
    selectedTime = null;

    // Render date grid (next 14 days, skip Sundays)
    renderDateGrid();

    // Render time slots
    renderTimeSlots();

    // Clear form
    document.getElementById('clientName').value = '';
    document.getElementById('clientPhone').value = '';

    // Update submit button
    updateBookingSubmitState();

    // Switch modal
    document.getElementById('vehicleModal').classList.remove('active');
    document.getElementById('bookingModal').classList.add('active');
}

async function loadColleagues() {
    const colleagueList = document.getElementById('colleagueList');
    colleagueList.innerHTML = '<div style="color: var(--muted)">載入中...</div>';

    try {
        const doc = await db.collection('config').doc('colleagues').get();
        if (doc.exists && doc.data().list) {
            colleagues = doc.data().list;
        } else {
            // Default colleagues
            colleagues = [
                { name: 'Sunny', phone: '85256781234' },
                { name: 'KL', phone: '85256781235' }
            ];
        }
    } catch (error) {
        console.error('Error loading colleagues:', error);
        colleagues = [
            { name: 'Sunny', phone: '85256781234' },
            { name: 'KL', phone: '85256781235' }
        ];
    }

    colleagueList.innerHTML = colleagues.map((c, i) => `
        <div class="colleague-item" data-index="${i}">
            <div class="colleague-avatar">${c.name.charAt(0)}</div>
            <div class="colleague-info">
                <div class="colleague-name">${c.name}</div>
                <div class="colleague-phone">${c.phone}</div>
            </div>
            <div class="colleague-check"></div>
        </div>
    `).join('');

    colleagueList.querySelectorAll('.colleague-item').forEach(item => {
        item.addEventListener('click', () => {
            colleagueList.querySelectorAll('.colleague-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            selectedColleague = colleagues[parseInt(item.dataset.index)];
            updateBookingSubmitState();
        });
    });
}

function renderDateGrid() {
    const grid = document.getElementById('dateGrid');
    const days = [];
    const today = new Date();

    // Collect 4 weeks of available dates (skip Sundays)
    let daysAdded = 0;
    const targetDays = 28; // 4 weeks
    for (let i = 0; i < 60 && daysAdded < targetDays; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        // Skip Sundays
        if (date.getDay() === 0) continue;

        days.push(date);
        daysAdded++;
    }

    grid.innerHTML = days.map((date, idx) => {
        const dayName = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
        const dayNum = date.getDate();
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        const isToday = idx === 0;

        return `
            <div class="date-cell${isToday ? ' today' : ''}" data-date="${dateStr}">
                <span class="date-day-name">${dayName}</span>
                <span class="date-day-num">${dayNum}</span>
            </div>
        `;
    }).join('');

    grid.querySelectorAll('.date-cell').forEach(cell => {
        cell.addEventListener('click', () => {
            grid.querySelectorAll('.date-cell').forEach(c => c.classList.remove('selected'));
            cell.classList.add('selected');
            selectedDate = cell.dataset.date;
            updateBookingSubmitState();
        });
    });
}

function renderTimeSlots() {
    const container = document.getElementById('timeSlots');
    const times = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

    container.innerHTML = times.map(time => `
        <div class="time-slot" data-time="${time}">${time}</div>
    `).join('');

    container.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', () => {
            container.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            selectedTime = slot.dataset.time;
            updateBookingSubmitState();
        });
    });
}

function updateBookingSubmitState() {
    const btn = document.getElementById('confirmBooking');
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();

    const isValid = selectedDate && selectedTime && name && phone;
    btn.disabled = !isValid;
}

function confirmBooking() {
    if (!selectedDate || !selectedTime) return;

    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const vehicleName = `${currentVehicle.year} ${currentVehicle.make} ${currentVehicle.model}`;

    const message = `您好，我想要預約睇車。%0A%0A` +
        `📅 日期：${selectedDate}%0A` +
        `⏰ 時間：${selectedTime}%0A` +
        `🚗 車型：${vehicleName}%0A` +
        `👤 姓名：${name}%0A` +
        `📞 電話：${phone}`;

    const whatsappUrl = `https://wa.me/85256781234?text=${message}`;

    window.open(whatsappUrl, '_blank');

    // Close booking modal
    document.getElementById('bookingModal').classList.remove('active');
    document.body.style.overflow = '';
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
    document.body.style.overflow = '';
}

// ================================================
// Initialize Modal Event Listeners
// ================================================

function initModals() {
    // Vehicle modal close
    document.getElementById('vehicleModalClose')?.addEventListener('click', closeVehicleModal);
    document.getElementById('openBookingModal')?.addEventListener('click', openBookingModal);

    // Gallery navigation
    document.getElementById('galleryPrev')?.addEventListener('click', () => navigateGallery(-1));
    document.getElementById('galleryNext')?.addEventListener('click', () => navigateGallery(1));

    // Booking modal close
    document.getElementById('bookingModalClose')?.addEventListener('click', closeBookingModal);
    document.getElementById('confirmBooking')?.addEventListener('click', confirmBooking);

    // Form validation
    document.getElementById('clientName')?.addEventListener('input', updateBookingSubmitState);
    document.getElementById('clientPhone')?.addEventListener('input', updateBookingSubmitState);

    // Close on overlay click
    document.getElementById('vehicleModal')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) closeVehicleModal();
    });
    document.getElementById('bookingModal')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) closeBookingModal();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (document.getElementById('bookingModal')?.classList.contains('active')) {
                closeBookingModal();
            } else if (document.getElementById('vehicleModal')?.classList.contains('active')) {
                closeVehicleModal();
            }
        }
    });

    // Replace initVehicleGrid with Firestore loading
    const originalInit = window.initVehicleGrid;
    window.initVehicleGrid = () => {
        loadVehiclesFromFirestore();
    };
}

// ================================================
// Update DOMContentLoaded
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initModals();
    initVehicleGrid();
    initStatsCounter();
    initContactForm();
    initPWABanner();
    initFBSharePrompt();

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    }
});

// ================================================
// PWA Install Overlay Modal
// ================================================
function initPWABanner() {
    const overlay = document.getElementById('pwaOverlay');
    const closeBtn = document.getElementById('pwaModalClose');
    const stepsEl = document.getElementById('pwaModalSteps');
    if (!overlay || !closeBtn) return;

    // Check if already dismissed
    if (sessionStorage.getItem('pwaBannerDismissed')) return;

    // Detect iOS/Android
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    // If already in PWA mode, skip entirely
    if (isStandalone) return;

    // Build steps based on platform
    if (isIOS) {
        stepsEl.innerHTML = `
            <div class="pwa-modal-step">
                <div class="pwa-modal-step-num">1</div>
                <div class="pwa-modal-step-text">點擊底部 <strong>分享按鈕</strong>（右下角）</div>
            </div>
            <div class="pwa-modal-step">
                <div class="pwa-modal-step-num">2</div>
                <div class="pwa-modal-step-text">向下滾動，點擊 <strong>「加入主畫面」</strong></div>
            </div>
            <div class="pwa-modal-step">
                <div class="pwa-modal-step-num">3</div>
                <div class="pwa-modal-step-text">點擊右上角 <strong>「加入」</strong> 完成</div>
            </div>`;
    } else if (isAndroid) {
        stepsEl.innerHTML = `
            <div class="pwa-modal-step">
                <div class="pwa-modal-step-num android">⋮</div>
                <div class="pwa-modal-step-text">點擊右上角 <strong>選單</strong></div>
            </div>
            <div class="pwa-modal-step">
                <div class="pwa-modal-step-num android">✓</div>
                <div class="pwa-modal-step-text">點擊 <strong>「加入主畫面」</strong></div>
            </div>`;
    } else {
        stepsEl.innerHTML = `
            <div class="pwa-modal-step">
                <div class="pwa-modal-step-num">1</div>
                <div class="pwa-modal-step-text">按 <strong>Ctrl+D</strong> (Windows) 或 <strong>Cmd+D</strong> (Mac) 加入書籤</div>
            </div>
            <div class="pwa-modal-step">
                <div class="pwa-modal-step-num">2</div>
                <div class="pwa-modal-step-text">在書籤列拖放到桌面捷徑</div>
            </div>`;
    }

    // Show overlay after short delay
    setTimeout(() => {
        overlay.classList.add('show');
        document.getElementById('pwaCornerArrow').classList.add('visible');
    }, 2000);

    // Close on button click
    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('show');
        document.getElementById('pwaCornerArrow').classList.remove('visible');
        sessionStorage.setItem('pwaBannerDismissed', '1');
    });

    // Close on backdrop click
    overlay.querySelector('.pwa-overlay-backdrop').addEventListener('click', () => {
        overlay.classList.remove('show');
        document.getElementById('pwaCornerArrow').classList.remove('visible');
        sessionStorage.setItem('pwaBannerDismissed', '1');
    });
}

// ================================================
// Facebook Share Prompt
// ================================================
function initFBSharePrompt() {
    const prompt = document.getElementById('fbSharePrompt');
    const shareBtn = document.getElementById('fbShareBtn');
    const closeBtn = document.getElementById('fbShareClose');
    if (!prompt || !shareBtn || !closeBtn) return;

    // Check OG tags exist
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');

    // Show prompt after delay if OG tags missing
    setTimeout(() => {
        if (!ogImage || !ogTitle) {
            prompt.classList.add('show');
        }
    }, 5000);

    // Dismiss on close
    closeBtn.addEventListener('click', () => {
        prompt.classList.remove('show');
        sessionStorage.setItem('fbPromptDismissed', '1');
    });

    // Share button
    shareBtn.addEventListener('click', () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    });
}
