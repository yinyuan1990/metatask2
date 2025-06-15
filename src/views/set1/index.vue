<template>

    <div class="set1-page">
      <titleBar :title="$t('setting.title')" />
  
      <!-- 货币转换 -->
      <section class="setting-item">
        <h3 class="title">{{ $t('setting.currency') }}</h3>
        <p class="desc">{{ $t('setting.currencyDesc') }}</p>
      </section>
  
      <!-- 货币选择框 -->
      <section class="setting-item">
        <div class="dropdown-box" @click="onSelectCurrency">
          <span class="dropdown-text">{{ $t('setting.currencyUnit') }}</span>
          <span class="dropdown-icon"></span>
        </div>
      </section>
  
      <!-- 主要货币 -->
      <section class="setting-item">
        <h3 class="title">{{ $t('setting.mainCurrency') }}</h3>
        <p class="desc">{{ $t('setting.mainCurrencyDesc') }}</p>
        <div class="radio-group">
          <label><input type="radio" value="native" v-model="mainCurrency" /> {{ $t('setting.native') }}</label>
          <label><input type="radio" value="fiat" v-model="mainCurrency" /> {{ $t('setting.fiat') }}</label>
        </div>
      </section>
  
      <!-- 当前语言 -->
      <section class="setting-item">
        <h3 class="title">{{ $t('setting.language') }}</h3>
        <p class="desc">{{ $t('setting.languageDesc') }}</p>
      </section>
  
      <!-- 语言选择框 -->
      <section class="setting-item">
        <div class="dropdown-box" @click="onSelectCurrency1">
          <span class="dropdown-text">{{ $t('setting.languageCurrent') }}</span>
          <span class="dropdown-icon"></span>
        </div>
      </section>
  
      <!-- 搜索引擎 -->
      <section class="setting-item">
        <h3 class="title">{{ $t('setting.searchEngine') }}</h3>
        <p class="desc">{{ $t('setting.searchEngineDesc') }}</p>
      </section>
  
      <!-- 搜索引擎选择框 -->
      <section class="setting-item">
        <div class="dropdown-box" @click="onSelectCurrency2">
          <span class="dropdown-text">{{ $t('setting.searchEngineCurrent') }}</span>
          <span class="dropdown-icon"></span>
        </div>
      </section>
  
      <!-- 隐藏没有余额的代币 -->
      <section class="setting-item">

        <div class="switch-row">
          <h3 class="title">{{ $t('setting.hideEmptyToken') }}</h3>
         <IosSwitch v-model="hideZeroBalance" />
       </div>
      </section>

      <section class="setting-item toggle-row">
      <div>
         <p class="desc">{{ $t('setting.hideEmptyTokenDesc') }}</p>
       </div>
      </section>
  
      <!-- 账户 Identicon -->
      <section class="setting-item">
        <h3 class="title">{{ $t('setting.identicon') }}</h3>
        <p class="desc">{{ $t('setting.identiconDesc') }}</p>
      </section>



      <!-- 头像类型选择 -->
        <section class="setting-item identicon-row">
        <div class="avatar-option">
            <div class="mm-avatar-account__jazzicon">
            <div class="avatar-box">
                <headbox height="16" width="16" />
            </div>
            </div>
            <span class="avatar-label">Jazzicons</span>
        </div>
        <div class="avatar-option">
            <div class="mm-avatar-account__jazzicon">
            <div class="avatar-box">
                <headbox height="16" width="16" />
            </div>
            </div>
            <span class="avatar-label">Blockies</span>
        </div>
        </section>


      <LanguageSelectDialog v-if="showLangDialog" @close="showLangDialog = false" />
    </div>

    
  </template>
  
  
  <script>
  import TitleBar from '@/components/common/TitleBar.vue'
  import LanguageSelectDialog from '@/components/common/LanguageSelectDialog.vue'
  export default {
    components: {
      TitleBar,
      LanguageSelectDialog, // ✅ 加上这一句
      IosSwitch: () => import('@/components/common/IosSwitch.vue'), // 异步加载开关组件
    },
    data() {
      return {
        mainCurrency: 'native',
        hideZeroBalance: false,
        showLangDialog: false,
      }
    },
    methods: {
        onSelectCurrency() {
        // 可弹出弹窗、打开选择列表等
          console.log('点击选择货币单位');
        },
        onSelectCurrency1() {
        // 
           this.showLangDialog = true;
           console.log('点击语言切换');
        },
        onSelectCurrency2() {
        // 可弹出弹窗、打开选择列表等
          console.log('点击选择货币单位');
        },
    }
  }
  </script>
  
  <style scoped lang="scss">
  .set1-page {
    background: #fff;
    min-height: 100vh;
    padding-bottom: 20px;
    padding-left: 10px;
    padding-right: 10px;
    
  }
  
  .setting-item {
    padding: 16px;
    
  
    .title {
      font-size: 20px;
      color: #000;
      font-weight: 500;
      margin-bottom: 6px;
    }
  
    .desc {
      font-size: 16px;
      color: #777;
      line-height: 1.4;
    }
  
    .radio-group {
      display: flex;
      gap: 50px;
      margin-top: 10px;
  
      label {
        font-size: 16px;
        color: #333;
      }
  
      input[type='radio'] {
        margin-right: 10px;
        transform: scale(1.5); /* 放大按钮 */
        cursor: pointer;
      }
    }
  }
  
  .toggle-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 24px;
  transition: 0.3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

.switch input:checked + .slider {
  background-color: #4459ff;
}

.switch input:checked + .slider:before {
  transform: translateX(20px);
}
.dropdown-box {
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  box-sizing: border-box;
  cursor: pointer;
}

.dropdown-text {
  font-size: 16px;
  color: #000;
}

.dropdown-icon {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #000; /* 朝下小三角 */
}
.identicon-row {
  display: flex;
  justify-content: space-between; // 关键点：让左右分散对齐
  align-items: center;
  margin-top: 20px;

  .avatar-option {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .avatar-box {
    border-radius: 50px;
    overflow: hidden;
    width: 40px;
    height: 40px;
    display: inline-block;
    background: rgb(3, 85, 94);
    padding: 0;
    margin: 0;
  }

  .avatar-label {
    font-size: 16px;
    color: #000;
  }
}


</style>
  