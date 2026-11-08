export const PENDING_PAYMENT_STORAGE_KEY = "jasa_pending_payment";

const LEGACY_BOOMFI_STORAGE_KEY = "jasa_pending_boomfi_order";
const PAYMENT_RECOVERY_TTL = 7 * 24 * 60 * 60 * 1000;

export function readPendingPayment() {
  try {
    const raw =
      localStorage.getItem(PENDING_PAYMENT_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_BOOMFI_STORAGE_KEY);
    if (!raw) return null;

    const pending = JSON.parse(raw);
    const timestamp = Number(pending?.timestamp);
    if (
      !pending ||
      typeof pending.transactionId !== "string" ||
      !pending.transactionId ||
      !Number.isFinite(timestamp)
    ) {
      clearPendingPayment();
      return null;
    }

    if (Date.now() - timestamp > PAYMENT_RECOVERY_TTL) {
      clearPendingPayment();
      return null;
    }

    return {
      ...pending,
      gateway:
        pending.gateway ||
        (pending.transactionId.startsWith("BF-") ? "boomfi" : "paypal"),
      serviceId: pending.serviceId || "services",
    };
  } catch (error) {
    console.error("Could not restore pending payment:", error);
    return null;
  }
}

export function savePendingPayment(payment) {
  const existing = readPendingPayment();
  const pending = {
    ...existing,
    ...payment,
    timestamp:
      existing?.transactionId === payment.transactionId
        ? existing.timestamp
        : payment.timestamp || Date.now(),
  };

  localStorage.setItem(PENDING_PAYMENT_STORAGE_KEY, JSON.stringify(pending));
  localStorage.removeItem(LEGACY_BOOMFI_STORAGE_KEY);
  return pending;
}

export function clearPendingPayment() {
  try {
    localStorage.removeItem(PENDING_PAYMENT_STORAGE_KEY);
    localStorage.removeItem(LEGACY_BOOMFI_STORAGE_KEY);
  } catch (error) {
    console.error("Could not clear pending payment recovery data:", error);
  }
}
