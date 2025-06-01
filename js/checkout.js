// Importer la classe StripePayment
import StripePayment from './stripe/stripe-integration.js';

// Script pour la page de checkout
document.addEventListener('DOMContentLoaded', function() {
    // Force le curseur à disparaître
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';
    
    // Récupérer le curseur
    const cursor = document.getElementById('simple-cursor');
    
    // Fonction ultra-simple pour suivre le curseur
    function moveCursor(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
    
    // Ajout de plusieurs écouteurs
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
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Retirer la classe active de tous les onglets
            tabHeaders.forEach(h => h.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué
            this.classList.add('active');
            
            // Afficher le contenu correspondant
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Mise à jour des prix en fonction de l'abonnement sélectionné
    optionButtons.forEach(option => {
        option.addEventListener('change', updatePrices);
    });
    
    // Initialisation des prix
    updatePrices();
    
    // Animation du compte à rebours pour crypto
    let timeLeft = 900; // 15 minutes en secondes
    const timerDisplay = document.querySelector('.countdown-timer');
    
    if (timerDisplay) {
        const updateTimer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(updateTimer);
                timerDisplay.textContent = "00:00";
                timerDisplay.classList.add('expired');
            } else {
                timeLeft--;
            }
        }, 1000);
    }
    
    // Effet de copie pour l'adresse crypto
    const copyBtn = document.getElementById('copyAddress');
    const cryptoAddress = document.getElementById('cryptoAddress');
    
    if (copyBtn && cryptoAddress) {
        copyBtn.addEventListener('click', function() {
            const tempInput = document.createElement('input');
            tempInput.value = cryptoAddress.textContent;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            // Animation de confirmation
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        });
    }

    // Intégration de Stripe
    setupStripeIntegration();
});

// Configurer l'intégration Stripe
async function setupStripeIntegration() {
    try {
        // Modifier le formulaire de paiement par carte
        modifyPaymentForm();

        // Initialiser Stripe
        const stripePayment = new StripePayment();
        await stripePayment.initialize();
    } catch (error) {
        console.error('Erreur lors de la configuration de Stripe:', error);
    }
}

// Modifier le formulaire de paiement pour intégrer Stripe
function modifyPaymentForm() {
    // Trouver le formulaire de carte de crédit
    const cardForm = document.querySelector('#creditCard form');
    if (!cardForm) return;

    // Ajouter l'ID au formulaire
    cardForm.id = 'payment-form';

    // Trouver les champs du formulaire
    const cardNumberInput = cardForm.querySelector('input[placeholder="1234 5678 9012 3456"]');
    const cardExpiryInput = cardForm.querySelector('input[placeholder="MM/AA"]');
    const cardCVCInput = cardForm.querySelector('input[placeholder="123"]');
    const nameInput = cardForm.querySelector('input[placeholder="John Doe"]');
    const emailInput = cardForm.querySelector('input[placeholder="email@example.com"]');

    // Ajouter des IDs aux champs existants
    if (nameInput) nameInput.id = 'customer-name';
    if (emailInput) emailInput.id = 'customer-email';

    // Créer un conteneur pour l'élément de carte Stripe
    const cardElementContainer = document.createElement('div');
    cardElementContainer.id = 'card-element-container';
    cardElementContainer.classList.add('form-group', 'cyber-input', 'stripe-container');

    // Ajouter un label
    const cardLabel = document.createElement('label');
    cardLabel.textContent = 'Informations de carte';
    cardElementContainer.appendChild(cardLabel);

    // Remplacer les champs de carte par l'élément Stripe
    if (cardNumberInput && cardNumberInput.parentNode) {
        const parentNode = cardNumberInput.parentNode.parentNode;
        if (parentNode) {
            // Supprimer les champs de carte existants
            if (cardNumberInput.parentNode) {
                parentNode.removeChild(cardNumberInput.parentNode);
            }
            if (cardExpiryInput && cardExpiryInput.parentNode && cardExpiryInput.parentNode.parentNode) {
                cardExpiryInput.parentNode.parentNode.parentNode.removeChild(cardExpiryInput.parentNode.parentNode);
            }
            
            // Insérer le conteneur de l'élément de carte Stripe
            parentNode.insertBefore(cardElementContainer, parentNode.firstChild);
        }
    }

    // Ajouter des styles CSS pour l'élément Stripe
    addStripeCSSStyles();
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

// Ajouter des styles CSS pour l'élément Stripe
function addStripeCSSStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .stripe-container {
            padding: 15px;
            border-radius: 8px;
            background-color: rgba(30, 30, 40, 0.8);
            margin-bottom: 20px;
            border: 1px solid rgba(255, 0, 0, 0.3);
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.2);
        }
        
        #card-element {
            padding: 15px;
            border-radius: 5px;
            background-color: rgba(40, 40, 50, 0.7);
            border: 1px solid rgba(255, 0, 0, 0.2);
            transition: all 0.3s ease;
            margin-top: 5px;
            min-height: 20px;
        }
        
        #card-element:hover, #card-element:focus {
            border-color: rgba(255, 0, 0, 0.5);
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.3);
        }
        
        #card-errors {
            color: #ff3333;
            text-align: left;
            font-size: 14px;
            margin-top: 10px;
            padding: 8px;
            background-color: rgba(255, 0, 0, 0.1);
            border-radius: 4px;
            display: none;
        }
        
        .stripe-card-element {
            transition: all 0.3s ease;
        }
        
        button.loading {
            opacity: 0.8;
            cursor: wait;
        }
    `;
    document.head.appendChild(styleElement);
} 