document.addEventListener('DOMContentLoaded', () => {
    const galleryButtons = document.querySelectorAll('.selector a');
    const galleries = document.querySelectorAll('[data-gallery]');

    galleryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior

            // Remove active class from all buttons
            galleryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            const targetGalleryId = button.dataset.galleryTarget;

            galleries.forEach(gallery => {
                if (gallery.id === targetGalleryId) {
                    gallery.hidden = false; // Show the target gallery
                } else {
                    gallery.hidden = true; // Hide other galleries
                }
            });
        });
    });

    // Set the initial active state for the first button and show its gallery
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