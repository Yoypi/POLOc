// Configuration Stripe
const stripeConfig = {
  publicKey: 'pk_test_51RVBOjFwpGRfv8Xb4XQKQDKIUqx9o4FWRCPVI5PkumEZqAs6u6n6cbYSZWxM6otB3MI4pWUTqIuU2mdRDXjb7awK00WcE9g2zw',
  currency: 'eur',
  locale: 'fr',
  successUrl: 'https://samouraishop.netlify.app/confirmation.html',
  cancelUrl: 'https://samouraishop.netlify.app/checkout.html'
};

// Exporter la configuration
export default stripeConfig; 