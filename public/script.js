document.addEventListener('DOMContentLoaded', () => {
    const galleryButtons = document.querySelectorAll('.selector a');
    const galleries = document.querySelectorAll('[data-gallery]');
    const arrowLeft = document.querySelector('.left-arrow');
    const arrowRight = document.querySelector('.right-arrow');

    let currentGalleryElement = null; 
    let currentGalleryColumns = [];
    let activeGalleryId = '';
    let currentIndex = 0;

    const getColumnsPerView = () => {
        if (window.matchMedia('(max-width: 768px)').matches) { 
            return 2;
        }
        if (window.matchMedia('(max-width: 480px)').matches) {
            return 1;
        }
        return 3; 
    };

    const updateGalleryDisplay = () => {
        if (!currentGalleryElement) return;

        const columnsPerView = getColumnsPerView();
        const totalColumns = currentGalleryColumns.length;

        currentGalleryElement.style.transition = 'none';
        currentGalleryElement.style.transform = `translateX(0)`;

        currentGalleryElement.innerHTML = '';

        for (let i = 0; i < totalColumns; i++) {
            currentGalleryElement.appendChild(currentGalleryColumns[i]);
        }
    };

    const updateGalleryVisibility = (targetGalleryId) => {
        galleries.forEach(gallery => {
            if (gallery.id === targetGalleryId) {
                gallery.hidden = false;
                currentGalleryElement = gallery;
                currentGalleryColumns = Array.from(gallery.querySelectorAll('[data-gallery-column]'));
                currentIndex = 0;
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

        const columnsPerView = getColumnsPerView();
        const columnWidth = currentGalleryColumns[0].offsetWidth + (parseFloat(getComputedStyle(currentGalleryElement).gap));

        const firstColumn = currentGalleryColumns.shift();
        currentGalleryColumns.push(firstColumn);

        currentGalleryElement.style.transition = 'transform 0.5s ease-in-out';
        currentGalleryElement.style.transform = `translateX(-${columnWidth}px)`;

        currentGalleryElement.addEventListener('transitionend', function handler() {
            currentGalleryElement.style.transition = 'none';
            currentGalleryElement.style.transform = `translateX(0)`;
            currentGalleryElement.appendChild(firstColumn);
            currentGalleryElement.removeEventListener('transitionend', handler);
        }, { once: true });
    });

    arrowLeft.addEventListener('click', () => {
        if (!currentGalleryElement || currentGalleryColumns.length === 0) return;

        const columnsPerView = getColumnsPerView();
        const columnWidth = currentGalleryColumns[0].offsetWidth + (parseFloat(getComputedStyle(currentGalleryElement).gap));

        const lastColumn = currentGalleryColumns.pop();
        currentGalleryColumns.unshift(lastColumn);

        currentGalleryElement.prepend(lastColumn);

        currentGalleryElement.style.transition = 'none';
        currentGalleryElement.style.transform = `translateX(-${columnWidth}px)`;

        void currentGalleryElement.offsetWidth; 

        currentGalleryElement.style.transition = 'transform 0.5s ease-in-out';
        currentGalleryElement.style.transform = `translateX(0px)`;
    });

    window.addEventListener('resize', updateGalleryDisplay);
});