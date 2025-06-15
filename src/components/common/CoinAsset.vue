<template>
	<div class="asset-manager">
		<div class="asset-head">
			<!-- 左边 -->
			<div class="l1">
				<div class="choose" @click="show = true">
					{{ chooseText }}
					<van-icon name="arrow-down" />
				</div>
			</div>
			<!-- 右边 -->
			<div class="l2">
				<div class="l21" @click="onSwapClick">
					<img src="@/static/icon/swap-vertical.svg" alt="swap" />
				</div>
				<div class="l22" @click="onAddClick">
					<img src="@/static/icon/addicon.png" alt="add" />
				</div>
			</div>
		</div>
		<!-- BetterScroll 容器 -->
		<div class="scroll-wrapper" ref="scrollWrapper">
			<!-- 资产列表 -->
			<div class="asset-item" v-for="(item, index) in coinList" :key="item.contractAddress + item.chainId" @click="showDetailsDb(item)">
				<div class="ld">
					<div class="ld-1">
						<img :src="item.iconUrl" class="token-icon" @error="onTokenIconError($event)" />
						<ChainIcon2 :chainId="item.chainId" :isTestnet="false" class="chain-icon" />
					</div>
					<div class="ld-2">
						<div class="token-name">
							<div class="asset-row">
								{{ item.name }}
								<template v-if="item.chainId == 1 && item.isMainCoin">
									<div class="stake-action" @click="handleStakeClick(item)">
										{{ $t('setting.common.stake') }}
										<div class="icon-stake"></div>
									</div>
								</template>
							</div>
						</div>
						<div class="token-change" :class="item.change24h >= 0 ? 'up' : 'down'">
							{{ formatChange(item.change24h) }}
						</div>
					</div>
				</div>
				<div class="rd">
					<div class="balance">{{ formatSmartNumber(item.balance, { decimals: 4 }) }} {{ item.symbol }}</div>
					<div class="value">${{ formatSmartNumber(item.price * item.balance, { decimals: 4 }) }}</div>
				</div>
			</div>
			<!-- 资产导入放入滚动内容尾部 -->
			<div class="asset-import" @click="drdbclick">
				<span class="gray-text">{{ $t('setting.noTokensFound') }}</span>
				<span class="blue-text">{{ $t('setting.importToken') }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import BScroll from 'better-scroll';
import { EventBus } from '@/bbjs/bus.js'; // 你的事件总线
import { assetManager } from '@/bbjs/AssetManager';
import { getTokenLogo } from '@/bbjs/iconService.js';
import { networkManager } from '@/bbjs/networkManager.js';
import ChainIcon2 from '@/components/common/ChainIcon2.vue';
import { accountManager, save } from '@/bbjs/AccountManager';
import { chainDefaultTokenMap } from '@/bbjs/chain-default-assets';
import { fetchTokenPrice, fetchTokenPrice2, fetchTokenBalance, fetchTokenBalance2 } from '@/bbjs/priceService';
export default {
	components: { ChainIcon2 },
	destroyed() {
		// 记得在销毁时移除监听
	},
	beforeDestroy() {
		EventBus.$off('network-changed', this.onNetworkChanged);
		EventBus.$off('acc-changed', this.onAccountChanged);
		EventBus.$off('as-changed', this.onAccountChanged1);
		EventBus.$off('selectedNetworkTypeChanged', type => {
			this.selectedType = type;
		});
	},
	created() {
		// 监听全局事件，确保跨组件同步
		EventBus.$on('selectedNetworkTypeChanged', type => {
			this.selectedType = type;
		});
		EventBus.$on('network-changed', this.onNetworkChanged);
		EventBus.$on('acc-changed', this.onAccountChanged);
		EventBus.$on('as-changed', this.onAccountChanged1);
	},
	computed: {
		chooseText() {
			this.refreshnetKey;
			this.selectedType = networkManager.getSelectedNetworkType();
			this.popularNetworks = networkManager.getAll().filter(net => net.isJoined && !net.isTestnet);
			const currentAccount = accountManager.getCurrentAccount();
			if (currentAccount && currentAccount.currentChainId) {
				this.currentNetwork = networkManager.getByChainId(currentAccount.currentChainId);
			} else {
				this.currentNetwork = null;
			}

			if (this.selectedType === 1) {
				// 当前网络名，没有时显示默认文本
				return this.currentNetwork ? this.currentNetwork.name : this.$t('setting.currentNetwork');
			} else {
				return this.$t('setting.popularNetworks');
			}
		},
	},
	data() {
		return {
			selectedType: networkManager.getSelectedNetworkType(), // 1 = 当前网络, 100 = 热门网络，默认当前网络
			coinList: [],
			isLoading: false,
			totalM: 0,
			refreshnetKey: 0, // 用于强制刷新
			bs: null, // better-scroll实例
			refreshRequestId: 0, // 请求标识
		};
	},
	async mounted() {
		await this.initData();
		this.initBetterScroll();
	},
	methods: {
		handleStakeClick(asset) {
			console.log('点击质押', asset);

			this.$router.push({ path: '/pledge' });
			// 👉 在这里处理跳转/弹窗等逻辑
			//this.$emit('stake-click', asset); // 也可以向上传递事件
		},
		onSwapClick() {
			console.log('swap clicked');
		},
		onAccountChanged() {
			this.refreshnetKey++;
			console.log('账号已更改:');
			this.initData(); // 重新加载数据
		},
		showDetailsDb(it) {
			//显示代币详情
			save('dbitem', it);
			this.$router.push({
				path: '/dbdetails',
			});
		},
		onAccountChanged() {
			this.refreshnetKey++;
			console.log('账号已更改:');
			this.initData(); // 重新加载数据
		},
		onNetworkChanged(net) {
			this.refreshnetKey++;
			console.log('网络已更改:', net);
			this.initData(); // 重新加载数据
		},
		onAddClick() {
			console.log('add clicked');
		},
		initBetterScroll() {
			this.bs = new BScroll(this.$refs.scrollWrapper, {
				scrollY: true,
				click: true,
				probeType: 2,
				pullDownRefresh: {
					threshold: 50,
					stop: 20,
				},
			});

<<<<<<< Updated upstream
			this.bs.on('pullingDown', async () => {
				await this.refreshPricesAndBalances();
				this.bs.finishPullDown();
				this.bs.refresh();
			});
		},

		async initData() {
			this.isLoading = true;
			const currentAccount = accountManager.getCurrentAccount();
			if (!currentAccount) {
				this.coinList = [];
				this.isLoading = false;
				return;
			}

			const baseAssets = assetManager.getAssets(currentAccount.walletId, currentAccount.currentChainId) || [];
			let arrbox = baseAssets.map(it => ({
				...it,
				price: 0,
				change24h: 0,
				iconUrl: getTokenLogo(it.chainId, it.contractAddress, it.symbol),
				balance: it.balance ?? 0,
			}));
=======
              </div>
              <div class="ld-2">
                <div class="token-name">
                  <div class="asset-row">
                    {{ item.name }}
                    <template v-if="item.chainId == 1 && item.isMainCoin">
                      <div class="stake-action" @click="handleStakeClick(item)">
                        {{ $t('setting.common.stake') }}
                        <div class="icon-stake"></div>
                      </div>
                    </template>
                  </div>

                </div>
                <div
                  class="token-change"
                  :class="item.change24h >= 0 ? 'up' : 'down'"
                >
                  {{ formatChange(item.change24h) }}
                </div>
              </div>
            </div>
            <div class="rd">
              <div class="balance">
                {{ formatSmartNumber(item.balance, { decimals: 4 }) }} {{ item.symbol }}
              </div>
              <div class="value">
                ${{ formatSmartNumber(item.price * item.balance, { decimals: 4 }) }}
              </div>
            </div>
          </div>
  
          <!-- 资产导入放入滚动内容尾部 -->
         <div class="asset-import" @click="drdbclick" style="margin-top:20px;">
            <span class="gray-text">{{ $t('setting.noTokensFound') }}</span>
            <span class="blue-text">{{ $t('setting.importToken') }}</span>
        </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import BScroll from 'better-scroll'
  import ChainIcon2 from '@/components/common/ChainIcon2.vue'
  import { accountManager,save } from "@/bbjs/AccountManager";
  import { assetManager } from "@/bbjs/AssetManager";
  import { getTokenLogo } from '@/bbjs/iconService.js'
  import { fetchTokenPrice,fetchTokenPrice2,  fetchTokenBalance,fetchTokenBalance2 } from '@/bbjs/priceService'
  import { chainDefaultTokenMap } from "@/bbjs/chain-default-assets";
  import { networkManager } from '@/bbjs/networkManager.js'
  import { EventBus } from '@/bbjs/bus.js' // 你的事件总线
  export default {
    components: { ChainIcon2 },
    destroyed() {
    // 记得在销毁时移除监听
    
  },
  beforeDestroy() {
    EventBus.$off('network-changed', this.onNetworkChanged)
    EventBus.$off('acc-changed', this.onAccountChanged)
    EventBus.$off('as-changed', this.onAccountChanged1)
    EventBus.$off('selectedNetworkTypeChanged', (type) => {
     this.selectedType = type
    }
  )
},
    created() {
    // 监听全局事件，确保跨组件同步
    EventBus.$on('selectedNetworkTypeChanged', (type) => {
      this.selectedType = type
    })
    EventBus.$on('network-changed',this.onNetworkChanged)
    EventBus.$on('acc-changed',this.onAccountChanged)
    EventBus.$on('as-changed',this.onAccountChanged1)
  },
    computed: {
    chooseText() {
>>>>>>> Stashed changes

			this.coinList = arrbox; // 先显示初始数据

			// 顺序更新余额，UI立即刷新
			for (let i = 0; i < arrbox.length; i++) {
				const it = arrbox[i];
				try {
					const meta = chainDefaultTokenMap[it.chainId];
					const rpcUrl = meta?.rpcUrl;
					if (rpcUrl && it.address) {
						const result = await fetchTokenBalance2({
							rpcUrl,
							address: it.address,
							chainid: it.chainId,
							contractAddress: it.contractAddress || '',
							decimals: it.decimals || 18,
						});

						console.log('fetchTokenBalance2 请求chainId:', it.chainId, '当前chainId:', accountManager.getCurrentChainId());
						if (result.chainid !== accountManager.getCurrentChainId()) {
							// 当前链已变更，停止更新
							this.isLoading = false;
							return;
						}
						arrbox[i].balance = parseFloat(result.formatted);
						this.$set(this.coinList, i, { ...arrbox[i] });
					}
				} catch (e) {
					console.warn(`[余额更新失败] ${it.symbol || it.name}`, e);
				}
			}

			// 顺序更新价格，UI立即刷新
			for (let i = 0; i < arrbox.length; i++) {
				const it = arrbox[i];
				try {
					const meta = chainDefaultTokenMap[it.chainId];
					if (!meta) {
						continue;
					}
					const priceData = await fetchTokenPrice2(meta.coinGeckoPlatformId, it.chainId, it.contractAddress, meta.coinGeckoPlatformId);

					console.log('fetchTokenPrice2 请求chainId:', it.chainId, '当前chainId:', accountManager.getCurrentChainId());
					if (priceData.chainid !== accountManager.getCurrentChainId()) {
						// 当前链已变更，停止更新
						this.isLoading = false;
						return;
					}

					arrbox[i].price = priceData.price;
					arrbox[i].change24h = priceData.change24h;
					arrbox[i].iconUrl = priceData.icon || it.iconUrl;
					arrbox[i].chainid = priceData.chainid;
					this.$set(this.coinList, i, { ...arrbox[i] });
				} catch (e) {
					console.warn(`[价格更新失败] ${it.symbol || it.name}`, e);
				}
			}

			// 计算总价值
			this.totalM = arrbox.reduce((sum, item) => sum + (item.price || 0) * (item.balance || 0), 0);

			this.isLoading = false;
		},
		async refreshPricesAndBalances() {
			this.initData();
		},

		formatSmartNumber(value, options = {}) {
			const { useChinese = false, decimals = 2 } = options;
			const num = parseFloat(value);
			if (isNaN(num)) return '0';

			if (num > 0 && num < 0.0001) return '<0.0001';

			if (useChinese) {
				if (num >= 1e11) return (num / 1e8).toFixed(2) + ' 亿';
				if (num >= 1e8) return (num / 1e8).toFixed(2) + ' 亿';
				if (num >= 1e6) return (num / 1e6).toFixed(2) + ' 百万';
				if (num >= 1e4) return (num / 1e4).toFixed(2) + ' 万';
			} else {
				if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
				if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
				if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
			}

			return num.toFixed(decimals).replace(/\.?0+$/, '');
		},

		formatChange(value) {
			if (typeof value !== 'number') return '0.00%';
			const fixed = Math.abs(value).toFixed(2);
			if (value > 0) return `+${fixed}%`;
			if (value < 0) return `-${fixed}%`;
			return '0.00%';
		},

		onTokenIconError(e) {
			e.target.src = require('@/static/icon/moren.png');
		},

		drdbclick() {
			console.log('导入代币');
			this.$emit('importTokens');
		},
	},
};
</script>

<style scoped lang="scss">
.asset-manager {
	width: 100%;
	height: 100%;
	display: flex;
	padding: 0 20px;
	position: relative;
	flex-direction: column;
	box-sizing: border-box;

	.asset-head {
		width: 100%;
		display: flex;
		position: relative;
		align-items: center;
		box-sizing: border-box;
		justify-content: space-between;

		.choose {
			color: #000;
			font-size: 13px;
			padding: 8px 16px;
			border-radius: 24px;
			border: 1px solid #bbbbbb;
		}

		.l2 {
			gap: 6px;
			display: flex;
			align-items: center;

			.l21,
			.l22 {
				display: flex;
				padding: 8px 16px;
				align-items: center;
				border-radius: 24px;
				justify-content: center;
				border: 1px solid #bbbbbb;

				img {
					width: 15px;
					height: 15px;
					user-select: none;
				}
			}
		}
	}

	.scroll-wrapper {
		flex: 1;
		margin-top: 20px;
		overflow: hidden;

		.asset-item {
			padding: 0;
			height: 60px;
			display: flex;
			align-items: center;
			border-radius: 10px;
			margin-bottom: 10px;
			box-sizing: border-box;
			justify-content: space-between;

			.ld {
				flex: 1;
				display: flex;
				align-items: flex-start;

				.ld-1 {
					width: 41px;
					height: 41px;
					position: relative;

					.chain-icon {
						right: 6px;
						bottom: 3px;
						width: 15px;
						height: 15px;
						position: absolute;
					}
				}
			}
		}
	}
}

.token-icon {
	width: 30px;
	height: 30px;
	border-radius: 50%;
}

.ld-2 {
	display: flex;
	margin-left: 12px;
	flex-direction: column;
	justify-content: center;
}

.token-name {
	color: #000;
	font-size: 16px;
	font-weight: 600;
}

.token-change {
	font-size: 15px;
}

.token-change.up {
	color: #ca3441;
}

.token-change.down {
	color: #4259ff;
}

.rd {
	display: flex;
	align-items: flex-end;
	flex-direction: column;
	justify-content: center;
}

.balance {
	color: #000;
	font-size: 16px;
	font-weight: 600;
}

.value {
	color: #999;
	font-size: 15px;
}

.asset-import {
	font-size: 16px;
	margin-top: 20px;
	color: #9ca0ae;
	user-select: none;
	text-align: center;
}

.asset-import .blue-text {
	font-size: 14px;
	color: #4259ff;
	margin-left: 10px;
}

.svgicon {
	width: 20px;
	height: 20px;
	color: #4259ff;
	fill: currentColor;
}

.icon-stake {
	width: 16px;
	height: 16px;
	display: inline-block;
	background-color: #4259ff;
	mask: url('@/static/icon/stake.svg') no-repeat center;
	-webkit-mask: url('@/static/icon/stake.svg') no-repeat center;
	mask-size: contain;
	-webkit-mask-size: contain;
	margin-left: 4px;
}
.asset-row {
	display: flex;
	align-items: center;
	gap: 8px;

	.stake-action {
		display: flex;
		color: #4259ff;
		font-weight: 500;
		align-items: center;

		.icon-stake {
			width: 16px;
			height: 16px;
			margin-left: 4px;
			background-color: currentColor;
			mask: url('@/static/icon/stake.svg') no-repeat center;
			-webkit-mask: url('@/static/icon/stake.svg') no-repeat center;
			mask-size: contain;
			-webkit-mask-size: contain;
		}
	}
}
</style>
