import { ethers } from 'ethers'
import * as bip39 from 'bip39'
import { assetManager } from './AssetManager'
// 用于本地存储（可替换成 Telegram 云存储）
const STORAGE = typeof window !== 'undefined' ? window.localStorage : new Map()

export function save(key, value) {
  STORAGE.setItem ? STORAGE.setItem(key, JSON.stringify(value)) : STORAGE.set(key, JSON.stringify(value))
}
export function load(key, defaultValue = null) {
  const raw = STORAGE.getItem ? STORAGE.getItem(key) : STORAGE.get(key)
  if (!raw) return defaultValue
  try {
    return JSON.parse(raw)
  } catch (e) {
    return defaultValue
  }
}

const ACCOUNTS_KEY = 'wallet_accounts'
const CURRENT_KEY = 'current_wallet_id'
const DEFAULT_PATH = "m/44'/60'/0'/0/0" // EVM BIP-44

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
  25: 'Cronos',
  11155111: 'Sepolia',
  59141: 'Linea Sepolia',
  6342: 'MegaETH Testnet',
}


function getDerivePathByChainId(chainId) {
  // 默认 coinType 是 60（Ethereum）
  const coinTypeMap = {
    1: 60,         // Ethereum
    56: 60,        // BSC
    137: 60,       // Polygon
    10: 60,        // Optimism
    42161: 60,     // Arbitrum
    8453: 60,      // Base
    324: 60,       // zkSync
    43114: 60,     // Avalanche
    250: 60,       // Fantom
    25: 60,        // Cronos
    11155111: 60,  // Sepolia (testnet)
    59141: 60,     // Linea Sepolia
    6342: 60       // MegaETH Testnet
  }

  const coinType = coinTypeMap[chainId] ?? 60
  return `m/44'/${coinType}'/0'/0/0`
}
class AccountManager {
  constructor() {
    this.accounts = load(ACCOUNTS_KEY, [])
    this.currentAccountId = load(CURRENT_KEY, null)
  }

  save() {
    save(ACCOUNTS_KEY, this.accounts)
    save(CURRENT_KEY, this.currentAccountId)
  }

  /*
  importMnemonic(mnemonic, payPassword) {

    console.log('importMnemonic', mnemonic, payPassword)
    if (!bip39.validateMnemonic(mnemonic)) {
      // return '无效助记词';
      throw new Error('无效助记词')
    }
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, DEFAULT_PATH)
    const id = crypto.randomUUID?.() || Date.now().toString()

    const entry = {
      chainId: '1',
      coinType: 60,
      address: wallet.address,
      path: DEFAULT_PATH,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
    }

    const account = {
      walletId: id,
      mnemonic,
      privateKey: null,
      importType: 'mnemonic',
      addresses: [entry],
      currentChainId: '1',
      payPassword: payPassword, // ✅ 新增字段
    }

    this.accounts.push(account)
    if (!this.currentAccountId) this.currentAccountId = id
    this.save()

      // ✅ 自动添加默认主币资产
     //assetManager.addDefaultMainAsset(id, '1', wallet.address).catch(console.error)

     Object.keys(folderMap).forEach(chainId => {
      const numericChainId = Number(chainId)
      console.log('addDefaultMainAsset', id, numericChainId.toString(), wallet.address)
      assetManager.addDefaultMainAsset(id, numericChainId.toString(), wallet.address).catch(console.error)
    })

    return account
  }*/
  async createFromMnemonic(payPassword) {
    console.log(payPassword)
    const mnemonic = bip39.generateMnemonic()
    return this.importMnemonic(mnemonic, payPassword)
  }


  isValidMnemonic(mnemonic) {
   
    console.log("isValidMnemonic join ")
    return bip39.validateMnemonic(mnemonic)
  }



  async importMnemonic(mnemonic, payPassword) {
    console.log('importMnemonic', mnemonic, payPassword)
  
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('无效助记词')
    }
  
