document.addEventListener('DOMContentLoaded', () => {
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

            if (isAnimating) return; 

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
        if (isAnimating || !currentGalleryElement || currentGalleryColumns.length === 0) return;
        isAnimating = true;

        const gap = parseFloat(getComputedStyle(currentGalleryElement).gap);
        const columnWidth = currentGalleryColumns[0].offsetWidth; 
        const slideDistance = (columnWidth * columnsPerView) + (gap * (columnsPerView > 1 ? (columnsPerView - 1) : 0));

        const columnsToAppend = [];
        for (let i = 0; i < columnsPerView; i++) {
            const nextIndex = (currentGalleryColumns.length + i) % currentGalleryColumns.length;
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

    window.addEventListener('resize', updateGalleryDisplay);
});