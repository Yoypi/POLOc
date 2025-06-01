// Script pour la page de checkout
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
        const interactiveElements = document.querySelectorAll('a, button, .tab-header, input, select, .subscription-option');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursorGlow.style.width = '60px';
                cursorGlow.style.height = '60px';
                this.classList.add('element-hover');
            });
            
            element.addEventListener('mouseleave', function() {
                cursorGlow.style.width = '40px';
                cursorGlow.style.height = '40px';
                this.classList.remove('element-hover');
            });
        });
    }
    
    // Gestion des onglets de paiement
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const optionButtons = document.querySelectorAll('.subscription-option input');
    const productPrice = {
        '1day': { keyser: 6, redengine: 8, redphaze: 15, susano: 25 },
        '3days': { keyser: 8, redengine: 11, redphaze: 20, susano: 35 },
        '1week': { keyser: 11, redengine: 14, redphaze: 25, susano: 45 },
        '1month': { keyser: 16, redengine: 24, redphaze: 40, susano: 80 },
        '3months': { keyser: 31, redengine: 45, redphaze: 70, susano: 140 },
        'lifetime': { keyser: 31, redengine: 45, redphaze: 70, susano: 140 }
    };
    
    // Déterminer le produit à partir de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product') || 'keyser';
    const product = document.getElementById('productName');
    const productImage = document.getElementById('productImage');
    
    // Définir les détails du produit en fonction du paramètre d'URL
    updateProductDetails(productParam);
    
    // Changement d'onglet de paiement
    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Supprimer la classe active de tous les onglets
            tabHeaders.forEach(h => h.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué
            header.classList.add('active');
            const tabId = header.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Mise à jour des prix en fonction de l'abonnement sélectionné
    optionButtons.forEach(option => {
        option.addEventListener('change', updatePrices);
    });
    
    // Initialisation des prix
    updatePrices();
    
    // Copie de l'adresse crypto
    const copyButton = document.getElementById('copyAddress');
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const cryptoAddress = document.getElementById('cryptoAddress').innerText;
            navigator.clipboard.writeText(cryptoAddress)
                .then(() => {
                    copyButton.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Erreur lors de la copie :', err);
                });
        });
    }
    
    // Fonction pour mettre à jour les prix
    function updatePrices() {
        const selectedOption = document.querySelector('.subscription-option input:checked');
        const duration = selectedOption ? selectedOption.value : '1week';
        const price = productPrice[duration][productParam];
        
        // Mise à jour des montants
        const subtotal = document.getElementById('subtotal');
        const tax = document.getElementById('tax');
        const total = document.getElementById('total');
        
        const priceValue = price;
        const taxValue = (priceValue * 0.20).toFixed(2);
        const totalValue = (parseFloat(priceValue) + parseFloat(taxValue)).toFixed(2);
        
        subtotal.textContent = priceValue + ' €';
        tax.textContent = taxValue + ' €';
        total.textContent = totalValue + ' €';
        
        // Mise à jour du montant crypto (simulé)
        const cryptoAmount = document.getElementById('cryptoAmount');
        if (cryptoAmount) {
            // Conversion simulée en BTC (ce serait à remplacer par une API réelle)
            const btcRate = 0.000037; // Taux de conversion simulé EUR/BTC
            const btcAmount = (priceValue * btcRate).toFixed(6);
            cryptoAmount.textContent = btcAmount + ' BTC';
        }
    }
    
    // Fonction pour mettre à jour les détails du produit
    function updateProductDetails(productKey) {
        const productDetails = {
            'keyser': {
                name: 'Keyser',
                image: 'img/product1.jpg.png',
                description: 'Cheat ultime pour voir à travers les murs et dominer tous les joueurs de FiveM'
            },
            'redengine': {
                name: 'Red Engine',
                image: 'img/product2.jpg.png',
                description: 'Le cheat le plus puissant avec des fonctionnalités avancées et une détection minimale'
            },
            'redphaze': {
                name: 'Red+Phaze',
                image: 'img/product3.jpg.png',
                description: 'Combinaison puissante de deux cheats premium pour une domination totale'
            },
            'susano': {
                name: 'Susano',
                image: 'img/product4.jpg.png',
                description: 'Le cheat ultime avec des capacités inégalées et une interface intuitive'
            }
        };
        
        if (productDetails[productKey]) {
            product.textContent = productDetails[productKey].name;
            productImage.src = productDetails[productKey].image;
            document.getElementById('productDescription').textContent = productDetails[productKey].description;
        }
    }
    
    // Validation du formulaire de carte
    const paymentForm = document.querySelector('.payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ici, vous pourriez ajouter une validation plus poussée des champs
            const cardNumber = paymentForm.querySelector('input[placeholder="1234 5678 9012 3456"]').value;
            const expiryDate = paymentForm.querySelector('input[placeholder="MM/AA"]').value;
            const cvc = paymentForm.querySelector('input[placeholder="123"]').value;
            const cardName = paymentForm.querySelector('input[placeholder="John Doe"]').value;
            const email = paymentForm.querySelector('input[type="email"]').value;
            
            // Vérification de base
            if (!cardNumber || !expiryDate || !cvc || !cardName || !email) {
                showError('Veuillez remplir tous les champs');
                return;
            }
            
            // Redirection vers la page de confirmation (simulée)
            simulatePayment();
        });
    }
    
    // Fonction pour simuler le paiement avec animation
    function simulatePayment() {
        // Créer un overlay de paiement
        const overlay = document.createElement('div');
        overlay.className = 'payment-processing-overlay';
        overlay.innerHTML = `
            <div class="payment-processing-container">
                <div class="processing-spinner"></div>
                <h3>Traitement du paiement</h3>
                <p>Veuillez patienter pendant que nous traitons votre paiement...</p>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Simuler un temps de traitement
        setTimeout(() => {
            overlay.innerHTML = `
                <div class="payment-processing-container success">
                    <div class="processing-checkmark"><i class="fas fa-check"></i></div>
                    <h3>Paiement réussi!</h3>
                    <p>Vous allez être redirigé vers la page de confirmation...</p>
                </div>
            `;
            
            // Rediriger vers la page de confirmation
            setTimeout(() => {
                window.location.href = 'confirmation.html';
            }, 2000);
        }, 3000);
    }
    
    // Fonction pour afficher les erreurs
    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'payment-error';
        errorElement.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
        
        // Ajouter l'erreur au formulaire
        paymentForm.prepend(errorElement);
        
        // Supprimer l'erreur après 4 secondes
        setTimeout(() => {
            errorElement.classList.add('fade-out');
            setTimeout(() => {
                errorElement.remove();
            }, 300);
        }, 4000);
    }
    
    // Effet de survol sur les options d'abonnement
    const subscriptionOptions = document.querySelectorAll('.subscription-option');
    subscriptionOptions.forEach(option => {
        option.addEventListener('mouseenter', () => {
            option.classList.add('hover-glow');
        });
        
        option.addEventListener('mouseleave', () => {
            option.classList.remove('hover-glow');
        });
    });
    
    // Animation du curseur lors de la sélection d'une option
    document.querySelectorAll('.subscription-option input').forEach(input => {
        input.addEventListener('change', function() {
            const cursor = document.getElementById('simple-cursor');
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.backgroundColor = 'orange';
            
            setTimeout(() => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'red';
            }, 300);
        });
    });
    
    // Animation du countdown
    startCountdown();
    
    // Fonction pour animer le countdown
    function startCountdown() {
        // Cette fonction pourrait être améliorée pour utiliser une vraie date
        const countdownItems = document.querySelectorAll('.countdown-item .number');
        
        // Animation simple de pulse pour les nombres
        countdownItems.forEach(item => {
            setInterval(() => {
                item.classList.add('pulse');
                setTimeout(() => {
                    item.classList.remove('pulse');
                }, 1000);
            }, 2000);
        });
    }
    
    // Effets visuels pour les backgrounds
    animateBackgrounds();
    
    // Fonction pour animer les arrière-plans
    function animateBackgrounds() {
        const cyberGrid = document.querySelector('.cyber-grid');
        const liquidBg = document.querySelector('.liquid-bg');
        
        // Déplacement subtil avec le mouvement de la souris
        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            
            if (cyberGrid) {
                cyberGrid.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
            
            if (liquidBg) {
                liquidBg.style.transform = `translate(${-moveX * 2}px, ${-moveY * 2}px)`;
            }
        });
    }
});

// Styles pour les animations et effets
const styles = `
.payment-processing-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.payment-processing-container {
    background-color: var(--card-bg);
    border-radius: 10px;
    padding: 30px;
    text-align: center;
    box-shadow: 0 0 30px rgba(231, 76, 60, 0.5);
    border: 1px solid var(--primary-color);
    max-width: 400px;
    width: 90%;
}

.processing-spinner {
    width: 60px;
    height: 60px;
    border: 5px solid rgba(255, 255, 255, 0.1);
    border-top: 5px solid var(--primary-color);
    border-radius: 50%;
    margin: 0 auto 20px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.processing-checkmark {
    width: 60px;
    height: 60px;
    background-color: rgba(39, 174, 96, 0.2);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto 20px;
    color: #27ae60;
    font-size: 2rem;
    animation: pop-in 0.5s ease;
}

@keyframes pop-in {
    0% { transform: scale(0); }
    70% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

.payment-processing-container h3 {
    margin-bottom: 10px;
    color: var(--light-color);
}

.payment-processing-container p {
    color: #aaa;
}

.payment-processing-container.success h3 {
    color: #27ae60;
}

.payment-error {
    background-color: rgba(231, 76, 60, 0.2);
    border: 1px solid rgba(231, 76, 60, 0.5);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    animation: slide-in 0.3s ease;
}

.error-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.payment-error i {
    color: var(--primary-color);
    font-size: 1.5rem;
}

.payment-error p {
    color: var(--light-color);
    margin: 0;
}

.fade-out {
    opacity: 0;
    transition: opacity 0.3s ease;
}

@keyframes slide-in {
    0% { transform: translateY(-20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
}

.hover-glow {
    box-shadow: 0 0 15px rgba(231, 76, 60, 0.5) !important;
}

.pulse {
    animation: number-pulse 1s ease;
}

@keyframes number-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); color: var(--primary-color); }
    100% { transform: scale(1); }
}
`;

// Ajouter les styles à la page
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet); 