<template>
    <div class="popup-overlay">
      <div class="popup-container">
        <div class="popup-header">
          <span class="popup-title">{{ $t('setting.title5') }}</span>
          <img src="@/assets/icon/close.svg" class="close-btn" @click="$emit('close')" />
        </div>
  
        <div class="tab-bar">
          <div
            class="tab-item"
            :class="{ active: activeTab === 'hot' }"
            @click="activeTab = 'hot'"
          >
            {{ $t('setting.hot') }}
          </div>
          <div
            class="tab-item"
            :class="{ active: activeTab === 'custom' }"
            @click="activeTab = 'custom'"
          >
            {{ $t('setting.customNetwork') }}
          </div>
        </div>
  
        <div class="tab-content">
            <HotNetworkList v-if="activeTab === 'hot'" @add="addwlclick" :refreshKey="refreshKey" />
          <CustomNetworkForm v-else @save="saveclick" />
        </div>

         <!-- 添加网络弹窗 -->
        <AddNetworkDialog
            v-if="showAddDialog"
            :item="selectedNetwork"
            @close="showAddDialog = false"
            @confirm="handleAddConfirm"
        />
      </div>
    </div>
  </template>
  
  <script>
  import HotNetworkList from './HotNetworkList.vue'
  import CustomNetworkForm from './CustomNetworkForm.vue'
  import AddNetworkDialog from './AddNetworkDialog.vue'  // 你实现的弹窗组件
  import { networkManager } from '@/bbjs/networkManager.js'
  export default {
    components: {
      HotNetworkList,
      CustomNetworkForm,
        AddNetworkDialog
    },
    data() {
      return {
        activeTab: 'hot',
        showAddDialog: false,
        selectedNetwork: null,
        refreshKey: 0  // 用来刷新 HotNetworkList
      }
    },
    methods: {
      addwlclick(item) {
        // 添加网络逻辑
        console.log('添加网络：', item)
        this.selectedNetwork = item
        this.showAddDialog = true
      },
      saveclick(data) {
        // 保存自定义网络逻辑
        console.log('保存网络：', data)
      },
      handleAddConfirm(item) {
        // 这里执行加入网络逻辑，比如调用 networkManager 加入网络
        console.log('确认添加网络', item)
        // 关闭弹窗
        this.showAddDialog = false
         
        networkManager.setJoinStatus(item.chainId, true)
        // 刷新 HotNetworkList 数据
        this.refreshKey++
     }


    }
  }
  </script>
  
  <style scoped lang="scss">
  .popup-overlay {
    position: fixed;
    top: 0; 
    left: 0;
    
    width: 100%; height: 100%;
    background: #000;
    z-index: 999;
    display: flex;
    //flex-direction: column;
  }
  
  .popup-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;

  }
  
  .popup-header {
    position: relative;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .popup-title {
    font-size: 16px;
    font-weight: bold;
    color: #000;
  }
  
  .close-btn {
    position: absolute;
    right: 0;
    width: 20px; height: 20px;
    cursor: pointer;
  }
  
  .tab-bar {
    display: flex;            /* 关键：横向排列 */
    flex-direction: row;
    width: 100%;
    border-bottom: 1px solid #eee;
  
}

.tab-item {
  flex: 1;                /* 各占一半宽度 */
  text-align: center;     /* 文字居中 */
  padding: 10px 0;
  font-size: 12px;
  cursor: pointer;
  color: #999;
  position: relative;
}

.tab-item.active {
  color: #4259FF;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background-color: #4259FF;
}
  
  .tab-content {
    flex: 1;
    overflow-y: auto;
  }
  </style>
  