<template>
	<div class="page-container">
		<div class="fixed-top-content">
			<div class="title-bar">
				<div class="left-section">
					<div class="network-select" @click="qhwlclick">
						<ChainIcon :chainId="currentChainId" :isTestnet="false" class="chain-icon" />
						<img src="@/static/icon/arrow-down.svg" alt="下拉箭头" class="arrow-icon" />
					</div>
				</div>
				<div class="center-section" @click="showAddclick">
					<div class="head_con">
						<div class="content-wrapper">
							<button class="account-button" data-testid="account-menu-icon">
								<span class="account-info">
									<div class="avatar-wrapper">
										<headbox height="20" width="20"></headbox>
									</div>
									<span class="account-label"> Account {{ userinfos.idx + 1 }} </span>
								</span>
								<img src="@/static/icon/arrow-down.svg" alt="" class="arrow-icon" />
							</button>
							<span class="copy-text">{{ currentAddress }}</span>
						</div>
					</div>
				</div>
				<div class="right-section">
					<div class="mhead_right_icons">
						<img src="@/static/icon/copy.svg" alt="copy" class="icon" @click="copyText(currentAddress || '')" />
						<img src="@/static/icon/notification.svg" alt="notification" class="icon" @click="tongzhiclick" />
					</div>
				</div>
			</div>
			<div class="asset-container">
				<div class="ld">
					<div class="ld-sd">
						<div class="usd-text">US$</div>
						<div class="total-balance">0</div>
						<img src="@/static/icon/eye.svg" alt="eye-icon" class="eye-icon" @click="toggleVisibility" />
					</div>
					<div class="ld-xd">
						<div class="plus-zero">+$0</div>
						<div class="increase">+0%</div>
					</div>
				</div>
				<van-button color="#4459ff" round plain class="rd" @click="tzzhclick">
					<span class="rd-1">{{ $t('setting.portfolio') }}</span>
					<img src="@/static/icon/export.svg" alt="export-icon" class="rd-2" />
				</van-button>
			</div>
			<banner
				:bannerData="[
					{
						icon: require('@/static/icon/b1.png'),
						des1: 'MetaMask Card', // 不需要国际化，直接写字符串
						des2: { i18nKey: 'setting.banner.availableInRegions' }, // 需要国际化的文本
					},
					{
						icon: require('@/static/icon/b2.png'),
						des1: { i18nKey: 'setting.banner.topUpWallet' }, // 需要国际化
						des2: { i18nKey: 'setting.banner.addOrTransferToken' }, // 需要国际化
					},
					{
						icon: require('@/static/icon/b3.png'),
						des1: [{ i18nKey: 'setting.banner.through' }, ' MetaMask ', { i18nKey: 'setting.banner.withdraw' }],
						des2: { i18nKey: 'setting.banner.sellCrypto' }, // 卖出加密货币换取现金
					},
					{
						icon: require('@/static/icon/b4.png'),
						des1: { i18nKey: 'setting.banner.totalBalance' }, // 您的余额为汇总总额
						des2: { i18nKey: 'setting.banner.balanceSetting' }, // 在设置中控制您的余额视图
					},
					{
						icon: require('@/static/icon/b5.png'),
						des1: 'Add multiple Secret Recovery Phrases',
						des2: 'Import and use multiple wallets in MetaMask',
					},
				]" />
			<div class="tab-nav">
				<div v-for="(tabKey, index) in tabKeys" :key="tabKey" :class="['tab-item', { active: currentIndex === index }]" @click="selectTab(index)">
					{{ $t(tabKey) }}
				</div>
			</div>
		</div>
		<div class="scroll-container">
			<CoinAsset v-show="currentIndex === 0" @importTokens="handleImportTokens" />
			<!-- <NftComponent v-show="currentIndex === 1" /> -->
		</div>
		<ChainChangeDialog v-if="showNetworkModal" @close="showNetworkModal = false" @select-network="handleSelectNetwork" @add-zdynetwork="handleAddZdyNetwork" />
		<AddNetworkZdyPopup v-if="showAddPopup" @close="closePopup" />
		<!-- 切换账号弹框 -->
		<AcountChangeDialog v-if="selectUVueShow" @closeFn="selectUVueShow = false" @close="selectUVueShow = false" @accountRefresh="accountRefresh" />
		<SendDialog v-if="SendDialogModal" :asset="selectedAsset" @cancelclick="SendDialogModal = false" @nextclick="onNextSend" @selectSendAccount="onSelectSendAccount" />
		<tabVue :active="0" />
	</div>
