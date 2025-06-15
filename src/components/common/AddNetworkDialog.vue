<template>
    <div class="dialog-overlay" @click.self="qxclick">
      <div class="dialog-container">
        <!-- 标题 -->
        <div class="dialog-title">{{ $t('setting.addNetworkTitle', { name: item.name }) }}</div>
  
        <!-- 链图标+链名称 -->
        <div class="chain-info">
          <ChainIcon :chainId="item.chainId" :isTestnet="item.isTestnet" class="chain-icon" />
          <span class="chain-name">{{ item.name }}</span>
        </div>
  
        <!-- 说明 -->
        <div class="dialog-desc">
          {{ $t('setting.addNetworkNotice') }}
          <span class="link" @click="zkclick">{{ $t('setting.addNetworkLearnMore') }}</span>
        </div>
  
        <!-- 链描述 -->
        <div
          class="chain-detail"
          ref="chainDetail"
          :style="{ maxHeight: fixedHeight + 'px', overflowY: isExpanded ? 'auto' : 'hidden' }"
        >
          <p class="detail-row symbol">{{ item.symbol }}</p>
          <p class="detail-row name">{{ item.name }}</p>
          <p class="detail-row rpc-label">{{ $t('setting.addNetworkRpcLabel') }}</p>
          <p class="detail-row rpc-url">{{ item.rpcUrls[0] }}</p>
  
          <div class="detail-row info-link" @click="toggleExpand">
            <span class="info-text">{{ $t('setting.addNetworkViewDetails') }}</span>
            <img
              :src="isExpanded ? require('@/static/icon/arrow-up.svg') : require('@/static/icon/arrow-down.svg')"
              alt="arrow"
              class="info-icon"
            />
          </div>
  
          <!-- 额外详细信息 -->
          <div v-if="isExpanded" class="extra-detail">
            <p class="detail-row label chain-id-label">{{ $t('setting.addNetworkChainIdLabel') }}</p>
            <p class="detail-row value chain-id">{{ item.chainId }}</p>
  
            <p class="detail-row label display-name-label">{{ $t('setting.addNetworkDisplayNameLabel') }}</p>
            <p class="detail-row value display-name">{{ item.name }}</p>
  
            <p class="detail-row label symbol-label">{{ $t('setting.addNetworkSymbolLabel') }}</p>
            <p class="detail-row value symbol">{{ item.symbol }}</p>
  
            <p class="detail-row label explorer-label">{{ $t('setting.addNetworkExplorerLabel') }}</p>
            <p class="detail-row value explorer-url">{{ item.rpcUrls[0] }}</p>
          </div>
        </div>
  
        <!-- 按钮 -->
        <div class="btns">
          <button class="btn cancel" @click="qxclick">{{ $t('setting.addNetworkCancel') }}</button>
          <button class="btn confirm" @click="qrclick">{{ $t('setting.addNetworkConfirm') }}</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ChainIcon from '@/components/common/ChainIcon.vue'
  
  export default {
    name: 'AddNetworkDialog',
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    components: { ChainIcon },
    data() {
      return {
        isExpanded: false,
        fixedHeight: 0
      }
    },
    methods: {
      qxclick() {
        this.$emit('close')
      },
      qrclick() {
        this.$emit('confirm', this.item)
        this.$emit('close')
      },
      zkclick() {
        // 这里可以加“了解更多”逻辑
      },
      toggleExpand() {
        this.isExpanded = !this.isExpanded
      }
    },
    mounted() {
      this.$nextTick(() => {
        // 记录链描述div的初始高度，展开前的固定高度
        this.fixedHeight = this.$refs.chainDetail.scrollHeight
      })
    }
  }
  </script>
  
  <style scoped lang="scss">
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 0;
  }
  
  .dialog-container {
    background: #fff;
    width: 100vw;
    max-width: 100vw;
    border-radius: 16px 16px 0 0;
    padding: 20px 15px 30px;
    box-sizing: border-box;
  }
  
  .dialog-title {
    font-size: 20px;
    font-weight: 700;
    color: #000;
    text-align: center;
    margin-top: 20px;
  }
  
  .chain-info {
    display: flex;
    align-items: center;
    height: 30px;
    background: #F4F5F9;
    border-radius: 30px;
    padding: 0 15px;
    margin: 15px auto 0;
    width: fit-content;
    max-width: 100%;
  
    .chain-icon {
      width: 15px;
      height: 15px;
      margin-right: 15px;
    }
  
    .chain-name {
      font-size: 20px;
      font-weight: 400;
      color: #000;
    }
  }
  
  .dialog-desc {
    font-size: 20px;
    color: #000;
    margin: 15px 15px 0;
    line-height: 1.4;
  
    .link {
      color: #000;
      cursor: pointer;
      user-select: none;
      margin-left: 5px;
      //text-decoration: underline;
    }
  }
  
  .chain-detail {
    border: 1px solid gray;
    border-radius: 15px;
    margin: 15px 15px 0;
    padding: 20px;
    transition: max-height 0.3s ease;
    /* max-height 和 overflow-y 由 js 控制 */
    
    .detail-row {
      font-size: 20px;
      color: #000;
      margin-bottom: 10px;
      font-weight: 400;
      text-align: left;
  
      &.symbol,
      &.name,
      &.rpc-label,
      &.rpc-url {
        font-weight: 700;
      }
  
      &.rpc-label {
        margin-top: 20px;
        margin-bottom: 10px;
      }
    }
  
    .info-link {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      cursor: pointer;
      user-select: none;
  
      .info-text {
        font-size: 20px;
        color: #4259FF;
        margin-right: 5px;
      }
  
      .info-icon {
        width: 15px;
        height: 15px;
        transition: transform 0.3s ease;
      }
    }
  }
  
  .extra-detail {
    margin-top: 10px;
  
    .label {
      font-weight: 700;
      color: #000;
      margin-top: 10px;
      margin-bottom: 0;
      text-align: left;
    }
  
    .value {
      
      color: #000;
      margin-top: 10px;
      margin-bottom: 10px;
      text-align: left;
    }
  
    .display-name-label {
      margin-top: 20px;
    }
  
    .explorer-label {
      margin-top: 20px;
    }

    .symbol-label {
      margin-top: 20px;
    }
  }
  
  .btns {
    margin: 20px 10px 20px 20px;
    display: flex;
    gap: 20px;
    justify-content: space-between;
  }
  
  .btn {
    flex: 1;
    height: 50px;
    font-size: 20px;
    border-radius: 50px;
    cursor: pointer;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .cancel {
    background: #fff;
    border: 1px solid #4259FF;
    color: #4259FF;
  }
  
  .confirm {
    background: #4259FF;
    border: none;
    color: #fff;
  }
  </style>
  