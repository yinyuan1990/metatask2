<script>
import TitleBar from '@/components/common/TitleBar.vue'

export default {
  components: {
    TitleBar,
  },
  methods: {
  click1() {
    const title = this.$t('setting.privacyPolicy')
    const url = 'https://consensys.io/privacy-policy' // 你自己填真实链接
    console.log('隐私政策点击')
    this.$router.push({
      name: 'wwwcom',
      query: { title, url }
    })
  },
  click2() {
    const title = this.$t('setting.termsOfUse')
    const url = 'https://legal.consensys.io/metamask/terms-of-use/' // 你自己填真实链接
    console.log('使用条款点击')
    this.$router.push({
      name: 'wwwcom',
      query: { title, url }
    })
  },
  click3() {


    window.location.href = 'https://raw.githubusercontent.com/MetaMask/metamask-mobile/v7.46.1/attribution.txt';
    
    //const title = this.$t('setting.contributors')
    //const url = 'https://raw.githubusercontent.com/MetaMask/metamask-mobile/v7.46.1/attribution.txt' // 自行填写
    console.log('参与者点击')
    //this.$router.push({
    //  name: 'wwwcom',
    //  query: { title, url }
    //})
  },
  click4() {
    const title = this.$t('setting.supportCenter')
    const url = 'https://support.metamask.io' // 自行填写
    console.log('访问我们的支持中心点击')
    this.$router.push({
      name: 'wwwcom',
      query: { title, url }
    })
  },
  click5() {
    const title = this.$t('setting.website')
    const url = 'https://support.metamask.io' // 自行填写
    console.log('访问我们的网站点击')
    this.$router.push({
      name: 'wwwcom',
      query: { title, url }
    })
  },
  click6() {
    const title = this.$t('setting.contactUs')
    const url = 'https://support.metamask.io' // 自行填写
    console.log('联系我们点击')
    this.$router.push({
      name: 'wwwcom',
      query: { title, url }
    })
  }
}

}
</script>

<template>
  <div class="set-page">
    <div class="fixed-top">
      <TitleBar :title="$t('setting.title8')" />
    </div>

    <div class="content-wrapper">
      <img src="@/static/icon/fox.png" alt="fox" class="fox-icon" />

      <p class="version-text">{{ $t('setting.version') }}</p>

      <p class="link-text black">{{ $t('setting.link') }}</p>
      <div class="spacing-20"></div> 
      <p class="link-text blue" @click="click1" style="margin-left: 20px;">{{ $t('setting.privacyPolicy') }}</p>
      <div class="spacing-20"></div> 
      <p class="link-text blue" @click="click2" style="margin-left: 20px;">{{ $t('setting.termsOfUse') }}</p>
      <div class="spacing-20"></div> 
      <p class="link-text blue" @click="click3" style="margin-left: 20px;">{{ $t('setting.contributors') }}</p>

      <div class="underline"></div>

      <p class="link-text blue" @click="click4" style="margin-left: 20px;">{{ $t('setting.supportCenter') }}</p>
      <div class="spacing-20"></div> 
      <p class="link-text blue" @click="click5" style="margin-left: 20px;">{{ $t('setting.website') }}</p>
      <div class="spacing-20"></div> 
      <p class="link-text blue" @click="click6" style="margin-left: 20px;">{{ $t('setting.contactUs') }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.set-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow-x: hidden; /* 禁止页面左右滚动 */
}

.fixed-top {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
  border-bottom: 1px solid #eee;
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;  /* 禁止左右滚动 */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  width: 100vw; /* 保障宽度不超出屏幕 */
  box-sizing: border-box;
}

.fox-icon {
  width: 80px;
  height: 80px;
  display: block;
  margin: 20px auto 10px auto;
}

.version-text {
  font-size: 20px;
  color: #666666;
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
}

.link-text {
  font-size: 20px;
  cursor: pointer;
  user-select: none;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
}

.link-text.black {
  color: #000000;
  text-align: left; /* 改成左对齐 */

  margin-left: 20px; /* 加个左边距对齐你设计 */
}

.link-text.blue {
  color: #4259FF;
  text-align: left;

}

.underline {
  width: 25vw; /* 屏幕宽度的1/4 */
  height: 0.5px;
  background-color: #D9D9D9;
  margin: 30px 0px 20px 20px;
  align-self: flex-start;
}
</style>
