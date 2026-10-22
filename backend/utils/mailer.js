const axios = require("axios");
const {
  getAdminEmailHtml,
  getClientEmailHtml,
  getContactAdminHtml,
  getContactClientHtml,
} = require("../templates/emailTemplates");

const RESEND_API_URL = "https://api.resend.com/emails";

async function sendMailOverAPI({ from, to, replyTo, subject, html }) {
  const apiKey = (process.env.RESEND_API_KEY || process.env.SMTP_PASS || "").trim();
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY in backend environment.");
  }

  await axios.post(
    RESEND_API_URL,
    { from, to, reply_to: replyTo, subject, html },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    },
  );
}

async function sendOrderEmailsIfReady(orderDoc) {
  if (!orderDoc?.customer?.email || orderDoc.emailsDispatched) return;

  const senderEmail = (
    process.env.SENDER_EMAIL || "hello@jasabacklinks.net"
  ).trim();
  const adminEmail = (process.env.ADMIN_EMAIL || senderEmail).trim();
  const emailData = {
    customer: orderDoc.customer,
    transactionId: orderDoc.transactionId,
    paymentMethod: orderDoc.paymentMethod,
    totalLinks: orderDoc.totalLinks,
    totalAmount: orderDoc.totalAmount,
    packages: orderDoc.packages,
  };

  await Promise.all([
    sendMailOverAPI({
      from: senderEmail,
      to: orderDoc.customer.email,
      replyTo: senderEmail,
      subject: `Order received — ${orderDoc.transactionId}`,
      html: getClientEmailHtml(emailData),
    }),
    sendMailOverAPI({
      from: senderEmail,
      to: adminEmail,
      replyTo: orderDoc.customer.email,
      subject: `New paid order — ${orderDoc.transactionId}`,
      html: getAdminEmailHtml(emailData),
    }),
  ]);

  orderDoc.emailsDispatched = true;
  await orderDoc.save();
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

async function sendContactEnquiry(enquiry) {
  const senderEmail = (
    process.env.SENDER_EMAIL || "hello@jasabacklinks.net"
  ).trim();
  const adminEmail = (process.env.ADMIN_EMAIL || senderEmail).trim();
  const safeEnquiry = Object.fromEntries(
    Object.entries(enquiry).map(([key, value]) => [key, escapeHtml(value)]),
  );

  await Promise.all([
    sendMailOverAPI({
      from: senderEmail,
      to: adminEmail,
      replyTo: enquiry.email,
      subject: "New contact enquiry — Jasa Backlinks",
      html: getContactAdminHtml(safeEnquiry),
    }),
    sendMailOverAPI({
      from: senderEmail,
      to: enquiry.email,
      replyTo: senderEmail,
      subject: "We received your enquiry — Jasa Backlinks",
      html: getContactClientHtml({
        fullName: safeEnquiry.fullName,
        message: safeEnquiry.message,
      }),
    }),
  ]);
}

module.exports = { sendOrderEmailsIfReady, sendContactEnquiry };