// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Sélection des éléments
    const menuOpen = document.getElementById('menuOpen');
    const menuClose = document.getElementById('menuClose');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.querySelector('.navbar');
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    const cursorGlow = document.querySelector('.cursor-glow');
    const btns = document.querySelectorAll('.btn, a, button');
    const productCards = document.querySelectorAll('.product-card');
    const features = document.querySelectorAll('.feature');
    const heroContent = document.querySelector('.hero-content');
    
    // Animation du contenu hero - Titres animés
    if (heroContent) {
        // Attendre un peu avant de démarrer l'animation
        setTimeout(() => {
            const badges = document.querySelectorAll('.hero-badge .badge');
            badges.forEach((badge, index) => {
                badge.style.opacity = '0';
                badge.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    badge.style.transition = 'all 0.5s ease';
                    badge.style.opacity = '1';
                    badge.style.transform = 'translateY(0)';
                }, 1000 + (index * 200));
            });
        }, 500);
    }
    
    // SOLUTION DÉFINITIVE POUR LE CURSEUR
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';
    
    // Créer un curseur super-simple directement en JS
    const cursor = document.createElement('div');
    cursor.id = 'simple-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background-color: red;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999999;
        transform: translate(-50%, -50%);
        top: 0;
        left: 0;
        box-shadow: 0 0 15px 5px rgba(255, 0, 0, 0.8);
        display: block !important;
        opacity: 1 !important;
    `;
    document.body.appendChild(cursor);
    
    // Fonction ultra-simple pour suivre le curseur
    function moveCursor(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
    
    // Ajout de plusieurs écouteurs pour capturer tous les mouvements possibles
    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', moveCursor);
    document.addEventListener('mouseover', moveCursor);
    
    // S'assurer qu'il est toujours visible
    setInterval(() => {
        document.documentElement.style.cursor = 'none';
        document.body.style.cursor = 'none';
        cursor.style.display = 'block';
        cursor.style.opacity = '1';
    }, 500);

    // Rendre le curseur visible au clic
    document.addEventListener('click', function(e) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.backgroundColor = 'orange';
        
        setTimeout(() => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'red';
        }, 200);
    });
    
    // Simuler un mouvement de souris initial
    const simulatedEvent = new MouseEvent('mousemove', {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2
    });
    document.dispatchEvent(simulatedEvent);
    
    // GESTION SUPER ROBUSTE DU CURSEUR PERSONNALISÉ
    // Empêcher le curseur normal de s'afficher
    document.body.style.cursor = 'none';
    
    // Récupérer les éléments du curseur
    const cursorDot = document.querySelector('.cursor-dot');
    
    // Initialiser le curseur avec des valeurs par défaut
    if (cursorDot) {
        cursorDot.style.display = 'block';
        cursorDot.style.opacity = '1';
        cursorDot.style.zIndex = '100000';
    }
    
    if (cursorGlow) {
        cursorGlow.style.display = 'block';
        cursorGlow.style.opacity = '1';
        cursorGlow.style.zIndex = '99999';
    }
    
    // Fonction pour mettre à jour la position du curseur
    function updateCursor(e) {
        const x = e.clientX;
        const y = e.clientY;
        
        if (cursorDot) {
            cursorDot.style.left = x + 'px';
            cursorDot.style.top = y + 'px';
        }
        
        if (cursorGlow) {
            cursorGlow.style.left = x + 'px';
            cursorGlow.style.top = y + 'px';
        }
        
        // Créer une traînée pour plus de visibilité
        createTrail(x, y);
    }
    
    // Création d'une traînée
    function createTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        
        document.body.appendChild(trail);
        
        // Supprimer la traînée après un délai
        setTimeout(() => {
            if (trail && trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 800);
    }
    
    // Ajouter des écouteurs d'événements pour tous les types d'interactions
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousedown', updateCursor);
    document.addEventListener('mouseup', updateCursor);
    document.addEventListener('mouseenter', updateCursor);
    
    // Effet de survol sur les éléments interactifs
    const interactiveElements = document.querySelectorAll('a, button, .product-card, .feature, .subscription-option, input, select');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (cursorDot) {
                cursorDot.style.width = '18px';
                cursorDot.style.height = '18px';
                cursorDot.style.backgroundColor = '#ff5e00';
            }
            
            if (cursorGlow) {
                cursorGlow.style.width = '80px';
                cursorGlow.style.height = '80px';
            }
            
            this.classList.add('element-hover');
        });
        
        element.addEventListener('mouseleave', function() {
            if (cursorDot) {
                cursorDot.style.width = '12px';
                cursorDot.style.height = '12px';
                cursorDot.style.backgroundColor = '#ff0000';
            }
            
            if (cursorGlow) {
                cursorGlow.style.width = '50px';
                cursorGlow.style.height = '50px';
            }
            
            this.classList.remove('element-hover');
        });
    });
    
    // S'assurer que le curseur est toujours visible
    function checkCursorVisibility() {
        if (cursorDot && (getComputedStyle(cursorDot).display === 'none' || parseFloat(getComputedStyle(cursorDot).opacity) < 0.5)) {
            cursorDot.style.display = 'block';
            cursorDot.style.opacity = '1';
        }
        
        if (cursorGlow && (getComputedStyle(cursorGlow).display === 'none' || parseFloat(getComputedStyle(cursorGlow).opacity) < 0.5)) {
            cursorGlow.style.display = 'block';
            cursorGlow.style.opacity = '1';
        }
    }
    
    // Vérifier périodiquement la visibilité du curseur
    setInterval(checkCursorVisibility, 1000);
    
    // Déclencher manuellement pour s'assurer que le curseur est visible au chargement
    setTimeout(function() {
        const event = new MouseEvent('mousemove', {
            clientX: window.innerWidth / 2,
            clientY: window.innerHeight / 2
        });
        document.dispatchEvent(event);
        checkCursorVisibility();
    }, 100);
    
    // Gestion des options de souscription
    const subscriptionOptions = document.querySelectorAll('.subscription-option');
    const radioInputs = document.querySelectorAll('.subscription-option input[type="radio"]');
    
    subscriptionOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Trouver le radio input dans cette option
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                
                // Effet visuel lors de la sélection
                const glowEffect = document.createElement('div');
                glowEffect.className = 'option-glow-effect';
                glowEffect.style.position = 'absolute';
                glowEffect.style.top = '0';
                glowEffect.style.left = '0';
                glowEffect.style.width = '100%';
                glowEffect.style.height = '100%';
                glowEffect.style.borderRadius = '5px';
                glowEffect.style.background = 'rgba(255, 0, 0, 0.2)';
                glowEffect.style.pointerEvents = 'none';
                glowEffect.style.opacity = '0.8';
                glowEffect.style.transition = 'opacity 0.5s';
                
                this.style.position = 'relative';
                this.appendChild(glowEffect);
                
                // Mise à jour du prix du produit
                updateProductPrice(radio);
                
                setTimeout(() => {
                    glowEffect.style.opacity = '0';
                    setTimeout(() => {
                        glowEffect.remove();
                    }, 500);
                }, 300);
            }
        });
    });
    
    // Fonction pour mettre à jour le prix affiché dans le bouton
    function updateProductPrice(radio) {
        const productCard = radio.closest('.product-card');
        if (productCard) {
            const btn = productCard.querySelector('.btn');
            const label = radio.nextElementSibling;
            const price = label.textContent.split('-')[1].trim();
            
            if (btn) {
                // Extraire le texte original sans le prix
                let btnText = btn.innerHTML;
                // Si le bouton contient déjà un prix, le remplacer
                if (btnText.includes('(')) {
                    btnText = btnText.replace(/\s*\([^)]*\)/, '');
                }
                // Ajouter le nouveau prix
                btn.innerHTML = `${btnText} (${price})`;
            }
        }
    }
    
    // Initialiser les prix sur les boutons pour les options pré-sélectionnées
    radioInputs.forEach(radio => {
        if (radio.checked) {
            updateProductPrice(radio);
        }
    });
    
    // Effet spécial pour l'image du produit Keyser
    const keyserProduct = document.querySelector('.product-card:nth-child(2)');
    if (keyserProduct) {
        const keyserImage = keyserProduct.querySelector('.product-image');
        
        keyserImage.addEventListener('mouseenter', function() {
            // Créer un effet de glitch sur l'image
            this.classList.add('glitch-image-effect');
            
            // Effet de particules autour de l'image
            for (let i = 0; i < 20; i++) {
                createImageParticle(this);
            }
            
            // Faire clignoter le badge
            const badge = this.querySelector('.product-badge');
            if (badge) {
                badge.style.animation = 'glitch-text 0.3s infinite';
                badge.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.8)';
            }
        });
        
        keyserImage.addEventListener('mouseleave', function() {
            this.classList.remove('glitch-image-effect');
            
            const badge = this.querySelector('.product-badge');
            if (badge) {
                badge.style.animation = 'pulse-intense 2s infinite';
                badge.style.boxShadow = '0 5px 15px rgba(255, 0, 0, 0.5)';
            }
        });
    }
    
    function createImageParticle(element) {
        const particle = document.createElement('span');
        particle.className = 'image-particle';
        
        // Position aléatoire autour de l'élément
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width * Math.random();
        const y = rect.top + rect.height * Math.random();
        
        // Style
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        
        document.body.appendChild(particle);
        
        // Animation et suppression
        gsap.to(particle, {
            duration: 1 + Math.random(),
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            opacity: 0,
            scale: 0,
            onComplete: function() {
                particle.remove();
            }
        });
    }
    
    // Utilisation de GSAP si disponible, sinon fallback
    const gsap = window.gsap || {
        to: function(element, options) {
            const duration = (options.duration || 1) * 1000;
            element.style.transition = `all ${duration}ms ease`;
            
            if (options.x) element.style.transform = `translateX(${options.x}px)`;
            if (options.y) element.style.transform += ` translateY(${options.y}px)`;
            if (options.opacity !== undefined) element.style.opacity = options.opacity;
            if (options.scale !== undefined) element.style.transform += ` scale(${options.scale})`;
            
            setTimeout(() => {
                if (typeof options.onComplete === 'function') options.onComplete();
            }, duration);
        }
    };
    
    // Menu mobile - Ouverture
    if (menuOpen && menuClose && navLinks) {
        menuOpen.addEventListener('click', function() {
            navLinks.classList.add('active');
        });
        
        menuClose.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
        
        // Fermer le menu mobile en cliquant sur un lien
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Changement de style de la navbar au scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Animer les sections au scroll
        animateOnScroll();
    });
    
    // Défilement fluide pour les liens internes
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Fermer le menu mobile si ouvert
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajustement pour la navbar
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Effet de parallaxe pour les sections
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    function updateParallax() {
        parallaxSections.forEach(section => {
            const distance = window.scrollY;
            section.style.backgroundPositionY = `${distance * 0.1}px`;
        });
    }
    
    // Mettre à jour l'effet de parallaxe au scroll
    window.addEventListener('scroll', updateParallax);
    
    // Animation des produits au scroll
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Fonction pour animer les éléments visibles
    function animateOnScroll() {
        productCards.forEach((card, index) => {
            if (isElementInViewport(card)) {
                setTimeout(() => {
                    card.style.opacity = 1;
                    card.style.transform = 'translateY(0)';
                }, index * 100); // Ajouter un délai progressif
            }
        });
        
        // Animation des sections
        document.querySelectorAll('.section-header, .about-content, .feature').forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('animated');
            }
        });
    }
    
    // Appliquer le style initial aux cartes de produits
    productCards.forEach((card, index) => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1.1)';
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
        
        // Ajouter un effet de survol avancé
        card.addEventListener('mouseenter', function() {
            // Animation de la carte
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
            
            // Animation de l'image
            const image = this.querySelector('.product-image img');
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
            
            // Animation du bouton
            const button = this.querySelector('.btn');
            if (button) {
                button.style.transform = 'translateY(-5px)';
                button.style.boxShadow = '0 5px 15px rgba(231, 76, 60, 0.3)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            // Restaurer l'état normal
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
            
            // Restaurer l'image
            const image = this.querySelector('.product-image img');
            if (image) {
                image.style.transform = '';
            }
            
            // Restaurer le bouton
            const button = this.querySelector('.btn');
            if (button) {
                button.style.transform = '';
                button.style.boxShadow = '';
            }
        });
    });
    
    // Déclencher l'animation au chargement et au scroll
    setTimeout(() => {
        animateOnScroll();
    }, 500);
    
    // Animation du scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
    
    // Animation du formulaire de contact
    const formGroups = document.querySelectorAll('.contact-form .form-group');
    
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            group.style.transition = 'all 0.5s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
    });
    
    // Validation du formulaire de contact
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            // Simuler l'envoi
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé!';
                submitBtn.classList.add('success');
                
                // Réinitialiser le formulaire
                this.reset();
                
                // Restaurer le bouton après 3 secondes
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('success');
                }, 3000);
            }, 1500);
        });
    }
    
    // Animation des témoignages
    const testimonials = document.querySelectorAll('.testimonial');
    
    testimonials.forEach((testimonial, index) => {
        testimonial.style.opacity = '0';
        testimonial.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            testimonial.style.transition = 'all 0.8s ease';
            testimonial.style.opacity = '1';
            testimonial.style.transform = 'translateY(0)';
        }, 300 + (index * 150));
    });
    
    // Effet de survol amélioré pour les caractéristiques
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.color = '#e74c3c';
            }
        });
        
        feature.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
                icon.style.color = '';
            }
        });
    });
    
    // Animer les badges des produits
    const productBadges = document.querySelectorAll('.product-badge');
    
    productBadges.forEach(badge => {
        // Animation initiale
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            badge.style.transition = 'all 0.5s ease';
            badge.style.opacity = '1';
            badge.style.transform = 'translateY(0)';
            
            // Ajouter un effet de pulsation
            badge.style.animation = 'pulse 2s infinite';
        }, 1000);
    });
    
    // Animation du formulaire newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        const input = newsletterForm.querySelector('input');
        const button = newsletterForm.querySelector('button');
        
        // Animation du bouton au survol
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
        
        // Gestion de la soumission
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (input.value.trim() !== '') {
                // Sauvegarder la valeur de l'input
                const email = input.value;
                
                // Afficher un message de confirmation
                input.value = '';
                input.placeholder = '✓ Vous êtes inscrit!';
                input.disabled = true;
                button.disabled = true;
                
                // Restaurer après 3 secondes
                setTimeout(() => {
                    input.placeholder = 'Votre email';
                    input.disabled = false;
                    button.disabled = false;
                }, 3000);
            }
        });
    }
    
    // Animation de la section CTA
    const ctaSection = document.querySelector('.cta-section');
    
    if (ctaSection) {
        window.addEventListener('scroll', function() {
            // Vérifier si la section est visible
            const rect = ctaSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            
            if (rect.top < viewportHeight && rect.bottom > 0) {
                // Calculer la position de défilement relative
                const scrollPercent = Math.min(1, 1 - (rect.top / viewportHeight));
                
                // Appliquer un effet de parallaxe
                ctaSection.style.backgroundPositionY = `${scrollPercent * 50}px`;
                
                // Faire varier l'opacité du fond
                const overlay = ctaSection.querySelector(':before');
                if (overlay) {
                    overlay.style.opacity = 0.8 + (scrollPercent * 0.2);
                }
            }
        });
    }
    
    // Ajout d'effets de distorsion aléatoires sur les titres
    const glitchTexts = document.querySelectorAll('h1, h2, .product-card h3');
    
    function applyRandomGlitch() {
        if (Math.random() > 0.97) { // Déclenchement aléatoire
            const randomElement = glitchTexts[Math.floor(Math.random() * glitchTexts.length)];
            randomElement.classList.add('glitch-effect');
            
            setTimeout(() => {
                randomElement.classList.remove('glitch-effect');
            }, 200);
        }
    }
    
    // Exécuter l'effet de glitch périodiquement
    setInterval(applyRandomGlitch, 500);
    
    // Animation des badges améliorée
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(-3deg)';
            this.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.7)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
        });
    });
    
    // Effet de particules sur les boutons
    const glowButtons = document.querySelectorAll('.glow-btn');
    
    glowButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            // Créer des particules
            for (let i = 0; i < 10; i++) {
                createParticle(button);
            }
        });
    });
    
    function createParticle(element) {
        const particle = document.createElement('span');
        particle.className = 'btn-particle';
        
        // Position aléatoire
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width * Math.random();
        const y = rect.top + rect.height * Math.random();
        
        // Style
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--size', Math.random() * 3 + 3 + 'px');
        
        document.body.appendChild(particle);
        
        // Animation et suppression
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
    // Configuration des éléments glitch-text pour afficher correctement le data-text
    const glitchElements = document.querySelectorAll('.glitch-text');
    glitchElements.forEach(element => {
        element.setAttribute('data-text', element.textContent);
    });
    
    // Effet de déformation 3D au survol des cartes produit
    productCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; // Position X relative à la carte
            const y = e.clientY - rect.top; // Position Y relative à la carte
            
            // Calculer l'angle de rotation en fonction de la position de la souris
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateY = (x - centerX) / 20; // Plus la valeur est petite, plus l'effet est prononcé
            const rotateX = (centerY - y) / 20;
            
            // Appliquer l'effet 3D
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
            
            // Effet de lumière suivant le curseur
            const glare = this.querySelector('.product-overlay');
            if (glare) {
                glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.1) 80%)`;
            }
        });
        
        // Réinitialiser l'effet quand la souris quitte la carte
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            const glare = this.querySelector('.product-overlay');
            if (glare) {
                glare.style.background = '';
            }
        });
    });
    
    // Animation d'entrée améliorée pour les sections
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Ajouter des particules si c'est un élément important
                if (entry.target.classList.contains('important-element')) {
                    createParticles(entry.target, 10);
                }
                
                observer.unobserve(entry.target); // Ne déclencher qu'une fois
            }
        });
    }, observerOptions);
    
    // Sélectionner les éléments à animer
    document.querySelectorAll('.section-header, .feature, .product-card, .about-content').forEach(elem => {
        elem.classList.add('to-animate');
        animateOnScroll.observe(elem);
    });
    
    // Créer des particules pour des effets spéciaux
    function createParticles(element, count) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Positionner la particule aléatoirement autour de l'élément
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            // Variation aléatoire de taille et couleur
            const size = 3 + Math.random() * 8;
            const hue = Math.random() > 0.5 ? '0' : '350'; // Rouge ou violet
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = `hsla(${hue}, 100%, 50%, 0.8)`;
            
            document.body.appendChild(particle);
            
            // Animation de disparition
            gsap.to(particle, {
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                opacity: 0,
                duration: 1 + Math.random(),
                onComplete: () => particle.remove()
            });
        }
    }
    
    // Style dynamique pour le fond du site
    const addDynamicBackground = () => {
        const background = document.createElement('div');
        background.className = 'dynamic-background';
        document.body.appendChild(background);
        
        for (let i = 0; i < 5; i++) {
            const line = document.createElement('div');
            line.className = 'bg-line';
            line.style.left = `${Math.random() * 100}%`;
            line.style.animationDuration = `${10 + Math.random() * 20}s`;
            line.style.animationDelay = `${Math.random() * 5}s`;
            background.appendChild(line);
        }
    };
    
    // Initialiser le fond dynamique
    addDynamicBackground();
    
    // Créer les éléments d'arrière-plan dynamique
    function createDynamicBackgrounds() {
        // Créer le fond de circuit
        const bgCircuit = document.createElement('div');
        bgCircuit.className = 'bg-circuit';
        document.body.appendChild(bgCircuit);
        
        // Créer le fond liquide
        const liquidBg = document.createElement('div');
        liquidBg.className = 'liquid-bg';
        document.body.appendChild(liquidBg);
    }

    // Initialiser le fond dynamique
    createDynamicBackgrounds();
    
    // Configuration des éléments cyberpunk-text
    const cyberpunkElements = document.querySelectorAll('.cyberpunk-text');
    cyberpunkElements.forEach(element => {
        if (element.getAttribute('data-text') === null) {
            element.setAttribute('data-text', element.textContent);
        }
    });
    
    // Gérer les notifications pour le bouton Coming Soon
    const notifyBtn = document.querySelector('.notify-btn');
    if (notifyBtn) {
        notifyBtn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
            this.disabled = true;
            
            // Simuler le traitement
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Vous serez notifié!';
                this.style.background = 'linear-gradient(45deg, #00cc66, #00ff99)';
                this.style.boxShadow = '0 5px 15px rgba(0, 204, 102, 0.4)';
                
                // Après 3 secondes, revenir à l'état initial
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                    this.style.background = '';
                    this.style.boxShadow = '';
                }, 3000);
            }, 1500);
        });
    }
    
    // Effet spécial pour la carte Coming Soon
    const comingSoonCard = document.querySelector('.product-card.coming-soon');
    if (comingSoonCard) {
        comingSoonCard.addEventListener('mouseenter', function() {
            // Effet de distorsion cyber
            this.style.transform = 'translateY(-15px) scale(1.05)';
            this.style.boxShadow = '0 20px 40px rgba(0, 255, 255, 0.3)';
            
            // Pulser la badge Coming Soon
            const badge = this.querySelector('.coming-soon-badge');
            if (badge) {
                badge.style.animation = 'coming-soon-pulse 1s infinite';
            }
            
            // Effet sur l'image
            const image = this.querySelector('.product-image img');
            if (image) {
                image.style.transform = 'scale(1.1) rotate(3deg)';
                image.style.filter = 'hue-rotate(180deg) saturate(2)';
            }
            
            // Créer des particules spéciales
            for (let i = 0; i < 15; i++) {
                createNeonParticle(this);
            }
        });
        
        comingSoonCard.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            
            const badge = this.querySelector('.coming-soon-badge');
            if (badge) {
                badge.style.animation = 'coming-soon-pulse 2s infinite';
            }
            
            const image = this.querySelector('.product-image img');
            if (image) {
                image.style.transform = '';
                image.style.filter = '';
            }
        });
    }
    
    // Créer des particules néon pour Coming Soon
    function createNeonParticle(element) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const rect = element.getBoundingClientRect();
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Variation aléatoire de taille et couleur
        const size = 2 + Math.random() * 5;
        const hue = Math.random() > 0.5 ? '180' : '300'; // Cyan ou magenta
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = `hsla(${hue}, 100%, 50%, 0.8)`;
        particle.style.boxShadow = `0 0 10px hsla(${hue}, 100%, 50%, 0.8)`;
        
        document.body.appendChild(particle);
        
        // Animation de disparition
        gsap.to(particle, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            opacity: 0,
            duration: 1 + Math.random(),
            onComplete: () => particle.remove()
        });
    }
    
    // Mettre en valeur le nouveau produit au chargement
    window.addEventListener('load', function() {
        const comingSoonCard = document.querySelector('.product-card.coming-soon');
        
        if (comingSoonCard) {
            // Ajouter une classe pour l'animation d'entrée
            setTimeout(() => {
                comingSoonCard.classList.add('highlight-product');
                
                // Créer un effet de flash
                const flash = document.createElement('div');
                flash.className = 'product-flash';
                flash.style.position = 'absolute';
                flash.style.top = '0';
                flash.style.left = '0';
                flash.style.width = '100%';
                flash.style.height = '100%';
                flash.style.background = 'linear-gradient(45deg, rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.3))';
                flash.style.opacity = '0';
                flash.style.zIndex = '10';
                flash.style.pointerEvents = 'none';
                flash.style.transition = 'opacity 0.5s ease';
                comingSoonCard.appendChild(flash);
                
                setTimeout(() => {
                    flash.style.opacity = '0.8';
                    
                    setTimeout(() => {
                        flash.style.opacity = '0';
                        
                        setTimeout(() => {
                            flash.remove();
                        }, 500);
                    }, 300);
                }, 100);
            }, 1000);
        }
    });
}); 