    const id = crypto.randomUUID?.() || Date.now().toString()
    const path = DEFAULT_PATH
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path)
  
    const sharedEntry = {
      coinType: 60,
      address: wallet.address,
      path,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
    }
  
    // 所有 EVM 链复用相同的地址/私钥
    const addresses = Object.keys(folderMap).map(chainId => ({
      chainId,
      ...sharedEntry,
    }))
  
    const start = performance.now()
    // 添加所有链的主币资产
    await Promise.all(
      addresses.map(addr =>
        assetManager.addDefaultMainAsset(id, addr.chainId, addr.address).catch(console.error)
      )
    )
    const end = performance.now()
    console.log(`批量添加主币耗时: ${(end - start).toFixed(2)}ms`)
    const account = {
      walletId: id,
      mnemonic,
      privateKey: wallet.privateKey,
      importType: 'mnemonic',
      addresses,
      currentChainId: '1',
      payPassword,
    }
  
    this.accounts.push(account)
    if (!this.currentAccountId) this.currentAccountId = id
    this.save()
  
    return account
  }
  
  
 
  /*
  async importMnemonic(mnemonic, payPassword) {
    console.log('importMnemonic', mnemonic, payPassword)
  
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('无效助记词')
    }
  
    const id = crypto.randomUUID?.() || Date.now().toString()
  


    var privateKeycopy =""

    
    // 创建地址和钱包
    const addresses = Object.keys(folderMap).map(chainId => {
      const numericChainId = Number(chainId)
      const path = getDerivePathByChainId(numericChainId)
      const wallet = ethers.Wallet.fromMnemonic(mnemonic, path)
      privateKeycopy = wallet.privateKey
      return {
        chainId: chainId,
        coinType: 60,
        address: wallet.address,
        path,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
      }
    })



  
    // 异步等待所有 addDefaultMainAsset 执行完成
    await Promise.all(
      addresses.map(addr =>
        assetManager.addDefaultMainAsset(id, addr.chainId, addr.address).catch(console.error)
      )
    )
  
    const account = {
      walletId: id,
      mnemonic,
      privateKey: privateKeycopy,
      importType: 'mnemonic',
      addresses,
      currentChainId: '1',
      payPassword,
    }
  
    this.accounts.push(account)
    if (!this.currentAccountId) this.currentAccountId = id
    this.save()
  
    return account
  }*/
  
  async importPrivateKey(privateKey, payPassword) {
    if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
      throw new Error('私钥格式错误')
    }
  
    const id = crypto.randomUUID?.() || Date.now().toString()
    const wallet = new ethers.Wallet(privateKey)
  
    const addresses = Object.keys(folderMap).map(chainId => {
      return {
        chainId,
        coinType: 60,
        address: wallet.address,
        path: null,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
      }
    })
    const start = performance.now()
    // 等待所有主币资产添加完成
    await Promise.all(
      addresses.map(addr =>
        assetManager.addDefaultMainAsset(id, addr.chainId, addr.address).catch(console.error)
      )
    )
    const end = performance.now()
    console.log(`批量添加主币耗时: ${(end - start).toFixed(2)}ms`)
    const account = {
      walletId: id,
      mnemonic: null,
      privateKey,
      importType: 'privateKey',
      addresses,
      currentChainId: '1',
      payPassword,
    }
  
    this.accounts.push(account)
    if (!this.currentAccountId) this.currentAccountId = id
    this.save()
  
    return account
  }
  
    
  /*
  async importMnemonic(mnemonic, payPassword) {
    console.log('importMnemonic', mnemonic, payPassword)
  
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('无效助记词')
    }
  
    const id = crypto.randomUUID?.() || Date.now().toString()
   
    const addresses = Object.keys(folderMap).map(chainId => {
      const numericChainId = Number(chainId)
      const path = getDerivePathByChainId(numericChainId)
      const wallet = ethers.Wallet.fromMnemonic(mnemonic, path)
  
      // 添加默认主币资产
      assetManager.addDefaultMainAsset(id, chainId, wallet.address).catch(console.error)
  
      return {
        chainId: chainId,
        coinType: 60,
        address: wallet.address,
        path: path,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
      }
    })
  
    const account = {
      walletId: id,
      mnemonic,
      privateKey: null,
      importType: 'mnemonic',
      addresses,
      currentChainId: '1', // 默认当前链是 Ethereum
      payPassword,
    }
  
    this.accounts.push(account)
    if (!this.currentAccountId) this.currentAccountId = id
    this.save()
  
    return account
  }




  importPrivateKey(privateKey, payPassword) {
    if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
      throw new Error('私钥格式错误')
    }
  
    const id = crypto.randomUUID?.() || Date.now().toString()
    const wallet = new ethers.Wallet(privateKey)
  
    // 所有链都复用同一个地址，但 path 为 null（因为私钥导入不需要路径）
    const addresses = Object.keys(folderMap).map(chainId => {
      const numericChainId = Number(chainId)
  
      // 添加默认主币资产
      assetManager.addDefaultMainAsset(id, chainId, wallet.address).catch(console.error)
  
      return {
        chainId: chainId,
        coinType: 60,
        address: wallet.address,
        path: null,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
      }
    })
  
    const account = {
      walletId: id,
      mnemonic: null,
      privateKey,
      importType: 'privateKey',
      addresses,
      currentChainId: '1', // 默认链为 Ethereum
      payPassword,
    }
  
    this.accounts.push(account)
    if (!this.currentAccountId) this.currentAccountId = id
    this.save()
  
    return account
  }
  */

  /*
  importPrivateKey(privateKey,payPassword) {


    
    if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) throw new Error('私钥格式错误')
    const wallet = new ethers.Wallet(privateKey)
    const id = crypto.randomUUID?.() || Date.now().toString()

    const entry = {
      chainId: '1',
      coinType: 60,
      address: wallet.address,
      path: null,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
    }

    const account = {
      walletId: id,
      mnemonic: null,
      privateKey,
      importType: 'privateKey',
      addresses: [entry],
      currentChainId: '1',
      payPassword: payPassword, // ✅ 新增字段
    }

    this.accounts.push(account)
    if (!this.currentAccountId) this.currentAccountId = id
    this.save()

    // ✅ 自动添加默认主币资产
    //assetManager.addDefaultMainAsset(id, '1', wallet.address).catch(console.error)

    
    Object.keys(folderMap).forEach(chainId => {
      const numericChainId = Number(chainId)
      console.log('addDefaultMainAsset', id, numericChainId.toString(), wallet.address)
      assetManager.addDefaultMainAsset(id, numericChainId.toString(), wallet.address).catch(console.error)
    })


    return account
  }*/

      /**
   * 更新当前账户的支付密码
   * @param {string} newPassword 新密码
   * @returns {boolean} 是否更新成功
   */
  updatePayPassword(newPassword) {
    const acc = this.getCurrentAccount()
    if (!acc) return false

    acc.payPassword = newPassword
    this.save()
    return true
  }

  getCurrentAccountIndex() {
    return this.accounts.findIndex(acc => acc.walletId === this.currentAccountId)
  }

  getCurrentAccount() {
    
    return this.accounts.find(acc => acc.walletId === this.currentAccountId)
  }

  getCurrentAddress() {
    
    const acc = this.getCurrentAccount()
    return acc?.addresses?.find(a => a.chainId === acc.currentChainId) || null
  }

  getCurrentChainId() {
    const acc = this.getCurrentAccount()
    return acc ? acc.currentChainId : null
  }

  getAddressByWalletIdAndChainId(walletId, chainId) {
    //console.log('getAddressByWalletIdAndChainId', walletId, chainId)
    const account = this.accounts.find(acc => acc.walletId === walletId)
    if (!account) return null
    return account.addresses.find(addr => addr.chainId === chainId) || null
  }
  
  switchAccount(walletId) {
    this.currentAccountId = walletId
    this.save()
  }

  getAllAccounts() {
    return this.accounts
  }

  deleteAccount(walletId) {
    const i = this.accounts.findIndex(acc => acc.walletId === walletId)
    if (i < 0 || this.accounts.length <= 1) return false
    this.accounts.splice(i, 1)
    if (walletId === this.currentAccountId) {
      this.currentAccountId = this.accounts[0].walletId
    }
    this.save()
    return true
  }


  deleteCurrentAccount() {
    const currentId = this.currentAccountId

    console.log("deletebefor "+this.getCurrentAddress().address)
    if (!currentId) return false

    const index = this.accounts.findIndex(acc => acc.walletId === currentId)
    if (index === -1) return false

    // 删除当前账号
    this.accounts.splice(index, 1)

    if (this.accounts.length === 0) {
      this.currentAccountId = null
    } else {
      // 设置新的当前账号
      this.currentAccountId = this.accounts[0].walletId
      console.log("deleteafter "+this.getCurrentAddress().address)
    }

    this.save()
    
    return true
  }


  
  /**
   * 切换当前账户到指定链（如果该链无地址，则自动派生；仅限助记词账户）
   * @param {string} chainId
   * @returns {AddressEntry|null} 切换后的地址信息
   */
  
  switchToChain2(chainId) {

    
    const acc = this.getCurrentAccount()
    console.log('switchToChain before', this.getCurrentAccount().currentChainId)
    if (!acc) return null


      
      
    let entry = acc.addresses.find(a => a.chainId === chainId)

    console.log('switchToChain join', JSON.stringify(entry))

    if (!entry && acc.mnemonic) {
      // 默认派生路径（可扩展为链特定路径）
      const wallet = ethers.Wallet.fromMnemonic(acc.mnemonic, DEFAULT_PATH)
      entry = {
        chainId,
        coinType: 60,
        address: wallet.address,
        path: DEFAULT_PATH,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey
      }
      acc.addresses.push(entry)
    }

    if (entry) {
      console.log('switchToChain center', this.getCurrentAccount().currentChainId)
      acc.currentChainId = chainId
      this.save()
      return entry
    }
    console.log('switchToChain after', this.getCurrentAccount().currentChainId)
    return null
  }


  switchToChain(chainId) {
    console.log('switchToChain', chainId);
    const acc = this.getCurrentAccount();
    console.log('switchToChain before', acc?.currentChainId);
  
    if (!acc) return null;
  
    let entry = acc.addresses.find(a => a.chainId === chainId);
    if (!entry) {
      if (acc.mnemonic) {
        // 用助记词派生地址
        const wallet = ethers.Wallet.fromMnemonic(acc.mnemonic, DEFAULT_PATH);
        entry = {
          chainId,
          coinType: 60,
          address: wallet.address,
          path: DEFAULT_PATH,
          publicKey: wallet.publicKey,
          privateKey: wallet.privateKey,
        };
        acc.addresses.push(entry);
      } else if (acc.privateKey) {
        // 用私钥生成地址（私钥通常只有一个对应地址）
        const wallet = new ethers.Wallet(acc.privateKey);
        entry = {
          chainId,
          coinType: 60,
          address: wallet.address,
          path: '', // 私钥无路径或自定义空
          publicKey: wallet.publicKey,
          privateKey: acc.privateKey,
        };
        acc.addresses.push(entry);
      }
    }
  
    if (entry) {
      console.log('switchToChain center', acc.currentChainId);
      acc.currentChainId = chainId;
      this.save();
      return entry;
    }
  
    console.log('switchToChain after', acc.currentChainId);
    return null;
  }
  

}


/**
 * 获取主币或代币余额（自动识别）
 * @param {object} options 参数
 * @param {string} options.rpcUrl 链的 RPC 地址
 * @param {string} options.address 用户地址
 * @param {string} [options.contractAddress] 可选，代币合约地址；不传表示主币
 * @returns {Promise<string>} 返回余额（单位为最小单位，需除以 decimals）
 */
export async function fetchTokenBalance({ rpcUrl, address, contractAddress }) {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

  try {
    if (!contractAddress) {
      // 主币余额
      const balance = await provider.getBalance(address)
      return balance.toString() // 返回 Wei 单位
    } else {
      // 合约代币余额
      const erc20Abi = ['function balanceOf(address) view returns (uint256)']
      const contract = new ethers.Contract(contractAddress, erc20Abi, provider)
      const balance = await contract.balanceOf(address)
      return balance.toString()
    }
  } catch (e) {
    console.error(`[fetchTokenBalance] 余额获取失败:`, e)
    return '0'
  }
}

export const accountManager = new AccountManager()

window.accountManager = accountManager;
