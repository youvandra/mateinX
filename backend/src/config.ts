import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3006', 10),
  databasePath: process.env.DATABASE_PATH || './data/mateinx.db',
  okxApiKey: process.env.OKX_API_KEY || '',
  okxSecretKey: process.env.OKX_SECRET_KEY || '',
  okxPassphrase: process.env.OKX_PASSPHRASE || '',
  rewardWalletAddress: process.env.REWARD_WALLET_ADDRESS || '0x08d3e28263766be87fb251d768cf6dcdeec91275',
  entryFees: {
    easy: 0.5,
    medium: 0.5,
    hard: 1.0,
    grandmaster: 2.0,
  },
  rewards: {
    easy: parseFloat(process.env.EASY_REWARD || '0.3'),
    medium: parseFloat(process.env.MEDIUM_REWARD || '1.0'),
    hard: parseFloat(process.env.HARD_REWARD || '3.0'),
    grandmaster: parseFloat(process.env.GRANDMASTER_REWARD || '10.0'),
  },
  puzzleDbUrl: 'https://database.lichess.org/lichess_db_puzzle.csv.zst',
  tokenAddress: '0x779ded0c9e1022225f8e0630b35a9b54be713736',
  chainId: 196,
};
