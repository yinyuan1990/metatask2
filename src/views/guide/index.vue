<script>
export default {
	name: '',
	data() {
		return {
			list: [
				{
					name: '欢迎使用',
					desc: 'MetaMask 深受数百万人信任，是一款可以让所有人进入 web3 世界的安全钱包。',
					img: require('@/static/img/banner1.png'),
				},
				{
					name: '管理您的数字资产',
					desc: '存储、支出和发送数字资产，如代币、以太币、独特收藏品。',
					img: require('@/static/img/banner2.png'),
				},
				{
					name: '您通往 web3 的门户',
					desc: '使用 MetaMask 登录并进行交易，以便投资、赚钱、玩游戏、销售等!',
					img: require('@/static/img/banner3.png'),
				},
			],
			listKey: 0,
		};
	},
	mounted() {
		let isGuide = localStorage.getItem('isGuide');
		if (isGuide) {
			this.$router.replace({
				path: '/login',
			});
		}
	},
	methods: {
		onChange(index) {
			// 切换
			this.listKey = index;
		},
		goLogin() {
			localStorage.setItem('isGuide', 1);
			this.$router.replace({
				path: '/login',
			});
		},
	},
};
</script>
<template>
	<div class="guide">
		<!-- logo -->
		<img class="guide_icon" src="@/static/img/metamask1.png" />
		<!-- 滑动轮播 -->
		<van-swipe class="my-swipe" indicator-color="#333333" @change="onChange">
			<van-swipe-item v-for="(item, i) in list" :key="i">
				<div class="guide_head">
					{{ item.name }}
					<span v-if="listKey == 0" class="guide_head_name">MetaMask</span>
					<!-- <img class="guide_head_im" src="@/static/img/metamask2.png" v-if="listKey == 0" /> -->
				</div>
				<div class="guide_tips">{{ item.desc }}</div>
				<img :src="item.img" class="guide_banimg" />
			</van-swipe-item>
		</van-swipe>
		<!-- 开始按钮 -->
		<div class="guide-btn">
			<van-button color="#465bff" plain hairline round @click="goLogin">开始使用</van-button>
		</div>
	</div>
</template>
<style scoped lang="scss">
.guide {
	width: 100%;
	height: 100%;
	display: flex;
	overflow: hidden;
	position: relative;
	flex-direction: column;

	&_icon {
		width: 20%;
		display: block;
		margin: 15px auto;
	}
	.guide_head {
		display: flex;
		margin: 24px 0;
		font-size: 23px;
		font-weight: 500;
		align-items: center;
		letter-spacing: 1px;
		justify-content: center;

		.guide_head_name {
			margin-left: 4px;
		}

		&_im {
			width: 30vw;
			display: block;
			margin-left: 1vw;
		}
	}
	.guide_tips {
		width: 78%;
		margin: 0 auto;
		font-size: 13px;
		line-height: 18px;
		color: #686e7d;
		text-align: center;
	}
	.guide_banimg {
		flex: 1;
		width: 80%;
		margin: auto;
		display: block;
		object-fit: contain;
	}
	.my-swipe {
		flex: 1;
		width: 100%;
		display: flex;
		position: relative;
		flex-direction: column;

		:deep(.van-swipe__indicators) {
			gap: 10px;
			bottom: 12px;
			display: flex;

			.van-swipe__indicator {
				background: #838383;
			}

			.van-swipe__indicator {
				width: 8px;
				height: 8px;
			}
		}
	}

	.guide-btn {
		width: 100%;
		margin: 32px 0;
		padding: 0 24px;
		box-sizing: border-box;

		.van-button {
			width: 100%;
			height: 48px;

			.van-button__text {
				font-size: 14px;
				font-weight: 600;
			}
		}
	}
}
</style>
