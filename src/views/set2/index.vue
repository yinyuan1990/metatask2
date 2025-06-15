<script>
import TitleBar from '@/components/common/TitleBar.vue'
import { accountManager } from "@/bbjs/AccountManager"
export default {
    components:{
      TitleBar,
      IosSwitch: () => import('@/components/common/IosSwitch.vue'), // 异步加载开关组件
     
    },
  data() {
    return {
     
       basicFeatureEnabled: true,
       show:false,
       securityAlertEnabled: true, // 默认开启
       bioLoginEnabled: false,      // 使用生物特征登录状态
       rememberMeEnabled: false,     // “记住我”功能状态
       estimateBalanceEnabled: true,
    showNFTMedia: true,
    autoDetectNFT: true,
    ipfsEnabled: true,
    metaMetricsEnabled : true,
    marketingDataEnabled: true,
    syncEnabled: true,
    networkDetailsEnabled: true,
    batchBalanceRequestEnabled: true,
    incomingTxEnabled: true,
    autoSecurityCheckEnabled: true, // 自动安全检查开关
    autoSecurityCheckEnabled: true, // 自动安全检查开关

       chains: [
      {
        id: 'eth',
        name: 'Ethereum Mainnet',
        icon: require('@/assets/icons/eth_logo.svg'),
        enabled: true,
      },
      {
        id: 'arbitrum',
        name: 'Arbitrum One',
        icon: require('@/assets/icons/arbitrum.svg'),
        enabled: true,
      },
      {
        id: 'bsc',
        name: 'BNB Smart Chain Mainnet',
        icon: require('@/assets/icons/bnb.svg'),
        enabled: true,
      },
      {
        id: 'base',
        name: 'Base',
        icon: require('@/assets/icons/base.svg'),
        enabled: false,
      },
      {
        id: 'op',
        name: 'OP Mainnet',
        icon: require('@/assets/icons/optimism.svg'),
        enabled: true,
      },
      {
        id: 'polygon',
        name: 'Polygon Mainnet',
        icon: require('@/assets/icons/pol-token.svg'),
        enabled: true,
      },
     ]
    };
  },
  computed: {
    currentAccountLabel() {
        const all = accountManager.getAllAccounts()
        const current = accountManager.getCurrentAccount()
        const index = all.findIndex(acc => acc.walletId === current?.walletId)
        console.log('当前账户索引:', index, '总账户数:', all.length)
        return `Account ${index + 1}`
      },
  },
  methods:{
    
    xssyzjcclick() {
    // 触发显示助记词逻辑
     console.log('显示私钥助记词按钮点击');
   },
   ggmmclick() {
    console.log('点击更改密码')
   },
     // 自动锁定时间选择点击事件
    xzkxsjclick() {
      console.log('点击选择自动锁定时间');
    },
    xssyclick() {
      alert('显示私钥按钮被点击')
    },
    ggljclick() {
    console.log('管理连接');
  },
  qcyssjclick() {
    console.log('清除隐私数据');
  },
  qcllqlscjlclick() {
    console.log('清除历史记录');
  },
  qcllqcookieclick() {
    console.log('清除 Cookie');
  },wgclick(){
    console.log('点击选择IPFS网关');
  },
  scclick() {
    console.log('删除MetaMetrics数据点击')
    // TODO: 实现删除逻辑
  },
  scqbclick() {
    console.log('删除钱包点击')
    // TODO: 实现删除钱包逻辑
  }
  }
};
</script>
<template>
  <div class="set2-page">
  
    <titleBar :title="$t('setting.title1')" />
    <section class="security-section">
    <h1 class="p0">{{ $t('setting.security') }}</h1>
    <h2 class="p1">{{ $t('setting.protectWallet') }}</h2>
    <div class="spacing-10"></div>
    <p class="p2">{{ $t('setting.protectWalletDesc') }}</p>


    <div class="status-box">
      <div class="status-strip"></div>
      <div class="status-icon">
       ✔
      </div>
      <div class="status-text p1">{{ $t('setting.mnemonicBacked') }}</div>
    </div>

    <div class="reveal-button" @click="xssyzjcclick">
      {{ $t('setting.revealMnemonic') }}
    </div>


    <div class="spacing-30"></div>
    <!-- 密码部分 -->
    <h2 class="p1">{{ $t('setting.password') }}</h2>

    <div class="spacing-10"></div>

    <p class="p2">{{ $t('setting.passwordDesc') }}</p>
    <div class="spacing-10"></div>
    <!-- 更改密码按钮 -->
    <div class="outline-button" @click="ggmmclick">
      {{ $t('setting.changePassword') }}
    </div>


    <div class="spacing-30"></div>
   <!-- 自动锁定区域 -->
    <h2 class="p1">{{ $t('setting.autoLock') }}</h2>
    <div class="spacing-10"></div>
    <p class="p2">{{ $t('setting.autoLockDesc') }}</p>

    <!-- 下拉框：显示“永不” -->
    <div class="dropdown-box" @click="xzkxsjclick">
      <span class="p2">{{ $t('setting.autoLockTime') }}</span>
      <span class="arrow-down" />
    </div>
     
    <!-- 使用生物特征登录 开关 -->
    <div class="spacing-20"></div>

    <div class="row-between">
      <h2 class="p1">{{ $t('setting.bioLogin') }}</h2>
      <IosSwitch v-model="bioLoginEnabled" />
    </div>
    <div class="spacing-20"></div>
     

    <!-- 打开“记住我” 开关 -->
    <div class="row-between">
      <h2 class="p1">{{ $t('setting.rememberMe') }}</h2>
      <IosSwitch v-model="rememberMeEnabled" />
    </div>

    <div class="spacing-10"></div>
    <p class="p2">{{ $t('setting.rememberMeDesc') }}</p>
 
    <div class="spacing-30"></div>
    <h2 class="p1">{{ $t('setting.showPrivateKeyFor', { account: currentAccountLabel }) }}</h2>

    <div class="spacing-10"></div>
    <!-- 当前账户私钥说明 -->
    <p class="p2">
      {{ $t('setting.showPrivateKeyDesc', { label: currentAccountLabel }) }}
    </p>
    <div class="spacing-10"></div>
    <!-- 显示私钥按钮 -->
    <div class="blue-button" @click="xssyclick">
      {{ $t('setting.showPrivateKey') }}
    </div>
    <div class="spacing-30"></div>
    <!-- ✅ 安全提醒模块 -->
    <div class="row-between">
      <h2 class="p1">{{ $t('setting.securityAlert') }}</h2>
      <IosSwitch v-model="securityAlertEnabled" />
    </div>
    <div class="spacing-30"></div>
    <!-- ✅ 安全提醒说明文字 -->
    <p class="p2">
      {{ $t('setting.securityAlertDesc') }}
      <span class="link-text">{{ $t('setting.learnMore') }}</span>
    </p>

    <!-- ✅ 隐私主标题 -->
