// Infinite Carousel Controller
document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.querySelector('.carousel-container');
    const carousel = document.querySelector('.carousel-track');

    if (!carousel || !carouselContainer) return;

    let isScrolling = false;
    let scrollTimeout;
    let isPaused = false;

    // Get all carousel items
    const items = Array.from(carousel.children);
    const itemCount = items.length / 2; // Half are duplicates

    // Clone all items again to ensure smooth infinite scroll
    items.forEach(item => {
        const clone = item.cloneNode(true);
        carousel.appendChild(clone);
    });

    // Calculate scroll positions
    function getScrollWidth() {
        return carousel.scrollWidth / 3; // Divided by 3 because we have 3 sets now
    }

    // Check and adjust scroll position for infinite effect
    function checkInfiniteScroll() {
        const scrollWidth = getScrollWidth();
        const currentScroll = carouselContainer.scrollLeft;
        const maxScroll = carousel.scrollWidth - carouselContainer.clientWidth;

        // If scrolled to the end, jump to the beginning of second set
        if (currentScroll >= scrollWidth * 2) {
            carouselContainer.scrollLeft = currentScroll - scrollWidth;
        }
        // If scrolled to the beginning, jump to the end of first set
        else if (currentScroll <= 0) {
            carouselContainer.scrollLeft = scrollWidth;
        }
    }

    // Initialize scroll position to middle (second set)
    setTimeout(() => {
        carouselContainer.scrollLeft = getScrollWidth();
    }, 100);

    // Monitor scroll events
    carouselContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checkInfiniteScroll, 50);
    });

    // Pause/Resume animation on hover
    carouselContainer.addEventListener('mouseenter', () => {
        isPaused = true;
        carousel.style.animationPlayState = 'paused';
    });

    carouselContainer.addEventListener('mouseleave', () => {
        isPaused = false;
        carousel.style.animationPlayState = 'running';
    });

    // Navigation buttons
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const scrollAmount = 300;
            carouselContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            const scrollAmount = 300;
            carouselContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }

    // Drag to scroll functionality
    let isDragging = false;
    let startX;
    let scrollLeft;
    let velocity = 0;
    let lastX = 0;
    let lastTime = Date.now();

    carouselContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        isPaused = true;
        carousel.style.animationPlayState = 'paused';
        carouselContainer.style.cursor = 'grabbing';
        carouselContainer.style.userSelect = 'none';

        startX = e.pageX - carouselContainer.offsetLeft;
        scrollLeft = carouselContainer.scrollLeft;
        lastX = e.pageX;
        lastTime = Date.now();
        velocity = 0;
    });

    carouselContainer.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            carouselContainer.style.cursor = 'grab';
            carouselContainer.style.userSelect = 'auto';
            applyMomentum();
        }
    });

    carouselContainer.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            carouselContainer.style.cursor = 'grab';
            carouselContainer.style.userSelect = 'auto';
            applyMomentum();
        }
        setTimeout(() => {
            if (!isDragging) {
                isPaused = false;
                carousel.style.animationPlayState = 'running';
            }
        }, 500);
    });

    carouselContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.pageX - carouselContainer.offsetLeft;
        const walk = (x - startX) * 1.5;
        carouselContainer.scrollLeft = scrollLeft - walk;

        // Calculate velocity for momentum
        const now = Date.now();
        const dt = now - lastTime;
        if (dt > 0) {
            velocity = (e.pageX - lastX) / dt;
        }
        lastX = e.pageX;
        lastTime = now;

        checkInfiniteScroll();
    });

    // Apply momentum scrolling after drag release
    function applyMomentum() {
        if (Math.abs(velocity) > 0.1) {
            const friction = 0.95;
            const scroll = velocity * 15;

            carouselContainer.scrollLeft -= scroll;
            velocity *= friction;

            requestAnimationFrame(applyMomentum);
        }
    }

    // Touch support for mobile
    let touchStartX = 0;
    let touchScrollLeft = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
        isPaused = true;
        carousel.style.animationPlayState = 'paused';
        touchStartX = e.touches[0].pageX - carouselContainer.offsetLeft;
        touchScrollLeft = carouselContainer.scrollLeft;
    });

    carouselContainer.addEventListener('touchend', () => {
        setTimeout(() => {
            isPaused = false;
            carousel.style.animationPlayState = 'running';
        }, 300);
    });

    carouselContainer.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - carouselContainer.offsetLeft;
        const walk = (x - touchStartX) * 1.5;
        carouselContainer.scrollLeft = touchScrollLeft - walk;
        checkInfiniteScroll();
    });

    // Auto-scroll with animation (alternative to CSS animation)
    let autoScrollInterval;

    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            if (!isPaused && !isDragging) {
                carouselContainer.scrollLeft += 1;
                checkInfiniteScroll();
            }
        }, 20);
    }

    // Disable CSS animation and use JS for better control
    carousel.style.animation = 'none';
    startAutoScroll();
});

