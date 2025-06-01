// Script pour la page de confirmation
document.addEventListener('DOMContentLoaded', function() {
    // Curseur personnalisé fortement amélioré
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow) {
        // S'assurer que le curseur est initialisé correctement
        document.body.style.cursor = 'none';
        cursorGlow.style.display = 'block';
        cursorGlow.style.opacity = '1';
        cursorGlow.style.zIndex = '99999';
        
        // Récupérer le point central du curseur
        const cursorDot = document.querySelector('.cursor-dot');
        
        // Fonction principale pour gérer le curseur
        function updateCursorPosition(e) {
            // Position précise avec translate3d pour de meilleures performances
            cursorGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
            
            // Mettre à jour la position du point central
            if (cursorDot) {
                cursorDot.style.left = `${e.clientX}px`;
                cursorDot.style.top = `${e.clientY}px`;
            }
            
            // Effet de traînée amélioré et plus visible
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            
            // Variation aléatoire de taille et couleur pour la traînée avec plus d'intensité
            const size = 6 + Math.random() * 10;
            const hue = Math.random() > 0.5 ? '0' : '350'; // Rouge ou magenta
            const saturation = 95 + Math.random() * 5; // Haute saturation
            const luminosity = 45 + Math.random() * 10; // Luminosité moyenne à haute
            
            trail.style.width = size + 'px';
            trail.style.height = size + 'px';
            trail.style.background = `radial-gradient(circle, hsla(${hue}, ${saturation}%, ${luminosity}%, 0.9) 0%, hsla(${hue}, ${saturation}%, ${luminosity}%, 0.4) 60%, hsla(${hue}, ${saturation}%, ${luminosity}%, 0) 100%)`;
            trail.style.boxShadow = `0 0 10px hsla(${hue}, ${saturation}%, ${luminosity}%, 0.7)`;
            
            document.body.appendChild(trail);
            
            // Supprimer après un délai
            setTimeout(() => {
                trail.remove();
            }, 800);
        }
        
        // Utiliser mousedown/mouseup pour les cas où mousemove ne se déclenche pas assez
        document.addEventListener('mousedown', updateCursorPosition);
        document.addEventListener('mouseup', updateCursorPosition);
        document.addEventListener('mousemove', updateCursorPosition);
        
        // S'assurer que le curseur est toujours visible
        setTimeout(() => {
            cursorGlow.style.display = 'block';
            cursorGlow.style.opacity = '1';
        }, 100);
        
        // Effet sur les éléments interactifs
        const interactiveElements = document.querySelectorAll('a, button, .support-option, .next-actions .btn');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursorGlow.style.width = '60px';
                cursorGlow.style.height = '60px';
                this.classList.add('element-hover');
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.2)';
                }
            });
            
            element.addEventListener('mouseleave', function() {
                cursorGlow.style.width = '40px';
                cursorGlow.style.height = '40px';
                this.classList.remove('element-hover');
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                }
            });
        });
    }
    
    // Générer un numéro de commande aléatoire
    function generateOrderNumber() {
        return Math.floor(1000 + Math.random() * 9000);
    }
    
    // Récupérer l'email à partir des paramètres d'URL ou utiliser une valeur par défaut
    function getEmailFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('email') || 'client@example.com';
    }
    
    // Animation des confettis
    function setupConfetti() {
        const confettiElements = document.querySelectorAll('.confetti');
        
        confettiElements.forEach(confetti => {
            // Définir des propriétés aléatoires pour chaque confetti
            const duration = 5 + Math.random() * 5; // Entre 5 et 10 secondes
            const size = 5 + Math.random() * 15; // Entre 5 et 20px
            
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size * 2}px`;
            confetti.style.animationDuration = `${duration}s`;
            
            // Forme aléatoire (carré ou rectangle)
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }
        });
    }
    
    // Animation des étapes
    function animateSteps() {
        const steps = document.querySelectorAll('.step');
        
        steps.forEach((step, index) => {
            // Appliquer un délai croissant pour chaque étape
            setTimeout(() => {
                step.style.opacity = '0';
                step.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    step.style.transition = 'all 0.5s ease';
                    step.style.opacity = '1';
                    step.style.transform = 'translateY(0)';
                }, 100);
            }, index * 300);
        });
    }
    
    // Gérer les actions utilisateur
    function setupActions() {
        // Animation au survol des options de support
        const supportOptions = document.querySelectorAll('.support-option');
        
        supportOptions.forEach(option => {
            option.addEventListener('mouseenter', function() {
                const icon = this.querySelector('i');
                icon.style.transform = 'scale(1.2)';
                
                if (cursorGlow) {
                    cursorGlow.style.width = '50px';
                    cursorGlow.style.height = '50px';
                    cursorGlow.style.opacity = '0.8';
                }
            });
            
            option.addEventListener('mouseleave', function() {
                const icon = this.querySelector('i');
                icon.style.transform = 'scale(1)';
                
                if (cursorGlow) {
                    cursorGlow.style.width = '30px';
                    cursorGlow.style.height = '30px';
                    cursorGlow.style.opacity = '1';
                }
            });
        });
        
        // Animation au survol des boutons d'action
        const actionButtons = document.querySelectorAll('.next-actions .btn');
        
        actionButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                
                if (cursorGlow) {
                    cursorGlow.style.width = '50px';
                    cursorGlow.style.height = '50px';
                    cursorGlow.style.opacity = '0.8';
                }
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                
                if (cursorGlow) {
                    cursorGlow.style.width = '30px';
                    cursorGlow.style.height = '30px';
                    cursorGlow.style.opacity = '1';
                }
            });
        });
    }
    
    // Initialiser la page
    function initPage() {
        // Définir le numéro de commande
        document.getElementById('orderNumber').textContent = generateOrderNumber();
        
        // Définir l'email client
        document.getElementById('customerEmail').textContent = getEmailFromUrl();
        
        // Configurer les animations
        setupConfetti();
        
        // Animer les étapes avec un délai pour laisser l'animation de la coche se terminer
        setTimeout(animateSteps, 1500);
        
        // Configurer les interactions
        setupActions();
    }
    
    // Lancer l'initialisation
    initPage();
}); 