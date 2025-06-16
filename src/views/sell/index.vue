<script>
import { Toast } from 'vant'
import { networkManager} from '@/bbjs/networkManager.js'
import { accountManager,save } from "@/bbjs/AccountManager";
import { formatAddress } from '@/bbjs/utils.js';
import ChainIcon2 from '@/components/common/ChainIcon2.vue'  // 确保路径正确
import { assetManager } from "@/bbjs/AssetManager";
export default {
  data() {
    return {
      price: '',
      currentChainId: accountManager.getCurrentChainId(),
    }
  },
  components:{
    ChainIcon2 
  },
  computed:{
    userinfos() {
			
			if (accountManager.getCurrentAccount()) {
				const idx = accountManager.getAllAccounts().findIndex(acc => acc.address === accountManager.getCurrentAccount().address);
				return {
					child: accountManager.getCurrentAccount(),
					idx: idx === -1 ? 0 : idx,
				};
			}
			return { child: null, idx: 0 };
		},
    currentAddress() {
			
			return formatAddress(accountManager.getCurrentAddress().address || '');
		},
  },
  methods: {
    getPrice() {
      Toast('系统繁忙')
    },
    getNameByChainId3(){

      //Account 1(oxEab1...5401)

      return networkManager.getByChainId(accountManager.getCurrentChainId()).name

    },
    getNameByChainId2(){

      return networkManager.getByChainId(accountManager.getCurrentChainId()).name
    },
    getPrice() {
      Toast('系统繁忙')
    },
    getName(){
      
      return assetManager.getCurrentMainAsset(accountManager.getCurrentAccount().walletId,accountManager.getCurrentChainId()).name
    },
    getName1(){
      
      return assetManager.getCurrentMainAsset(accountManager.getCurrentAccount().walletId,accountManager.getCurrentChainId()).symbol
    },backRoot(){
      this.$router.back()
    }
  }
}
</script>

<template>
  <div class="page trade-page p-13 f-14">
    <div class="flex-r f-13">
      <div class="flex text-center flex-col items-center justify-center">
        <div class="f-16 bold">{{ $t('trade.sellAmount') }}</div>
        <div class="mt-5 c-9">{{ getNameByChainId2() }}</div>
      </div>
      <div class="pl-10 c-main" @click="backRoot()">{{ $t('common3.cancel') }}</div>
    </div>

    <div class="flex-auto">
      <div class="sel-btn flex-r">
        <div class="btn-bg flex-hide flex-r">
          <div class="avatar-wrapper">
            <headbox height="20" width="20"></headbox>
          </div>
          <div class="flex text-line1 bold">
            {{ $t('trade.account') }} {{ userinfos.idx + 1 }} ({{ currentAddress }})
          </div>
          <img class="icon-arrow" alt="" src="@/static/icon/arrow-down.svg" />
        </div>

        <div class="btn-bg flex-r btn-right">
          <img class="img-20" alt="" src="@/static/img/arc.png" />
          <img class="icon-arrow" alt="" src="@/static/icon/arrow-down.svg" />
        </div>

        <div class="btn-bg flex-r btn-right">
          <div class="f-16 bold">USD</div>
          <img class="icon-arrow" alt="" src="@/static/icon/arrow-down.svg" />
        </div>
      </div>

      <p class="c-6">{{ $t('trade.youWantToSell') }}</p>
      <div class="btn-border flex-r">
        <div class="chain-icon-wrapper">
          <ChainIcon2 :chainId="currentChainId" :isTestnet="false" class="chain-icon" />
        </div>
        <div class="flex text-line1 bold pl-10">
          {{ $t('trade.account') }} {{ userinfos.idx + 1 }} ({{ currentAddress }})
        </div>
        <div class="bold pl-10">{{ getName() }}</div>
        <img class="icon-arrow" alt="" src="@/static/icon/arrow-down.svg" />
      </div>

      <p class="mb-15 c-9 f-12">{{ $t('trade.currentBalance') }}：0</p>

      <p class="mt-5 c-6">{{ $t('trade.amount') }}</p>
      <div class="btn-border flex-r">
        <input class="flex f-16 bold price-inp" v-model="price" />
        <div>USD</div>
        <img class="icon-arrow" alt="" src="@/static/icon/arrow-down.svg" />
      </div>

      <p class="pt-10 c-6">{{ $t('trade.sendToCashAccount') }}</p>
      <div class="btn-border">
        <div class="pay-way flex-r ptb-10">
          <img class="img-20 mr-10" alt="" src="@/static/icon/card.svg" />
          <div class="text-line1 bold flex">{{ $t('trade.debitOrCredit') }}</div>
          <div class="bold pl-10">{{ $t('common3.change') }}</div>
          <img class="icon-arrow" alt="" src="@/static/icon/arrow-down.svg" />
        </div>
        <div class="flex-r ptb-10">
          <img class="pay-card" alt="" src="@/static/img/payall.png" />
        </div>
      </div>
    </div>

    <van-button
      class="g-radius mt-13"
      type="info"
      :disabled="!price"
      @click="getPrice()"
    >
      {{ $t('trade.getQuote') }}
    </van-button>
  </div>
</template>


<style scoped lang="scss">
@import "~@/static/style/trade.scss";

.avatar-wrapper {
	width: 20px;
	height: 20px;
  margin-right: 10px;
	border-radius: 50%;
	overflow: hidden;
	background: #03555e;
	display: flex;
	justify-content: center;
	align-items: center;
}
.chain-icon-wrapper .chain-icon {
  width: 35x !important;
  height: 35px !important;
  border-radius: 50%;
  overflow: hidden;
}
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}
</style>
