document.addEventListener('DOMContentLoaded', () => {
    const galleryButtons = document.querySelectorAll('.selector a');
    const galleries = document.querySelectorAll('[data-gallery]');

    galleryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            galleryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const targetGalleryId = button.dataset.galleryTarget;

            galleries.forEach(gallery => {
                if (gallery.id === targetGalleryId) {
                    gallery.hidden = false;
                } else {
                    gallery.hidden = true; 
                }
            });
        });
    });

    if (galleryButtons.length > 0) {
        galleryButtons[0].classList.add('active');
        const initialTargetGalleryId = galleryButtons[0].dataset.galleryTarget;
        galleries.forEach(gallery => {
            if (gallery.id === initialTargetGalleryId) {
                gallery.hidden = false;
            } else {
                gallery.hidden = true;
            }
        });
    }
});