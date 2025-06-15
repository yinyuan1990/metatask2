<template>
    <div class="dialog-mask" @click.self="close">
      <div class="dialog-box">
        <!-- 标题，固定 -->
        <div class="dialog-title">{{ $t('setting.selectNetwork') }}</div>
  
        <!-- 搜索框，固定 -->
        <div class="search-wrapper">
          <img src="@/static/icon/search.svg" alt="search" class="search-icon" />
          <input
            type="text"
            v-model="searchText"
            :placeholder="$t('setting.searchPlaceholder')"
            class="search-input"
            @input="onSearchInput"
          />
        </div>
  

        <div class="spacing-20"></div>
        <!-- 启用的网络 -->
        <div class="network-list">
          <div class="group">
            <h3 class="group-title">{{ $t('setting.enabledNetworks') }}</h3>
            <div v-if="filteredJoinedNetworks.length === 0" class="empty-tip">{{ $t('setting.noData') }}</div>
            <div
              v-for="(net, index) in filteredJoinedNetworks"
              :key="index"
              class="network-item"
              @click="selectNetwork(net)"
            >
              <ChainIcon :chainId="net.chainId" class="network-icon" />
              <span class="network-name">{{ net.name }}</span>
              <img src="@/static/icon/more-vertical.svg" alt="more" class="more-icon" />
            </div>
          </div>
  
          <!-- 其他网络 -->
          <div class="group">
            <h3 class="group-title">{{ $t('setting.otherNetworks') }}</h3>
            <div class="spacing-10"></div>
            <div v-if="filteredOtherNetworks.length === 0" class="empty-tip">{{ $t('setting.noData') }}</div>
            <div
              v-for="(net, index) in filteredOtherNetworks"
              :key="index"
              class="network-item"
              @click="addNetwork(net)"
            >
              <ChainIcon :chainId="net.chainId" class="network-icon" />
              <span class="network-name">{{ net.name }}</span>
              <span class="add-btn" @click.stop="addNetwork">{{ $t('setting.add') }}</span>
            </div>
          </div>
  
          <!-- 测试网络 -->
          <div class="group testnet-group">
            <div class="testnet-header">
                <h3 class="group-title">{{ $t('setting.testNetworks') }}</h3>
                <IosSwitch v-model="showTestnet" />
            </div>
            <div class="spacing-10"></div>
            <div v-show="showTestnet">
              <div
                v-for="(net, index) in filteredTestnetNetworks"
                :key="index"
                class="network-item"
                @click="selectNetwork(net)"
              >
                <ChainIcon :chainId="net.chainId" class="network-icon" />
                <span class="network-name">{{ net.name }}</span>
                <img src="@/static/icon/more-vertical.svg" alt="more" class="more-icon" />
              </div>
            </div>
        
          </div>

        </div>

              <!-- 添加自定义网络按钮 -->
              <div class="add-network-btn" @click="tjzdyiwalclick">
          {{ $t('setting.addCustomNetwork') }}
        </div>
  
      </div>

        <!-- 添加网络弹窗 -->
        <AddNetworkDialog
            v-if="showAddDialog"
            :item="selectedNetwork"
            @close="showAddDialog = false"
            @confirm="handleAddConfirm"
        />
    </div>
  </template>
  
  <script>
  import ChainIcon from '@/components/common/ChainIcon.vue'
  import { networkManager } from '@/bbjs/networkManager.js'
  import IosSwitch from '@/components/common/IosSwitch.vue'
  import AddNetworkDialog from './AddNetworkDialog.vue'  // 你实现的弹窗组件
  export default {
    components: { ChainIcon, IosSwitch ,AddNetworkDialog},
    data() {
      return {
        showAddDialog: false,
        selectedNetwork: null,
        searchText: '',
        showTestnet: true,
        refreshKey: 0,  // 用来刷新 HotNetworkList
        networks: networkManager.getAll(),
      };
    },
    computed: {
      filteredJoinedNetworks() {
        this.refreshKey
        return this.networks
          .filter(net => net.isJoined && !net.isTestnet)
          .filter(net => net.name.toLowerCase().includes(this.searchText.toLowerCase()));
      },
      filteredOtherNetworks() {
        this.refreshKey
        return this.networks
          .filter(net => !net.isJoined && !net.isTestnet)
          .filter(net => net.name.toLowerCase().includes(this.searchText.toLowerCase()));
      },
      filteredTestnetNetworks() {
        this.refreshKey
        return this.networks
          .filter(net => net.isTestnet)
          .filter(net => net.name.toLowerCase().includes(this.searchText.toLowerCase()));
      }
    },
  watch: {
    showTestnet(newVal) {
      // 监听到 showTestnet 变化时的回调函数
      console.log('Testnet networks visibility changed:', newVal);
      // 你可以在这里做一些其他操作，比如向后端发送请求，或者刷新列表等
    }
  },
    methods: {
        handleAddConfirm(item) {
        // 这里执行加入网络逻辑，比如调用 networkManager 加入网络
        console.log('确认添加网络', item)
        // 关闭弹窗
        this.showAddDialog = false
         
        networkManager.setJoinStatus(item.chainId, true)
        // 刷新 HotNetworkList 数据
        this.refreshKey++
     },

        addNetwork(net) {

            this.selectedNetwork = net
            this.showAddDialog = true
            //this.$emit('add-network', net)
        
      },
      selectNetwork(net) {

        this.$emit('select-network', net)
        this.close();
      },
      close() {
        this.$emit('close');
      },
      onSearchInput(e) {
        this.searchText = e.target.value;
      },tjzdyiwalclick(){ //

        console.log('添加自定义网络')
        this.$emit('add-zdynetwork')
        
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
  .dialog-mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: flex-end; /* 修改为底部对齐 */
  }
  
  .dialog-box {
    width: calc(100%);
    max-width: 1400px;
    background: #fff;
    border-radius: 10px 10px 0 0;
    padding: 20px 20px;
    box-sizing: border-box;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }
  
  .dialog-title {
    font-size: 20px;
    font-weight: bold;
    color: #000;
    text-align: center;
    margin-bottom: 10px;
    flex-shrink: 0; /* 不参与滚动 */
  }
  
  .search-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 4px;
    height: 60px;
    padding-left: 10px;
    margin: 10px 10px 0 0px;
    user-select: none;
  }
  
  .search-icon {
    width: 20px;
    height: 20px;
    margin-left: 20px;
    object-fit: contain;
  }
  
  .search-input {
    border: none;
    outline: none;
    margin-left: 10px;
    font-size: 12px;
    color: #000;
    flex: 1;
  }
  
  .network-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 10px;
    margin-bottom: 60px;
  }
  
  .group {
    padding: 0px;
  }
  
  .group-title {
    font-weight: 700;
    font-size: 16px;
    color: #000;
    margin-bottom: 10px;
  }
  
  .network-item {
    display: flex;
    align-items: center;
    padding: 5px 0px;
    cursor: pointer;
    
  }
  
  .network-icon {
    width: 30px;
    height: 30px;
    margin-right: 12px;
  }
  
  .network-name {
    flex: 1;
    font-size: 16px;
    color: #000;
  }
  
  .more-icon {
    width: 10px;
    height: 10px;
    object-fit: contain;
    user-select: none;
    margin-left: auto;
  }
  
  .testnet-group .testnet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0px;
    user-select: none;
  }
  .add-btn {
  font-size: 14px;
  color: #4259ff;
  cursor: pointer;
  text-align: right;
  padding-left: 10px;
}

.add-network-btn {
  position: fixed;
  bottom: 20px;      /* 距离底部20px */
  left: 50%;         /* 水平居中 */
  transform: translateX(-50%);
  
  height: 40px;
  width: calc(100% - 40px); /* 保持左右边距20px */
  border: 1px solid #4259ff;
  color: #4259ff;
  font-size: 18px;
  border-radius: 40px;
  background: #fff;
  cursor: pointer;
  user-select: none;

  /* 居中文字 */
  display: flex;
  justify-content: center;
  align-items: center;
}

  </style>
  