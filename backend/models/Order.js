const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    transactionId: { type: String, required: true, unique: true, index: true },
    gatewayOrderId: { type: String, index: true },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending_payment", "paid_pending_details", "completed", "failed"],
      default: "pending_payment",
      index: true,
    },
    totalAmount: { type: Number, required: true },
    totalCents: { type: Number, required: true },
    totalLinks: { type: Number, required: true },
    cart: { type: Object, required: true },
    packages: {
      type: [
        {
          id: String,
          name: String,
          qty: Number,
          price: Number,
          subtotal: Number,
          isGuestPost: Boolean,
        },
      ],
      default: [],
    },
    customer: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      contactPlatform: { type: String, default: "WhatsApp" },
      contactHandle: { type: String, default: "" },
      targetUrls: { type: String, default: "" },
      anchorTexts: { type: String, default: "" },
      notes: { type: String, default: "" },
    },
    emailsDispatched: { type: Boolean, default: false },
    paidAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { strict: false }
);

module.exports = mongoose.model("Order", OrderSchema);