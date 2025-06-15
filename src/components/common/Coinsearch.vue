<template>
  <div class="search-asset-page">
    <!-- 1. 选链栏 -->
    <div class="net-selector" @click="selectNetClick">
      <div class="l1">{{ currentChainName }}</div>
      <div class="l2">
        <div class="chain-icon-wrapper">
          <ChainIcon2 :chainId="currentChainId" :isTestnet="false" class="chain-icon"/>
        </div>
        <img src="@/static/icon/arrow-down.svg" alt="arrow down" class="l22" />
      </div>
    </div>

    <!-- 2. 搜索框 -->
    <div class="search-box">
      <img src="@/static/icon/search.svg" alt="search" class="search-icon" />
      <input
        type="text"
        v-model="searchKeyword"
        @input="onInputChange"
        :placeholder="$t('addAsset.placeholder.contractAddress')"
      />
      <img
        v-if="searchKeyword"
        src="@/static/icon/close.svg"
        alt="clear"
        class="clear-icon"
        @click="clearInput"
      />
    </div>

    <!-- 3. 搜索结果列表 -->
    <div class="result-list">
      <div
        v-for="(token, index) in filteredTokens"
        :key="token.contractAddress"
        class="result-item"
        @click="selectToken(token)"
      >
        <div
          class="item1"
          :class="{ selected: selectedToken && selectedToken.contractAddress === token.contractAddress }"
        ></div>
        <div class="item2">
          <img :src="token.logo" alt="token icon" class="token-icon" />
          <ChainIcon2 :chainId="token.chainId" :isTestnet="false" class="chain-icon" />
        </div>
        <div class="item3">
          <div class="token-symbol">{{ token.symbol }}</div>
          <div class="token-name">{{ token.name }}</div>
        </div>
      </div>
    </div>

    <!-- 4. 下一步按钮 -->
    <button
      class="next-btn"
      :disabled="!selectedToken"
      @click="nextClick"
    >
      {{ $t('addAsset.next') }}
    </button>
  </div>
</template>

  
  <script>
  import { getSymbolByChainId, chainDefaultAssetMap,getNameByChainId } from '@/bbjs/chain-default-assets'
  import { fetchTokenDetailWithFallback } from '@/bbjs/priceService'
  import debounce from 'lodash/debounce'
  import ChainIcon2 from '@/components/common/ChainIcon2.vue'  // 确保路径正确
  import { accountManager,getAddressByWalletIdAndChainId,getCurrentChainId } from '@/bbjs/AccountManager';
  import { chainDefaultTokenMap } from "@/bbjs/chain-default-assets";
  import { assetManager } from '@/bbjs/AssetManager.js'
  import { EventBus } from '@/bbjs/bus.js';
  export default {
    components: { ChainIcon2 },
    data() {
      return {
        searchKeyword: '',
        tokenList: [],
        selectedToken: null,
        currentChainId: accountManager.getCurrentChainId(),
      }
    },
    computed: {
      currentChainName() {

        return getNameByChainId(this.currentChainId)
      },
      filteredTokens() {
        if (!this.searchKeyword) return this.tokenList
        const key = this.searchKeyword.toLowerCase()
        return this.tokenList.filter(token =>
          token.name.toLowerCase().includes(key) ||
          token.symbol.toLowerCase().includes(key) ||
          token.contractAddress.toLowerCase() === key
        )
      }
    },
    created() {
    this.onInputChange = debounce(() => {
        
      
      console.log("join "+this.searchKeyword)

      if (this.isValidAddress(this.searchKeyword)) {
        console.log("join 1")
        this.searchTokens()
      } else {
        console.log("join 2")
        this.tokenList = []
        this.selectedToken = null
      }
    }, 600)
  },
    methods: {
      selectNetClick() {
        this.$emit('selectNetClick')
      },
      clearInput() {
        this.searchKeyword = ''
        this.tokenList = []
        this.selectedToken = null
      },
      async searchTokens() {
        if (!this.isValidAddress(this.searchKeyword)) {
          this.tokenList = []
          this.selectedToken = null
          return
        }
        try {


          const meta = chainDefaultTokenMap[this.currentChainId];

          console.log("join 3")
          const rpcUrl = meta?.rpcUrl;
          console.log("join 4" +rpcUrl)



          var platformId = meta?.coinGeckoPlatformId
          console.log("join 5" +platformId)
          if (Number(this.currentChainId) === 56) {
            console.log("join 6" +platformId)
            platformId = "binance-smart-chain"
          }
          console.log("join 7" +platformId)
          if (!rpcUrl || !platformId) {
            this.tokenList = []
            return
          }
          const tokenDetail = await fetchTokenDetailWithFallback({
            rpcUrl,
            platformId,
            contractAddress: this.searchKeyword
          })

          console.log(JSON.stringify(tokenDetail)) 

          if (tokenDetail) {
            tokenDetail.contractAddress = this.searchKeyword; // 额外添加
            tokenDetail.chainId = this.currentChainId;
          }
          
          if(tokenDetail && tokenDetail.contractAddress) {
            console.log("join 8" +platformId)
            this.tokenList = [tokenDetail]
          } else {
            console.log("join 9" +platformId)
            this.tokenList = []
          }
          console.log(JSON.stringify(this.tokenList)) 
          this.selectedToken = null
        } catch (e) {
          console.error('搜索代币失败', e)
          this.tokenList = []
        }
      },
      isValidAddress(address) {
        return /^0x[a-fA-F0-9]{40}$/.test(address)
      },
      selectToken(token) {
        this.selectedToken = token
      },
      async nextClick() {

        if (!this.selectedToken) return

        const currentAccount = accountManager.getCurrentAccount();
        const baseAssets = assetManager.getAssets(currentAccount.walletId, currentAccount.currentChainId)
        console.log("000---> "+JSON.stringify(baseAssets))


       
        if(assetManager.hasAsset(accountManager.getCurrentAccount.walletId,this.selectedToken.chainId,this.selectedToken.contractAddress)){


          this.$toast.success(this.$t('assetManager.addFailExists'))   
        }else{

          const meta = chainDefaultTokenMap[this.currentChainId];
          const rpcUrl = meta?.rpcUrl;
          var platformId = meta?.coinGeckoPlatformId

          try {
            const asset = await assetManager.addContractTokenAsset(accountManager.getCurrentAccount().walletId,
            this.selectedToken.chainId,accountManager.getCurrentAddress().address,
            this.selectedToken.contractAddress,
            this.tokenList[0],
            platformId)
            this.$toast.success(this.$t('assetManager.addSuccess'))
            EventBus.$emit('as-changed')
            this.$emit('nextClick')
          }catch (err) {
            console.error('添加失败', err)
            // 判断错误信息，区分提示
            if (err.message === 'assetManager.addFailExists') {
              this.$toast.fail(this.$t('assetManager.addFailExists'))
            } else {
              this.$toast.fail(this.$t('assetManager.addError'))
            }
          }

        }
        

        //this.$emit('nextClick', this.selectedToken)




      }
    }
  }
  </script>
  
  <style scoped>
  /* 选链栏 固定高度 */