<h1 class="p0">{{ $t('setting.privacy') }}</h1>
<!-- ✅ 通用文字 -->
<p class="p2">{{ $t('setting.general') }}</p>
<!-- ✅ 基本功能模块 -->
<div class="row-between">
  <h2 class="p1">{{ $t('setting.basicFeatures') }}</h2>
  <IosSwitch v-model="basicFeatureEnabled" />
</div>

<div class="spacing-10"></div>
<!-- ✅ MetaMask 服务说明段落（含链接） -->
<p class="p2">
  {{ $t('setting.metamaskServiceDesc1') }}
  <span class="link-text">{{ $t('setting.privacyPolicy') }}</span>
  {{ $t('setting.metamaskServiceDesc2') }}
</p>

<div class="spacing-30"></div>
<!-- 配置文件同步 -->
<div class="switch-row">
  <h2 class="p1">{{ $t('setting.profileSync') }}</h2>
  <IosSwitch v-model="syncEnabled" />
</div>
<div class="spacing-10"></div>
<p class="p2">
  {{ $t('setting.profileSyncDesc1') }}
  <span class="link-text">{{ $t('setting.profileSyncDesc2') }}</span>
</p>
<!-- 间距 -->
<div style="height: 10px;"></div>

<!-- 清除隐私或浏览器数据 -->
<p class="p2">{{ $t('setting.clearPrivacyBrowserData') }}</p>
<!-- 间距 -->
<div style="height: 10px;"></div>

