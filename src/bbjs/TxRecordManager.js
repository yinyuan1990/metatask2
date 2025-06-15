// TxRecordManager.js

const STORAGE = typeof window !== 'undefined' ? window.localStorage : new Map()

function save(key, value) {
  STORAGE.setItem ? STORAGE.setItem(key, JSON.stringify(value)) : STORAGE.set(key, JSON.stringify(value))
}

function load(key, defaultValue = []) {
  const raw = STORAGE.getItem ? STORAGE.getItem(key) : STORAGE.get(key)
  if (!raw) return defaultValue
  try {
    return JSON.parse(raw)
  } catch {
    return defaultValue
  }
}

function getStorageKey(chainId, address) {
  return `tx_records_${chainId}_${address.toLowerCase()}`
}

export class TxRecordManager {
  /**
   * 保存一条交易记录
   * @param {object} record - 交易记录对象
   * @param {string|number} chainId
   * @param {string} address
   */
  static saveRecord(chainId, address, record) {
    const key = getStorageKey(chainId, address)
    const records = load(key, [])

    // 附带 chainId 以确保记录自包含
    const enriched = {
      ...record,
      chainId,
      timestamp: record.timestamp || Date.now(),
    }

    records.unshift(enriched)
    save(key, records.slice(0, 50)) // 限制保存 50 条
    console.log("保存成功！！")
    
  }

  /**
   * 获取某地址某链下的所有记录
   * @param {string|number} chainId
   * @param {string} address
   * @returns {Array}
   */
  static getRecords(chainId, address) {

    console.log("getRecords---> ")
    const key = getStorageKey(chainId, address)
    console.log("getRecords---> "+key)
    return load(key, [])
  }

  static csLogin() {
   
    console.log("rinima1 join laile--->")

  }

  /**
   * 清除某地址某链记录
   * @param {string|number} chainId
   * @param {string} address
   */
  static clearRecords(chainId, address) {
    const key = getStorageKey(chainId, address)
    save(key, [])
  }
}
