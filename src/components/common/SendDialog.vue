<template>
    <div class="transfer-modal">
      <!-- 标题栏 固定 -->
      <div class="header">
        <div class="z">
          <div class="z1">{{ $t('setting.transfer.sendTo') }}</div>
          <div class="z2">{{ getSymbolByChainId(chainId) }}</div>
        </div>
        <div class="r" @click="cancleclick">{{ $t('setting.common.cancel') }}</div>
      </div>
  
      <!-- From 区 固定 -->
      <div class="from" @click="selectorSendacount">
        <div class="f1">{{ $t('setting.transfer.from') }}</div>
        <div class="f2">
          <div class="f21">
            <div class="f21-1">
                <div class="avatar-wrapper">
                    <headbox :height="40" :width="40" />
                </div>
             
            </div>
            <div class="f21-2">
              <div class="f21-2-1">{{ $t('setting.transfer.account') }}{{ sendAccountIndex + 1 }}</div>
              <div class="f21-2-2">
                <span class="balance-label">{{ $t('setting.transfer.balance') }}:</span>
                <span class="balance-value">{{ formatSmartNumber(sendAccountBalance, { decimals: 4 }) }} {{ sendAccountSymbol }}</span>
              </div>
            </div>
          </div>
          <div class="f22">
            <!-- 右侧箭头 -->
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
  
      <!-- To 区 固定 -->
      <div class="to">
        <div class="t1">{{ $t('setting.transfer.to') }}</div>
        <div class="t2">
          <template v-if="toStatus === 'input'">
            <input
              type="text"
              v-model="toAddress"
              :placeholder="$t('setting.transfer.publicKeyPlaceholder')"
              class="to-input"
            />

        
          </template>
          <template v-else>
            <div class="t2-2-content">
              <div class="t2-2-1">
                <div class="avatar-wrapper">
                    <headbox :height="40" :width="40" />
                </div>
                <div class="t2-2-1-2">
                  <div class="account-label">{{ $t('setting.transfer.account') }}{{ receiveAccountIndex + 1 }}</div>
                  <div class="account-address">{{ formatAddress(toAddress) }} ✅</div>
                </div>
              </div>
              <div class="t2-2-2" @click="clearReceiveAcount">
                <img src="@/static/icon/close.svg" alt="close" />
              </div>
            </div>
          </template>
        </div>
      </div>
  
      <!-- 灰色下划线 -->
      <div class="divider"></div>
  
      <!-- 你的账户 标题 -->
      <div class="your-account">{{ $t('setting.transfer.yourAccount') }}</div>
  
      <!-- 接收账户列表 滚动区域 -->
      <div class="receiver-list">
        <div
          v-for="(item, idx) in accounts"
          :key="item.walletId"
          class="item-receiver-item"
          @click="selectReceiveAccount(idx, item)"
        >
          <div class="item-t1">
            <div class="avatar-wrapper">
                    <headbox :height="40" :width="40" />
                </div>
          </div>
          <div class="item-t2">
            <div class="item-t2-1">{{ $t('setting.transfer.account') }}{{ idx + 1 }}</div>
            <div class="item-t2-2">{{ formatAddress2(item) }}</div>
          </div>
        </div>
      </div>
  
      <!-- 底部按钮 固定 -->
      <button
        :class="['next-btn', { disabled: !canNext }]"
        :disabled="!canNext"
        @click="nextclick"
      >
        {{ $t('setting.transfer.next') }}
      </button>
    </div>
  </template>
  
  <script>
  import { accountManager,getAddressByWalletIdAndChainId,getCurrentChainId } from '@/bbjs/AccountManager';
  import { isValidAddress,formatSmartNumber } from '@/bbjs/utils'
  import Headbox from '@/components/icon/headbox.vue';
  import { getSymbolByChainId, chainDefaultAssetMap } from '@/bbjs/chain-default-assets';
  import { fetchTokenBalance } from '@/bbjs/priceService'; // 请替换路径
 
  export default {
    components: { headbox: Headbox },
    props: {
      asset: {
        type: Object,
        required: true,
      }
    },
    data() {
      return {
        chainId: this.asset.chainId,
        accounts: [],
        sendAccountIndex: 0,
        selectedSendAccount: null, // 当前选中的发送账户对象
        sendAccountBalance: this.asset.balance || '0',
        sendAccountSymbol: this.asset.symbol || '',
        toStatus: 'input', // 'input' or 'selected'
        toAddress: '',
        receiveAccountIndex: null,
      };
    },
    computed: {
     // canNext() {
     //   return this.sendAccountIndex !== null && this.toAddress && this.toStatus === 'selected';
     // }
     canNext() {
    const sendAccountValid = this.selectedSendAccount !== null;
    const receiveAddressValid = this.toAddress && isValidAddress(this.toAddress);
    return sendAccountValid && receiveAddressValid;
    }
    },
    mounted() {
         
        this.accounts = accountManager.getAllAccounts() || [];
        console.log('accounts', "---->"+this.accounts.length);
        const currentAccount = accountManager.getCurrentAccount();
        if (this.accounts.length && currentAccount) {
            // 找当前账户在 accounts 里的索引
            const idx = this.accounts.findIndex(acc => acc.walletId === currentAccount.walletId);
            this.sendAccountIndex = idx >= 0 ? idx : 0;
            this.selectedSendAccount = this.accounts[this.sendAccountIndex];
        } else {
            this.sendAccountIndex = 0;
        }
        this.toAddress = '';
        this.toStatus = 'input';
        this.updateSendAccountBalance();

    },
    methods: {
        selectorSendacount() {
           this.$emit('selectSendAccount');
        },
        onSendAccountSelected(walletId) {
            const idx = this.accounts.findIndex(acc => acc.walletId === walletId);
            if (idx >= 0) {
            this.sendAccountIndex = idx; // 会触发watch更新selectedSendAccount和余额
            }
        },
        formatSmartNumber,
        formatAddress2(item, head = 6, tail = 4) {
            const chainId = accountManager.getCurrentChainId()
            console.log('formatAddress2', item, chainId)
            const address = accountManager.getAddressByWalletIdAndChainId(item.walletId, chainId).address
            console.log('formatAddress2', address, item.walletId, chainId)

            if (!address || !isValidAddress(address)) return address || ''
            return `${address.slice(0, head)}...${address.slice(-tail)}`
        }
,
        formatAddress(address, head = 6, tail = 4) {
        if (!isValidAddress(address)) return address
        return `${address.slice(0, head)}...${address.slice(-tail)}`
      },
      getSymbolByChainId,
      async updateSendAccountBalance() {
        try {
            const account = this.selectedSendAccount;
            if (!account) return;


            const chainInfo = chainDefaultAssetMap[this.asset.chainId];
            if (!chainInfo) return;
            const rpcUrl = chainInfo.rpcUrl;
            if (!rpcUrl) return;

            //const chainId = accountManager.getCurrentChainId();
            const address = accountManager.getAddressByWalletIdAndChainId(account.walletId, this.asset.chainId)?.address;
            if (!address) return;

            const { formatted } = await fetchTokenBalance({
            rpcUrl,
            address,
            contractAddress: this.asset.contractAddress || '',
            decimals: this.asset.decimals || 18,
            });

            this.sendAccountBalance = formatted;
            this.asset.balance = this.sendAccountBalance;
        } catch (e) {
            console.error('获取余额失败', e);
        }
        },
      cancleclick() {
        this.$emit('cancelclick');
      },
      clearReceiveAcount() {
        this.toStatus = 'input';
        this.toAddress = '';
        this.receiveAccountIndex = null;
      },
      selectReceiveAccount(index, account) {
        this.receiveAccountIndex = index;
        const chainId = accountManager.getCurrentChainId()
            console.log('formatAddress2', account, chainId)
            const aaddress = accountManager.getAddressByWalletIdAndChainId(account.walletId, chainId).address
        this.toAddress = aaddress;
        this.toStatus = 'selected';
      },
      nextclick() {
        if (this.canNext) {
           
            console.log("rinima")
          this.$emit('nextclick', {
            fromAccount: this.accounts[this.sendAccountIndex],
            toAddress: this.toAddress,
            assets: this.asset
          });

        }
      }
    },
    watch: {
      sendAccountIndex() {
        this.updateSendAccountBalance();
      },
      sendAccountIndex(newIndex) {
        this.selectedSendAccount = this.accounts[newIndex] || null;
        this.updateSendAccountBalance();
       },
        toAddress(newVal) {
            if (this.toStatus !== 'input') {
            this.toStatus = 'input';
            this.receiveAccountIndex = null;
        }
  }
    }
  };
  </script>
  
  <style scoped>
  .transfer-modal {
    z-index: 9999;
    position: fixed;
    inset: 0;
    background: white;
    display: flex;
    flex-direction: column;
    height: 100vh;
    font-family: Arial, sans-serif;
  }
  
  /* 标题栏 */
  .header {
    flex-shrink: 0;
    height: 60px;
    
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
  }
  .header .z {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    flex: 1;
    user-select: none;
  }
  .header .z1 {
    font-weight: bold;
    font-size: 20px;
    color: #000;
  }
  .header .z2 {
    font-size: 16px;
    color: #888;
  }
  .header .r {
    font-size: 16px;
    color: #4259ff;
    cursor: pointer;
    user-select: none;
  }
  
  /* From 区 */
  .from {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 10px 15px;
    cursor: pointer;
    user-select: none;
    
  }
  .f1 {
    width: 100px;
    font-size: 18px;
    color: #000;
    text-align: left;
  }
  .f2 {
    flex: 1;
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px 20px 20px 10px;
    justify-content: space-between;
  }
  .f21 {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .f21-2 {
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-align: left;
  }
  .f21-2-1 {
    font-size: 16px;
    color: #000;
  }
  .f21-2-2 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 10px;
    color: #000;
  }
  .balance-label {
    font-weight: normal;
  }
  .balance-value {
    font-weight: normal;
  }
  .f22 svg {
    cursor: pointer;
    user-select: none;
  }
  
  /* To 区 */
  .to {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 10px 15px;
    margin-top: 10px;
    border-bottom: 1px  #ccc;
  }
  .t1 {
    width: 100px;
    font-size: 18px;
    color: #000;
    text-align: left;
  }
  .t2 {
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px 20px 20px 10px;
    height: 60px;
    display: flex;
    align-items: center;
    position: relative;
  }
  .to-input {
    width: 100%;
    font-size: 16px;
    color: #888;
    border: none;
    outline: none;
  }
  
  /* To状态2内容 */
  .t2-2-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .t2-2-1 {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  .t2-2-1-2 {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .account-label {
    font-size: 16px;
    color: #000;
  }
  .account-address {
    font-size: 16px;
    color: #000;
  }
  .t2-2-2 img {
    width: 15px;
    height: 15px;
    cursor: pointer;
    user-select: none;
  }
  
  /* 灰色下划线 */
  .divider {
    height: 1px;
    background: #ccc;
    flex-shrink: 0;
    margin-top: 0;
  }
  
  /* 你的账户 标题 */
  .your-account {
    font-size: 20px;
    font-weight: bold;
    color: #000;
    padding: 15px;
    flex-shrink: 0;
    user-select: none;
  }
  
  /* 接收账户列表 滚动 */
  .receiver-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 15px 10px 15px;

  }
  .receiver-item {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px 10px 0 10px;
    cursor: pointer;
    user-select: none;
  }
  .receiver-item:hover {
    background-color: #f5f5f5;
  }
  .receiver-item .t1 {
    flex-shrink: 0;
  }
  .receiver-item .t2 {
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: left;
  }
  .receiver-item .t2-1 {
    font-size: 16px;
    color: #000;
  }
  .receiver-item .t2-2 {
    font-size: 16px;
    color: #888;
  }
  
  /* 底部按钮 固定 */
  .next-btn {
    flex-shrink: 0;
    width: 90%;
    height: 50px;
    background-color: #4259ff;
    border: none;
    border-radius: 50px;
    color: white;
    font-size: 20px;
    font-weight: normal;
    cursor: pointer;
    user-select: none;
    margin: 0 auto 20px auto; /* 水平居中，底部间距20px */
    display: block; /* 保证margin生效 */
    
  }
  .next-btn.disabled {
    background-color: #4259ff;
    cursor: not-allowed;
  }
  .avatar-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #03555e;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-receiver-list {
  /* 如果有需要可以设置滚动 */
  flex: 1;
    overflow-y: auto;
    padding: 0 15px 10px 15px;
    margin-bottom: 50px;
}

.item-receiver-item {
  display: flex;
  align-items: center; /* 垂直居中 */
  padding: 20px 10px;
  gap: 20px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s;
}

.item-receiver-item:hover {
  background-color: #f5f5f5; /* 悬停背景色 */
}

.item-t1 {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.item-t2 {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 左对齐 */
  gap: 10px;
  flex: 1;
}

.item-t2-1 {
  font-size: 16px;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-t2-2 {
  font-size: 16px;
  color: #666666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

  </style>
  