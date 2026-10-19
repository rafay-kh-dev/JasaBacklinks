const axios = require("axios");

async function runBoomFiTest() {
  // Agar aapka backend live hai toh yahan live URL daalein, warna localhost rehne dein
  const BACKEND_URL = "http://localhost:5000"; 

  console.log("🚀 Testing BoomFi Checkout API...");

  try {
    const response = await axios.post(`${BACKEND_URL}/api/create-boomfi-charge`, {
      // Ek dummy cart bhej rahe hain test karne ke liye
      cart: { hp_post: 1, sidebar: 1 },
      originUrl: "https://www.jasabacklinks.net"
    });

    console.log("✅ SUCCESS! BoomFi Response:");
    console.log("------------------------------------------------");
    console.log("Transaction ID :", response.data.transactionId);
    console.log("Total Amount   : $" + response.data.total);
    console.log("Checkout URL   :", response.data.checkoutUrl);
    console.log("Return URL     :", response.data.returnUrl);
    console.log("------------------------------------------------");
    
    console.log("💡 Ab aap is 'Checkout URL' ko browser mein copy-paste kar ke payment flow dekh sakte hain.");

  } catch (error) {
    console.error("❌ FAILED! BoomFi Error:");
    console.error(error.response ? error.response.data : error.message);
  }
}

runBoomFiTest();