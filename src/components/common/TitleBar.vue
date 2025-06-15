<template>
  <div class="title-bar">
    <div class="title-bar__inner">
      <img class="back-icon" src="@/static/icon/arrow-left.svg" @click="goBack" />
      <h2 class="title">{{ title }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    }
  },
  methods: {
    goBack() {
      console.log('返回上一页');
      this.$router.back(); // 返回上一页
    }
  }
};
</script>

<style scoped>
.title-bar {
  padding-top: env(safe-area-inset-top, 0px); /* 兼容刘海屏 */
  background-color: #fff;
  border-bottom: 1px solid #eee;
  position: relative;
  z-index: 10;
}

.title-bar__inner {
  display: flex;
  align-items: center;
  padding: 20px 16px;
}

.back-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin-right: 10px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-left: 30px;
}
</style>
