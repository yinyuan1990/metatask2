<script>
import tabVue from '@/components/tabbox/tab.vue'
import ChainIcon from '@/components/common/ChainIcon.vue'
import { networkManager, eventBus } from '@/bbjs/networkManager.js'
import { accountManager } from '@/bbjs/AccountManager.js'
import { EventBus } from '@/bbjs/bus.js' // 你的事件总线

export default {
  components: {
    tabVue,
    ChainIcon
  },
  watch: {
    show(val) {
      if (val) {
        this.loadNetworks()
      }
    }
  },
  data() {
    return {
      show: false,
      refreshnetKey: 0, // 用于强制刷新网络列表
      popularNetworks: [],
      currentNetwork: null,
      selectedType: networkManager.getSelectedNetworkType(), // 1 = 当前网络, 100 = 热门网络，默认当前网络
    }
  },
  created() {
    // 监听全局事件，确保跨组件同步
    eventBus.$on('selectedNetworkTypeChanged', (type) => {
      this.selectedType = type
      this.refreshnetKey++ // 强制刷新网络列表
    })
  },
  methods: {




    loadNetworks() {
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
    },
    selectPopular() {
      this.selectedType = 100
      networkManager.setSelectedNetworkType(100)
      this.show = false

      EventBus.$emit('selectedNetworkTypeChanged', type)
       
    },
    selectCurrent() {
      this.selectedType = 1
      networkManager.setSelectedNetworkType(1)
      this.show = false
      EventBus.$emit('selectedNetworkTypeChanged', type)

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

        if (this.selectedType === 1) {
            // 当前网络名，没有时显示默认文本
            return this.currentNetwork ? this.currentNetwork.name : this.$t('setting.currentNetwork')
        } else {
            return this.$t('setting.popularNetworks')
        }
    }
  }
}
</script>

<template>
  <div class="setting">
    <h1 class="h1">{{ $t('setting.transactionTitle') }}</h1>
    
    <div class="choose" @click="show = true">
      {{ chooseText }}
      <van-icon name="arrow-down" />
    </div>

    <van-popup
      v-model="show"
      position="bottom"
      round
      z-index="9"
      :overlay-style="{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }"
    >
      <div class="pop">
        <h1>{{ $t('setting.filterMethod') }}</h1>

        <!-- 热门网络 -->
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
              <ChainIcon
                :chainId="item.chainId"
                :isTestnet="item.isTestnet"
                class="popular-chain-icon"
              />
            </div>
          </div>
        </div>

        <!-- 当前网络 -->
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

<style scoped lang="scss">
.setting {
  .h1 {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    line-height: 1.5;
    margin-bottom: 10px;
    padding: 10px 20px;
  }
  .choose {
    display: inline;
    border: 1px solid #eee;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    color: #000;
    margin-left: 20px;
    cursor: pointer;
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
      box-sizing: border-box;
      /* marginLeft 由内联样式控制 */
    }

    .popular-chain-icon,
    .current-chain-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: contain;
      /* 可加白边： box-shadow: 0 0 0 2px #fff; */
    }
  }
}
</style>
