<script>
import addAccVue from '@/components/index/addAcc.vue'

export default {
  data() {
    return {
      show: false
    }
  },
  components: {
    addAccVue
  },
  methods: {
    onTap() {
      this.show = true
    }
  }
}
</script>

<template>
  <div class="page leading-in-a f-14">
    <div class="text-right bg-box">
      <img class="head-close p-13 box-set" alt="" src="@/static/icon/close.svg" />
    </div>

    <div class="flex-auto" style="margin-top: -1px;">
      <div class="bg-box p-13">
        <img class="dao-ru box-set" alt="" src="@/static/icon/daoru.svg" />
        <div class="tit-1">导入账户</div>
        <div class="f-12 text-line mb-10">导入的账户可在您的钱包中查看，但无法通过MetaMask 私钥助记词找回。</div>
        <div class="f-12 text-line mb-10">在此处详细了解导入的账户。</div>
      </div>

      <div class="bg-f-part">
        <div class="f-16 bold">粘贴您的私钥字符串</div>

        <div class="private-key text-line f-2 c-9">
          例如：
          3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266
        </div>

        <div class="c-main text-center">或扫描二维码</div>
      </div>
    </div>

    <addAccVue :show="show" @closeFn="show = false" />

    <van-button class="van-btn-reset" type="info" @click="onTap()">导入</van-button>
  </div>
</template>

<style scoped lang="scss">
@import "~@/static/style/base.css";

.bg-box {
  background: #f5f5f5;
}

.leading-in-a {

  .head-close {
    width: 20px;
  }

  .dao-ru {
    width: 32px;
  }

  .text-line {
    line-height: 18px;
  }

  .tit-1 {
    padding: 13px 0 30px;
    font-size: 20px;
  }

  .bg-f-part {
    padding: 25px 13px 13px;
  }

  .private-key {
    word-wrap: break-word;
    border: 1px solid #f5f5f5;
    border-radius: 10px;
    margin: 15px 0 30px;
    padding: 26px 13px;
  }

  .van-btn-reset {
    margin: 13px;
  }
}
</style>
