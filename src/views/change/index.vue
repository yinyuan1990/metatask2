<template>
  <div class="setting-container">
    <!-- 顶部固定区域 -->
    <div class="setting-header">
      <h1 class="h1">{{ $t('setting.transactionTitle') }}</h1>
      <div class="choose" @click="show = true">
        {{ chooseText }}
        <van-icon name="arrow-down" />
      </div>
    </div>

    <!-- 可滚动历史区域 -->
    <div class="setting-history-scroll" ref="scrollWrapper">
      <history />
    </div>

    <!-- 弹出筛选 -->
    <van-popup
      v-model="show"
      position="bottom"
      round
      z-index="9"
      :overlay-style="{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }"
    >
      <div class="pop">
        <h1>{{ $t('setting.filterMethod') }}</h1>

        <div
          class="popular-list"
          :class="{ active: selectedType === 100 }"
          @click="onPopularNetworkClick"
        >
          <span class="popular-div"></span>
          <div class="popular-name">{{ $t('setting.popularNetworks') }}</div>
          <div class="popular-chain-icons">
            <div
              v-for="(item, index) in popularNetworks"
              :key="item.chainId"
              class="popular-chain-icon-wrapper"
              :style="{ zIndex: popularNetworks.length - index, marginLeft: index === 0 ? '0' : '-8px' }"
            >
              <ChainIcon :chainId="item.chainId" :isTestnet="item.isTestnet" class="popular-chain-icon" />
            </div>
          </div>
        </div>

        <div
          class="current-list"
          :class="{ active: selectedType === 1 }"
          @click="onCurrentNetworkClick"
        >
          <span class="current-div"></span>
          <div class="current-name">{{ $t('setting.currentNetwork') }}</div>
          <div class="current-chain-icons">
            <div v-if="currentNetwork" class="current-chain-icon-wrapper">
              <ChainIcon
                :chainId="currentNetwork.chainId"
                :isTestnet="currentNetwork.isTestnet"
                class="current-chain-icon"
              />
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <tabVue :active="1" />
  </div>
</template>

<script>
import tabVue from '@/components/tabbox/tab.vue'
import ChainIcon from '@/components/common/ChainIcon.vue'
import { networkManager, eventBus } from '@/bbjs/networkManager.js'
import { accountManager } from '@/bbjs/AccountManager.js'
import { bus } from '@/bbjs/bus.js'
import history from '@/components/history/history.vue'
import BScroll from 'better-scroll'

export default {
  components: {
    tabVue,
    ChainIcon,
    history
  },
  data() {
    return {
      show: false,
      refreshnetKey: 0,
      popularNetworks: [],
      currentNetwork: null,
      selectedType: networkManager.getSelectedNetworkType(),
      bs: null
    }
  },
  mounted() {
    this.bs = new BScroll(this.$refs.scrollWrapper, {
      scrollY: true,
      click: true
    })
  },
  beforeDestroy(){
    eventBus.$off('selectedNetworkTypeChanged',this.typeChange)
  },
  created() {
    eventBus.$on('selectedNetworkTypeChanged',this.typeChange)
  },
  methods: {

    typeChange(type){
      this.selectedType = type
      this.refreshnetKey++
    }
    ,
    loadNetworks() {
      this.popularNetworks = networkManager.getAll().filter(net => net.isJoined && !net.isTestnet)
      const currentAccount = accountManager.getCurrentAccount()
      if (currentAccount && currentAccount.currentChainId) {
        this.currentNetwork = networkManager.getByChainId(currentAccount.currentChainId)
      } else {
        this.currentNetwork = null
      }
    },
    selectPopular() {
      this.selectedType = 100
      networkManager.setSelectedNetworkType(100)
      this.show = false
      bus.$emit('selectedNetworkTypeChanged', 100)
    },
    selectCurrent() {
      this.selectedType = 1
      networkManager.setSelectedNetworkType(1)
      this.show = false
      bus.$emit('selectedNetworkTypeChanged', 1)
    },
    onPopularNetworkClick() {
      this.selectPopular()
    },
    onCurrentNetworkClick() {
      this.selectCurrent()
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
      return this.selectedType === 1
        ? (this.currentNetwork ? this.currentNetwork.name : this.$t('setting.currentNetwork'))
        : this.$t('setting.popularNetworks')
    }
  }
}
</script>

<style scoped lang="scss">
.setting-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
}

.setting-header {
  flex-shrink: 0;
  background: #fff;
  z-index: 2;
  padding: 16px 20px;


  .h1 {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

  .choose {
    border: 1px solid #eee;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    color: #000;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }
}

.setting-history-scroll {
  flex: 1;
  overflow: hidden; /* better-scroll 控制滚动 */
}

.pop {
  padding-bottom: 20px;
  h1 {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    padding: 20px 0;
  }

  .popular-list,
  .current-list {
    display: flex;
    align-items: center;
    padding: 8px 20px 8px 4px;
    border-radius: 0px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    .popular-div,
    .current-div {
      width: 4px;
      height: 40px;
      border-radius: 4px;
      background: #4459ff;
    }
    .popular-name,
    .current-name {
      font-size: 16px;
      font-weight: 400;
      margin-left: 10px;
    }
  }

  .popular-list.active,
  .current-list.active {
    background: #e0e2ef;
  }

  .popular-chain-icons,
  .current-chain-icons {
    display: flex;
    flex-direction: row;
    align-items: center;
    white-space: nowrap;
    margin-left: auto;
  }

  .popular-chain-icon-wrapper,
  .current-chain-icon-wrapper {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .popular-chain-icon,
  .current-chain-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: contain;
  }
}
</style>
