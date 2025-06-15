import { ethers } from 'ethers'

/**
 * 校验地址是否合法（EVM 地址）
 * @param {string} address
 * @returns {boolean}
 */
export function isValidAddress(address) {
  return ethers.utils.isAddress(address)
}

/**
 * 校验私钥是否合法（64 位 hex）
 * @param {string} privateKey
 * @returns {boolean}
 */
export function isValidPrivateKey(privateKey) {
  return /^0x[0-9a-fA-F]{64}$/.test(privateKey)
}

/**
 * 压缩地址（适合 UI 展示）
 * @param {string} address
 * @param {number} head 保留前几位
 * @param {number} tail 保留后几位
 * @returns {string}
 */
export function formatAddress(address, head = 6, tail = 4) {
  if (!isValidAddress(address)) return address
  return `${address.slice(0, head)}...${address.slice(-tail)}`
}

/**
 * 格式化余额（UI显示，最多保留 6 位小数）
 * @param {string|number} balance
 * @returns {string}
 */
export function formatBalance(balance,jindu=2) {
  const num = parseFloat(balance)
  if (isNaN(num)) return '0'
  return num.toFixed(jindu).replace(/\.?0+$/, '')
}

/**
 * 截断大数字（千、百万、十亿显示）
 * @param {number} n
 * @returns {string}
 */
export function formatNumber(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K'
  return n.toFixed(2)
}


/**
 * 美化数字显示，如 123456789 -> "1.23 亿"
 */
export function formatLargeNumber(num) {
  if (num === null || num === undefined) return '-'
  num = Number(num)

  if (num >= 1e11) return (num / 1e8).toFixed(2) + ' 亿'     // 千亿级别转亿
  if (num >= 1e8)  return (num / 1e8).toFixed(2) + ' 亿'
  if (num >= 1e6)  return (num / 1e6).toFixed(2) + ' 百万'
  if (num >= 1e4)  return (num / 1e4).toFixed(2) + ' 万'
  if (num >= 1)    return num.toFixed(2)
  if (num >= 0.0001) return num.toFixed(4)
  return '<0.0001'
}

/**
 * 美化价格显示：带 $ 前缀
 */
export function formatPrice(price) {
  if (price === null || price === undefined) return '-'
  return '$' + formatLargeNumber(price)
}

/**
 * 美化百分比（涨跌幅）
 */
export function formatPercent(change) {
  if (change === null || change === undefined) return '-'
  const fixed = Number(change).toFixed(2)
  return (change > 0 ? '+' : '') + fixed + '%'
}


/**
 * 智能格式化数字：根据大小自动显示为普通、小数、大数等形式
 * @param {number|string} value 要格式化的数值
 * @param {object} options 可选配置
 * @param {boolean} [options.useChinese=false] 是否使用中文单位（如 万/亿）
 * @param {number} [options.decimals=2] 默认保留小数位数
 * @returns {string}
 */
export function formatSmartNumber(value, options = {}) {
  const { useChinese = false, decimals = 2 } = options
  const num = parseFloat(value)
  if (isNaN(num)) return '0'

  // 小于 0.0001 显示为 <0.0001
  if (num > 0 && num < 0.0001) return '<0.0001'

  // 使用中文单位（万、百万、亿）
  if (useChinese) {
    if (num >= 1e11) return (num / 1e8).toFixed(2) + ' 亿'
    if (num >= 1e8) return (num / 1e8).toFixed(2) + ' 亿'
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' 百万'
    if (num >= 1e4) return (num / 1e4).toFixed(2) + ' 万'
  } else {
    // 英文缩写：B, M, K
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  }

  // 正常显示小数（去除多余0）
  return num.toFixed(decimals).replace(/\.?0+$/, '')
}









