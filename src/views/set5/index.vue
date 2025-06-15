<template>
  <div class="set-page">
    <!-- 顶部：标题 + 搜索框 -->
    <div class="fixed-top">
      <TitleBar :title="$t('setting.title5')" />
      <div class="search-box">
        <img src="@/assets/icons/search.svg" class="search-icon" />
        <input
          class="search-input"
          :placeholder="$t('setting.search')"
          v-model="searchText"
        />
      </div>
    </div>

    <!-- 中部：滚动的网络列表 -->
    <div class="networks-body">
      <div v-if="mainnetList.length">
        <h2 class="group-title">{{ $t('setting.mainnet') }}</h2>
        <div
          v-for="item in mainnetList"
          :key="item.chainId"
          class="net-item"
          @click="onItemClick(item)"
        >
          <ChainIcon :chainId="item.chainId" :isTestnet="item.isTestnet" class="net-icon" />
          <span class="net-name">{{ item.name }}</span>
          <img v-if="!item.isUpdateRpcUrl" src="@/assets/icon/lock.svg" class="lock-icon" />
        </div>
      </div>

      <div v-if="customList.length">
        <h2 class="group-title">{{ $t('setting.custom') }}</h2>
        <div
          v-for="item in customList"
          :key="item.chainId"
          class="net-item"
          @click="onItemClick(item)"
        >
          <ChainIcon :chainId="item.chainId" :isTestnet="item.isTestnet" class="net-icon" />
          <span class="net-name">{{ item.name }}</span>
          <img v-if="!item.isUpdateRpcUrl" src="@/assets/icon/lock.svg" class="lock-icon" />
        </div>
      </div>

      <div v-if="testList.length">
        <h2 class="group-title">{{ $t('setting.testnet') }}</h2>
        <div
          v-for="item in testList"
          :key="item.chainId"
          class="net-item"
          @click="onItemClick(item)"
        >
          <ChainIcon :chainId="item.chainId" :isTestnet="item.isTestnet" class="net-icon" />
          <span class="net-name">{{ item.name }}</span>
          <img v-if="!item.isUpdateRpcUrl" src="@/assets/icon/lock.svg" class="lock-icon" />
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-btn" @click="tjlclick">
      {{ $t('setting.addNetwork') }}
    </div>

    <AddNetworkPopup v-if="showAddPopup" @close="closePopup" />
  </div>

</template>

<script>
import TitleBar from '@/components/common/TitleBar.vue'
import ChainIcon from '@/components/common/ChainIcon.vue'
import { networkManager } from '@/bbjs/networkManager.js'
import AddNetworkPopup from '@/components/common/AddNetworkPopup.vue'

export default {
  components: {
    TitleBar,
    ChainIcon,
    AddNetworkPopup
  },
  data() {
    return {
      searchText: '',
      showAddPopup: false,
      refreshKey: 0,   // 新增
    }
  },
  computed: {
    filteredList() {
      this.refreshKey  // 依赖刷新计数器
      const all = networkManager.getAll()
      if (!this.searchText.trim()) return all
      return all.filter(i => i.name.toLowerCase().includes(this.searchText.toLowerCase()))
    },
    mainnetList() {
      return this.filteredList.filter(i => i.isJoined && !i.isTestnet && !i.isUpdateRpcUrl)
    },
    customList() {
      return this.filteredList.filter(i => i.isJoined && !i.isTestnet && i.isUpdateRpcUrl)
    },
    testList() {
      return this.filteredList.filter(i => i.isTestnet)
    }
  },
  methods: {
    tjlclick() {
      this.showAddPopup = true
    },
    onItemClick(item) {
      this.$router.push({ path: '/set5/editNetwork', query: { id: item.chainId } })
    },
    closePopup() {
      this.showAddPopup = false
      this.refreshKey++   // 触发computed重新计算
    }
  }
}
</script>

<style scoped lang="scss">
.set-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: #fff;
}

.fixed-top {
  flex-shrink: 0;
  background-color: #fff;
  z-index: 2;
  position: sticky;
  top: 0;
  padding: 0 0px;
  padding-bottom: 10px;
  
}

.search-box {
  margin: 0 20px;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  margin-top: 12px;

  .search-icon {
    width: 20px;
    margin-left: 10px;
  }

  .search-input {
    border: none;
    flex: 1;
    margin-left: 10px;
    font-size: 16px;
    outline: none;
    background: transparent;
  }
}

.networks-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 100px; // 给按钮留空间
  box-sizing: border-box;
}

.group-title {
  font-size: 16px;
  color: #000;
  margin-top: 20px;
  margin-bottom: 10px;
}

.net-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  cursor: pointer;

  .net-icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }

  .net-name {
    font-size: 16px;
    color: #000;
    flex: 1;
  }

  .lock-icon {
    width: 16px;
    height: 16px;
  }
}

.bottom-btn {
  position: fixed;
  bottom: 30px;
  left: 20px;
  right: 20px;
  height: 50px;
  background-color: #4259ff;
  color: #ffffff;
  border-radius: 50px;
  font-size: 16px;
  text-align: center;
  line-height: 50px;
  z-index: 99;
}
</style>
