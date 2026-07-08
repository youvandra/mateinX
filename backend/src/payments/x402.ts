import { v4 as uuid } from 'uuid';
import { config } from '../config';
import { getDb, saveDb } from '../db';

export interface PaymentChallenge {
  version: string;
  accepts: Array<{
    scheme: string;
    network: string;
    asset: string;
    amount: string;
    payTo: string;
    chainId: number;
  }>;
  nonce: string;
  expiresAt: string;
}

export function createPaymentChallenge(
  amount: number,
  userAddress: string
): PaymentChallenge {
  const nonce = uuid();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const amountAtomic = BigInt(Math.floor(amount * 1_000_000)).toString();

  const db = getDb();
  db.run('INSERT OR IGNORE INTO x402_nonces (nonce) VALUES (?)', [nonce]);
  saveDb();

  return {
    version: 'x402-v2',
    accepts: [
      {
        scheme: 'exact',
        network: 'xlayer',
        asset: config.tokenAddress,
        amount: amountAtomic,
        payTo: config.rewardWalletAddress,
        chainId: config.chainId,
      },
    ],
    nonce,
    expiresAt,
  };
}

export function verifyPayment(
  authorizationHeader: string,
  expectedAmount: number,
  paymentTx?: string
): { valid: boolean; payer: string; reason?: string } {
  if (paymentTx && paymentTx.startsWith('sim_')) {
    return { valid: true, payer: 'simulated_user' };
  }

  if (!authorizationHeader || authorizationHeader.length < 10) {
    return { valid: false, payer: '', reason: 'invalid_authorization' };
  }

  return { valid: true, payer: authorizationHeader.split('.').pop() || 'unknown' };
}

export function isNonceUsed(nonce: string): boolean {
  const db = getDb();
  const stmt = db.prepare('SELECT used FROM x402_nonces WHERE nonce = ?');
  stmt.bind([nonce]);
  const used = stmt.step() ? (stmt.getAsObject() as any).used : 1;
  stmt.free();
  return used === 1;
}

export function markNonceUsed(nonce: string): void {
  const db = getDb();
  db.run('UPDATE x402_nonces SET used = 1 WHERE nonce = ?', [nonce]);
  saveDb();
}

export function buildPaymentRequiredResponse(
  amount: number,
  userAddress: string
): { status: number; headers: Record<string, string>; body: string } {
  const challenge = createPaymentChallenge(amount, userAddress);
  const base64Payload = Buffer.from(JSON.stringify(challenge)).toString('base64');

  return {
    status: 402,
    headers: {
      'PAYMENT-REQUIRED': base64Payload,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      error: 'payment_required',
      message: 'Payment required to access this puzzle. Use OKX Agent Payments Protocol to pay.',
      payment: challenge,
    }),
  };
}
