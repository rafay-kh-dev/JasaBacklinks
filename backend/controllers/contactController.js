const { sendContactEnquiry } = require("../utils/mailer");

exports.submitContactEnquiry = async (req, res) => {
  try {
    await sendContactEnquiry(req.validatedBody);
    return res.json({ success: true, confirmationSent: true });
  } catch (error) {
    console.error("Contact enquiry dispatch failed:", error.message);
    return res.status(502).json({
      success: false,
      error: "Unable to send your enquiry right now. Please try again shortly.",
    });
  }
};