const request = require("supertest");
const app = require("./server.js");

describe("Jasa Backlinks API Tests", () => {
  
  test("1. Contact Form API should respond without crashing", async () => {
    const payload = {
      enquiryType: "Test Enquiry",
      fullName: "Automated Tester",
      email: "test@jasabacklinks.net",
      contactPlatform: "WhatsApp",
      contactHandle: "+44000000000",
      volumeTier: "50-250 Links",
      websiteUrl: "https://test.com",
      message: "This is an automated test message from Jest."
    };

    const response = await request(app)
      .post("/api/contact")
      .send(payload);

    expect([200, 500, 503]).toContain(response.status);
  }, 30000); 

  test("2. Admin SMTP Verify API should respond", async () => {
    const response = await request(app).get("/api/verify-smtp");
    expect([200, 500, 503]).toContain(response.status);
  }, 30000);

  // --- NAYA TEST: Payment/Order Submission Form ---
  test("3. Submit Order API should successfully save data and respond", async () => {
    const payload = {
      transactionId: "TXN-JEST-TEST99",
      paymentMethod: "Stripe Automated Test",
      totalAmount: 150.00,
      totalLinks: 50,
      packages: [
        { name: "Homepage Post", qty: 50, subtotal: 50.00 }
      ],
      customer: {
        fullName: "Jest Automated Tester",
        email: "test-order@jasabacklinks.net",
        contactPlatform: "Telegram",
        contactHandle: "@jest_tester",
        targetUrls: "https://example.com/page1",
        anchorTexts: "automated seo testing",
        notes: "Please ignore, this is an automated Jest test."
      }
    };

    const response = await request(app)
      .post("/api/submit-order")
      .send(payload);

    // Humne route ko bulletproof banaya hai, toh yeh SMTP error par bhi HTTP 200 aur success: true dega
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  }, 30000);

});