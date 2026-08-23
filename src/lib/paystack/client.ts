import "server-only";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function paystackHeaders() {
  return {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  };
}

type PaystackResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

export async function createTransferRecipient(params: {
  name: string;
  accountNumber: string;
  bankCode: string;
}) {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transferrecipient`, {
    method: "POST",
    headers: paystackHeaders(),
    body: JSON.stringify({
      type: "nuban",
      name: params.name,
      account_number: params.accountNumber,
      bank_code: params.bankCode,
      currency: "NGN",
    }),
  });

  const json: PaystackResponse<{ recipient_code: string }> = await res.json();
  if (!json.status)
    throw new Error(json.message || "Failed to create recipient");
  return json.data.recipient_code;
}

export async function initiateTransfer(params: {
  amount: number; // in the smallest currency unit (kobo)
  recipientCode: string;
  reference: string;
  reason?: string;
}) {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transfer`, {
    method: "POST",
    headers: paystackHeaders(),
    body: JSON.stringify({
      source: "balance",
      amount: params.amount,
      recipient: params.recipientCode,
      reference: params.reference,
      reason: params.reason ?? "TalentQ withdrawal",
    }),
  });

  const json: PaystackResponse<{
    transfer_code: string;
    reference: string;
    status: string;
  }> = await res.json();

  if (!json.status)
    throw new Error(json.message || "Failed to initiate transfer");
  return json.data;
}

export async function initializeTransaction(params: {
  email: string;
  amount: number; // kobo
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}) {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: paystackHeaders(),
    body: JSON.stringify({
      email: params.email,
      amount: params.amount,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const json: PaystackResponse<{
    authorization_url: string;
    reference: string;
  }> = await res.json();
  if (!json.status)
    throw new Error(json.message || "Failed to initialize transaction");
  return json.data;
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
    {
      headers: paystackHeaders(),
    },
  );

  const json: PaystackResponse<{
    status: string;
    amount: number;
    reference: string;
  }> = await res.json();
  if (!json.status)
    throw new Error(json.message || "Failed to verify transaction");
  return json.data;
}

export async function listBanks(params?: { country?: string }) {
  const country = params?.country ?? "nigeria";
  const res = await fetch(
    `${PAYSTACK_BASE_URL}/bank?country=${country}&currency=NGN`,
    {
      headers: paystackHeaders(),
    },
  );

  const json: PaystackResponse<
    { name: string; code: string; longcode: string }[]
  > = await res.json();
  if (!json.status) throw new Error(json.message || "Failed to list banks");
  return json.data;
}

export async function resolveAccount(params: {
  accountNumber: string;
  bankCode: string;
}) {
  const res = await fetch(
    `${PAYSTACK_BASE_URL}/bank/resolve?account_number=${params.accountNumber}&bank_code=${params.bankCode}`,
    {
      headers: paystackHeaders(),
    },
  );

  const json: PaystackResponse<{
    account_number: string;
    account_name: string;
  }> = await res.json();
  if (!json.status)
    throw new Error(json.message || "Failed to resolve account");
  return json.data;
}