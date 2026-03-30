// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll('section');
    const sectionImages = document.querySelectorAll('.section-image');
    const fixedContainer = document.querySelector('.fixed-image-container');
    
    // Initialize - set the first section's image as active
    const firstSectionId = 'brand-essence';
    let currentSection = firstSectionId;
    let isTransitioning = false;
    
    // Make sure first image is visible on page load
    setActiveImage(firstSectionId);
    
    // Function to handle showing the correct image with a subtle fade
    function setActiveImage(sectionId) {
        // If we're already showing this section or in transition, do nothing
        if (currentSection === sectionId || isTransitioning) return;
        
        isTransitioning = true;
        
        // Special case for conclusion
        if (sectionId === 'conclusion') {
            fixedContainer.classList.add('conclusion-mode');
        } else {
            fixedContainer.classList.remove('conclusion-mode');
        }
        
        // Special case for projects section - hide first image (bglogo)
        if (sectionId === 'projects') {
            fixedContainer.classList.add('bglogo-hidden');
        } else if (sectionId === 'brand-essence') {
            fixedContainer.classList.remove('bglogo-hidden');
        }
        
        // Find the new target image
        const nextImage = document.querySelector(`.section-image[data-section="${sectionId}"]`);
        
        // First set the new image to active (it will start fading in)
        if (nextImage) {
            // Make sure the next image is on top
            nextImage.style.zIndex = '5';
            nextImage.classList.add('active');
            
            // For all other images, set to inactive after a short delay
            setTimeout(() => {
                sectionImages.forEach(img => {
                    if (img.dataset.section !== sectionId) {
                        img.classList.remove('active');
                        img.style.zIndex = '1';
                    }
                });
                
                isTransitioning = false;
            }, 250); // Match the transition time
        } else {
            isTransitioning = false;
        }
        
        // Update current section tracker
        currentSection = sectionId;
    }
    
    // Main scroll function to determine which section is active
    function updateActiveSection() {
        if (isTransitioning) return; // Skip if transitioning
        
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const viewportCenter = scrollPosition + (windowHeight / 2); // 50% of viewport height
        
        // Check for conclusion section (near bottom of page)
        if (scrollPosition + windowHeight >= documentHeight - 300) {
            if (currentSection !== 'conclusion') {
                setActiveImage('conclusion');
            }
            return;
        }
        
        // Check all sections to find which one is at the viewport center
        let closestSection = null;
        let closestDistance = Infinity;
        
        // Check all sections (except conclusion)
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            if (section.id === 'conclusion') continue;
            
            const sectionTop = section.offsetTop;
            const sectionMiddle = sectionTop + (section.offsetHeight / 2);
            
            // Calculate distance to viewport center (works for both up and down scrolling)
            const distance = Math.abs(viewportCenter - sectionTop);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = section.id;
            }
        }
        
        // If we found a closest section and it's different from current, update
        if (closestSection && closestSection !== currentSection) {
            setActiveImage(closestSection);
        }
    }
    
    // Handle scroll event with throttling to improve performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                scrollTimeout = null;
                updateActiveSection();
            }, 50); // Small delay to prevent too many calls
        }
    });
    
    // Handle resize event
    window.addEventListener('resize', function() {
        requestAnimationFrame(updateActiveSection);
    });
    
    // Initial check on page load
    updateActiveSection();
});
