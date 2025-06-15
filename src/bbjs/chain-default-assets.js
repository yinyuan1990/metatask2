export const chainDefaultAssetMap = {
  1: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    coinGeckoCoinId: 'ethereum',
    coinGeckoPlatformId: 'ethereum',
    rpcUrl: "https://web3.mytokenpocket.vip",
    rpcUrls: ["https://web3.mytokenpocket.vip", "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"]
  },
  56: {
    symbol: 'BNB',
    name: 'BNB',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
    coinGeckoCoinId: 'binancecoin',
    coinGeckoPlatformId: 'binance-smart-chain',
    rpcUrl: "https://bsc-dataseed.binance.org",
    rpcUrls: ["https://bsc-dataseed.binance.org", "https://bsc-dataseed1.binance.org", "https://bsc-dataseed2.binance.org"]
  },
  137: {
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
    coinGeckoCoinId: 'matic-network',
    coinGeckoPlatformId: 'polygon-pos',
    rpcUrl: "https://polygon-rpc.com",
    rpcUrls: ["https://polygon-rpc.com", "https://polygon-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"]
  },
  10: {
    symbol: 'ETH',
    name: 'Optimism',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
    coinGeckoCoinId: 'ethereum',
    coinGeckoPlatformId: 'optimistic-ethereum',
    rpcUrl: "https://mainnet.optimism.io",
    rpcUrls: ["https://mainnet.optimism.io", "https://optimism-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"]
  },
  42161: {
    symbol: 'ETH',
    name: 'Arbitrum',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg',
    coinGeckoCoinId: 'ethereum',
    coinGeckoPlatformId: 'arbitrum-one',
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    rpcUrls: ["https://arb1.arbitrum.io/rpc", "https://arbitrum-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"]
  },
  8453: {
    symbol: 'ETH',
    name: 'Base',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/30980/large/base-logo-icon.png',
    coinGeckoCoinId: 'ethereum',
    coinGeckoPlatformId: 'base',
    rpcUrl: "https://mainnet.base.org",
    rpcUrls: ["https://mainnet.base.org", "https://base-mainnet.public.blastapi.io"]
  },
  324: {
    symbol: 'ETH',
    name: 'zkSync',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/40061/large/zksync.jpg',
    coinGeckoCoinId: 'ethereum',
    coinGeckoPlatformId: 'zksync',
    rpcUrl: "https://mainnet.era.zksync.io",
    rpcUrls: ["https://mainnet.era.zksync.io", "https://zksync2-mainnet.zksync.io"]
  },
  43114: {
    symbol: 'AVAX',
    name: 'Avalanche',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite.png',
    coinGeckoCoinId: 'avalanche-2',
    coinGeckoPlatformId: 'avalanche',
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"]
  },
  250: {
    symbol: 'FTM',
    name: 'Fantom',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/4001/large/Fantom.png',
    coinGeckoCoinId: 'fantom',
    coinGeckoPlatformId: 'fantom',
    rpcUrl: "https://rpcapi.fantom.network",
    rpcUrls: ["https://rpcapi.fantom.network"]
  },
  25: {
    symbol: 'CRO',
    name: 'Cronos',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/7310/large/cro_token_logo.png',
    coinGeckoCoinId: 'crypto-com-chain',
    coinGeckoPlatformId: 'cronos',
    rpcUrl: "https://evm.cronos.org",
    rpcUrls: ["https://evm.cronos.org"]
  },
  11155111: {
    symbol: 'ETH',
    name: 'Sepolia',
    decimals: 18,
    logoURI: 'https://trustwallet.com/assets/images/blockchains/ethereum/info/logo.png', // 使用 Ethereum Trust 图标
    coinGeckoCoinId: 'ethereum', // 测试网无 CoinGecko 支持
    coinGeckoPlatformId: 'ethereum',
    rpcUrl: 'https://sepolia.infura.io',
    rpcUrls: ['https://sepolia.infura.io', 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID']
  },
  59141: {
    symbol: 'ETH',
    name: 'Linea Sepolia',
    decimals: 18,
    logoURI: 'https://trustwallet.com/assets/images/blockchains/ethereum/info/logo.png', // 没有官方 Linea 测试网图标，沿用 ETH
    coinGeckoCoinId: 'ethereum',
    coinGeckoPlatformId: 'ethereum',
    rpcUrl: 'https://rpc.sepolia.linea.build',
    rpcUrls: ['https://rpc.sepolia.linea.build']
  },
  6342: {
    symbol: 'tETH',
    name: 'MegaETH Testnet',
    decimals: 18,
    logoURI: 'https://trustwallet.com/assets/images/blockchains/ethereum/info/logo.png', // 没有官方图标，沿用 ETH
    coinGeckoCoinId: 'ethereum',
    coinGeckoPlatformId: 'ethereum',
    rpcUrl: 'https://carrot.megaeth.com/rpc',
    rpcUrls: ['https://carrot.megaeth.com/rpc']
  },
  //2222: {
  //  symbol: 'KAVA',
  //  name: 'Kava',
  //  decimals: 18,
  //  logoURI: 'https://assets.coingecko.com/coins/images/9763/large/kava.png', // CoinGecko 上的 Kava 图标
  //  coinGeckoCoinId: 'kava',
  //  coinGeckoPlatformId: 'kava', 
  //  rpcUrl: 'https://rpc.kava.io', // 官方RPC地址
  //  rpcUrls: ['https://rpc.kava.io', 'https://kava-rpc.chainnode.com'] // 备用RPC节点
  //}
}