<!-- 管理连接 -->
<h2 class="p1">{{ $t('setting.manageConnections') }}</h2>
<div class="spacing-10"></div>
<p class="p2">{{ $t('setting.manageConnectionsDesc') }}</p>


<!-- 管理连接按钮 -->
<div class="primary-btn" @click="ggljclick">
  {{ $t('setting.manageConnectionsBtn') }}
</div>

<div class="spacing-30"></div>
<!-- 清除隐私数据模块 -->
<h2 class="p1">{{ $t('setting.clearPrivacyData') }}</h2>
<div class="spacing-10"></div>
<p class="p2">{{ $t('setting.clearPrivacyDataDesc') }}</p>
<div class="spacing-10"></div>
<div class="primary-btn" @click="qcyssjclick">
  {{ $t('setting.clearPrivacyDataBtn') }}
</div>

<div class="spacing-30"></div>
<!-- 清除浏览器历史记录模块 -->
<h2 class="p1">{{ $t('setting.clearHistory') }}</h2>
<div class="spacing-10"></div>
<p class="p2">{{ $t('setting.clearHistoryDesc') }}</p>
<div class="spacing-10"></div>
<div class="primary-btn" @click="qcllqlscjlclick">
  {{ $t('setting.clearHistoryBtn') }}
</div>

<div class="spacing-30"></div>
<!-- 清除 Cookie 模块 -->
<h2 class="p1">{{ $t('setting.clearCookie') }}</h2>
<div class="spacing-10"></div>
<p class="p2">{{ $t('setting.clearCookieDesc') }}</p>
<div class="spacing-10"></div>
<div class="primary-btn" @click="qcllqcookieclick">
  {{ $t('setting.clearCookieBtn') }}
</div>

<div class="spacing-30"></div>
<!-- 网络提供商模块 -->

  <h2 class="p1">{{ $t('setting.networkProvider') }}</h2>

  <div class="switch-row">
    <span class="p1">{{ $t('setting.networkDetailsCheck') }}</span>
    <IosSwitch v-model="networkDetailsEnabled" />
  </div>
  <div class="spacing-10"></div>
  <p class="p2">
    {{ $t('setting.networkDetailsDesc.part1') }}
    <strong style="color: #000;">chainid.network</strong>
    {{ $t('setting.networkDetailsDesc.part2') }}
  </p>


<!-- 交易模块 -->
<div class="spacing-20"></div>
  <h2 class="p1">{{ $t('setting.transaction') }}</h2>

  <div class="switch-row">
    <span class="p1">{{ $t('setting.batchBalanceRequest') }}</span>
    <IosSwitch v-model="batchBalanceRequestEnabled" />
  </div>
  <div class="spacing-10"></div>
  <p class="p2">{{ $t('setting.batchBalanceRequestDesc') }}</p>

  <div class="switch-row">
    <span class="p1">{{ $t('setting.incomingTx') }}</span>
    <IosSwitch v-model="incomingTxEnabled" />
  </div>
  <div class="spacing-10"></div>
  <p class="p2">{{ $t('setting.incomingTxDesc') }}</p>



<!-- 链开关区域 -->

<div class="chain-toggle-item" v-for="chain in chains" :key="chain.id">
  <div class="left">
    <img :src="chain.icon" alt="icon" class="icon" />
    <span class="chain-name">{{ chain.name }}</span>
  </div>
  <IosSwitch v-model="chain.enabled" />
