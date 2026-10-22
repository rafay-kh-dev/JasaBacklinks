// backend/middlewares/validate.js
const { z } = require("zod");

const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return res.status(400).json({
      success: false,
      error: `${firstIssue.path.join(".") || "Payload"}: ${firstIssue.message}`,
    });
  }
  req.validatedBody = result.data;
  next();
};

const cartSchema = z.object({
  cart: z.record(z.string(), z.union([z.number(), z.string()])),
  originUrl: z.string().url().optional().or(z.literal("")),
  customer: z
    .object({
      fullName: z.string().max(120).optional(),
      email: z.string().email().optional(),
      contactPlatform: z.enum(["WhatsApp", "Telegram"]).optional(),
      contactHandle: z.string().max(120).optional(),
      targetUrls: z.string().max(5000).optional(),
      anchorTexts: z.string().max(5000).optional(),
      notes: z.string().max(2000).optional(),
    })
    .optional(),
});

const submitOrderSchema = z.object({
  transactionId: z.string().min(3).max(120),
  customer: z.object({
    fullName: z.string().min(2, "Full Name is required").max(120),
    email: z.string().email("Valid email is required"),
    contactPlatform: z.enum(["WhatsApp", "Telegram"]).default("WhatsApp"),
    contactHandle: z.string().min(2, "WhatsApp/Telegram handle is required").max(120),
    targetUrls: z.string().min(4, "Target URLs are required").max(10000),
    anchorTexts: z.string().min(1, "Anchor texts are required").max(10000),
    notes: z.string().max(3000).optional().default(""),
  }),
});

const contactSchema = z.object({
  enquiryType: z.string().max(100).optional().default("General"),
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  contactPlatform: z.string().max(40).optional().default("WhatsApp"),
  contactHandle: z.string().max(120).optional().default(""),
  volumeTier: z.string().max(80).optional().default(""),
  websiteUrl: z.string().max(300).optional().default(""),
  message: z.string().min(5).max(5000),
});

module.exports = {
  validateBody,
  cartSchema,
  submitOrderSchema,
  contactSchema,
};