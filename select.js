
        // ===== Theme Management =====
        function loadTheme() {
            const savedTheme = localStorage.getItem('em2_theme') || 'dark';
            document.body.className = savedTheme + '-theme';
        }

        // Initialize the theme when page loads
        window.addEventListener('DOMContentLoaded', loadTheme);