// Modal functionality for certification details
const certificationData = {
    'ds298': {
        title: 'Certificado DS 298',
        subtitle: 'Cumplimiento Normativo Transporte Cargas Peligrosas',
        description: 'Certificación de cumplimiento del Decreto Supremo 298, que reglamenta el transporte de cargas peligrosas por calles y caminos en Chile.',
        details: [
            'Validez: 2025',
            'Cumplimiento: 100% artículos 3,4,5,7,10,12,13,14,16,20,20 Bis,29 y 30',
            'Vehículo certificado: Camión MITSUBISHI FUSO CANTER 715',
            'Capacidad: 4 toneladas',
            'Patente: SRJK-43'
        ],
        image: '/static/img/certificado_ds298.svg'
    },
    'sidrep': {
        title: 'SIDREP',
        subtitle: 'Sistema de Declaración y Seguimiento de Residuos Peligrosos',
        description: 'Registro oficial en el Sistema de Declaración y Seguimiento Electrónico de Residuos Peligrosos del Ministerio de Salud.',
        details: [
            'Sistema: Ventanilla Única RETC',
            'Autorización: Ministerio de Salud',
            'Tipo: Transporte de Residuos Peligrosos',
            'Estado: Vigente',
            'Alcance: Nacional'
        ],
        image: '/static/img/sidrep_certificado.svg'
    },
    'resolucion': {
        title: 'Resolución Sanitaria',
        subtitle: 'N° 2510389969',
        description: 'Autorización sanitaria otorgada por el Ministerio de Salud para el transporte de residuos peligrosos (RESPEL) y sustancias peligrosas.',
        details: [
            'Número: 2510389969',
            'Emisor: Ministerio de Salud (MINSAL)',
            'Tipo: Autorización Transporte RESPEL',
            'Estado: Vigente',
            'Alcance: Sustancias peligrosas y REAS'
        ],
        image: '/static/img/resolucion_sanitaria.svg'
    },
    'clase1': {
        title: 'Clase 1 - Explosivos',
        subtitle: 'NCh 2190',
        description: 'Pictograma para identificación de materiales explosivos según norma chilena NCh 2190.',
        details: [
            'Clase: 1 - Explosivos',
            'Color: Naranja',
            'Norma: NCh 2190.Of2003',
            'Divisiones: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6',
            'Riesgo: Explosión y proyección'
        ],
        image: '/static/img/clase1_explosivos.svg'
    },
    'clase2': {
        title: 'Clase 2 - Gases',
        subtitle: 'NCh 2190',
        description: 'Pictograma para identificación de gases inflamables según norma chilena NCh 2190.',
        details: [
            'Clase: 2 - Gases',
            'Color: Rojo',
            'Norma: NCh 2190.Of2003',
            'Divisiones: 2.1 Inflamables, 2.2 No inflamables, 2.3 Tóxicos',
            'Riesgo: Inflamabilidad, presión, toxicidad'
        ],
        image: '/static/img/clase2_gases.svg'
    },
    'clase3': {
        title: 'Clase 3 - Líquidos Inflamables',
        subtitle: 'NCh 2190',
        description: 'Pictograma para identificación de líquidos inflamables según norma chilena NCh 2190.',
        details: [
            'Clase: 3 - Líquidos Inflamables',
            'Color: Rojo',
            'Norma: NCh 2190.Of2003',
            'Ejemplos: Gasolina, alcohol, solventes',
            'Riesgo: Incendio y explosión'
        ],
        image: '/static/img/clase3_liquidos.svg'
    },
    'clase6': {
        title: 'Clase 6 - Tóxicos',
        subtitle: 'NCh 2190',
        description: 'Pictograma para identificación de sustancias tóxicas según norma chilena NCh 2190.',
        details: [
            'Clase: 6 - Sustancias Tóxicas',
            'Color: Blanco',
            'Norma: NCh 2190.Of2003',
            'Divisiones: 6.1 Tóxicos, 6.2 Infecciosos',
            'Riesgo: Envenenamiento, infección'
        ],
        image: '/static/img/clase6_toxicos.svg'
    },
    'clase6_infeccioso': {
        title: 'Clase 6.2 - Infeccioso',
        subtitle: 'NCh 2190',
        description: 'Pictograma para identificación de sustancias infecciosas según norma chilena NCh 2190. Incluye residuos hospitalarios (REAS) y materiales biológicos peligrosos.',
        details: [
            'Clase: 6.2 - Sustancias Infecciosas',
            'Color: Blanco',
            'Norma: NCh 2190.Of2003',
            'Símbolo: Riesgo biológico (Biohazard)',
            'Ejemplos: Residuos hospitalarios, muestras clínicas',
            'Riesgo: Infección por microorganismos patógenos'
        ],
        image: '/static/img/clase6_infeccioso.svg'
    },
    'clase8': {
        title: 'Clase 8 - Corrosivos',
        subtitle: 'NCh 2190',
        description: 'Pictograma para identificación de sustancias corrosivas según norma chilena NCh 2190.',
        details: [
            'Clase: 8 - Corrosivos',
            'Color: Blanco y Negro',
            'Norma: NCh 2190.Of2003',
            'Ejemplos: Ácidos, bases, baterías',
            'Riesgo: Quemaduras químicas'
        ],
        image: '/static/img/clase8_corrosivos.svg'
    },
    'clase9': {
        title: 'Clase 9 - Varios',
        subtitle: 'NCh 2190',
        description: 'Pictograma para identificación de sustancias peligrosas varias según norma chilena NCh 2190.',
        details: [
            'Clase: 9 - Sustancias Peligrosas Varias',
            'Color: Blanco con franjas negras',
            'Norma: NCh 2190.Of2003',
            'Ejemplos: Baterías de litio, materiales magnetizados',
            'Riesgo: Diversos'
        ],
        image: '/static/img/clase9_varios.svg'
    }
};

