document.addEventListener('DOMContentLoaded', () => {
    const galleryButtons = document.querySelectorAll('.selector a');
    const galleries = document.querySelectorAll('[data-gallery]');
    const arrowLeft = document.querySelector('.left-arrow');
    const arrowRight = document.querySelector('.right-arrow');

    let currentGalleryElement = null;
    let currentGalleryColumns = [];
    let activeGalleryId = '';
    let columnsPerView = 3;

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

        currentGalleryElement.style.transition = 'none';
        currentGalleryElement.style.transform = `translateX(0)`;

        currentGalleryElement.innerHTML = '';

        for (let i = 0; i < currentGalleryColumns.length; i++) {
            currentGalleryElement.appendChild(currentGalleryColumns[i]);
        }
    };

    const updateGalleryVisibility = (targetGalleryId) => {
        galleries.forEach(gallery => {
            if (gallery.id === targetGalleryId) {
                gallery.hidden = false;
                currentGalleryElement = gallery;
                currentGalleryColumns = Array.from(gallery.querySelectorAll('[data-gallery-column]'));
                updateGalleryDisplay(); 
            } else {
                gallery.hidden = true;
            }
        });
    };

    galleryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            galleryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            activeGalleryId = button.dataset.galleryTarget;
            updateGalleryVisibility(activeGalleryId);
        });
    });

    if (galleryButtons.length > 0) {
        galleryButtons[0].classList.add('active');
        activeGalleryId = galleryButtons[0].dataset.galleryTarget;
        updateGalleryVisibility(activeGalleryId);
    }

    arrowRight.addEventListener('click', () => {
        if (!currentGalleryElement || currentGalleryColumns.length === 0) return;

        const gap = parseFloat(getComputedStyle(currentGalleryElement).gap);
        const columnWidth = currentGalleryColumns[0].offsetWidth; 
        const slideDistance = (columnWidth * columnsPerView) + (gap * (columnsPerView - 1));

        const columnsToMove = [];
        for (let i = 0; i < columnsPerView; i++) {
            if (currentGalleryColumns.length > 0) {
                columnsToMove.push(currentGalleryColumns.shift());
            }
        }

        currentGalleryElement.style.transition = 'transform 0.5s ease-in-out';
        currentGalleryElement.style.transform = `translateX(-${slideDistance}px)`;

        currentGalleryElement.addEventListener('transitionend', function handler() {
            currentGalleryElement.style.transition = 'none';
            currentGalleryElement.style.transform = `translateX(0)`;
            columnsToMove.forEach(col => currentGalleryColumns.push(col)); 
            updateGalleryDisplay(); 
            currentGalleryElement.removeEventListener('transitionend', handler);
        }, { once: true });
    });

    arrowLeft.addEventListener('click', () => {
        if (!currentGalleryElement || currentGalleryColumns.length === 0) return;

        const gap = parseFloat(getComputedStyle(currentGalleryElement).gap);
        const columnWidth = currentGalleryColumns[0].offsetWidth;
        const slideDistance = (columnWidth * columnsPerView) + (gap * (columnsPerView - 1));

        const columnsToMove = [];
        for (let i = 0; i < columnsPerView; i++) {
            if (currentGalleryColumns.length > 0) {
                columnsToMove.unshift(currentGalleryColumns.pop()); 
            }
        }
        currentGalleryColumns.unshift(...columnsToMove); 

        columnsToMove.reverse().forEach(col => currentGalleryElement.prepend(col));

        currentGalleryElement.style.transition = 'none';
        currentGalleryElement.style.transform = `translateX(-${slideDistance}px)`;

        void currentGalleryElement.offsetWidth;

        currentGalleryElement.style.transition = 'transform 0.5s ease-in-out';
        currentGalleryElement.style.transform = `translateX(0px)`;
    });

    window.addEventListener('resize', updateGalleryDisplay);
});