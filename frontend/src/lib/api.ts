const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006';

export class MateinXApi {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE;
  }

  async health(): Promise<{ status: string; puzzles: Record<string, number> }> {
    const res = await fetch(`${this.baseUrl}/v1/health`);
    return res.json();
  }

  async requestPuzzle(difficulty: string, userAddress: string) {
    const res = await fetch(`${this.baseUrl}/v1/puzzle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty, user_address: userAddress }),
    });

    if (res.status === 402) {
      const body = await res.json();
      return { paymentRequired: true, challenge: body, raw: res };
    }

    return res.json();
  }

  async confirmPuzzle(puzzleId: string, userAddress: string, paymentTx: string) {
    const res = await fetch(`${this.baseUrl}/v1/puzzle/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puzzle_id: puzzleId, user_address: userAddress, payment_tx: paymentTx }),
    });
    return res.json();
  }

  async solvePuzzle(gameId: string, solution: string, userAddress: string) {
    const res = await fetch(`${this.baseUrl}/v1/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_id: gameId, solution: solution, user_address: userAddress }),
    });
    return res.json();
  }

  async getGames(userAddress: string) {
    const res = await fetch(`${this.baseUrl}/v1/games/${userAddress}`);
    return res.json();
  }

  async getLeaderboard() {
    const res = await fetch(`${this.baseUrl}/v1/leaderboard`);
    return res.json();
  }

  async getUserStats(userAddress: string) {
    const res = await fetch(`${this.baseUrl}/v1/stats/${userAddress}`);
    return res.json();
  }
}

export const api = new MateinXApi();
