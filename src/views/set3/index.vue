<script>
import TitleBar from '@/components/common/TitleBar.vue'
import { accountManager } from "@/bbjs/AccountManager"
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
export default {
    components:{
      TitleBar,
      ConfirmDialog,
      IosSwitch: () => import('@/components/common/IosSwitch.vue'), // 异步加载开关组件
    },
  data() {
    return {
      openResetDialog: false,
       show:false,
      smartTxEnabled: false, // 智能交易开关
      hexDataEnabled: false, // 显示十六进制数据开关
      customNonceEnabled: false, // 自定义交易 nonce 开关
      tokenDetectionEnabled: true, // 自动检测代币开关
      testnetConversionEnabled: false, // 在测试网络上显示兑换开关
      stateLogEnabled: false, // 状态日志开关

    };
  },
  methods:{
    zzzhclick() {
      this.openResetDialog = true;
    console.log('点击了重设账户')
    // 👉 此处写实际的账户重置逻辑
    },
    xzztjlclick() {
      console.log('点击了下载状态日志')
      // 👉 此处写实际的下载状态日志逻辑
      // 例如：调用 accountManager.downloadStateLog() 方法
      //accountManager.downloadStateLog();
    }
  }
};
</script>
<template>
 <div class="set-page">
  <!-- 固定标题栏 -->
   <div class="title-wrapper">
      <titleBar :title="$t('setting.title2')" />
    </div>

    <!-- 可滑动内容区域 -->
    <section class="set-section scroll-content">
      <!-- 页面滑动内容填充这里 -->

      <div class="spacing-30"></div> 
      <!-- 重置账户模块 -->
      <h2 class="p1">{{ $t('setting.resetAccount') }}</h2>
      <div class="spacing-10"></div> 
      <p class="p2">{{ $t('setting.resetAccountDesc') }}</p>

      <div class="spacing-20"></div> 
      <!-- 重置账户按钮 -->
      <div
        class="btn-outline"
        @click="zzzhclick"
      >
        {{ $t('setting.resetAccountBtn') }}
      </div>
      <div class="spacing-30"></div>
      

      <!-- 智能交易 -->
<div class="switch-row">
  <h2 class="p1">{{ $t('setting.smartTx') }}</h2>
  <IosSwitch v-model="smartTxEnabled" />
</div>
<div class="spacing-10"></div> 
<p class="p2">
  {{ $t('setting.smartTxDesc') }}
  <span class="link-blue">{{ $t('setting.learnMore') }}</span>
</p>
<div class="spacing-10"></div> 
<!-- 显示十六进制数据 -->
<div class="switch-row">
  <h2 class="p1">{{ $t('setting.hexData') }}</h2>
  <IosSwitch v-model="hexDataEnabled" />
</div>
<div class="spacing-10"></div> 
<p class="p2">{{ $t('setting.hexDataDesc') }}</p>
<div class="spacing-10"></div> 
<!-- 自定义交易 nonce -->
<div class="switch-row">
  <h2 class="p1">{{ $t('setting.customNonce') }}</h2>
  <IosSwitch v-model="customNonceEnabled" />
</div>
<div class="spacing-10"></div> 
<p class="p2">{{ $t('setting.customNonceDesc') }}</p>
<div class="spacing-10"></div> 
<!-- 自动检测代币 -->
<div class="switch-row">
  <h2 class="p1">{{ $t('setting.tokenDetection') }}</h2>
  <IosSwitch v-model="tokenDetectionEnabled" />
</div>
<div class="spacing-10"></div> 
<p class="p2">{{ $t('setting.tokenDetectionDesc') }}</p>
<div class="spacing-10"></div> 
<!-- 在测试网络上显示兑换 -->
<div class="switch-row">
  <h2 class="p1">{{ $t('setting.testnetConversion') }}</h2>
  <IosSwitch v-model="testnetConversionEnabled" />
</div>
<div class="spacing-10"></div> 
<p class="p2">{{ $t('setting.testnetConversionDesc') }}</p>

<div class="spacing-10"></div> 
<!-- 状态日志 -->
<h2 class="p1">{{ $t('setting.stateLog') }}</h2>
<div class="spacing-10"></div> 
<p class="p2">{{ $t('setting.stateLogDesc') }}</p>

<div class="spacing-10"></div> 
<!-- 下载按钮 -->
<div class="btn-outline" @click="xzztjlclick">{{ $t('setting.downloadStateLog') }}</div>


</section> 


<ConfirmDialog v-if="openResetDialog" @close="openResetDialog = false">
      <template v-slot:title>重设账户？</template>
      重置账户将清除您的交易历史记录
      <template v-slot:confirm-btn-text>是，重置</template>
    </ConfirmDialog>

  </div>
</template>
<style scoped lang="scss">

.btn-outline {
  height: 40px;
  border-radius: 40px;
  border: 1px solid #4259FF;
  color: #4259FF;
  background: #fff;
  font-size: 16px;
  text-align: center;
  line-height: 40px;
  margin-top: 10px;
}

</style>