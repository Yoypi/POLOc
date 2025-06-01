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
      
      // Créer l'élément d'information
      this.setupCardElement();
      
      // Ajouter les écouteurs d'événements
      this.setupEventListeners();
      
      console.log('Stripe Checkout initialisé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Stripe:', error);
    }
  }

  // Configurer l'élément de carte
  setupCardElement() {
    // Pour Stripe Checkout, nous n'avons pas besoin d'éléments de carte
    // Mais nous configurons quand même le conteneur d'erreurs
    
    // Trouver le conteneur de carte
    const cardElementContainer = document.getElementById('card-element-container');
    if (!cardElementContainer) {
      console.error('Le conteneur de carte est introuvable');
      return;
    }
    
    // Vider le conteneur existant
    cardElementContainer.innerHTML = '';
    
    // Ajouter une explication sur Stripe Checkout
    const infoElement = document.createElement('div');
    infoElement.classList.add('stripe-checkout-info');
    infoElement.innerHTML = `
      <div class="stripe-logo-container">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" alt="Stripe" class="stripe-logo">
      </div>
      <p>Votre paiement sera traité de manière sécurisée par Stripe. Vous serez redirigé vers la page de paiement Stripe après avoir cliqué sur le bouton.</p>
    `;
    cardElementContainer.appendChild(infoElement);
    
    // Créer le conteneur pour les erreurs
    this.errorElement = document.createElement('div');
    this.errorElement.id = 'card-errors';
    this.errorElement.classList.add('stripe-error');
    cardElementContainer.appendChild(this.errorElement);
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
      const productDescription = document.getElementById('productDescription').textContent;
      const productPrice = document.getElementById('total').textContent.replace('€', '').trim();
      const priceInCents = Math.round(parseFloat(productPrice) * 100); // Convertir en centimes
      
      // Créer une session de paiement Stripe
      const { error } = await this.stripe.redirectToCheckout({
        lineItems: [
          {
            price_data: {
              currency: stripeConfig.currency,
              product_data: {
                name: productName,
                description: productDescription
              },
              unit_amount: priceInCents
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        successUrl: stripeConfig.successUrl,
        cancelUrl: stripeConfig.cancelUrl,
        customerEmail: customerEmail
      });
      
      if (error) {
        console.error('Erreur Stripe:', error);
        this.showError(error.message);
        this.stopLoading();
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      this.showError('Une erreur est survenue lors de la redirection vers Stripe.');
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