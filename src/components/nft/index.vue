<script>
  import { networkManager } from '@/bbjs/networkManager.js'
  import { accountManager,save } from "@/bbjs/AccountManager";
  import { EventBus } from '@/bbjs/bus.js';
export default {
      beforeDestroy() {
      
        EventBus.$off('selectedNetworkTypeChanged',this.typeChange)
    },
    created() {
    // 监听全局事件，确保跨组件同步
    EventBus.$on('selectedNetworkTypeChanged', this.typeChange)
  
  },
  methods:{
     typeChange(type){
      this.selectedType = type
     }
  },
  computed: {
    chooseText() {

        this.refreshnetKey
        this.selectedType = networkManager.getSelectedNetworkType()
        this.popularNetworks = networkManager.getAll().filter(net => net.isJoined && !net.isTestnet)
        const currentAccount = accountManager.getCurrentAccount()
        if (currentAccount && currentAccount.currentChainId) {
            this.currentNetwork = networkManager.getByChainId(currentAccount.currentChainId)
        } else {
            this.currentNetwork = null
        }

        if (this.selectedType === 1) {
            // 当前网络名，没有时显示默认文本
            return this.currentNetwork ? this.currentNetwork.name : this.$t('setting.currentNetwork')
        } else {
            return this.$t('setting.popularNetworks')
        }
    }
  },
  data() {
    return {
      selectedType: networkManager.getSelectedNetworkType(), // 1 = 当前网络, 100 = 热门网络，默认当前网络
      refreshnetKey: 0, // 用于强制刷新
    }
  }
}
</script>

<template>
  <div>
    <div class="container">
      <div class="l1">
        <div class="choose">
          {{ $t('nft.chooseText') }}
          <van-icon name="arrow-down" />
        </div>
      </div>     
    </div>

    <div class="no-nft f-12 text-center">
      <img class="img mb-5" alt="" src="@/static/img/nft.jpg" />
      <p class="f-18 c-6 mb-5">{{ $t('nft.emptyTitle') }}</p>
      <p class="mb-10">{{ $t('nft.learnMore') }}</p>
      <p class="c-9">{{ $t('nft.emptyHint') }}</p>
    </div>
  </div>
</template>


<style scoped lang="scss">
@import "~@/static/style/base.css";

.no-nft {
  padding: 70px 0;

  .img {
    width: 70px;
  }
}

.container {

  display: flex;
  justify-content: center; /* 整体居中 */
  align-items: center;
  box-sizing: border-box;
  margin-top: 30px; /* 底部留空 */
  margin-bottom: 0px;
  position: relative;
}

/* 左边靠左 */
.l1 {
  position: absolute;
  left: 0px;
  /* 也可以用flex-grow不让占用宽度过大 */
}

/* 右边靠右 */
.l2 {
  position: absolute;
  right: 0px;
  display: flex;
  align-items: center;
}

.choose {
    display: inline;
    border: 1px solid #eee;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    color: #000;
    margin-left: 0px;
    cursor: pointer;
  }
  .svgicon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  color: #4259ff; /* 设置图标颜色 */
}
</style>
