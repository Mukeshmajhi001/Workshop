// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    setupFilters();
    setupScrollToTop();
    setupLoadingStates();
});

// Global variables
let currentImageId = null;
let currentImageSrc = '';
let currentImageName = '';

// Initialize gallery
function initializeGallery() {
    // Add loading class to images
    const images = document.querySelectorAll('.photo');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.parentElement.parentElement.classList.remove('loading');
        });
        
        img.addEventListener('error', function() {
            this.parentElement.parentElement.classList.remove('loading');
            this.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
        });
        
        // Trigger load event if image is already cached
        if (img.complete) {
            img.dispatchEvent(new Event('load'));
        }
    });
}

// Download image function
function downloadImage(imageId, fileName) {
    const image = document.getElementById(imageId);
    if (!image) return;
    
    // Show downloading feedback
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    btn.disabled = true;
    
    // Create download link
    const link = document.createElement('a');
    link.href = image.src;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Reset button after delay
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1000);
    
    // Show success toast (optional)
    showToast(`Downloading ${fileName}...`);
}

// Fullscreen functions
function openFullscreen(imageId) {
    const image = document.getElementById(imageId);
    if (!image) return;
    
    const modal = document.getElementById('fullscreenModal');
    const modalImg = document.getElementById('fullscreenImage');
    const modalCaption = document.getElementById('modalCaption');
    
    // Get certificate name
    const container = image.closest('.photo-container');
    const certName = container.querySelector('.note-text').textContent;
    const badge = container.querySelector('.cert-badge').textContent;
    
    // Set modal content
    modal.style.display = 'block';
    modalImg.src = image.src;
    modalCaption.innerHTML = `<i class="fas fa-certificate"></i> ${certName} <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 0.2rem 0.8rem; border-radius: 50px; font-size: 0.8rem; margin-left: 0.5rem;">${badge}</span>`;
    
    // Store current image info for download
    currentImageId = imageId;
    currentImageSrc = image.src;
    currentImageName = certName.replace(/[^a-zA-Z0-9]/g, '_') + '.jpg';
    
    // Add keyboard support
    document.addEventListener('keydown', handleModalKeydown);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
    const modal = document.getElementById('fullscreenModal');
    modal.style.display = 'none';
    
    // Remove keyboard support
    document.removeEventListener('keydown', handleModalKeydown);
    
    // Restore body scrolling
    document.body.style.overflow = 'auto';
}

// Handle keyboard events for modal
function handleModalKeydown(e) {
    if (e.key === 'Escape') {
        closeFullscreen();
    } else if (e.key === 'ArrowLeft') {
        navigateFullscreen('prev');
    } else if (e.key === 'ArrowRight') {
        navigateFullscreen('next');
    }
}

// Navigate through images in fullscreen
function navigateFullscreen(direction) {
    const images = Array.from(document.querySelectorAll('.photo'));
    const currentIndex = images.findIndex(img => img.id === currentImageId);
    
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    } else {
        newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    }
    
    const newImage = images[newIndex];
    openFullscreen(newImage.id);
}

// Download image from modal
function downloadModalImage() {
    if (currentImageSrc && currentImageName) {
        const link = document.createElement('a');
        link.href = currentImageSrc;
        link.download = currentImageName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast(`Downloading ${currentImageName}...`);
    }
}

// Filter functionality
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.photo-container');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter items with animation
            items.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === category) {
                    // Show with animation
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    // Hide with animation
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update stats after filter
            updateFilteredStats(filterValue);
            
            // Show toast
            showToast(`Showing: ${filterValue === 'all' ? 'All Certificates' : filterValue}`);
        });
    });
}

// Update stats based on filter
function updateFilteredStats(filter) {
    const items = document.querySelectorAll('.photo-container');
    let count = 0;
    
    if (filter === 'all') {
        count = items.length;
    } else {
        items.forEach(item => {
            if (item.getAttribute('data-category') === filter) {
                count++;
            }
        });
    }
    
    // Update stat numbers temporarily
    const statNumber = document.querySelector('.stat-item:first-child .stat-number');
    const originalNumber = statNumber.textContent;
    
    statNumber.style.transition = 'all 0.3s ease';
    statNumber.style.transform = 'scale(1.2)';
    statNumber.textContent = count;
    
    setTimeout(() => {
        statNumber.style.transform = 'scale(1)';
    }, 200);
    
    setTimeout(() => {
        statNumber.textContent = originalNumber;
    }, 2000);
}

// Scroll to top functionality
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollBtn.style.display = 'block';
            scrollBtn.style.animation = 'fadeIn 0.3s ease';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Setup loading states
function setupLoadingStates() {
    const containers = document.querySelectorAll('.photo-container');
    containers.forEach(container => {
        container.classList.add('loading');
    });
}

// Toast notification system
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 1000;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        opacity: 0;
        transition: all 0.3s ease;
        font-family: 'Poppins', sans-serif;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
        toast.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2000);
}

// Image preloader
function preloadImages() {
    const images = document.querySelectorAll('.photo');
    const imageUrls = [];
    
    images.forEach(img => {
        imageUrls.push(img.src);
    });
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Call preloader
preloadImages();

// Add touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
    if (document.getElementById('fullscreenModal').style.display === 'block') {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left
        navigateFullscreen('next');
    } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right
        navigateFullscreen('prev');
    }
}

// Click outside modal to close
window.onclick = function(event) {
    const modal = document.getElementById('fullscreenModal');
    if (event.target === modal) {
        closeFullscreen();
    }
}

// Add keyboard shortcut for download (Ctrl+D)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'd' && document.getElementById('fullscreenModal').style.display === 'block') {
        e.preventDefault();
        downloadModalImage();
    }
});

// Add loading animation on filter buttons
const style = document.createElement('style');
style.textContent = `
    .toast-notification i {
        animation: spin 2s infinite linear;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .filter-btn:active {
        transform: scale(0.95);
    }
    
    .photo-container {
        transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .photo-container[style*="display: none"] {
        opacity: 0;
        transform: scale(0.8);
    }
`;
document.head.appendChild(style);