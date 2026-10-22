jest.mock("../utils/mailer", () => ({
  sendContactEnquiry: jest.fn(),
}));

const { sendContactEnquiry } = require("../utils/mailer");
const { submitContactEnquiry } = require("./contactController");

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe("submitContactEnquiry", () => {
  beforeEach(() => jest.clearAllMocks());

  it("sends validated contact details and confirms the request", async () => {
    const enquiry = {
      enquiryType: "General Enquiry",
      fullName: "Test Client",
      email: "client@example.com",
      message: "I would like more information.",
    };
    const res = createResponse();

    await submitContactEnquiry({ validatedBody: enquiry }, res);

    expect(sendContactEnquiry).toHaveBeenCalledWith(enquiry);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      confirmationSent: true,
    });
  });

  it("reports email delivery failure instead of returning success", async () => {
    sendContactEnquiry.mockRejectedValueOnce(new Error("Email provider down"));
    const res = createResponse();

    await submitContactEnquiry({ validatedBody: {} }, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Unable to send your enquiry right now. Please try again shortly.",
    });
  });
});
