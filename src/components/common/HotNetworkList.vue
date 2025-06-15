<template>
    <div class="hot-list">
      <div
        v-for="item in hotList"
        :key="item.chainId"
        class="hot-item"
        @click="addwlclick(item)"
      >
        <ChainIcon :chainId="item.chainId" :isTestnet="item.isTestnet" class="chain-icon" />
        <span class="chain-name">{{ item.name }}</span>
        <span class="add-btn">{{ $t('setting.add') }}</span>
      </div>
    </div>
  </template>
  
  <script>
  import ChainIcon from '@/components/common/ChainIcon.vue'
  import { networkManager } from '@/bbjs/networkManager.js'
  
  export default {
    name: 'HotNetworkList',
    components: { ChainIcon },
    props: {
      refreshKey: { type: Number, default: 0 }
    },
    computed: {
      hotList() {
        // 这里加个依赖 refreshKey，方便外部强制刷新
        this.refreshKey
        return networkManager.getAll().filter(i => !i.isJoined)
      }
    },
    methods: {
      addwlclick(item) {
        this.$emit('add', item) // 通知父组件
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
  .hot-list {
    padding: 20px 0px;
  }
  
  .hot-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    cursor: pointer;
  
    .chain-icon {
      width: 30px;
      height: 30px;
      margin-right: 12px;
      flex-shrink: 0;
      object-fit: contain;
    }
  
    .chain-name {
      font-size: 16px;
      color: #000;
      flex: 1;
      line-height: 30px;
    }
  
    .add-btn {
      font-size: 14px;
      color: #4259FF;
      line-height: 30px;
    }
  }
  </style>
  