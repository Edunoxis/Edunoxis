// Theme Management Function
function loadTheme() {
    const savedTheme = localStorage.getItem('em2_theme') || 'dark';
    document.body.className = savedTheme + '-theme';
    
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.toggle('active', option.dataset.theme === savedTheme);
    });
}

function handleThemeChange(theme) {
    // Remove all theme classes
    document.body.classList.remove('dark-theme', 'light-theme', 'blue-theme');
    
    // Add the selected theme class
    document.body.classList.add(theme + '-theme');
    
    // Save to localStorage
    localStorage.setItem('em2_theme', theme);
}

// Setup theme event listeners
function setupThemeListeners() {
    const themeOptions = document.querySelectorAll('.theme-option');
    
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            handleThemeChange(option.dataset.theme);
        });
    });
}

// Initialize theme
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    setupThemeListeners();
    
    // Add scrolled class to header
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }
});
