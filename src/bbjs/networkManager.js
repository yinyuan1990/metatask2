import Vue from 'vue'
const eventBus = new Vue() // 全局事件总线

const LOCAL_STORAGE_KEY = 'joinedNetworkIds'

const defaultJoinedIds = ['1', '56', '137', '11155111', '59141', '6342']
const testnetIds = ['11155111', '59141', '6342']
const updateRpcUrlIds = ['56', '137'] // ✅ 只有 BSC 和 Polygon 为 true

const rawChains = [
  {
    name: 'Ethereum Main Network',
    chainId: '1',
    symbol: 'ETH',
    rpcUrls: ['https://ethereum.blockpi.network/v1/rpc/public'],
    explorer: 'https://etherscan.io',
    decimals: 18
  },
  {
    name: 'BSC Main Network',
    chainId: '56',
    symbol: 'BNB',
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    explorer: 'https://bscscan.com',
    decimals: 18
  },
  {
    name: 'Polygon Main Network',
    chainId: '137',
    symbol: 'MATIC',
    rpcUrls: ['https://polygon-rpc.com'],
    explorer: 'https://polygonscan.com',
    decimals: 18
  },
  {
    name: 'zkSync Era Main Network',
    chainId: '324',
    symbol: 'ETH',
    rpcUrls: ['https://mainnet.era.zksync.io'],
    explorer: 'https://explorer.zksync.io',
    decimals: 18
  },
  {
    name: 'Optimism Main Network',
    chainId: '10',
    symbol: 'ETH',
    rpcUrls: ['https://mainnet.optimism.io'],
    explorer: 'https://optimistic.etherscan.io',
    decimals: 18
  },
  {
    name: 'Base Main Network',
    chainId: '8453',
    symbol: 'ETH',
    rpcUrls: ['https://mainnet.base.org'],
    explorer: 'https://basescan.org',
    decimals: 18
  },
  {
    name: 'Arbitrum One Main Network',
    chainId: '42161',
    symbol: 'ETH',
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    explorer: 'https://arbiscan.io',
    decimals: 18
  },
  {
    name: 'Avalanche Main Network',
    chainId: '43114',
    symbol: 'AVAX',
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    explorer: 'https://snowtrace.io',
    decimals: 18
  },
  {
    name: 'Fantom Main Network',
    chainId: '250',
    symbol: 'FTM',
    rpcUrls: ['https://rpc.ankr.com/fantom'],
    explorer: 'https://ftmscan.com',
    decimals: 18
  },
  {
    name: 'Cronos Main Network',
    chainId: '25',
    symbol: 'CRO',
    rpcUrls: ['https://evm.cronos.org'],
    explorer: 'https://cronoscan.com',
    decimals: 18
  },
  {
    name: 'Sepolia Test Network ',
    chainId: '11155111',
    symbol: 'ETH',
    rpcUrls: ['https://rpc.sepolia.org'],
    explorer: 'https://sepolia.etherscan.io',
    decimals: 18
  },
  {
    name: 'Linea Sepolia',
    chainId: '59141',
    symbol: 'ETH',
    rpcUrls: ['https://rpc.sepolia.linea.build'],
    explorer: 'https://sepolia.lineascan.build',
    decimals: 18
  },
  {
    name: 'MegaETH Testnet',
    chainId: '6342',
    symbol: 'ETH',
    rpcUrls: ['https://rpc.megaeth.net'],
    explorer: 'https://mega-explorer.megaeth.net',
    decimals: 18
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

class NetworkManager {
  constructor() {
    this.chains = []
    this.selectedNetworkType = 1 // 1 当前网络，100 热门网络，默认 1
    this.init()
  }

  init() {
    const joinedIds = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
    const finalJoinedIds = joinedIds.length > 0 ? joinedIds : defaultJoinedIds

    this.chains = rawChains.map(item => ({
      ...item,
      isTestnet: testnetIds.includes(item.chainId),
      isJoined: finalJoinedIds.includes(item.chainId),
      isUpdateRpcUrl: updateRpcUrlIds.includes(item.chainId)
    }))
  }

  getAll() {
    return this.chains
  }

  getJoined() {
    return this.chains.filter(c => c.isJoined)
  }

  getById(chainId) {
    return this.chains.find(c => c.chainId === chainId)
  }

  getByChainId(chainId) {
    return this.getById(chainId)
  }

  setJoinStatus(chainId, isJoined) {
    const item = this.getById(chainId)
    if (item) {
      item.isJoined = isJoined
      this.saveToStorage()
    }
  }

  setSelectedNetworkType(type) {
    if (type === 1 || type === 100) {
      this.selectedNetworkType = type
      eventBus.$emit('selectedNetworkTypeChanged', type)
    }
  }

  getSelectedNetworkType() {
    return this.selectedNetworkType
  }

  saveToStorage() {
    const joinedIds = this.chains.filter(c => c.isJoined).map(c => c.chainId)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(joinedIds))
  }
}

const networkManager = new NetworkManager()

export { networkManager, eventBus }
