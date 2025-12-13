
// Add this script before </body> tag

// Show loading animation immediately
document.addEventListener('DOMContentLoaded', function () {
    const loading = document.getElementById('loading');
    const body = document.body;

    // Add loading class to body
    body.classList.add('loading-active');

    // Wait for page to fully load
    window.addEventListener('load', function () {
        // Wait 1 second (for smoothness)
        setTimeout(function () {
            loading.classList.add('fade-out');
            body.classList.remove('loading-active');
            body.classList.add('loading-complete');

            // Remove loading screen completely after fade out
            setTimeout(function () {
                loading.style.display = 'none';
            }, 500); // Match the CSS transition time
        }, 1000); // 1 second minimum loading time
    });

    // Fallback - hide loading after 3 seconds even if page doesn't fully load
    setTimeout(function () {
        loading.classList.add('fade-out');
        body.classList.remove('loading-active');
        body.classList.add('loading-complete');

        setTimeout(function () {
            loading.style.display = 'none';
        }, 500);
    }, 3000); // 3 seconds maximum
});
