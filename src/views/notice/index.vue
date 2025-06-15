<script>
export default {
  data() {
    return {}
  }, methods:{

    backRoot(){
       this.$router.back()
    }
  }
}
</script>

<template>
  <div class="notice-page">
    <div class="flex-n p-13" @click="backRoot">
      <img class="close" alt="" src="@/static/icon/close.svg"  />

      <div class="flex text-center bold">{{ $t('notice.title') }}</div>
    </div>

    <div class="content text-center">
      <img class="notification mb-10" alt="" src="@/static/icon/notification.svg" />

      <div class="bold f-15 mb-10">{{ $t('notice.empty') }}</div>

      <div class="c-6 f-13">{{ $t('notice.desc') }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "~@/static/style/base.css";

.notice-page {
  .close {
    width: 20px;
  }

  .content {
    padding-top: 40vh;

    .notification {
      width: 24px;
    }
  }
}
</style>
