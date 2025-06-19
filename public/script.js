document.addEventListener('DOMContentLoaded', () => {
    const burgerCheckbox = document.getElementById('burger-checkbox');
    if (burgerCheckbox) {
        const burgerMenuLinks = document.querySelectorAll('.burger__menu .links__item');
        burgerMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerCheckbox.checked = false;
            });
        });
    }

    if (document.querySelector('.pictures')) { 
        const galleryButtons = document.querySelectorAll('.selector a');
        const galleries = document.querySelectorAll('[data-gallery]');
        const arrowLeft = document.querySelector('.left-arrow');
        const arrowRight = document.querySelector('.right-arrow');

        let currentGalleryElement = null;
        let currentGalleryColumns = [];
        let activeGalleryId = '';
        let columnsPerView = 3;
        let isAnimating = false;

        const getColumnsPerView = () => {
            const width = window.innerWidth;
            if (width <= 480) {
                return 1;
            } else if (width <= 768) {
                return 2;
            }
            return 3;
        };

        const updateGalleryDisplay = () => {
            if (!currentGalleryElement) return;

            columnsPerView = getColumnsPerView();

            currentGalleryElement.innerHTML = '';
            currentGalleryColumns.forEach(col => currentGalleryElement.appendChild(col));

            currentGalleryElement.style.transition = 'none';
            currentGalleryElement.style.transform = `translateX(0)`;
        };

        const updateGalleryVisibility = (targetGalleryId) => {
            galleries.forEach(gallery => {
                if (gallery.id === targetGalleryId) {
                    gallery.hidden = false;
                    gallery.setAttribute('aria-selected', 'true');
                    currentGalleryElement = gallery;
                    currentGalleryColumns = Array.from(gallery.querySelectorAll('[data-gallery-column]'));
                    updateGalleryDisplay();
                } else {
                    gallery.hidden = true;
                    gallery.setAttribute('aria-selected', 'false');
                }
            });
        };

        galleryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                if (isAnimating) return;

                galleryButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');

                activeGalleryId = button.dataset.galleryTarget;
                updateGalleryVisibility(activeGalleryId);
            });
        });

        if (galleryButtons.length > 0) {
            galleryButtons[0].classList.add('active');
            galleryButtons[0].setAttribute('aria-selected', 'true');
            activeGalleryId = galleryButtons[0].dataset.galleryTarget;
            updateGalleryVisibility(activeGalleryId);
        }

        arrowRight.addEventListener('click', () => {
            if (isAnimating || !currentGalleryElement || currentGalleryColumns.length === 0) return;
            isAnimating = true;

            const gap = parseFloat(getComputedStyle(currentGalleryElement).gap);
            const columnWidth = currentGalleryColumns[0].offsetWidth;
            const slideDistance = (columnWidth * columnsPerView) + (gap * (columnsPerView > 1 ? (columnsPerView - 1) : 0));

            const columnsToAppend = [];
            for (let i = 0; i < columnsPerView; i++) {
                const nextIndex = (i) % currentGalleryColumns.length;
                columnsToAppend.push(currentGalleryColumns[nextIndex].cloneNode(true));
            }
            columnsToAppend.forEach(col => currentGalleryElement.appendChild(col));

            currentGalleryElement.style.transition = 'transform 0.5s ease-in-out';
            currentGalleryElement.style.transform = `translateX(-${slideDistance}px)`;

            currentGalleryElement.addEventListener('transitionend', function handler() {
                const shiftedColumns = currentGalleryColumns.splice(0, columnsPerView);
                currentGalleryColumns.push(...shiftedColumns);

                currentGalleryElement.style.transition = 'none';
                currentGalleryElement.style.transform = `translateX(0)`;
                updateGalleryDisplay();

                isAnimating = false;
                currentGalleryElement.removeEventListener('transitionend', handler);
            }, { once: true });
        });

        arrowLeft.addEventListener('click', () => {
            if (isAnimating || !currentGalleryElement || currentGalleryColumns.length === 0) return;
            isAnimating = true;

            const gap = parseFloat(getComputedStyle(currentGalleryElement).gap);
            const columnWidth = currentGalleryColumns[0].offsetWidth;
            const slideDistance = (columnWidth * columnsPerView) + (gap * (columnsPerView > 1 ? (columnsPerView - 1) : 0));

            const columnsToPrepend = [];
            for (let i = 0; i < columnsPerView; i++) {
                const prevIndex = (currentGalleryColumns.length - columnsPerView + i) % currentGalleryColumns.length;
                columnsToPrepend.push(currentGalleryColumns[prevIndex].cloneNode(true));
            }
            columnsToPrepend.reverse().forEach(col => currentGalleryElement.prepend(col));

            currentGalleryElement.style.transition = 'none';
            currentGalleryElement.style.transform = `translateX(-${slideDistance}px)`;

            void currentGalleryElement.offsetWidth;

            currentGalleryElement.style.transition = 'transform 0.5s ease-in-out';
            currentGalleryElement.style.transform = `translateX(0px)`;

            currentGalleryElement.addEventListener('transitionend', function handler() {
                for (let i = 0; i < columnsPerView; i++) {
                    currentGalleryElement.removeChild(currentGalleryElement.lastChild);
                }

                const shiftedColumns = currentGalleryColumns.splice(currentGalleryColumns.length - columnsPerView, columnsPerView);
                currentGalleryColumns.unshift(...shiftedColumns);

                currentGalleryElement.style.transition = 'none';
                currentGalleryElement.style.transform = `translateX(0)`;
                updateGalleryDisplay();

                isAnimating = false;
                currentGalleryElement.removeEventListener('transitionend', handler);
            }, { once: true });
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateGalleryDisplay();
            }, 250);
        });
    }

    if (document.querySelector('.calculator-section')) {
        const serviceTypeSelect = document.getElementById('service-type');
        const timelineSelect = document.getElementById('timeline');
        const calculateButton = document.getElementById('calculate-btn');
        const estimatedPriceDisplay = document.getElementById('estimated-price');

        const websiteSubCategoryGroup = document.getElementById('website-sub-category-group');
        const websiteSubCategorySelect = document.getElementById('website-sub-category');
        const seoSubCategoryGroup = document.getElementById('seo-sub-category-group');
        const seoSubCategorySelect = document.getElementById('seo-sub-category');

        const basePrices = {
            maintenance: 400, 
            website: {
                'business-card': 600, 
                'online-showcase': 1200, 
                'online-store': 2000, 
                'commercial-portal': 3500 
            },
            seo: {
                'basic-seo': 300, 
                'advanced-seo': 600, 
                'comprehensive-seo': 900 
            }
        };

        const timelineMultipliers = {
            standard: 1,
            express: 1.30, 
            urgent: 1.70  
        };

        const calculatePrice = () => {
            const selectedService = serviceTypeSelect.value;
            const selectedTimeline = timelineSelect.value;
            let basePrice = 0;

            if (selectedService === 'maintenance') {
                basePrice = basePrices.maintenance;
            } else if (selectedService === 'website') {
                const selectedWebsiteSubCategory = websiteSubCategorySelect.value;
                basePrice = basePrices.website[selectedWebsiteSubCategory];
            } else if (selectedService === 'seo') {
                const selectedSeoSubCategory = seoSubCategorySelect.value;
                basePrice = basePrices.seo[selectedSeoSubCategory];
            }

            const finalPrice = basePrice * timelineMultipliers[selectedTimeline];
            estimatedPriceDisplay.textContent = `$${finalPrice.toFixed(2)}`;
        };

        const updateSubCategoryVisibility = () => {
            const selectedService = serviceTypeSelect.value;

            websiteSubCategoryGroup.style.display = 'none';
            seoSubCategoryGroup.style.display = 'none';

            if (selectedService === 'website') {
                websiteSubCategoryGroup.style.display = 'flex';
            } else if (selectedService === 'seo') {
                seoSubCategoryGroup.style.display = 'flex';
            }
            calculatePrice(); 
        };

        serviceTypeSelect.addEventListener('change', updateSubCategoryVisibility);
        websiteSubCategorySelect.addEventListener('change', calculatePrice);
        seoSubCategorySelect.addEventListener('change', calculatePrice);
        timelineSelect.addEventListener('change', calculatePrice);
        calculateButton.addEventListener('click', calculatePrice);

        updateSubCategoryVisibility(); 
        calculatePrice(); 
    }
});