// //主币信息



export function getTrustWalletChainLogo(chainId) {
  const folderMap = {
    1: 'ethereum',
    56: 'smartchain',
    137: 'polygon',
    10: 'optimism',
    42161: 'arbitrum',
    8453: 'base',
    324: 'zksync',
    43114: 'avalanche',
    250: 'fantom',
    2222: 'kava',
    11155111: 'ethereum',
    59141: 'ethereum',
    6342: 'ethereum',
  }

  const folder = folderMap[chainId]
  return folder
    ? `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${folder}/info/logo.png`
    : 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' // fallback
}


export const chainDefaultTokenMap = {
  1: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
    contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    coinGeckoCoinId: 'tether',
    coinGeckoPlatformId: 'ethereum',
    rpcUrl: "https://web3.mytokenpocket.vip",
    rpcUrls: ["https://web3.mytokenpocket.vip", "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"]
  },
  56: {
    symbol: 'CAKE',
    name: 'PancakeSwap',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/12632/large/IMG_0440.PNG',
    contractAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    coinGeckoCoinId: 'pancakeswap-token',
    coinGeckoPlatformId: 'binancecoin',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    rpcUrls: ["https://bsc-dataseed.binance.org", "https://bsc-dataseed1.binance.org", "https://bsc-dataseed2.binance.org"]
  },
  137: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    coinGeckoCoinId: 'usd-coin',
    coinGeckoPlatformId: 'matic-network',
    rpcUrl: 'https://polygon-rpc.com',
    rpcUrls: ["https://polygon-rpc.com", "https://polygon-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"]
  },
  10: {
    symbol: 'USDC',
    name: 'USD Coin (Optimism)',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    contractAddress: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    coinGeckoCoinId: 'usd-coin',
    coinGeckoPlatformId: 'optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    rpcUrls: ["https://mainnet.optimism.io", "https://optimism-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"]
  },
  42161: {
    symbol: 'USDC',
    name: 'USD Coin (Arbitrum)',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    contractAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    coinGeckoCoinId: 'usd-coin',
    coinGeckoPlatformId: 'arbitrum',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    rpcUrls: ["https://arb1.arbitrum.io/rpc", "https://arbitrum-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"]
  },
  8453: {
    symbol: 'USDbC',
    name: 'USD Base Coin',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    contractAddress: '0xd9AA94D6fFBAc94f8F243B8Af58d226fdc563f93',
    coinGeckoCoinId: 'usd-coin',
    coinGeckoPlatformId: 'base',
    rpcUrl: 'https://mainnet.base.org',
    rpcUrls: ["https://mainnet.base.org", "https://base-mainnet.public.blastapi.io"]
  },
  324: {
    symbol: 'USDC',
    name: 'USD Coin (zkSync)',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    contractAddress: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
    coinGeckoCoinId: 'usd-coin',
    coinGeckoPlatformId: 'zksync',
    rpcUrl: 'https://mainnet.era.zksync.io',
    rpcUrls: ["https://mainnet.era.zksync.io", "https://zksync2-mainnet.zksync.io"]
  },
  43114: {
    symbol: 'USDC',
    name: 'USD Coin (Avalanche C-Chain)',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    contractAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    coinGeckoCoinId: 'usd-coin',
    coinGeckoPlatformId: 'avalanche',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"]
  },
  250: {
    symbol: 'USDC',
    name: 'USD Coin (Fantom)',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    contractAddress: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
    coinGeckoCoinId: 'usd-coin',
    coinGeckoPlatformId: 'fantom',
    rpcUrl: 'https://rpcapi.fantom.network',
    rpcUrls: ["https://rpcapi.fantom.network"]
  },
  25: {
    symbol: 'USDC',
    name: 'USD Coin (Cronos)',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    contractAddress: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
    coinGeckoCoinId: 'usd-coin',
    coinGeckoPlatformId: 'cronos',
    rpcUrl: 'https://evm.cronos.org',
    rpcUrls: ["https://evm.cronos.org"]
  }
}



