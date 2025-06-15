<template>
    <div class="custom-form">

        <div class="spacing-10"></div> 
      <!-- 网络名称 -->
      <label class="p1">{{ $t('setting.networkName') }}</label>
      <div class="spacing-10"></div> 
      <input
        v-model="form.name"
        :placeholder="$t('setting.networkNamePlaceholder')"
        class="input-field"
      />
      <div class="spacing-10"></div> 
      <!-- RPC URL -->
      <label class="p1">{{ $t('setting.rpcUrl') }}</label>
      <div class="spacing-10"></div> 
      <div class="select-field" @click="onRpcSelect">
        <span class="placeholder">{{ $t('setting.rpcUrlPlaceholder') }}</span>
        <img src="@/static/icon/arrow-down.svg" class="arrow-icon" />
      </div>
      <div class="spacing-10"></div> 
      <!-- 链ID -->
      <label class="p1">{{ $t('setting.chainId') }}</label>
      <div class="spacing-10"></div> 
      <input
        v-model="form.chainId"
        :placeholder="$t('setting.chainIdPlaceholder')"
        class="input-field"
      />
      <div class="spacing-10"></div> 
      <!-- 符号 -->
      <label class="p1">{{ $t('setting.symbol') }}</label>
      <div class="spacing-10"></div> 
      <input
        v-model="form.symbol"
        :placeholder="$t('setting.symbolPlaceholder')"
        class="input-field"
      />
      <div class="spacing-10"></div> 
      <!-- 区块浏览器 URL -->
      <label class="p1">{{ $t('setting.blockExplorerUrl') }}</label>
      <div class="spacing-10"></div> 
      <div class="select-field" @click="onExplorerSelect">
        <span class="placeholder">{{ $t('setting.blockExplorerUrlPlaceholder') }}</span>
        <img src="@/static/icon/arrow-down.svg" class="arrow-icon" />
      </div>
  
      <!-- 保存按钮 -->
      <div class="save-btn" @click="onSaveClick">
        {{ $t('setting.save') }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CustomNetworkForm',
    data() {
      return {
        form: {
          name: '',
          rpcUrl: '',
          chainId: '',
          symbol: '',
          explorerUrl: ''
        }
      }
    },
    methods: {
      onRpcSelect() {
        // 这里可以弹出选择框，选中后设置 form.rpcUrl
      },
      onExplorerSelect() {
        // 这里可以弹出选择框，选中后设置 form.explorerUrl
      },
      onSaveClick() {
        this.$emit('save', this.form)
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
  .custom-form {
    padding: 20px 0px;
  }
  
  .p1 {
    font-size: 16px;
    font-weight: bold;
    margin: 16px 0 6px;
    color: #000;
  }
  
  .input-field {
    height: 50px;
    border-radius: 10px;
    border: 1px solid #B8BAC8;
    background-color: #fff;
    padding: 0 12px;
    font-size: 16px;
    color: #000;
    width: 100%;
    box-sizing: border-box;
  }
  
  .select-field {
    height: 50px;
    border-radius: 10px;
    border: 1px solid #B8BAC8;
    background-color: #fff;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
  
    .placeholder {
      font-size: 16px;
      color: #B8BAC8;
    }
  
    .arrow-icon {
      width: 20px;
      height: 20px;
      margin-right: 20px;
    }
  }
  
  .save-btn {
    margin-top: 30px;
    height: 40px;
    border-radius: 40px;
    background-color: #A1AAFF;
    font-size: 16px;
    color: #fff;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
  }
  </style>
  