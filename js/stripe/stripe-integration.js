import stripeConfig from './config.js';

class StripePayment {
  constructor() {
    this.stripe = null;
    this.elements = null;
    this.card = null;
    this.form = null;
    this.errorElement = null;
    this.paymentButton = null;
    this.isLoading = false;
  }

  // Initialiser Stripe
  async initialize() {
    try {
      // Charger Stripe.js dynamiquement
      if (!window.Stripe) {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise(resolve => {
          script.onload = resolve;
        });
      }
      
      // Initialiser l'instance Stripe
      this.stripe = Stripe(stripeConfig.publicKey);
      
      // Initialiser les éléments Stripe
      this.elements = this.stripe.elements({
        locale: stripeConfig.locale
      });
      
      // Créer l'élément de carte
      this.setupCardElement();
      
      // Ajouter les écouteurs d'événements
      this.setupEventListeners();
      
      console.log('Stripe initialisé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Stripe:', error);
    }
  }

  // Configurer l'élément de carte
  setupCardElement() {
    // Trouver le conteneur de carte
    const cardElementContainer = document.getElementById('card-element-container');
    if (!cardElementContainer) {
      console.error('Le conteneur de carte est introuvable');
      return;
    }

    // Créer le conteneur pour l'élément de carte s'il n'existe pas
    if (!document.getElementById('card-element')) {
      const cardElement = document.createElement('div');
      cardElement.id = 'card-element';
      cardElement.classList.add('stripe-card-element');
      cardElementContainer.appendChild(cardElement);
    }

    // Créer le conteneur pour les erreurs s'il n'existe pas
    if (!document.getElementById('card-errors')) {
      this.errorElement = document.createElement('div');
      this.errorElement.id = 'card-errors';
      this.errorElement.classList.add('stripe-error');
      cardElementContainer.appendChild(this.errorElement);
    } else {
      this.errorElement = document.getElementById('card-errors');
    }

    // Style pour l'élément de carte
    const cardStyle = {
      base: {
        color: '#ffffff',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
      invalid: {
        color: '#ff0000',
        iconColor: '#ff0000',
      },
    };

    // Créer l'élément de carte
    this.card = this.elements.create('card', {
      style: cardStyle,
      hidePostalCode: false
    });

    // Monter l'élément de carte
    this.card.mount('#card-element');

    // Écouter les changements pour afficher les erreurs
    this.card.on('change', (event) => {
      if (event.error) {
        this.showError(event.error.message);
      } else {
        this.clearError();
      }
    });
  }

  // Configurer les écouteurs d'événements
  setupEventListeners() {
    // Trouver le formulaire
    this.form = document.getElementById('payment-form');
    if (!this.form) {
      console.error('Le formulaire de paiement est introuvable');
      return;
    }

    // Trouver le bouton de paiement
    this.paymentButton = this.form.querySelector('button[type="submit"]');
    if (!this.paymentButton) {
      console.error('Le bouton de paiement est introuvable');
      return;
    }

    // Ajouter l'écouteur d'événement pour la soumission du formulaire
    this.form.addEventListener('submit', async (event) => {
      event.preventDefault();
      await this.handlePayment();
    });
  }

  // Gérer le paiement
  async handlePayment() {
    if (this.isLoading) return;
    
    this.startLoading();
    
    try {
      // Récupérer les données du client
      const customerEmail = document.getElementById('customer-email').value;
      const customerName = document.getElementById('customer-name').value;
      
      // Récupérer le produit et le prix
      const productName = document.getElementById('productName').textContent;
      const productPrice = document.getElementById('total').textContent.replace('€', '').trim();
      
      // Créer un token de paiement
      const { token, error } = await this.stripe.createToken(this.card, {
        name: customerName
      });
      
      if (error) {
        this.showError(error.message);
        this.stopLoading();
        return;
      }
      
      // Simuler l'envoi au serveur (à remplacer par un vrai appel API)
      console.log('Token de paiement créé:', token.id);
      console.log('Données de commande:', {
        product: productName,
        price: productPrice,
        email: customerEmail,
        name: customerName
      });
      
      // Rediriger vers la page de confirmation
      this.simulateSuccessfulPayment();
      
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      this.showError('Une erreur est survenue lors du traitement du paiement.');
    } finally {
      this.stopLoading();
    }
  }
  
  // Simuler un paiement réussi (pour les tests)
  simulateSuccessfulPayment() {
    // Générer un ID de commande aléatoire
    const orderId = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // Stocker les informations de la commande en session
    sessionStorage.setItem('orderComplete', 'true');
    sessionStorage.setItem('orderId', orderId);
    sessionStorage.setItem('orderProduct', document.getElementById('productName').textContent);
    sessionStorage.setItem('orderPrice', document.getElementById('total').textContent);
    
    // Rediriger vers la page de confirmation
    window.location.href = stripeConfig.successUrl;
  }

  // Afficher un message d'erreur
  showError(message) {
    this.clearError();
    this.errorElement.textContent = message;
    this.errorElement.style.display = 'block';
  }

  // Effacer le message d'erreur
  clearError() {
    this.errorElement.textContent = '';
    this.errorElement.style.display = 'none';
  }

  // Activer l'état de chargement
  startLoading() {
    this.isLoading = true;
    this.paymentButton.disabled = true;
    
    // Ajouter une classe pour l'animation de chargement
    this.paymentButton.classList.add('loading');
    
    // Changer le texte du bouton
    const btnContent = this.paymentButton.querySelector('.btn-content');
    if (btnContent) {
      btnContent.innerHTML = 'Traitement en cours <i class="fas fa-spinner fa-spin"></i>';
    }
  }

  // Désactiver l'état de chargement
  stopLoading() {
    this.isLoading = false;
    this.paymentButton.disabled = false;
    
    // Supprimer la classe pour l'animation de chargement
    this.paymentButton.classList.remove('loading');
    
    // Rétablir le texte du bouton
    const btnContent = this.paymentButton.querySelector('.btn-content');
    if (btnContent) {
      btnContent.innerHTML = 'Payer maintenant <i class="fas fa-lock"></i>';
    }
  }
}

export default StripePayment; 