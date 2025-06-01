// Configuration Stripe
const stripeConfig = {
  publicKey: 'pk_test_51OtDzwGANkQM6xUPmBGlcRozIJ4Q5R1XxXG73vQUfHZLEpg78rrNZc9Xzk8gDnXOoBp3R2ZpnJLs3CXOBHc4n97I00R0I6XQ6j',
  currency: 'eur',
  locale: 'fr',
  successUrl: window.location.origin + '/confirmation.html',
  cancelUrl: window.location.origin + '/checkout.html'
};

// Exporter la configuration
export default stripeConfig; 