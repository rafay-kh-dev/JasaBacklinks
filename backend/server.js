const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Fallback URLs to prevent 'undefined' crashes
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

const SERVICES = {
    hp_post: { price: 1.0 },
    sidebar: { price: 2.0 },
    sticky: { price: 2.0 },
    id_hp_post: { price: 2.0 },
    id_sidebar: { price: 3.0 },
    id_sticky: { price: 2.5 },
    hidden_links: { price: 20.0 },
    edu_post: { price: 3.0 },
    edu_sidebar: { price: 5.0 }
};

const calculateSecureTotal = (cart) => {
    let total = 0;
    for (const [id, qty] of Object.entries(cart)) {
        if (SERVICES[id] && qty > 0) total += SERVICES[id].price * qty;
    }
    return total;
};

// 1. STRIPE API
app.post('/api/create-stripe-intent', async (req, res) => {
    try {
        const { cart } = req.body;
        const totalAmount = calculateSecureTotal(cart);
        if (totalAmount <= 0) return res.status(400).json({ error: "Invalid total." });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100),
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
        });

        res.json({ clientSecret: paymentIntent.client_secret, total: totalAmount });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 2. PAYPAL API (FIXED)
async function getPayPalAccessToken() {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
    // FIXED: Using Fallback URL if .env is missing
    const response = await axios.post(`${PAYPAL_API_BASE}/v1/oauth2/token`, 'grant_type=client_credentials', {
        headers: { Authorization: `Basic ${auth}` }
    });
    return response.data.access_token;
}

app.post('/api/create-paypal-order', async (req, res) => {
    try {
        const { cart } = req.body;
        const totalAmount = calculateSecureTotal(cart);
        if (totalAmount <= 0) return res.status(400).json({ error: "Invalid total." });

        const accessToken = await getPayPalAccessToken();
        const response = await axios.post(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            intent: "CAPTURE",
            purchase_units: [{ amount: { currency_code: "USD", value: totalAmount.toFixed(2) } }]
        }, {
            headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }
        });

        res.json({ id: response.data.id, total: totalAmount });
    } catch (error) {
        console.error("PayPal Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to create PayPal order" });
    }
});

// 3. BOOMFI API (Crypto)
app.post('/api/create-boomfi-charge', async (req, res) => {
    try {
        const { cart } = req.body;
        const totalAmount = calculateSecureTotal(cart);
        if (totalAmount <= 0) return res.status(400).json({ error: "Invalid total." });

        // BoomFi standard payload
        const response = await axios.post('https://api.boomfi.com/v1/charges', {
            amount: totalAmount,
            currency: 'USD',
        }, {
            headers: { 
                "Authorization": `Bearer ${process.env.BOOMFI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        res.json({ checkoutUrl: response.data.checkout_url, total: totalAmount });
    } catch (error) {
        console.error("BoomFi Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to create Crypto charge. Verify BoomFi API Key." });
    }
});

app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));