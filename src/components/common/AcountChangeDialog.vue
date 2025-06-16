<template>
	<div class="dialog-mask" @click.self="closeFn">
		<div class="dialog-box">
			<!-- 标题，固定不滚动 -->
			<div class="dialog-title">{{ $t('setting.accounts') }}</div>
			<!-- 账户列表区域，可滚动 -->
			<div class="account-list">
				<div class="account-item" v-for="(item, index) in accList" :key="item.walletId" @click="changeAccFn(item)">
					<!-- 左侧ld -->
					<div class="ld">
						<div class="ld1">
							<div class="avatar-wrapper">
								<headbox height="30" width="30"></headbox>
							</div>
						</div>
						<div class="ld2">
							<div class="ld21">{{ $t('setting.account') }} {{ index + 1 }}</div>
							<div class="ld22">{{ formatAddress(item.child?.address || '') }}</div>
						</div>
					</div>

					<!-- 右侧rd -->
					<div class="rd">
						<div class="rd1">
							<div class="rd11">US$ {{ item.totalm?.totalPrice || 0 }}</div>
							<div class="rd12">{{ item.maincoinamount }} {{ item.mainSymbol || 'ETH' }}</div>
						</div>
						<div class="rd2">
							<img src="@/static/icon/more-vertical.svg" alt="more" width="10" height="10" />
						</div>
					</div>
				</div>
			</div>
			<!-- 底部固定按钮 -->
			<button class="add-account-btn" @click="addAccountClick">
				{{ $t('setting.addAccountOrHardwareWallet') }}
			</button>
		</div>
		<!-- 添加账户 -->
		<addAccVue v-if="showCreateAcount" @closeFn="showCreateAcount = false" @createEth="createEth" 
     @fs1="fs1"
    @fs2="fs2"
    />
	</div>
</template>

<script>
import { accountManager } from '@/bbjs/AccountManager';
import { assetManager } from '@/bbjs/AssetManager';
import { formatAddress, isValidAddress } from '@/bbjs/utils';
import { getSymbolByChainId } from '@/bbjs/chain-default-assets';
import Headbox from '@/components/icon/headbox.vue';
import addAccVue from '@/components/index/addAcc.vue';
import { EventBus } from '@/bbjs/bus.js'; // 你的事件总线
export default {
	components: {
		Headbox,
		addAccVue,
	},
	data() {
		return {
			refrescount: 0,
			showCreateAcount: false,
			accList: [],
		};
	},
	mounted() {
		this.refrescount;
		this.init();
	},
	methods: {
    fs1(){
      this.showCreateAcount = false;
      this.$router.push({ path: '/privateKey' });
    },
    fs2(){
      this.showCreateAcount = false;
      this.$router.push({ path: '/leadingInA' });
    },
		createEth() {
			console.log('create compelte-->2 ');

			//EventBus.$emit('acc-changed')
			console.log('create compelte-->3 ');
			this.showCreateAcount = false;
			this.refresh();
			console.log('create compelte-->4 ');
		},
		formatAddress(address, head = 6, tail = 4) {
			if (!isValidAddress(address)) return address;
			return `${address.slice(0, head)}...${address.slice(-tail)}`;
		},

		refresh() {
			//this.accList = accountManager.getAllAccounts()
			this.accList = accountManager.getAllAccounts().slice().reverse();

			const currentAcc = accountManager.getCurrentAccount();
			console.log('accountManager. size---> ' + this.accList.length);
			this.accList.forEach(item => {
				//console.log("accountManager. item---> "+JSON.stringify(item))
				let addressesForChain = item.addresses.filter(a => a.chainId === accountManager.getCurrentChainId());
				item.child = addressesForChain.length === 1 ? addressesForChain[0] : null;
				console.log('addressesForChain ===> ' + JSON.stringify(item.child) + '  cahinId: ' + accountManager.getCurrentChainId());
				item.maincoinamount = assetManager.getMainCoinBalance(item.walletId, accountManager.getCurrentChainId());
				item.totalm = assetManager.getTotalAssetSummary(item.walletId);
				item.mainSymbol = getSymbolByChainId(accountManager.getCurrentChainId()); // 你可以根据链ID替换成对应主币符号
				item.actItem = currentAcc && currentAcc.walletId === item.walletId;
			});
		},
		async init() {
			this.accList = accountManager.getAllAccounts();
			const currentAcc = accountManager.getCurrentAccount();

			this.accList.forEach(item => {
				//console.log("accountManager. item---> "+JSON.stringify(item))
				let addressesForChain = item.addresses.filter(a => a.chainId === accountManager.getCurrentChainId());
				item.child = addressesForChain.length === 1 ? addressesForChain[0] : null;
				console.log('addressesForChain ===> ' + JSON.stringify(item.child) + '  cahinId: ' + accountManager.getCurrentChainId());
				item.maincoinamount = assetManager.getMainCoinBalance(item.walletId, accountManager.getCurrentChainId());
				item.totalm = assetManager.getTotalAssetSummary(item.walletId);
				item.mainSymbol = getSymbolByChainId(accountManager.getCurrentChainId()); // 你可以根据链ID替换成对应主币符号
				item.actItem = currentAcc && currentAcc.walletId === item.walletId;
			});
		},
		closeFn() {
			this.$emit('close');
		},
		changeAccFn(item) {
			// if (item.actItem) return
			accountManager.switchAccount(item.walletId);
			this.$emit('accountRefresh');
			this.closeFn();
		},
		addAccountClick() {
			this.showCreateAcount = true; // ✅ 正确
			//this.$emit('addAccountClick')
		},
	},
};
</script>

