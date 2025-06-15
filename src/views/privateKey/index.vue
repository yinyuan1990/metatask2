<template>
  <div class="page f-14">
    <van-nav-bar
      class="g-nav"
      :border="false"
      left-arrow
      @click-left="backRoot"
    />

    <div class="flex-auto private-key">
      <div class="tit bold">{{ $t('import.title') }}</div>

      <div class="flex-r mb-10">
        <div class="flex c-6">{{ $t('import.hintMnemonic') }}</div>
        <img class="desc-img box-set pl-10" alt="" src="@/static/icon/arrow-down.svg" />
        <img class="desc-img box-set pl-10" alt="" src="@/static/icon/eye.svg" />
      </div>

      <div class="flex-b mb-15">
        <div
          class="words-box"
          v-for="(item, i) in 12"
          :key="i"
        >
          {{ i + 1 }}. {{ words[i] || '' }}
        </div>
      </div>

      <div class="text-right c-main" @click="onChange">
        {{ words.length ? $t('import.clearAll') : $t('import.paste') }}
      </div>
    </div>

    <van-button
      class="private-key-btn van-btn-reset"
      type="info"
      :disabled="!isValid"
      @click="onContinue"
    >
      {{ $t('import.continue') }}
    </van-button>
  </div>
</template>

<script>

import { assetManager,isValidMnemonic } from "@/bbjs/AssetManager";
export default {
  data() {
    return {
      words: [],
      isValid: false
    }
  },
  methods: {
    validateMnemonic(wordsArray) {
      if (wordsArray.length !== 12) return false
      return bip39.validateMnemonic(wordsArray.join(' '))
    },
    backRoot() {
      this.$router.back()
    },
    async onChange() {
      if (this.words.length) {
        this.words = []
        this.isValid = false
        return
      }

      if (!navigator.clipboard || !navigator.clipboard.readText) {
        this.$toast.fail(this.$t('import.clipboardNotSupported') || '当前浏览器不支持剪贴板读取')
        return
      }

      try {
        const text = await navigator.clipboard.readText()
        const parsed = text.trim().split(/\s+/).filter(Boolean)

        if (parsed.length !== 12) {
          this.$toast.fail(this.$t('import.invalidWords') || '助记词格式错误，请确保为12个单词')
          this.words = parsed
          this.isValid = false
          return
        }

        this.words = parsed
        console.log("---> 00000 "+this.isValid +"--> "+ parsed + " ---> "+parsed.join(' '))

        this.isValid = assetManager.isValidMnemonic(""+parsed.join(' '))
        console.log("---> "+this.isValid)
        if (!this.isValid) {
          this.$toast.fail(this.$t('import.invalidWords'))
        }

      } catch (err) {
        console.error('Clipboard read failed:', err)
        this.$toast.fail(this.$t('import.clipboardError') || '无法读取剪贴板内容，请检查权限或浏览器设置')
      }
    },
    onContinue() {
      if (!this.isValid) {
        this.$toast.fail(this.$t('import.invalidWords'))
        return
      }

      console.log('导入成功', this.words)
      // TODO: 执行导入逻辑
    }
  }
}
</script>

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
  height: 50px;
}
</style>