</div>


    <!-- 预计余额变化 -->
 
      <div class="switch-row">
        <h2 class="p1">{{ $t('setting.estimateBalanceChange') }}</h2>
        <IosSwitch v-model="estimateBalanceEnabled" />
      </div>
      <div class="spacing-10"></div>
      <p class="p2">
        {{ $t('setting.estimateBalanceChangeDesc') }}
        <span class="blue">{{ $t('setting.learnMore') }}</span>
      </p>
      <div class="spacing-20"></div>  
      <!-- 代币、NFT 和 ENS 自动检测 -->
      <h2 class="p1">{{ $t('setting.autoDetectAssets') }}</h2>

      <!-- 显示NFT媒体 -->
      <div class="switch-row">
      <h2 class="p1">{{ $t('setting.showNFTMedia') }}</h2>
      <IosSwitch v-model="showNFTMedia" />
      </div>
      <div class="spacing-10"></div> 
      <p class="p2">
        {{ $t('setting.showNFTMediaDesc') }}
      </p>

      <!-- 自动检测 NFT -->
      <div class="switch-row">
      <h2 class="p1">{{ $t('setting.autoDetectNFT') }}</h2>
      <IosSwitch v-model="autoDetectNFT" />
      </div>
      <div class="spacing-10"></div> 
      <p class="p2">{{ $t('setting.autoDetectNFTDesc') }}</p>

      <!-- IPFS 网关 -->
      <div class="switch-row">
      <h2 class="p1">{{ $t('setting.ipfsGateway') }}</h2>
      <IosSwitch v-model="ipfsEnabled" />
      </div>
      <div class="spacing-10"></div> 
      <p class="p2">{{ $t('setting.ipfsGatewayDesc') }}</p>
      <div class="spacing-10"></div> 
      <!-- 选择您的首选 IPFS 网关 -->
      <p class="p2">{{ $t('setting.selectPreferredGateway') }}</p>


    




      
  <!-- 当前 IPFS 网关异常 -->
  <div class="select-row" @click="wgclick">
    <p class="p2">{{ $t('setting.gatewayFailed') }}</p>
    <img src="@/assets/icons/arrow-down.svg" alt="down" class="down-arrow" />
  </div>


  <div class="spacing-30"></div> 
  <!-- 安全检查 -->
  <h2 class="p1">{{ $t('setting.securityCheck') }}</h2>
  <div class="spacing-20"></div> 
  <div class="switch-row">
    <h2 class="p1">{{ $t('setting.autoSecurityCheck') }}</h2>
    <IosSwitch v-model="autoSecurityCheckEnabled" />
  </div>
  <div class="spacing-10"></div> 
  <p class="p2">{{ $t('setting.autoSecurityCheckDesc') }}</p>

  <div class="spacing-10"></div> 
  <!-- 分析 -->
  <h2 class="p1">{{ $t('setting.analytics') }}</h2>
  <div class="spacing-20"></div> 
  <div class="switch-row">
    <h2 class="p1">{{ $t('setting.metaMetrics') }}</h2>
    <IosSwitch v-model="metaMetricsEnabled" />
  </div>
  <div class="spacing-10"></div> 
  <p class="p2">
    {{ $t('setting.metaMetricsDesc') }}
    <span class="link">{{ $t('setting.learnMoreLarge') }}</span>
  </p>
  <div class="spacing-20"></div> 
  <!-- 用于营销目的的数据收集 -->
  <div class="switch-row">
    <h2 class="p0">{{ $t('setting.marketingDataCollection') }}</h2>
    <IosSwitch v-model="marketingDataEnabled" />
  </div>
  <div class="spacing-10"></div> 
  <p class="p2">{{ $t('setting.marketingDataDesc') }}</p>
  <div class="spacing-20"></div> 
  <!-- 删除 MetaMetrics 数据 -->
  <h2 class="p1">{{ $t('setting.deleteMetaMetrics') }}</h2>
  <div class="spacing-10"></div> 
  <p class="p2">
    {{ $t('setting.deleteMetaMetricsDescPart1') }}
    <span class="link">MetaMetrics</span>
    {{ $t('setting.deleteMetaMetricsDescPart2') }}
    <span class="link">{{ $t('setting.privacyPolicy') }}</span>
    。
  </p>

  <div class="spacing-20"></div> 
  <!-- 删除 MetaMetrics 数据 按钮 -->