<style scoped lang="scss">
.dialog-mask {
	inset: 0;
	z-index: 9999;
	display: flex;
	position: fixed;
	align-items: flex-end;
	justify-content: center;
	background: rgba(0, 0, 0, 0.4);
}

.dialog-box {
	width: 100%;
	display: flex;
	overflow: hidden;
  max-height: 75vh;
	background: #fff;
	flex-direction: column;
	box-sizing: border-box;
	padding: 0 20px 20px 20px;
	border-radius: 10px 10px 0 0;
}

.dialog-title {
	font-size: 20px;
	font-weight: 700;
	color: #000;
	text-align: center;
	margin-top: 20px;
	margin-bottom: 20px;
	flex-shrink: 0;
	user-select: none;
}

/* 账户列表区域，除标题和底部按钮外，撑满剩余空间且可滚动 */
.account-list {
	flex: 1;
	overflow-y: auto;
}

/* 账户项 */
.account-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 0;
	border-bottom: 1px solid #eee;
	cursor: pointer;
}

/* 左侧 ld 容器 */
.ld {
	display: flex;
	align-items: center;
	gap: 20px;
}

/* 账户头像容器 */
.ld1 {
	width: 30px;
	height: 30px;
}

/* 账户信息容器 */
.ld2 {
	display: flex;
	flex-direction: column;
	gap: 5px;
	min-width: 120px;
}

.ld21 {
	//font-weight: 700;
	font-size: 18px;
	color: #000;
	user-select: none;
}

.ld22 {
	font-size: 16px;
	color: #888888;
	user-select: none;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

/* 右侧 rd 容器 */
.rd {
	display: flex;
	align-items: center;
	gap: 10px;
}

/* 账户余额及主币数量 */
.rd1 {
	display: flex;
	flex-direction: column;
	gap: 5px;
	min-width: 80px;
}

.rd11 {
	//font-weight: 700;
	font-size: 18px;
	color: #000;
	user-select: none;
}

.rd12 {
	font-size: 16px;
	color: #000;
	user-select: none;
}

/* 更多图标容器 */
.rd2 img {
	width: 20px;
	height: 20px;
	user-select: none;
}

/* 底部按钮 */
.add-account-btn {
	height: 40px;
	margin-top: 20px;
	background: #fff;
	color: #4259ff;
	font-size: 18px;
	font-weight: 500;
	border-radius: 40px;
	border: 1px solid #4259ff;
	cursor: pointer;
	user-select: none;
	flex-shrink: 0;
	width: 100%;
	text-align: center;
}
.avatar-wrapper {
	width: 30px;
	height: 30px;
	border-radius: 50%;
	overflow: hidden;
	background: #03555e;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