// 网络信息
export const chainArr = [
  {
    "name": "Ethereum",
    "chainId": "1",
    "symbol": "ETH",
    "rpcUrls": ["https://ethereum.blockpi.network/v1/rpc/public"],
    "explorer": "https://etherscan.io",
    "decimals": 18
  },
  {
    "name": "BSC",
    "chainId": "56",
    "symbol": "BNB",
    "rpcUrls": ["https://bsc-dataseed.binance.org"],
    "explorer": "https://bscscan.com",
    "decimals": 18
  },
  {
    "name": "Polygon",
    "chainId": "137",
    "symbol": "MATIC",
    "rpcUrls": ["https://polygon-rpc.com"],
    "explorer": "https://polygonscan.com",
    "decimals": 18
  },
  {
    "name": "zkSync Era",
    "chainId": "324",
    "symbol": "ETH",
    "rpcUrls": ["https://mainnet.era.zksync.io"],
    "explorer": "https://explorer.zksync.io",
    "decimals": 18
  },
  {
    "name": "Optimism",
    "chainId": "10",
    "symbol": "ETH",
    "rpcUrls": ["https://mainnet.optimism.io"],
    "explorer": "https://optimistic.etherscan.io",
    "decimals": 18
  },
  {
    "name": "Base",
    "chainId": "8453",
    "symbol": "ETH",
    "rpcUrls": ["https://mainnet.base.org"],
    "explorer": "https://basescan.org",
    "decimals": 18
  },
  {
    "name": "Arbitrum One",
    "chainId": "42161",
    "symbol": "ETH",
    "rpcUrls": ["https://arb1.arbitrum.io/rpc"],
    "explorer": "https://arbiscan.io",
    "decimals": 18
  },
  {
    "name": "Avalanche",
    "chainId": "43114",
    "symbol": "AVAX",
    "rpcUrls": ["https://api.avax.network/ext/bc/C/rpc"],
    "explorer": "https://snowtrace.io",
    "decimals": 18
  },
  {
    "name": "Fantom",
    "chainId": "250",
    "symbol": "FTM",
    "rpcUrls": ["https://rpcapi.fantom.network"],
    "explorer": "https://ftmscan.com",
    "decimals": 18
  },
  {
    "name": "Cronos",
    "chainId": "25",
    "symbol": "CRO",
    "rpcUrls": ["https://evm.cronos.org"],
    "explorer": "https://cronoscan.com",
    "decimals": 18
  },
  {
    "name": "Sepolia",
    "chainId": "11155111",
    "symbol": "ETH",
    "rpcUrls": ["https://sepolia.infura.io"],
    "explorer": "https://sepolia.etherscan.io",
    "decimals": 18
  },
  {
    "name": "Linea Sepolia",
    "chainId": "59141",
    "symbol": "ETH",
    "rpcUrls": ["https://rpc.sepolia.linea.build"],
    "explorer": "https://sepolia.lineascan.build",
    "decimals": 18
  },
  {
    "name": "MegaETH Testnet",
    "chainId": "6342",
    "symbol": "ETH",
    "rpcUrls": ["https://carrot.megaeth.com/rpc"],
    "explorer": "https://mega-explorer.megaeth.net",
    "decimals": 18
  }//,
  //{
  //  name: "Kava",
  //  chainId: "2222",
  //  symbol: "KAVA",
  //  rpcUrls: ["https://rpc.kava.io"],
  //  explorer: "https://explorer.kava.io",
  //  decimals: 18
  //}
]

export function getSymbolByChainId(chainId) {
  const id = typeof chainId === 'string' ? parseInt(chainId, 10) : chainId
  if (chainDefaultAssetMap[id] && chainDefaultAssetMap[id].symbol) {
    return chainDefaultAssetMap[id].symbol
  }
  return 'UNKNOWN'
}

export function getNameByChainId(chainId) {
  const id = typeof chainId === 'string' ? parseInt(chainId, 10) : chainId
  if (chainDefaultAssetMap[id] && chainDefaultAssetMap[id].name) {
    
    return chainDefaultAssetMap[id].name
  }
  return 'UNKNOWN'
}
