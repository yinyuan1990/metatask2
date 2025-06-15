<template>
	<div class="transfer-page">
		<!-- 标题栏 固定 -->
		<div class="header">
			<div class="z">
				<div class="z1">{{ $t('setting.transfer.sendTo') }}</div>
				<div class="z2">{{ getSymbolByChainId(chainId) }}</div>
			</div>
			<div class="r" @click="cancleclick">{{ $t('setting.common.cancel') }}</div>
		</div>

		<!-- From 区 -->
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
						<path d="M9 6l6 6-6 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</div>
			</div>
		</div>

		<!-- To 区 -->
		<div class="to">
			<div class="t1">{{ $t('setting.transfer.to') }}</div>
			<div class="t2">
				<template v-if="toStatus === 'input'">
					<input type="text" v-model="toAddress" :placeholder="$t('setting.transfer.publicKeyPlaceholder')" class="to-input" />
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

		<!-- 你的账户 标题 -->
		<div class="your-account">{{ $t('setting.transfer.yourAccount') }}</div>

		<!-- 接收账户列表 滚动区域 -->
		<div class="receiver-list">
			<div v-for="(item, idx) in accounts" :key="item.walletId" class="item-receiver-item" @click="selectReceiveAccount(idx, item)">
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

		<!-- 底部按钮 -->
		<button :class="['next-btn', { disabled: !canNext }]" :disabled="!canNext" @click="nextclick">
			{{ $t('setting.transfer.next') }}
		</button>
	</div>
</template>

<script>
import { accountManager, getAddressByWalletIdAndChainId, getCurrentChainId } from '@/bbjs/AccountManager';
import { isValidAddress, formatSmartNumber } from '@/bbjs/utils';
import Headbox from '@/components/icon/headbox.vue';
import { getSymbolByChainId, chainDefaultAssetMap } from '@/bbjs/chain-default-assets';
import { fetchTokenBalance } from '@/bbjs/priceService';
import { EventBus } from '@/bbjs/bus.js';

export default {
	components: { headbox: Headbox },
	data() {
		return {
			chainId: null,
			accounts: [],
			sendAccountIndex: 0,
			selectedSendAccount: null,
			sendAccountBalance: '0',
			sendAccountSymbol: '',
			toStatus: 'input', // 'input' or 'selected'
			toAddress: '',
			receiveAccountIndex: null,
			asset: null,
		};
	},
	beforeDestroy() {
		EventBus.$off('back-root', this.backRoot);
	},
	created() {
		EventBus.$on('back-root', this.backRoot);
	},
	computed: {
		canNext() {
			const sendAccountValid = this.selectedSendAccount !== null;
			const receiveAddressValid = this.toAddress && isValidAddress(this.toAddress);
			return sendAccountValid && receiveAddressValid;
		},
	},
	mounted() {
		this.loadLocalData();
	},
	methods: {
		backRoot() {
			console.log('send1 back root');
			this.$router.back();
		},
		async loadLocalData() {
			try {
				const localDataStr = localStorage.getItem('transferData1');
				if (!localDataStr) {
					console.warn('No transferData1 found in localStorage');
					return;
				}
				const localData = JSON.parse(localDataStr);
				console.log('获取数据成功', JSON.stringifylocalData);
				this.asset = localData.assets || null;
				console.log('获取数据成功', JSON.stringify(this.asset));
				this.chainId = this.asset?.chainId || null;
				this.accounts = accountManager.getAllAccounts() || [];

				//localStorage.removeItem('transferData1') // 用完清理

				const currentAccount = accountManager.getCurrentAccount();
				if (this.accounts.length && currentAccount) {
					const idx = this.accounts.findIndex(acc => acc.walletId === currentAccount.walletId);
					this.sendAccountIndex = idx >= 0 ? idx : 0;
					this.selectedSendAccount = this.accounts[this.sendAccountIndex];
				} else {
					this.sendAccountIndex = 0;
					this.selectedSendAccount = null;
				}

				this.toAddress = localData.toAddress || '';
				this.receiveAccountIndex = null;

				await this.updateSendAccountBalance();
			} catch (e) {
				console.error('Error loading transferModalData from localStorage:', e);
			}
		},
		selectorSendacount() {
			this.$emit('selectSendAccount');
		},
		onSendAccountSelected(walletId) {
			const idx = this.accounts.findIndex(acc => acc.walletId === walletId);
			if (idx >= 0) {
				this.sendAccountIndex = idx;
			}
		},
		formatSmartNumber,
		formatAddress2(item, head = 6, tail = 4) {
			const chainId = this.chainId || accountManager.getCurrentChainId();
			const address = accountManager.getAddressByWalletIdAndChainId(item.walletId, chainId)?.address;
			if (!address || !isValidAddress(address)) return address || '';
			return `${address.slice(0, head)}...${address.slice(-tail)}`;
		},
		formatAddress(address, head = 6, tail = 4) {
			if (!isValidAddress(address)) return address;
			return `${address.slice(0, head)}...${address.slice(-tail)}`;
		},
		getSymbolByChainId,
		async updateSendAccountBalance() {
			try {
				const account = this.selectedSendAccount;
				if (!account) return;

				const chainInfo = chainDefaultAssetMap[this.chainId];
				if (!chainInfo) return;
				const rpcUrl = chainInfo.rpcUrl;
				if (!rpcUrl) return;

				const address = accountManager.getAddressByWalletIdAndChainId(account.walletId, this.chainId)?.address;
				if (!address) return;

				const { formatted } = await fetchTokenBalance({
					rpcUrl,
					address,
					contractAddress: this.asset.contractAddress || '',
					decimals: this.asset.decimals || 18,
				});

				this.sendAccountBalance = formatted;
				this.sendAccountSymbol = this.asset.symbol || '';
				this.asset.balance = formatted;
			} catch (e) {
				console.error('获取余额失败', e);
			}
		},
		cancleclick() {
			this.$router.back();
		},
		clearReceiveAcount() {
			this.toStatus = 'input';
			this.toAddress = '';
			this.receiveAccountIndex = null;
		},
		selectReceiveAccount(index, account) {
			this.receiveAccountIndex = index;
			const chainId = this.chainId || accountManager.getCurrentChainId();
			const aaddress = accountManager.getAddressByWalletIdAndChainId(account.walletId, chainId)?.address || '';
			this.toAddress = aaddress;
			this.toStatus = 'selected';
		},
		nextclick() {
			if (this.canNext) {
				/*  
          this.$emit('nextclick', {
            fromAccount: this.accounts[this.sendAccountIndex],
            toAddress: this.toAddress,
            assets: this.asset
          });*/

				const payload = {
					fromAccount: this.selectedSendAccount,
					toAddress: this.toAddress,
					assets: this.asset,
				};

				localStorage.setItem('transferData', JSON.stringify(payload));
				this.$router.push({ path: '/send2' });
			}
		},
	},
	watch: {
		sendAccountIndex(newIndex) {
			this.selectedSendAccount = this.accounts[newIndex] || null;
			this.updateSendAccountBalance();
		},
		toAddress(newVal) {
			if (this.toStatus !== 'input') {
				this.toStatus = 'input';
				this.receiveAccountIndex = null;
			}
		},
	},
};
</script>

