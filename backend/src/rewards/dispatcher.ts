import { config } from '../config';

export interface RewardResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export async function sendReward(
  userAddress: string,
  amount: number,
  gameId: string
): Promise<RewardResult> {
  if (!config.okxApiKey || !config.okxSecretKey) {
    console.warn('[Rewards] OKX API key not configured. Simulating reward send.');
    return {
      success: true,
      txHash: `sim_${gameId}_${Date.now()}`,
    };
  }

  try {
    const amountAtomic = BigInt(Math.floor(amount * 1_000_000)).toString();

    const txHash = await executeOnchainTransfer(userAddress, amountAtomic);

    return {
      success: true,
      txHash,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('[Rewards] Failed to send reward:', error);
    return {
      success: false,
      error,
    };
  }
}

async function executeOnchainTransfer(
  to: string,
  amountAtomic: string
): Promise<string> {
  const { execSync } = await import('child_process');

  const cmd = [
    'onchainos',
    'wallet',
    'send',
    '--to', to,
    '--token', config.tokenAddress,
    '--amount', amountAtomic,
    '--chain', String(config.chainId),
  ].join(' ');

  const output = execSync(cmd, { timeout: 30000 }).toString().trim();

  return output;
}
