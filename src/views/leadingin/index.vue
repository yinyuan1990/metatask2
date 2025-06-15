<script>
import tabVue from '@/components/tabbox/tab.vue'

export default {
  components: {
    tabVue
  },
  data() {
    return {}
  }
}
</script>

<template>
  <div class="page leading-in f-14">
    <div class="flex-r head">
      <img class="head-back" alt="" src="@/static/icon/arrow-left.svg" />

      <div class="flex text-center f-16 bold">导入 NFT</div>
    </div>

    <div class="flex-auto">
      <div class="f-13 c-9 text-center">Ethereum Main Network</div>

      <div class="tip-box flex-n">
        <img class="img" alt="" src="@/static/img/warn.jpg" />
        <div class="flex">
          显示NFT媒体和数据可能会导致您的IP地址被中心化服务器获悉。仅当您了解相关风险时才可导入NFT。
        </div>
      </div>

      <div class="inp-box">
        <div class="mb-5">地址</div>
        <input class="form-field__input" placeholder="Ox..." />
      </div>

      <div class="inp-tip f-12">收藏品地址不能为空</div>

      <div class="inp-box">
        <div class="mb-5">ID</div>
        <input class="form-field__input" placeholder="输入收藏品ID" />
      </div>

      <div class="btn-box flex-r">
        <van-button class="flex" plain>取消</van-button>
        <van-button class="flex" plain type="info">添加</van-button>
      </div>
    </div>

    <tabVue :active="0" />
  </div>
</template>

<style scoped lang="scss">
@import "~@/static/style/base.css";

.leading-in {
  .head {
    padding: 13px 13px 5px;
  }

  .head-back {
    width: 20px;
  }

  .tip-box {
    line-height: 22px;
    align-items: flex-start;
    margin: 15px 0;
    padding: 10px;
    border-left: 4px solid #9E6809;
    border-radius: 5px;
    background: #F5EFE5;

    .img {
      width: 20px;
      margin-right: 10px;
    }
  }

  .inp-box {
    padding: 10px 13px;
  }

  .inp-tip {
    margin-bottom: 20px;
    padding-left: 10px;
    color: #CA3542;
  }

  .btn-box {
    padding: 50px 13px;

    .van-button {
      border-radius: 50px;

      &--default {
        margin-right: 20px;
      }
    }
  }
}
</style>
