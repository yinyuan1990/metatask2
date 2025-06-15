export default class PolygonTxFetcher {
    constructor(apiKey) {
      this.url = `https://polygon-mainnet.g.alchemy.com/v2/${apiKey}`;
      this.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
    }
  
    async getLatestBlockNumber() {
      const body = JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: []
      });
  
      const res = await fetch(this.url, {
        method: 'POST',
        headers: this.headers,
        body
      });
      const data = await res.json();
      return parseInt(data.result, 16); // 16进制转十进制
    }
  
    async getTxHistoryLast7Days(address, maxCount = 1000) {
      const latestBlock = await this.getLatestBlockNumber();
  
      //72747265 72790873
      console.log("qukuaigaodu ",latestBlock)
      
      const fromBlockNum = latestBlock - 100000;
  
      const fromBlock = '0x' + fromBlockNum.toString(16);
      const toBlock = 'latest';

    
  
      const body = JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock,
            toBlock,
            toAddress: address,
            withMetadata: false,
            excludeZeroValue: true,
            maxCount: '0x' + maxCount.toString(16),
            category: ["external"]
          }
        ]
      });
  
      try {
        const response = await fetch(this.url, {
          method: 'POST',
          headers: this.headers,
          body: body
        });
  
        const data = await response.json();
        console.error('success 获取交易记录失败:', JSON.stringify(data));
        if (data.result && data.result.transfers) {

            console.error('success 获取交易记录失败:', JSON.stringify(data.result.transfers));
          return data.result.transfers;
        } else {
          throw new Error(data.error?.message || 'Unknown error');
        }
      } catch (error) {
        console.error('❌ 获取交易记录失败:', error);
        return [];
      }
    }
  }
  