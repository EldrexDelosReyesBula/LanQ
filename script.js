                    // Handle the scroll effect for article cards and navbar background
                    window.addEventListener('scroll', () => {
                        document.querySelectorAll('.article-card').forEach(card => {
                            let position = card.getBoundingClientRect().top;
                            let screenHeight = window.innerHeight;
                            if (position < screenHeight - 100) {
                                card.classList.add('show');
                            }
                        });

                        const navbar = document.querySelector('.navbar');
                        navbar.style.background = window.scrollY > 50 ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)';
                    });

                    // Smooth scrolling for anchor links
                    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                        anchor.addEventListener('click', function(e) {
                            e.preventDefault();
                            document.querySelector(this.getAttribute('href')).scrollIntoView({
                                behavior: 'smooth'
                            });
                        });
                    });

                    // Theme toggle with saving in localStorage
                    document.querySelector('.theme-toggle').addEventListener('click', function() {
                        const body = document.body;
                        const icon = this.querySelector('i');

                        // Toggle between light and dark themes
                        if (body.classList.contains('light-theme')) {
                            body.classList.remove('light-theme');
                            body.classList.add('dark-theme');
                            icon.classList.remove('fa-moon');
                            icon.classList.add('fa-sun');
                            // Save to localStorage
                            localStorage.setItem('theme', 'dark');
                        } else {
                            body.classList.remove('dark-theme');
                            body.classList.add('light-theme');
                            icon.classList.remove('fa-sun');
                            icon.classList.add('fa-moon');
                            // Save to localStorage
                            localStorage.setItem('theme', 'light');
                        }
                    });

                    // Apply saved theme on page load
                    window.addEventListener('load', () => {
                        const savedTheme = localStorage.getItem('theme');
                        const body = document.body;
                        const icon = document.querySelector('.theme-toggle i');

                        if (savedTheme === 'dark') {
                            body.classList.add('dark-theme');
                            body.classList.remove('light-theme');
                            icon.classList.add('fa-sun');
                            icon.classList.remove('fa-moon');
                        } else {
                            body.classList.add('light-theme');
                            body.classList.remove('dark-theme');
                            icon.classList.add('fa-moon');
                            icon.classList.remove('fa-sun');
                        }
                    });

                    function toggleDropdown() {
                        const dropdown = document.querySelector('.dropdown-content');
                        // Toggle the display property of the dropdown content
                        dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
                    }

                    // Close the dropdown if the user clicks outside of it
                    window.addEventListener('click', function(event) {
                        if (!event.target.matches('.logo')) {
                            const dropdown = document.querySelector('.dropdown-content');
                            if (dropdown.style.display === 'block') {
                                dropdown.style.display = 'none';
                            }
                        }
                    });
                    document.getElementById('shareBtn').addEventListener('click', async () => {
                        const shareData = {
                            title: document.title,
                            text: 'Check out this website!',
                            url: window.location.href
                        };

                        if (navigator.share) {
                            try {
                                await navigator.share(shareData);
                                console.log('Content shared successfully');
                            } catch (err) {
                                console.error('Error sharing:', err);
                            }
                        } else {
                            // Fallback: copy URL to clipboard
                            copyToClipboard(window.location.href);
                            alert('Link copied to clipboard!');
                        }
                    });

                    function copyToClipboard(text) {
                        const textarea = document.createElement('textarea');
                        textarea.value = text;
                        // Avoid scrolling to bottom
                        textarea.style.top = '0';
                        textarea.style.left = '0';
                        textarea.style.position = 'fixed';
                        document.body.appendChild(textarea);
                        textarea.focus();
                        textarea.select();
                        try {
                            document.execCommand('copy');
                        } catch (err) {
                            console.error('Unable to copy', err);
                        }
                        document.body.removeChild(textarea);
                    }