.net-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid gray;
  border-radius: 10px;
  height: 50px;
  padding: 0 15px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 20px;
  flex-shrink: 0;  /* 不缩放 */
}
  .search-asset-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 15px;
    font-family: Arial, sans-serif;
  }
  
  /* 1. 选链栏 */
  .net-selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid gray;
    border-radius: 10px;
    height: 50px;
    padding: 0 15px;
    cursor: pointer;
    user-select: none;
    margin-bottom: 20px;
  }
  
  .l1 {
    color: gray;
    font-size: 16px;
  }
  
  .l2 {
  height: 50px;
  display: flex;
  justify-content: flex-end; /* 容器靠右 */
  align-items: center;
  gap: 5px; /* 元素间距 */
  padding-right: 0px; /* 右边适当内边距可选 */
}

.chain-icon-wrapper {
  width: 25px;
  height: 25px;
  position: relative; /* 保证内部绝对定位正常 */
}

.chain-icon-wrapper .chain-icon {
  width: 25px !important;
  height: 25px !important;
  border-radius: 50%;
  overflow: hidden;
}

.l22 {
  width: 15px;
  height: 15px;
}


  
  /* 2. 搜索框 */
  .search-box {
    display: flex;
    align-items: center;
    border: 1px solid gray;
    border-radius: 10px;
    padding: 0 20px;
    height: 70px;
    margin-bottom: 20px;
  }
  
  .search-icon {
    width: 15px;
    height: 15px;
    margin-right: 10px;
  }
  
  input {
    flex: 1;
    height: 50px;
    border: none;
    outline: none;
    font-size: 16px;
    color: #333;
  }
  
  .clear-icon {
    width: 15px;
    height: 15px;
    cursor: pointer;
    user-select: none;
  }
  
  /* 3. 结果列表 */
  .result-list {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 100px;
  }
  
  .result-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px 0;
    cursor: pointer;
    user-select: none;
  }
  
  .item1 {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid gray;
    flex-shrink: 0;
  }
  
  .item1.selected {
    background-color: #4259ff;
    border-color: #4259ff;
  }
  
  .item2 {
    position: relative;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
  }
  
  .token-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .chain-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
  }
  
  /* 代币名 */
  .item3 {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .token-symbol {
    font-weight: 700;
    font-size: 18px;
    color: black;
  }
  
  .token-name {
    font-size: 18px;
    color: gray;
  }
  
  /* 4. 下一步按钮 */
  .next-btn {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    height: 50px;
    border-radius: 10px;
    background-color: #4259ff;
    color: white;
    font-size: 18px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.3s;
  }
  
  .next-btn:disabled {
    background-color: #9bb1f8;
    cursor: not-allowed;
  }
  .search-asset-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 15px;
  font-family: Arial, sans-serif;
}

/* 选链栏 固定高度 */
.net-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid gray;
  border-radius: 10px;
  height: 50px;
  padding: 0 15px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 20px;
  flex-shrink: 0;  /* 不缩放 */
}

/* 搜索框 固定高度 */
.search-box {
  display: flex;
  align-items: center;
  border: 1px solid gray;
  border-radius: 10px;
  padding: 0 20px;
  height: 70px;
  margin-bottom: 20px;
  flex-shrink: 0;  /* 不缩放 */
}

/* 搜索结果列表 滚动 */
.result-list {
  flex: 1;              /* 占据剩余空间 */
  overflow-y: auto;     /* 垂直滚动 */
  margin-bottom: 100px; /* 避开底部按钮 */
}

/* 下一步按钮 固定底部 */
.next-btn {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  height: 50px;
  border-radius: 10px;
  background-color: #4259ff;
  color: white;
  font-size: 18px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s;
}

.next-btn:disabled {
  background-color: #9bb1f8;
  cursor: not-allowed;
}
  </style>
  