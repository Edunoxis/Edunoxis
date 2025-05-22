window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('em2_theme') || 'dark';
    document.body.className = savedTheme + '-theme';
});

