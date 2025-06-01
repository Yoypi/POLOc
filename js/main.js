// Fichier principal JavaScript pour Samourai Shop

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des animations et effets
    initializeMatrixEffect();
    initializeGlitchEffects();
    initializeNavigationEffects();
    initializeProductCards();
    initializeCountdown();
    initializeMouseEffects();
    
    // Affichage de la page avec transition
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 300);
});

// Effet Matrix
function initializeMatrixEffect() {
    const matrixEffect = document.querySelector('.matrix-effect');
    if (!matrixEffect) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    matrixEffect.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ff0000';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
    
    // Redimensionnement du canvas lors du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Effets de glitch
function initializeGlitchEffects() {
    // Effet de glitch sur les titres
    const glitchTitles = document.querySelectorAll('.glitch-title');
    
    glitchTitles.forEach(title => {
        setInterval(() => {
            title.classList.add('glitching');
            setTimeout(() => {
                title.classList.remove('glitching');
            }, 200);
        }, 3000);
    });
    
    // Effet de glitch sur les boutons cyberpunk
    const cyberpunkBtns = document.querySelectorAll('.cyberpunk-btn');
    
    cyberpunkBtns.forEach(btn => {
        btn.addEventListener('mouseover', function() {
            this.classList.add('btn-glitch');
            setTimeout(() => {
                this.classList.remove('btn-glitch');
            }, 300);
        });
    });
    
    // Effet de glitch aléatoire sur l'interface
    setInterval(() => {
        const glitchOverlay = document.querySelector('.glitch-overlay');
        if (glitchOverlay && Math.random() > 0.7) {
            glitchOverlay.style.opacity = '0.8';
            setTimeout(() => {
                glitchOverlay.style.opacity = '0.3';
            }, 100);
        }
    }, 5000);
}

// Effets de navigation
function initializeNavigationEffects() {
    // Gestion du menu mobile
    const menuOpen = document.getElementById('menuOpen');
    const menuClose = document.getElementById('menuClose');
    const navLinks = document.getElementById('navLinks');
    
    if (menuOpen) {
        menuOpen.addEventListener('click', function() {
            navLinks.style.right = '0';
        });
    }
    
    if (menuClose) {
        menuClose.addEventListener('click', function() {
            navLinks.style.right = '-250px';
        });
    }
    
    // Navigation active
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
        
        // Si on est tout en haut, activer "home"
        if (window.pageYOffset < 100) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === '#home') {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // Animation du logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            logo.classList.add('logo-animated');
        });
        
        logo.addEventListener('mouseleave', function() {
            logo.classList.remove('logo-animated');
        });
    }
}

// Effets sur les cartes produits
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Effet au survol
        card.addEventListener('mouseenter', function() {
            const hoverEffect = this.querySelector('.card-hover-effect');
            if (hoverEffect) {
                hoverEffect.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const hoverEffect = this.querySelector('.card-hover-effect');
            if (hoverEffect) {
                hoverEffect.style.opacity = '0';
            }
        });
        
        // Animation des prix lors du changement d'option
        const subscriptionOptions = card.querySelectorAll('.subscription-option input');
        const priceTag = card.querySelector('.price-tag');
        
        subscriptionOptions.forEach(option => {
            option.addEventListener('change', function() {
                if (this.checked && priceTag) {
                    const priceText = this.nextElementSibling.textContent;
                    const price = priceText.split('-')[1].trim();
                    
                    priceTag.classList.add('price-change');
                    setTimeout(() => {
                        priceTag.textContent = price;
                        priceTag.classList.remove('price-change');
                    }, 300);
                }
            });
        });
    });
    
    // Animation du bouton "Être notifié"
    const notifyBtn = document.querySelector('.notify-btn');
    if (notifyBtn) {
        notifyBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-check"></i> Vous serez notifié';
            this.classList.add('notified');
            this.disabled = true;
        });
    }
}

// Animation du compteur
function initializeCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    // Date cible: aujourd'hui + 1 jour à 21:37:20
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(21, 37, 20, 0);
    
    // Calcul du temps restant
    const diff = tomorrow - now;
    
    // Conversion en heures, minutes, secondes
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Afficher les valeurs exactes de l'image si c'est le premier chargement
    const hoursEl = document.querySelector('.countdown-item:nth-child(1) .number');
    const minutesEl = document.querySelector('.countdown-item:nth-child(2) .number');
    const secondsEl = document.querySelector('.countdown-item:nth-child(3) .number');
    
    if (hoursEl && minutesEl && secondsEl) {
        // Vérifier si c'est le premier chargement (21, 37, 20 sont les valeurs de l'image)
        const initialLoad = !hoursEl.hasAttribute('data-initialized');
        
        if (initialLoad) {
            hoursEl.setAttribute('data-initialized', 'true');
            hoursEl.textContent = '21';
            minutesEl.textContent = '37';
            secondsEl.textContent = '20';
        } else {
            // Animation de changement pour les secondes
            if (secondsEl.textContent !== seconds.toString()) {
                secondsEl.classList.add('number-change');
                setTimeout(() => {
                    secondsEl.classList.remove('number-change');
                }, 500);
                secondsEl.textContent = seconds;
            }
            
            // Animation de changement pour les minutes
            if (minutesEl.textContent !== minutes.toString()) {
                minutesEl.classList.add('number-change');
                setTimeout(() => {
                    minutesEl.classList.remove('number-change');
                }, 500);
                minutesEl.textContent = minutes;
            }
            
            // Animation de changement pour les heures
            if (hoursEl.textContent !== hours.toString()) {
                hoursEl.classList.add('number-change');
                setTimeout(() => {
                    hoursEl.classList.remove('number-change');
                }, 500);
                hoursEl.textContent = hours;
            }
        }
    }
}

// Effets de souris
function initializeMouseEffects() {
    // Curseur personnalisé
    const cursor = document.getElementById('simple-cursor');
    if (!cursor) return;
    
    // Masquer le curseur natif
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';
    
    function moveCursor(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
    
    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', moveCursor);
    document.addEventListener('mouseover', moveCursor);
    
    // Assurer la visibilité
    setInterval(() => {
        document.documentElement.style.cursor = 'none';
        document.body.style.cursor = 'none';
        cursor.style.display = 'block';
        cursor.style.opacity = '1';
    }, 500);
    
    // Animation au clic
    document.addEventListener('click', function(e) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.backgroundColor = 'orange';
        
        setTimeout(() => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'red';
        }, 200);
    });
    
    // Animation au survol des boutons et liens
    const interactiveElements = document.querySelectorAll('a, button, .product-card, .feature, .badge');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.classList.add('cursor-hover');
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.classList.remove('cursor-hover');
        });
    });
}

// Détection du scroll pour les animations
window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    
    // Parallax sur la section hero
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrollPosition * 0.2}px)`;
    }
    
    // Ajout de classes d'animation basées sur le scroll
    const animatedElements = document.querySelectorAll('.feature, .product-card, .stat-item');
    
    animatedElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.classList.add('element-visible');
        }
    });
});

// Fonction pour créer des particules cyber
function createCyberParticles() {
    const particlesContainer = document.querySelector('.cyber-particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Initialiser les particules
createCyberParticles();

// Réinitialiser les particules lors du redimensionnement
window.addEventListener('resize', function() {
    const particlesContainer = document.querySelector('.cyber-particles');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        createCyberParticles();
    }
});
