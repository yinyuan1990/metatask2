<script>
import TitleBar from '@/components/common/TitleBar.vue'
export default {
  components: {
    TitleBar,
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    ckhhclick() {
      console.log('查看会话按钮被点击')
    }
  }
}
</script>

<template>
  <div class="set-page">
    <div class="fixed-top">
      <TitleBar :title="$t('setting.walletConnectSession')" />
    </div>
    <p class="p2-centered">{{ $t('setting.noActiveSessions') }}</p>
  </div>
</template>

<style scoped lang="scss">
.p2-centered {
  font-size: 16px;   /* p2 公共字体大小 */
  color: #0F0F0F;    /* p2 公共字体颜色 */
  text-align: center;
  margin-top: 50px;
  margin-left: 0;
  margin-right: 0;
}

</style>
