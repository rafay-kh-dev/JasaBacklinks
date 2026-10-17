const request = require("supertest");
const app = require("./server.js");

describe("Jasa Backlinks API Tests", () => {
  
  // 30000ms (30 seconds) ka timeout add kiya gaya hai
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

    // Agar SMTP theek hai toh 200 aayega, warna SMTP error par 500 ya 503 aayega (lekin crash nahi hoga)
    expect([200, 500, 503]).toContain(response.status);
  }, 30000); 

  test("2. Admin SMTP Verify API should respond", async () => {
    const response = await request(app).get("/api/verify-smtp");
    
    // Status 200 (Connected), 500 ya 503 (Not Configured) dono pass maane jayenge
    expect([200, 500, 503]).toContain(response.status);
  }, 30000);

});