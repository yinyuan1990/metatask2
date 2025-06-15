<template>
    <div class="add-asset-page">
      <!-- 头部固定 -->
      <div class="header">
        <div class="title">{{ $t('addAsset.title') }}</div>
        <img
          src="@/static/icon/close.svg"
          alt="close"
          class="close-icon"
          :title="$t('addAsset.close')"
          @click="closePage"
        />
      </div>
  
      <!-- tabbar 固定底部 -->
      <div class="tabbar">
        <div
          :class="['tab-item', activeTab === 'search' ? 'active' : '']"
          @click="switchTab('search')"
        >
          {{ $t('addAsset.tabs.search') }}
        </div>
        <div
          :class="['tab-item', activeTab === 'custom' ? 'active' : '']"
          @click="switchTab('custom')"
        >
          {{ $t('addAsset.tabs.customToken') }}
        </div>
      </div>
  
      <!-- 下面放两个默认 slot，方便你后续替换成组件 -->
      <div class="tab-content">
        <slot name="search" v-if="activeTab === 'search'">
          <!-- 默认搜索占位 -->
          <div class="placeholder">{{ $t('addAsset.placeholders.search') }}</div>
        </slot>
  
        <slot name="custom" v-if="activeTab === 'custom'">
          <!-- 默认自定义代币占位 -->
          <div class="placeholder">{{ $t('addAsset.placeholders.customToken') }}</div>
        </slot>
      </div>
    </div>
  </template>
  
  
  <script>



  export default {
    name: 'AddAssetPage',
    data() {
      return {
        activeTab: 'search',
      }
    },
    methods: {
      switchTab(tab) {
        this.activeTab = tab;
      },
      closePage() {
        this.$router.back();
      }
    }
  }
  </script>
  
  <style scoped>
  .add-asset-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #fff;
    padding-top: 60px; /* 给头部留空间 */
    padding-bottom: 50px; /* 给tabbar留空间 */
  }
  
  /* 头部固定 */
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 40px 0 20px;
    box-sizing: border-box;
    z-index: 1000;
  }
  .title {
    font-weight: 700;
    font-size: 20px;
    color: #000;
    flex: 1;
    text-align: center;
  }
  .close-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 20px;
  }
  
  /* tabbar固定底部 */
  .tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    display: flex;
    border-top: 1px solid #ddd;
    background: #fff;
    z-index: 1000;
  }
  .tab-item {
    flex: 1;
    color: #999;
    font-size: 16px;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
    user-select: none;
    transition: color 0.3s;
  }
  .tab-item.active {
    color: #4259ff;
    font-weight: 600;
  }
  
  /* tab内容区域 */
  .tab-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
  
  .placeholder {
    color: #888;
    text-align: center;
    margin-top: 50px;
    font-size: 18px;
  }
  </style>
  