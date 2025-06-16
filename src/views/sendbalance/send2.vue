<template>
  <div class="transfer-page">
    <!-- 头部 -->
    <div class="header">
      <div class="h1" @click="goBack">{{ $t('transfer.return') }}</div>
      <div class="h2">
        <h1 class="h21">{{ $t('transfer.amount') }}</h1>
        <h2 class="h22">{{ getNameByChainId2() }}</h2>
      </div>
      <div class="h3" @click="goBack">{{ $t('transfer.cancel') }}</div>
    </div>

    <!-- 代币信息 -->
    <div class="token-info">
      <div class="d1">
        <span class="d11">{{ symbol || '' }}</span>
        <img class="d12" src="@/static/icon/arrow-2-down.svg" :alt="$t('transfer.arrowAlt')" />
      </div>
      <div class="d2"></div>
    </div>

    <!-- 数量输入 -->
    <div class="amount-input">
      <input
        type="number"
        step="0.0001"
        min="0"
        v-model.number="amount"
        :placeholder="$t('transfer.enterAmount')"
      />
    </div>

    <!-- 价值 -->
    <div class="value-display">
      <p class="p1">$:{{ formattedValue() }}</p>
    </div>

    <!-- 余额 -->
    <div class="balance-display">
      {{ $t('transfer.balance') }}: {{ formattedAmount() }} {{ symbol || '' }}
    </div>

    <!-- 底部按钮 -->
    <button
      class="next-btn"
      :disabled="!canSend"
      @click="sendEndclick"
    >
      {{ $t('transfer.nextStep') }}
    </button>
  </div>
</template>

<script>
import { getSymbolByChainId ,getNameByChainId} from '@/bbjs/chain-default-assets'
import { fetchTokenPrice } from '@/bbjs/priceService' 
import { chainDefaultTokenMap, chainDefaultAssetMap } from "@/bbjs/chain-default-assets";
import { formatSmartNumber } from '@/bbjs/utils'
import { networkManager} from '@/bbjs/networkManager.js'
import { fetchTokenBalance } from '@/bbjs/priceService'; 
import { EventBus } from '@/bbjs/bus.js';

