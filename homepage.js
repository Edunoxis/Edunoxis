
        // ===== DOM Elements =====
        const body = document.getElementById('body');
        const nav = document.querySelector('nav');
        const startBtn = document.getElementById('startBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const closeSettingsBtn = document.getElementById('closeSettingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const signInBtn = document.getElementById('signInBtn');
        const signUpBtn = document.getElementById('signUpBtn');
        const signUpModal = document.getElementById('signUpModal');
        const signInModal = document.getElementById('signInModal');
        const closeSignUpBtn = document.getElementById('closeSignUpBtn');
        const closeSignInBtn = document.getElementById('closeSignInBtn');
        const backToSettingsBtn = document.getElementById('backToSettingsBtn');
        const backFromSignInBtn = document.getElementById('backFromSignInBtn');
        const goToSignInBtn = document.getElementById('goToSignInBtn');
        const goToSignUpBtn = document.getElementById('goToSignUpBtn');
        const themeOptions = document.querySelectorAll('.theme-option');
        const notification = document.getElementById('notification');
        const notificationIcon = document.getElementById('notificationIcon');
        const notificationMessage = document.getElementById('notificationMessage');

        // ===== State Management =====
        let users = JSON.parse(localStorage.getItem('em2_users')) || [];
        let currentUser = JSON.parse(localStorage.getItem('em2_currentUser')) || null;
        let notificationTimeout;

        // ===== Initialization =====
        function initApp() {
            loadTheme();
            initUI();
            setupEventListeners();
        }

        // ===== Theme Management =====
        function loadTheme() {
            const savedTheme = localStorage.getItem('em2_theme') || 'dark';
            body.className = savedTheme + '-theme';
            
            document.querySelectorAll('.theme-option').forEach(option => {
                option.classList.toggle('active', option.dataset.theme === savedTheme);
            });
        }

        // ===== UI Functions =====
        function initUI() {
            if (currentUser) {
                settingsBtn.textContent = currentUser.fullName.split(' ')[0];
            }
        }

        function showNotification(message, type = 'success') {
            // Clear any existing timeout
            clearTimeout(notificationTimeout);
            
            // Set notification content
            notificationMessage.textContent = message;
            notification.className = `notification ${type}`;
            
            // Set appropriate icon
            switch(type) {
                case 'success':
                    notificationIcon.textContent = '✓';
                    break;
                case 'error':
                    notificationIcon.textContent = '✕';
                    break;
                case 'warning':
                    notificationIcon.textContent = '⚠';
                    break;
            }
            
            // Show notification
            notification.classList.add('show');
            
            // Auto-hide after 3 seconds
            notificationTimeout = setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // ===== Modal Management =====
        function toggleModal(modal, show) {
            if (show) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }

        // ===== Form Validation =====
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        }

        function validatePassword(password) {
            return password.length >= 8;
        }

        // ===== User Authentication =====
        function registerUser(fullName, email, password) {
            // Validate inputs
            if (!fullName || !email || !password) {
                showNotification('All fields are required', 'error');
                return false;
            }
            
            if (!validateEmail(email)) {
                showNotification('Please enter a valid email', 'error');
                return false;
            }
            
            if (!validatePassword(password)) {
                showNotification('Password must be at least 8 characters', 'error');
                return false;
            }
            
            // Check if user exists
            if (users.some(user => user.email === email)) {
                showNotification('User already exists', 'error');
                return false;
            }
            
            // Create new user
            const newUser = { 
                id: Date.now().toString(),
                fullName, 
                email, 
                password,
                createdAt: new Date().toISOString()
            };
            
            // Save user
            users.push(newUser);
            localStorage.setItem('em2_users', JSON.stringify(users));
            
            // Auto login
            loginUser(newUser);
            
            return true;
        }

        function loginUser(user) {
            currentUser = user;
            localStorage.setItem('em2_currentUser', JSON.stringify(currentUser));
            initUI();
            showNotification('Welcome back, ' + user.fullName.split(' ')[0] + '!');
        }

        function logoutUser() {
            currentUser = null;
            localStorage.removeItem('em2_currentUser');
            initUI();
        }

        // ===== Event Handlers =====
        function handleSignUp(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            // Register user
            if (registerUser(fullName, email, password)) {
                toggleModal(signUpModal, false);
                document.getElementById('signUpForm').reset();
            }
        }

        function handleSignIn(e) {
            e.preventDefault();
            
            const email = document.getElementById('signInEmail').value.trim().toLowerCase();
            const password = document.getElementById('signInPassword').value;
            
            // Find user
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                loginUser(user);
                toggleModal(signInModal, false);
                document.getElementById('signInForm').reset();
            } else {
                showNotification('Invalid email or password', 'error');
            }
        }

        function handleThemeChange(theme) {
            // Remove all theme classes
            body.classList.remove('dark-theme', 'light-theme', 'blue-theme');
            
            // Add the selected theme class
            body.classList.add(theme + '-theme');
            
            // Save to localStorage
            localStorage.setItem('em2_theme', theme);
        }

        // ===== Event Listeners =====
        function setupEventListeners() {
            // Navigation
            window.addEventListener('scroll', () => {
                nav.classList.toggle('scrolled', window.scrollY > 50);
            });
            
            // Start button
            startBtn.addEventListener('click', () => {
                if (currentUser) {
                    // Redirect to dashboard in real app
                    showNotification('Welcome back!');
                } else {
                    toggleModal(settingsModal, true);
                }
            });
            
            // Modal controls
            settingsBtn.addEventListener('click', () => toggleModal(settingsModal, true));
            closeSettingsBtn.addEventListener('click', () => toggleModal(settingsModal, false));
            signInBtn.addEventListener('click', () => {
                toggleModal(settingsModal, false);
                toggleModal(signInModal, true);
            });
            signUpBtn.addEventListener('click', () => {
                toggleModal(settingsModal, false);
                toggleModal(signUpModal, true);
            });
            closeSignUpBtn.addEventListener('click', () => toggleModal(signUpModal, false));
            closeSignInBtn.addEventListener('click', () => toggleModal(signInModal, false));
            backToSettingsBtn.addEventListener('click', () => {
                toggleModal(signUpModal, false);
                toggleModal(settingsModal, true);
            });
            backFromSignInBtn.addEventListener('click', () => {
                toggleModal(signInModal, false);
                toggleModal(settingsModal, true);
            });
            goToSignInBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleModal(signUpModal, false);
                toggleModal(signInModal, true);
            });
            goToSignUpBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleModal(signInModal, false);
                toggleModal(signUpModal, true);
            });
            
            // Close modal when clicking outside
            document.querySelectorAll('.modal').forEach(modal => {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        toggleModal(modal, false);
                    }
                });
            });
            
            // Theme toggle
            themeOptions.forEach(option => {
                option.addEventListener('click', () => {
                    themeOptions.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                    handleThemeChange(option.dataset.theme);
                });
            });
            
            // Form submissions
            document.getElementById('signUpForm').addEventListener('submit', handleSignUp);
            document.getElementById('signInForm').addEventListener('submit', handleSignIn);
        }

        // Initialize the app
        initApp();
