<script>
const initWords = ['dirt', 'tennis', 'summer', 'certain', 'horn', 'mosquito', 'ankle', 'rescue', 'silent', 'elephant', 'volcano', 'vibrant']

export default {
  data() {
    return {
      isEmpty: false,
      words: initWords
    }
  },
  methods: {
    onChange() {
      this.words = this.words.length ? [] : initWords
    }
  }
}
</script>

<template>
  <div class="page f-14">
    <van-nav-bar
        class="g-nav"
        :border="false"
        left-arrow
    />

    <div class="flex-auto private-key">
      <div class="tit bold">导入私钥助记词</div>

      <div class="flex-r mb-10">
        <div class="flex c-6">我有12个单词组成的助记词</div>
        <img class="desc-img box-set pl-10" alt="" src="@/static/icon/arrow-down.svg" />
        <img class="desc-img box-set pl-10" alt="" src="@/static/icon/eye.svg" />
      </div>

      <div class="flex-b mb-15">
        <div
            class="words-box"
            v-for="(item,i) in (words.length ? words : 12)"
            :key="i"
        >
          {{ i + 1 }}. {{ words.length ? item : '' }}
        </div>
      </div>

      <div class="text-right c-main" @click="onChange()">{{ words.length ? '全部清除' : '粘贴' }}</div>
    </div>

    <van-button class="private-key-btn van-btn-reset" type="info" :disabled="!words.length">继续</van-button>
  </div>
</template>

<style scoped lang="scss">
@import "~@/static/style/base.css";

.private-key {
  padding: 0 13px 13px;

  .tit {
    margin-bottom: 13px;
    font-size: 22px;
  }

  .desc-img {
    width: 17px;
  }

  .words-box {
    width: 30%;
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #f5f5f5;
    border-radius: 10px;
  }
}

.private-key-btn {
  margin: 13px;
}
</style>
