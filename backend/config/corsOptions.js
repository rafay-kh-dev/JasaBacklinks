const ALLOWED_ORIGINS = [
  "https://jasabacklinks.net",
  "https://www.jasabacklinks.net",
  "http://jasabacklinks.local",
  "https://jasabacklinks.local",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server requests (webhooks, UptimeRobot, Postman) with no origin header
    if (!origin || ALLOWED_ORIGINS.includes(origin.replace(/\/$/, ""))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Policy: Origin ${origin} is not authorised.`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-admin-token", "stripe-signature"],
  credentials: true,
};

module.exports = { corsOptions, ALLOWED_ORIGINS };