export default {
  name: 'TransferPage',


  data() {
    return {
      fromAccount: null,
      toAddress: '',
      assets: null,
      amount: 0,
      price: 0,
      balance: '0',
      chainId: null,
      symbol: '',
    }
  },
  
    beforeDestroy() {

EventBus.$off('back-root', this.backRoot)

},
created() {

EventBus.$on('back-root',this.backRoot)
 

},
  computed: {
    canSend() {
      const hasAmount = this.amount > 0
      const amountNotExceed = true//  parseFloat(this.amount) <= parseFloat(this.balance)
      const validAddress = this.toAddress && this.toAddress.length > 0 // 可用更严格的校验
      return hasAmount && amountNotExceed && validAddress && this.fromAccount
    }
  },
  mounted() {
    this.loadDataFromLocalStorage()
  },
  methods: {
    backRoot(){
      console.log("send2 back root")
            this.$router.back();
        },
    formatSmartNumber,
    formattedAmount() {
      return formatSmartNumber(this.balance, { decimals: 4 })
    },
    formattedValue() {
      const val = this.amount * this.price
      if (val <= 0) return '0'
      return formatSmartNumber(val, { decimals: 4 })
    },
    getSymbolByChainId,
    getNameByChainId,
    getNameByChainId2(){

       return networkManager.getByChainId(this.chainId).name
    },
    getSymbolByChainId2(){
       
      return getSymbolByChainId(this.chainId)
    },

    async loadDataFromLocalStorage() {
      try {
        const dataStr = localStorage.getItem('transferData')
        if (!dataStr) {
          console.warn('transferData not found in localStorage')
          return
        }
        const data = JSON.parse(dataStr)
        this.fromAccount = data.fromAccount || null
        this.toAddress = data.toAddress || ''
        this.assets = data.assets || null
        this.chainId = this.assets?.chainId || null
        this.symbol = this.assets?.symbol || ''
        console.log("join symbol",this.symbol)
        this.balance = this.assets.balance || '0'
        //localStorage.removeItem('transferData') // 用完清理


        if (Number(this.balance) === 0) {
          console.log("zero ")
          const chainInfo = chainDefaultAssetMap[this.chainId];
            const rpcUrl = chainInfo.rpcUrl;
            const address = accountManager.getAddressByWalletIdAndChainId(this.fromAccount.walletId, this.chainId)?.address;
            if (!address){

             }else{

              console.log("look",rpcUrl,"-",address,"-",this.assets.contractAddress,"-",this.assets.decimals)
              const { formatted } = await fetchTokenBalance({
              rpcUrl,
              address,
              contractAddress: this.assets.contractAddress || '',
              decimals: this.assets.decimals || 18,
              });

              this.balance = formatted;
              console.log("zero-->  "+this.balance)
            }
           
          
        }else{
           console.log("no zero ")
          
        }

            

           


        await this.fetchPriceAndBalance()
      } catch (e) {
        console.error('读取localStorage数据失败', e)
      }
    },
    async fetchPriceAndBalance() {
      if (!this.assets || !this.assets.chainId) return
      try {
        const meta = chainDefaultTokenMap[this.assets.chainId]
        if (!meta) throw new Error('无效链ID')
        const priceData = await fetchTokenPrice(this.assets.isMainCoin?meta.coinGeckoPlatformId:meta.coinGeckoCoinId, 
      this.assets.contractAddress, this.assets.isMainCoin?meta.coinGeckoPlatformId:meta.coinGeckoCoinId)
        this.price = priceData?.price || 0
        
      } catch (e) {
        console.error('获取代币价格或余额失败', e)
        this.price = 0
        
      }
    },
    goBack() {
      this.$router.back()
    },
    sendEndclick() {
      if (!this.canSend) return
      
      const payload = {
        fromAccount: this.fromAccount,
        toAddress: this.toAddress,
        assets: this.assets,
        amount: this.amount,
      }
      console.log('transferDataEnd', JSON.stringify(payload))
      localStorage.setItem('transferDataEnd', JSON.stringify(payload))
      // 2. 跳转到新页面（路径根据你项目实际定）
      this.$router.push({ path: '/send3' })


    }
  }
}
</script>

<style scoped>
.transfer-page {
  padding: 20px;
  max-width: 480px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 头部 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 20px 0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.h1, .h3 {
  color: #4259ff;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  height: 40px;
}

.h2 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  flex-grow: 1;
}

.h21 {
  font-weight: 700;
  font-size: 20px;
  color: #000;
  text-align: center;
  margin: 0;
}

.h22 {
  font-weight: 400;
  font-size: 18px;
  color: #000;
  margin: 0;
}

/* 代币信息 */
.token-info {
  margin-top: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  justify-content: center;
}

.d1 {
  height: 30px;
  background-color: #4259ff;
  border-radius: 30px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

.d11 {
  margin-left: 5px;
  font-size: 16px;
  font-weight: 500;
}

.d12 {
  margin-right: 5px;
  width: 15px;
  height: 15px;
  filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%);
}

/* 数量输入 */
.amount-input {

  margin-top: 30px;
  display: flex;
  justify-content: center;
  
}

.amount-input input {
  font-size: 30px;
  color: #000;
  border: none;
  outline: none;
  width: 100%;
  max-width: 300px;
  justify-content: center;
  text-align: center;
}

/* 价值 */
.value-display {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.p1 {
  height: 25px;
  border: 1px solid gray;
  border-radius: 10px;
  line-height: 25px;
  padding: 0 15px;
  font-size: 16px;
  color: #000;
}

/* 余额 */
.balance-display {
  margin-top: 30px;
  font-size: 12px;
  color: #000;
  text-align: center;
}

/* 底部按钮 */
.next-btn {
  position: fixed;
  bottom: 50px;
  left: 20px;
  right: 20px;
  height: 50px;
  background-color: #4259ff;
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 20px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s;
}

.next-btn:disabled {
  background-color: #9bb1f8;
  cursor: not-allowed;
}
</style>
