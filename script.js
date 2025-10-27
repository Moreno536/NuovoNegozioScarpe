let cartItems = [];
const SHIPPING_COST = 7.00;
const FREE_SHIPPING_THRESHOLD = 100.00;

document.addEventListener('DOMContentLoaded', () => {
    updateCart();
    // Nasconde la sezione di checkout all'avvio
    document.getElementById('checkout').classList.add('hidden');
});

// Funzioni per la Modal del Carrello
window.openCartModal = function() {
    document.getElementById('cartModal').style.display = 'block';
}

window.closeCartModal = function() {
    document.getElementById('cartModal').style.display = 'none';
}

function updateCart() {
    const list = document.getElementById('cart-items-list');
    const counter = document.getElementById('cart-counter');
    const subtotalDisplay = document.getElementById('subtotal');
    const shippingDisplay = document.getElementById('shipping');
    const finalTotalDisplay = document.getElementById('final-total');

    let subtotal = 0;
    list.innerHTML = ''; 

    if (cartItems.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #666;">Il carrello è vuoto. Aggiungi il tuo prossimo paio!</p>';
        subtotalDisplay.textContent = '0.00 €';
        shippingDisplay.textContent = '0.00 €';
        finalTotalDisplay.textContent = '0.00 €';
    } else {
        cartItems.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            list.innerHTML += `
                <div class="cart-item-row">
                    <span style="flex-grow: 1; font-weight: 700;">${item.name}</span>
                    <span>(x${item.quantity})</span>
                    <span style="width: 80px; text-align: right;">${itemTotal.toFixed(2)} €</span>
                    <button onclick="removeFromCart(${index})" title="Rimuovi uno">&times;</button>
                </div>
            `;
        });
        
        // Calcolo e visualizzazione spedizione
        const finalShipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0.00 : SHIPPING_COST;
        const finalTotal = subtotal + finalShipping;
        
        subtotalDisplay.textContent = subtotal.toFixed(2) + ' €';
        shippingDisplay.textContent = finalShipping === 0.00 ? 'GRATIS' : finalShipping.toFixed(2) + ' €';
        finalTotalDisplay.textContent = finalTotal.toFixed(2) + ' €';

        // Aggiorna il pulsante di pagamento nel checkout
        const finalCheckoutBtn = document.querySelector('.final-payment-btn');
        if (finalCheckoutBtn) {
            finalCheckoutBtn.textContent = `FINALIZZA ORDINE e PAGA ${finalTotal.toFixed(2)} €`;
        }
    }

    // Aggiorna il contatore fisso
    counter.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

window.addToCart = function(name, price) {
    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Puoi aggiungere qui la richiesta taglia, ma per semplicità la ignoriamo.
        cartItems.push({ name, price, quantity: 1 });
    }
    updateCart();
    
    // Animazione feedback
    const cartBtn = document.querySelector('.cart-btn-fixed');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => { cartBtn.style.transform = 'scale(1)'; }, 150);
}

window.removeFromCart = function(index) {
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
    } else {
        cartItems.splice(index, 1);
    }
    updateCart();
}

// Funzioni per la gestione del Checkout in pagina unica
window.startCheckout = function() {
    if (cartItems.length === 0) {
        alert("Il tuo carrello è vuoto! Aggiungi un prodotto prima di procedere.");
        return;
    }
    
    // Nasconde le sezioni principali e mostra il checkout
    document.getElementById('collezione').classList.add('hidden');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('checkout').classList.remove('hidden');
    closeCartModal();
    window.scrollTo(0, 0); 
    
    // Assicura che il primo step sia visibile
    document.getElementById('step-shipping').classList.remove('hidden');
    document.getElementById('step-payment').classList.add('hidden');
}

window.cancelCheckout = function() {
    // Nasconde il checkout e mostra le sezioni principali
    document.getElementById('checkout').classList.add('hidden');
    document.getElementById('collezione').classList.remove('hidden');
    document.getElementById('home').classList.remove('hidden');
    window.scrollTo(0, 0);
}

window.goToPaymentStep = function() {
    const shippingForm = document.getElementById('shipping-form');
    // Valida il form prima di passare al pagamento
    if (shippingForm.checkValidity()) {
        document.getElementById('step-shipping').classList.add('hidden');
        document.getElementById('step-payment').classList.remove('hidden');
        updateCart(); // Aggiorna il totale finale nel pulsante
    } else {
        shippingForm.reportValidity(); // Mostra gli errori di validazione
    }
}

// Gestione invio modulo finale (simulato)
document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    if (this.checkValidity()) {
        alert("Ordine di " + document.getElementById('final-total').textContent + " finalizzato con successo! Riceverai una mail di conferma. Grazie per aver scelto STEP UP!");
        
        // Logica post-acquisto: reset carrello e ritorno alla home
        cartItems = [];
        updateCart();
        cancelCheckout();
    } else {
        this.reportValidity();
    }
});