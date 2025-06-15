import { ethers } from 'ethers'

/**
 * 获取当前地址 nonce（用于防止重复交易）
 */
export async function getNonce(rpcUrl, address) {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  return await provider.getTransactionCount(address, 'latest')
}

/**
 * 获取当前 gas 价格（返回 BigNumber）
 */
export async function getGasPrice(rpcUrl) {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  return await provider.getGasPrice()
}

/**
 * 查询交易状态
 * @param {string} rpcUrl
 * @param {string} txHash
 */
export async function getTransactionReceipt(rpcUrl, txHash) {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  return await provider.getTransactionReceipt(txHash) // 包含 status, blockNumber 等
}

/**
 * 发起主币转账（ETH/BNB/MATIC 等）
 */
export async function sendNativeToken({
  rpcUrl,
  privateKey,
  to,
  amount, // 单位 ETH
  gasPrice = null,
  nonce = null
}) {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  const wallet = new ethers.Wallet(privateKey, provider)

  const txParams = {
    to,
    value: ethers.utils.parseEther(amount.toString())
  }

  if (gasPrice) txParams.gasPrice = ethers.BigNumber.from(gasPrice)
  if (nonce !== null) txParams.nonce = nonce

  const tx = await wallet.sendTransaction(txParams)
  return tx.hash
}

/**
 * 发起 ERC20 代币转账（合约调用）
 */
export async function sendERC20Token({
  rpcUrl,
  privateKey,
  to,
  contractAddress,
  amount,      // 人类单位
  decimals = 18,
  gasPrice = null,
  gasLimit = 100_000,
  nonce = null
}) {
  const abi = ['function transfer(address to, uint256 value) returns (bool)']
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  const wallet = new ethers.Wallet(privateKey, provider)
  const contract = new ethers.Contract(contractAddress, abi, wallet)

  const value = ethers.utils.parseUnits(amount.toString(), decimals)

  const overrides = {
    gasLimit
  }
  if (gasPrice) overrides.gasPrice = ethers.BigNumber.from(gasPrice)
  if (nonce !== null) overrides.nonce = nonce

  const tx = await contract.transfer(to, value, overrides)
  return tx.hash
}


/**
 * 估算转账手续费（gasLimit * gasPrice），支持主币和ERC20代币转账
 * @param {string} rpcUrl
 * @param {string} fromAddress 发送者地址
 * @param {string} toAddress 接收者地址
 * @param {string} [contractAddress] 代币合约地址，不传表示主币转账
 * @param {string|number} [amount] 转账金额（人类可读单位，ETH或代币单位）
 * @param {number} [decimals=18] 代币精度
 * @returns {Promise<string>} 返回估算手续费，单位 ETH（字符串）
 */
export async function estimateGasFee({
  rpcUrl,
  fromAddress,
  toAddress,
  contractAddress = '',
  amount = '0',
  decimals = 18,
}) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const value = ethers.utils.parseUnits(amount.toString(), decimals)

    let gasLimit
    if (!contractAddress) {
      // 主币转账估算
      gasLimit = await provider.estimateGas({
        from: fromAddress,
        to: toAddress,
        value,
      })
    } else {
      // ERC20代币转账估算
      const abi = ['function transfer(address to, uint256 value) returns (bool)']
      const contract = new ethers.Contract(contractAddress, abi, provider)

      const data = contract.interface.encodeFunctionData('transfer', [toAddress, value])
      gasLimit = await provider.estimateGas({
        from: fromAddress,
        to: contractAddress,
        data,
      })
    }

    const gasPrice = await provider.getGasPrice()
    const fee = gasLimit.mul(gasPrice)

    // 格式化为 ETH 字符串
    return ethers.utils.formatEther(fee)
  } catch (error) {
    console.error('手续费估算失败:', error)
    return '0'
  }
}

/**
 * 统一转账函数，支持主币和ERC20代币转账
 * @param {Object} params 参数对象
 * @param {string} params.rpcUrl 链RPC地址
 * @param {string} params.privateKey 私钥（发送者）
 * @param {string} params.to 接收地址
 * @param {string|number} params.amount 转账金额（人类可读单位）
 * @param {string} [params.contractAddress] 代币合约地址（不传则主币转账）
 * @param {number} [params.decimals=18] 代币精度
 * @returns {Promise<{ success: boolean, txHash?: string, error?: string }>} 返回交易hash或错误信息
 */
export async function sendToken({
  rpcUrl,
  privateKey,
  to,
  amount,
  contractAddress = '',
  decimals = 18
}) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const wallet = new ethers.Wallet(privateKey, provider)

    const gasPrice = await provider.getGasPrice()
    const nonce = await provider.getTransactionCount(wallet.address, 'latest')

    let txResponse

    if (!contractAddress) {
      // 主币转账
      const txParams = {
        to,
        value: ethers.utils.parseUnits(amount.toString(), decimals),
        gasPrice,
        nonce
      }

      // 估算gasLimit
      const estimatedGasLimit = await provider.estimateGas(txParams)
      txParams.gasLimit = estimatedGasLimit

      txResponse = await wallet.sendTransaction(txParams)
    } else {
      // ERC20代币转账
      const abi = ['function transfer(address to, uint256 value) returns (bool)']
      const contract = new ethers.Contract(contractAddress, abi, wallet)
      const value = ethers.utils.parseUnits(amount.toString(), decimals)

      // 估算gasLimit
      const data = contract.interface.encodeFunctionData('transfer', [to, value])
      const estimatedGasLimit = await provider.estimateGas({
        from: wallet.address,
        to: contractAddress,
        data
      })

      txResponse = await contract.transfer(to, value, {
        gasLimit: estimatedGasLimit,
        gasPrice,
        nonce
      })
    }

    // txResponse.hash 是交易hash
    return { success: true, txHash: txResponse.hash }
  } catch (e) {
    console.error('转账失败:', e)
    return { success: false, error: e.message || '未知错误' }
  }
}

/**
 * 查询交易状态
 * @param {string} rpcUrl
 * @param {string} txHash
 * @returns {Promise<{ confirmed: boolean, status?: number }>}
 */
export async function checkTxStatus(rpcUrl, txHash) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const receipt = await provider.getTransactionReceipt(txHash)
    // status: 1成功，0失败；未确认时receipt为null
    if (!receipt) return { confirmed: false }
    return { confirmed: true, status: receipt.status }
  } catch (e) {
    console.error('查询交易状态失败:', e)
    return { confirmed: false }
  }
}


/*
const nonce = await getNonce(rpcUrl, walletAddress)
const gas = await getGasPrice(rpcUrl)

// 主币
const txHash1 = await sendNativeToken({
  rpcUrl,
  privateKey,
  to: '0xabc...',
  amount: '0.01',
  gasPrice: gas.toString(),
  nonce
})

// 代币
const txHash2 = await sendERC20Token({
  rpcUrl,
  privateKey,
  to: '0xabc...',
  contractAddress: '0xTokenAddress...',
  amount: '100',
  decimals: 6,
  gasPrice: gas.toString(),
  nonce: nonce + 1
})

// 等待交易确认
const receipt = await getTransactionReceipt(rpcUrl, txHash2)
console.log(receipt.status === 1 ? '✅ 成功' : '❌ 失败');
*/