</template>
<script>
import { EventBus } from '@/bbjs/bus.js';
import tabVue from '@/components/tabbox/tab.vue';
import TitleBar from '@/components/common/TitleBar.vue';
import { accountManager } from '@/bbjs/AccountManager.js';

import { formatAddress } from '@/bbjs/utils.js';
import ChainIcon from '@/components/common/ChainIcon.vue';
import { copyText } from '@/static/js/common';
import banner from '@/components/common/banner.vue';
import CoinAsset from '@/components/common/CoinAsset.vue';

import ChainChangeDialog from '@/components/common/ChainChangeDialog.vue';
import LanguageSelectDialog from '@/components/common/LanguageSelectDialog.vue';

import { assetManager } from '@/bbjs/AssetManager.js'; // 确保引入了 assetManager
import SendDialog from '@/components/common/SendDialog.vue';
import AddNetworkZdyPopup from '@/components/common/AddNetworkZdyPopup.vue';
import AcountChangeDialog from '@/components/common/AcountChangeDialog.vue';

export default {
	beforeDestroy() {
		EventBus.$off('send-acount', this.sendAcount);
	},
	created() {
		EventBus.$on('send-acount', this.sendAcount);
	},
	computed: {
		selectedAsset() {
			this.currentAccountVersion;
			const walletId = accountManager.getCurrentAccount()?.walletId; // 获取当前钱包ID
			const chainId = accountManager.getCurrentAccount()?.currentChainId; // 当前链id
			const assets = assetManager.getCurrentMainAsset(walletId, chainId);

			console.log('selectedAsset', JSON.stringify(assets, null, 2));

			return assets;
		},

		currentAccount() {
			// 利用 currentAccountVersion 作为依赖，强制刷新
			this.currentAccountVersion;
			return accountManager.getCurrentAccount();
		},
		accounts() {
			this.currentAccountVersion;
			return accountManager.getAllAccounts() || [];
		},
		userinfos() {
			this.currentAccountVersion;
			if (this.currentAccount) {
				const idx = this.accounts.findIndex(acc => acc.address === this.currentAccount.address);
				return {
					child: this.currentAccount,
					idx: idx === -1 ? 0 : idx,
				};
			}
			return { child: null, idx: 0 };
		},
		currentChainId() {
			this.currentAccountVersion;
			return this.currentAccount ? this.currentAccount.currentChainId : null;
		},
		currentAddress() {
			this.currentAccountVersion;
			console.log('currentAddress', formatAddress(accountManager.getCurrentAddress().address || ''));
			return formatAddress(accountManager.getCurrentAddress().address || '');
		},
	},
	components: {
		TitleBar,
		tabVue,
		ChainIcon,
		banner,
		CoinAsset,
		ChainChangeDialog,
		LanguageSelectDialog, // ✅ 加上这一句
		AddNetworkZdyPopup,
		AcountChangeDialog,
		SendDialog,
	},
	data() {
		return {
			tabKeys: ['setting.tokens', 'setting.collectibles'], // i18n keys
			currentIndex: 0,
			showNetworkModal: false,
			SendDialogModal: false, // 发送弹窗
			show: false,
			showAdd: false,
			showAddPopup: false,
			currentIndex: 0, // 当前选中的标签索引
			currentAccountVersion: 0, // 用来触发computed重新计算
			selectUVueShow: false, // 切换账号弹框
		};
	},
	methods: {
		sendAcount() {
			console.log('sendAcount-------->');
			//this.SendDialogModal=true // 发送弹窗

			const walletId = accountManager.getCurrentAccount()?.walletId; // 获取当前钱包ID
			const chainId = accountManager.getCurrentAccount()?.currentChainId; // 当前链id
			const assets = assetManager.getCurrentMainAsset(walletId, chainId);

			const payload = {
				assets: assets,
			};

			localStorage.setItem('transferData1', JSON.stringify(payload));
			this.$router.push({ path: '/send1' });
		},
		copyText,
		qhwlclick() {
			this.showNetworkModal = true;
		},
		manualRefresh() {},
		tongzhiclick() {
			this.$router.push({ path: '/notice' });
		},
		toggleVisibility() {
			console.log('切换余额可见性');
			// 这里写切换显示余额的逻辑
		},
		tzzhclick() {
			console.log('投资组合点击事件');
			// 这里写投资组合点击的处理逻辑
			window.location.href = 'https://portfolio.metamask.io/explore?MetaMaskEntry=mobile%2F&metricsEnabled=true&marketingEnabled=true';
		},
		selectTab(index) {
			console.log('选中标签索引:', index);
			this.currentIndex = index;
			//this.$emit('change', index)
		},
		handleImportTokens() {
			// 用户点击“导入代币”触发的回调
			console.log('导入代币事件触发了');
			// 这里写你要做的操作，比如跳转页面或者弹窗
		},
		handleSelectNetwork(network) {
			console.log('选中了网络:', JSON.stringify(network));
			// 这里可以处理切换网络逻辑
			this.showNetworkModal = false;

			accountManager.switchToChain(network.chainId);
			console.log('选中了网络:1');
			this.currentAccountVersion++; // 强制触发computed重新计算
			console.log('选中了网络:2');
			EventBus.$emit('network-changed', network);
			console.log('网络切换成功:', accountManager.getCurrentAccount().currentChainId);
		},
		handleAddCustomNetwork() {
			console.log('添加自定义网络按钮点击');
			// 这里可以跳转自定义网络添加页面
			this.showNetworkModal = false;
			this.showAddPopup = true;
		},
		handleAddZdyNetwork() {
			console.log('收到自定义网络:');
			// 这里写你要做的逻辑
			this.showNetworkModal = false;
			this.showAddPopup = true;
		},
		closePopup() {
			this.showAddPopup = false;
		},
		showAddclick() {
			console.log('showAddclick');
			this.selectUVueShow = true;
		},
		accountRefresh() {
			console.log('accountRefresh');
			this.currentAccountVersion++; // 强制触发computed重新计算
			EventBus.$emit('acc-changed');
		},
		onNextSend(payload) {
			//console.log('下一步点击，发送账户:', payload.fromAccount);
			//console.log('接收地址:', payload.toAddress);
			// TODO: 执行转账逻辑，或跳转下一页
			//this.SendDialogModal = false;
			//payload.fromAccount, payload.toAddress, payload.assets

			console.log('data---> ' + JSON.stringify(payload));
			localStorage.setItem('transferData', JSON.stringify(payload));
			this.$router.push({ path: '/send2' });
		},
		onSelectSendAccount() {
			console.log('打开账户选择弹框');
			// TODO: 弹出账户选择，选择后更新 selectedAsset 或发送账户索引
		},
		handleImportTokens() {
			this.$router.push({ path: '/evmaddcoin' });
		},
	},
};
</script>
<style scoped lang="scss">
.page-container {
	width: 100vw;
	height: 100vh;
	display: flex;
	overflow: hidden;
	padding-bottom: 50px;
	flex-direction: column;

	.fixed-top-content {
		flex-shrink: 0;

		.asset-container {
			width: 100%;
			display: flex;
			padding: 0 20px;
			box-sizing: border-box;
			align-items: flex-start;
			justify-content: space-between;

			.ld {
				gap: 4px;
				display: flex;
				flex-direction: column;

				.ld-xd {
					display: flex;
					align-items: center;
				}
			}

			.ld-sd {
				display: flex;
				align-items: center;
			}

			.rd {
				height: 36px;
				display: flex;
				align-items: center;

				.rd-1 {
					font-size: 15px;
					font-weight: 500;
					color: #4259ff;
				}

				.rd-2 {
					width: 20px;
					height: 20px;
					margin-left: 4px;
				}

				.van-button__text {
					display: flex;
					align-items: center;
				}

				&:active {
					background-color: #4259ff;

					.rd-1 {
						color: #fff;
					}
				}
			}
		}

		.title-bar {
			width: 100%;
			display: flex;
			padding: 20px;
			align-items: center;
			box-sizing: border-box;
			background-color: #fff;
			justify-content: space-between;
		}
		.left-section,
		.center-section,
		.right-section {
			display: flex;
			align-items: center;
		}
		.center-section {
			flex: 1;
			justify-content: center;
		}
	}
}