function openModal(certId) {
    const data = certificationData[certId];
    if (!data) {
        console.warn('No data found for:', certId);
        return;
    }

    const modal = document.getElementById('cert-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalDescription = document.getElementById('modal-description');
    const modalDetails = document.getElementById('modal-details');
    const modalImage = document.getElementById('modal-image');

    if (!modal) return;

    if (modalTitle) modalTitle.textContent = data.title;
    if (modalSubtitle) modalSubtitle.textContent = data.subtitle;
    if (modalDescription) modalDescription.textContent = data.description;

    // Set image
    if (modalImage && data.image) {
        modalImage.src = data.image;
        modalImage.alt = data.title;
    }

    // Build details as modern chips/tags
    if (modalDetails) {
        modalDetails.textContent = '';
        data.details.forEach(function(detail, index) {
            const chip = document.createElement('div');
            chip.className = 'detail-item inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium';
            chip.style.animationDelay = (index * 0.08) + 's';

            const icon = document.createElement('i');
            icon.className = 'fas fa-check-circle text-hazard text-xs';

            const text = document.createElement('span');
            text.textContent = detail;

            chip.appendChild(icon);
            chip.appendChild(text);
            modalDetails.appendChild(chip);
        });
    }

    // Show modal with animation
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Trigger animation after a tiny delay
    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            modal.classList.add('show');
        });
    });
}

function closeModal() {
    const modal = document.getElementById('cert-modal');
    if (!modal) return;

    // Remove show class to trigger close animation
    modal.classList.remove('show');

    // Wait for animation to finish before hiding
    setTimeout(function() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
