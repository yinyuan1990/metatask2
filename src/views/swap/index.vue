<script>
import tabNum from '@/components/number/index.vue'
import { mapState } from 'vuex'
import { accountManager } from "@/bbjs/AccountManager";
import { getSymbolByChainId ,getNameByChainId} from '@/bbjs/chain-default-assets'
import { assetManager } from "@/bbjs/AssetManager";
import { networkManager} from '@/bbjs/networkManager.js'
 import ChainIcon2 from '@/components/common/ChainIcon2.vue'
export default {
  components: {
    tabNum,
    ChainIcon2
  },
  data:{
   // currentChain: accountManager.getCurrentChainId(),
   // currentAccount: accountManager.getCurrentAccount()
  },
  computed: {
   
    networkName() {

      
      return networkManager.getByChainId((accountManager.getCurrentChainId())).name
    },
    chainSymbol() {
      const walletId = accountManager.getCurrentAccount()?.walletId; // 获取当前钱包ID
      const chainId = accountManager.getCurrentAccount()?.currentChainId;   // 当前链id
      const assets = assetManager.getCurrentMainAsset(walletId, chainId);
      console.log("rnm-->"+JSON.stringify(assets))
      return assets.symbol
    },
    chainLogo() {
      return  require('@/static/icon/eth_logo.svg')
    },
    shortAddress() {
      const addr = accountManager.getCurrentAddress()?.address || '0x0000...0000'
      return addr.slice(0, 6) + '...' + addr.slice(-4)
    },


   
    sendAccountIndex2() {

     
      console.log("index==== "+accountManager.getCurrentAccountIndex())

      return accountManager.getCurrentAccountIndex()
    },
     chanind(){
       
      return accountManager.getCurrentAccount()?.currentChainId
     }
  },
  methods: {
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<template>
  <div class="page swap-page text-center">
    <div class="flex-r p-13 f-13">
      <div class="flex column flex-c-c full-height">
        <div class="f-16 bold">{{ $t('swap.title') }}</div>
        <div class="mt-5 c-9">{{ networkName }}</div>
      </div>
      <div class="pl-10 c-main" @click="goBack">{{ $t('common.cancel') }}</div>
    </div>

    <div class="flex-auto">
      <div class="flex-c-c">
        <div class="btn-bg flex-r">
          <img class="img" alt="" src="@/static/icon/fox.png" />
          <div class="text-line1 bold">{{ $t('setting.transfer.account') }}{{ sendAccountIndex2 + 1 }}({{ shortAddress }})</div>
          <img class="arrow" alt="" src="@/static/icon/arrow-down.svg" />
        </div>
      </div>

      <div class="flex-c-c">
        <div class="btn-bg flex-r">
          

          <ChainIcon2
                  :chainId="chanind"
                  :isTestnet="false"
                  class="chain-icon"
                />

          <div class="text-line1">{{ chainSymbol }}</div>
          <img class="arrow" alt="" src="@/static/icon/arrow-down.svg" />
        </div>
      </div>

      <div class="number">0</div>
      <div class="f-14">0 {{ chainSymbol }} {{ $t('swap.available') }}</div>

      <div class="split text-center">
        <img class="arrow box-set" alt="" src="@/static/icon/arrow-2-down.svg" />
      </div>

      <div class="flex-c-c">
        <div class="choose btn-bg flex-r">
          <div class="f-14">{{ $t('swap.chooseToken') }}</div>
          <img class="arrow" alt="" src="@/static/icon/arrow-down.svg" />
        </div>
      </div>

      <tabNum />

      <div class="btn-bom flex-r f-14">
        <div class="flex c-main text-left">{{ $t('swap.slippage') }}</div>
        <van-button class="van-btn-reset" type="info" disabled>{{ $t('swap.quote') }}</van-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "~@/static/style/base.css";

.swap-page {
  .btn-bg {
    margin-bottom: 20px;
    padding: 5px 10px;
    border-radius: 50px;
    background: #F3F5F9;

    .img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      border-radius: 30px;
    }

    .text-line1 {
      max-width: 55vw;
    }

    .arrow {
      width: 22px;
      padding-left: 10px;
    }
  }

  .number {
    margin-bottom: 15px;
    font-size: 30px;
  }

  .split {
    margin: 10px 30px 34px 30px;
    border-bottom: 1px solid #f5f5f5;

    .arrow {
      width: 20px;
      margin-bottom: -17px;
      padding: 0 10px;
      background: #fff;
    }
  }

  .choose {
    padding: 10px 10px 10px 35px;
  }

  .btn-bom {
    padding: 10px 20px 10px;
  }

  .flex {
  display: flex;
}

.flex-c-c {
  align-items: center;   // 横向居中（column 模式下就是水平方向）
  justify-content: center; // 纵向居中
}

.column {
  flex-direction: column;
}

.full-height {
  height: 100%; // 或者你设定的父容器高度，如 60px、100vh 等
}

.chain-icon {
    margin-right: 10px;
    width: 15px;
    height: 15px;
  }
}
</style>
