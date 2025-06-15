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
      this.$router.push({ path: '/set7/look' });
    }
  }
}
</script>

<template>
  <div class="set-page">
    <div class="fixed-top">
      <TitleBar :title="$t('setting.title7')" />
    </div>

    <div class="walletconnect-session">
      <p class="p1" style="margin-top: 20px; margin-left: 20px;">{{ $t('setting.walletConnectSession') }}</p>
      <p class="p2" style="margin-top: 20px; margin-left: 20px;">{{ $t('setting.walletConnectSessionList') }}</p>

      <div class="btn-wrapper">
        <button class="btn-check-session" @click="ckhhclick">{{ $t('setting.checkSession') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.btn-wrapper {
  margin-top: 20px;
  padding: 0 20px;
}

.btn-check-session {
  width: 100%;
  height: 40px;
  border-radius: 40px;
  background-color: white;
  border: 2px solid #A1AAFF;
  color: #4259FF;
  font-size: 16px;
  cursor: pointer;
  margin-top: 16px;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
