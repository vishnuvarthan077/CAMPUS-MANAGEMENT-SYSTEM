/**
 * Mock Payment Gateway Service
 * NOTE: This is purely a simulation for academic/demonstration purposes.
 * NO real banking or monetary transactions are performed.
 */

const processMockPayment = async (fee, { paymentMethod = "Mock Gateway", simulateFailure = false } = {}) => {
  if (fee.status === "PAID") {
    const error = new Error("This invoice has already been paid.");
    error.statusCode = 400;
    throw error;
  }

  if (fee.status === "CANCELLED") {
    const error = new Error("Cannot process payment for a cancelled invoice.");
    error.statusCode = 400;
    throw error;
  }

  if (simulateFailure) {
    return {
      success: false,
      status: "FAILED",
      message: "Simulated payment failure (bank gateway timeout or declined).",
      isSimulation: true,
    };
  }

  // Generate simulated unique transaction ID
  const randomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
  const transactionId = `TXN_MOCK_${Date.now()}_${randomSuffix}`;
  const paidAt = new Date();

  fee.status = "PAID";
  fee.paymentMethod = paymentMethod;
  fee.transactionId = transactionId;
  fee.paidAt = paidAt;

  await fee.save();

  return {
    success: true,
    status: "SUCCESS",
    message: "Payment successfully simulated and invoice marked as PAID.",
    transaction: {
      transactionId,
      invoiceNumber: fee.invoiceNumber,
      amount: fee.amount,
      paymentMethod,
      paidAt,
      isSimulation: true,
    },
  };
};

module.exports = {
  processMockPayment,
};