<div class="button-outline" @click="scclick">
  {{ $t('setting.deleteMetaMetrics') }}
</div>
<div class="spacing-20"></div> 
<!-- 删除钱包 P1 -->
<h2 class="p1">{{ $t('setting.deleteWallet') }}</h2>
<div class="spacing-10"></div> 
<!-- 删除钱包 P2 -->
<p class="p2">{{ $t('setting.deleteWalletDesc') }}</p>

<!-- 删除钱包按钮 -->
<div class="button-outline" @click="scqbclick">
  {{ $t('setting.deleteWallet') }}
</div>

<div class="spacing-30"></div> 
<div class="spacing-30"></div> 
<div class="spacing-30"></div> 






   </section>


  
   
  </div>
</template>
<style scoped lang="scss">
  .set2-page {
    background: #fff;
    min-height: 100vh;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    
  }
  .security-section {
    padding: 0px 16px;

  }
  

.spacing-10 {
  height: 10px;
}
.spacing-20 {
  height: 20px;
}
.spacing-30 {
  height: 30px;
}

.status-box {
  display: flex;
  align-items: center;
  height: 40px;
  background-color: #E9F2E8;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 20px;
}
.status-strip {
  width: 5px;
  height: 40px;
  background-color: #1F7E34;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.status-icon {
  width: 20px;
  height: 20px;
  background-color: #1F7E34;
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.status-text {
  margin-left: 20px;
  aligncenter: center;
}
.reveal-button {
  height: 40px;
  border-radius: 40px;
  background-color: #4259FF;
  color: #fff;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  cursor: pointer;
}

.outline-button {
  height: 40px;
  border-radius: 40px;
  border: 1px solid #4259FF;
  background-color: #fff;
  color: #4259FF;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  cursor: pointer;
  font-weight: bold;
}
/* 下拉框样式：40px 高，圆角5px */
.dropdown-box {
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  margin-top: 10px;
  cursor: pointer;
  position: relative;
}

/* 黑色倒三角图标 */
.arrow-down {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #000;
}
.row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}
.blue-button {
  height: 40px;
  border-radius: 40px;
  background-color: #4259FF;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  cursor: pointer;
}
.link-text {
  color: #4259FF;
  font-weight: 500;
}
.link-text {
  color: #4259FF;
  font-weight: 500;
}
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}
.primary-btn {
  height: 40px;
  border-radius: 40px;
  background-color: #fff;
  border: 1px solid #4259FF;
  color: #4259FF;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  cursor: pointer;
}
/* 加在 style scoped 里面 */
.chain-toggle-item {
  padding: 10px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;

  .left {
    display: flex;
    align-items: center;
  }

  .icon {
    width: 30px;
    height: 30px;
    margin-right: 8px;
  }

  .chain-name {
    margin-left: 8px;
    font-size: 16px;
    color: #000;
  }
}

.blue {
  color: #4259FF;
}

.select-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 0 10px;
  margin-top: 16px;
  cursor: pointer;
  background-color: #fff;
  position: relative;

  .down-arrow {
    width: 10px;
    height: 6px;
    margin-left: 10px;
  }
}

.link {
  color: #4259FF;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: inline;
}
.button-outline {
  height: 40px;
  border-radius: 40px;
  border: 1px solid #4259FF;
  background-color: white;
  color: #4259FF;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  cursor: pointer;
}

</style>