<style scoped>
.transfer-page {
	display: flex;
	flex-direction: column;
	height: 100%;
	font-family: Arial, sans-serif;
	background: #fff;
	padding: 10px;
}

/* 标题栏 */
.header {
	height: 60px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 15px;
	user-select: none;
}
.header .z {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
	flex: 1;
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
}

/* From 区 */
.from {
	display: flex;
	align-items: center;
	padding: 10px 15px;
	cursor: pointer;
	user-select: none;
	margin-top: 10px;
}
.f1 {
	width: 60px;
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
}

/* To 区 */
.to {
	display: flex;
	align-items: center;
	padding: 10px 15px;
	margin-top: 10px;
	border-bottom: 1px solid #ccc;
}
.t1 {
	width: 60px;
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

/* 你的账户 标题 */
.your-account {
	font-size: 20px;
	font-weight: bold;
	color: #000;
	padding: 15px;
	margin-top: 10px;
	user-select: none;
}

/* 接收账户列表 滚动 */
.receiver-list {
	flex: 1;
	overflow-y: auto;
	padding: 0 15px 10px 15px;
	margin-bottom: 50px;
}
.item-receiver-item {
	display: flex;
	align-items: center;
	gap: 20px;
	padding: 20px 10px 0 10px;
	cursor: pointer;
	user-select: none;
	transition: background-color 0.3s;
}
.item-receiver-item:hover {
	background-color: #f5f5f5;
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
	align-items: flex-start;
	gap: 10px;
	flex: 1;
}
.item-t2-1 {
	font-size: 16px;
	color: #000;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.item-t2-2 {
	font-size: 16px;
	color: #888;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* 底部按钮 固定 
  .next-btn {
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
    margin: 0 auto 20px auto;
    display: block;
  }
  */

.next-btn {
	position: fixed;
	bottom: 20px; /* 底部距离 */
	left: 50%;
	transform: translateX(-50%);
	width: calc(100% - 40px); /* 留左右边距 */
	max-width: 400px; /* 可选最大宽度 */
	height: 50px;
	background-color: #4259ff;
	border: none;
	border-radius: 50px;
	color: white;
	font-size: 20px;
	font-weight: normal;
	cursor: pointer;
	user-select: none;
	/* 去掉 margin */
	margin: 0;
	display: block;
	z-index: 1000; /* 避免被遮挡 */
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
</style>