.network-select {
	gap: 8px;
	height: 32px;
	display: flex;
	padding: 0 12px;
	border-radius: 24px;
	align-items: center;
	justify-content: center;
	background-color: #f4f5f9;
}

.chain-icon {
	width: 20px;
	height: 20px;
}

.arrow-icon {
	width: 15px;
	height: 15px;
	object-fit: contain;
}
.head_con {
	display: flex;
	justify-content: center; /* 水平居中 */
	align-items: center; /* 垂直居中 */
	height: 50px; /* 你可以根据需要调整高度 */
	padding: 0 10px;
	box-sizing: border-box;
}

.content-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.account-button {
	display: flex;
	align-items: center;
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 0;
	gap: 8px;
	color: #000;
	font-weight: 600;
	font-size: 14px;
}

.account-info {
	display: flex;
	align-items: center;
	gap: 8px;
}

.avatar-wrapper {
	width: 16px;
	height: 16px;
	border-radius: 50%;
	overflow: hidden;
	background: #03555e;
	display: flex;
	justify-content: center;
	align-items: center;
}

.account-label {
	white-space: nowrap;
}

.arrow-icon {
	width: 12px;
	height: 12px;
}

.copy-wrapper {
	display: flex;
	justify-content: center;
	width: 100%;
}
.mhead_right_icons {
	display: flex;
	gap: 8px;
	align-items: center;
}
.icon {
	width: 25px;
	height: 25px;
	cursor: pointer;
	user-select: none;
}

/* US$ 文字 */
.usd-text {
	font-weight: bold;
	font-size: 30px;
	color: #000;
	text-align: center;
}

/* 账户总余额 */
.total-balance {
	font-weight: bold;
	font-size: 30px;
	color: #000;
	text-align: center;
	margin-left: 8px;
}

/* 眼睛图标 */
.eye-icon {
	width: 20px;
	height: 20px;
	margin-left: 10px;
	cursor: pointer;
	user-select: none;
}

/* +$0 */
.plus-zero {
	font-size: 15px;
	color: #1b7f34;
	text-align: center;
}

/* 涨幅 */
.increase {
	font-size: 15px;
	color: #1b7f34;
	margin-left: 5px;
	text-align: center;
}

.tab-nav {
	height: 40px;
	display: flex;
	margin: 12px 0;
	padding: 0 20px;
}
.tab-item {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-size: 16px;
	font-weight: 500;
	color: #000;
	user-select: none;
	transition: color 0.3s;
	border-bottom: none; /* 未选中时无下划线 */
}
.tab-item.active {
	color: #4259ff;
	border-bottom: 2px solid #4259ff; /* 只有激活时显示下划线 */
}

.scroll-container {
	flex: 1;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}
</style>
