<script>
import { Toast } from 'vant'

export default {
  data() {
    return {
      price: 'POL'
    }
  },
  methods: {
    getPrice() {
      Toast('系统繁忙')
    }
  }
}
</script>

<template>
  <div class="page trade-page p-13 f-14">
    <div class="flex-r f-13">
      <div class="flex text-center">
        <div class="f-16 bold">要卖出的金额</div>
        <div class="mt-5 c-9">Polygon Mainnet</div>
      </div>
      <div class="pl-10 c-main">取消</div>
    </div>

    <div class="flex-auto">
      <div class="sel-btn flex-r">
        <div class="btn-bg flex-hide flex-r">
          <img class="img-20 mr-10" alt="" src="@/static/img/turn-on-metamask-notifications.png" />
          <div class="flex text-line1 bold">Account 1(oxEab1...5401)</div>
          <img class="icon-arrow" alt="" src="@/static/icon/arrow-down.svg" />
        </div>

        <div class="btn-bg flex-r btn-right">
          <img class="img-20" alt="" src="@/static/icon/fox.png" />
          <img class="icon-arrow" alt="" src="@/static/icon/arrow-down.svg" />
        </div>

        <div class="btn-bg flex-r btn-right">
          <div class="f-16 bold">EUR</div>
          <img class="icon-arrow" alt="" src="@/static/icon/arrow-down.svg" />
        </div>
      </div>

      <p class="c-6">您想卖出</p>
      <div class="btn-border flex-r">
        <img class="img" alt="" src="@/static/img/turn-on-metamask-notifications.png" />
        <div class="flex text-line1 bold pl-10">Account 1(oxEab1...5401)Account 1(oxEab1...5401)Account
          1(oxEab1...5401)Account 1(oxEab1...5401)
        </div>
        <div class="bold pl-10">POL</div>
        <img class="icon-arrow" alt="" src="@/static/icon/arrow-down.svg" />
      </div>
      <p class="mb-15 c-9 f-12">当前余额：0.87264POL*$0.17</p>

      <p class="mt-5 c-6">金额</p>
      <div class="btn-border flex-r">
        <div class="f-16 bold">O </div>
        <input
            class="flex f-16 bold price-inp"
            v-model="price"
        />
        <div>USD</div>
        <img class="icon-arrow" alt="" src="@/static/icon/arrow-down.svg" />
      </div>

      <p class="pt-10 c-6">将您的现金发送到</p>
      <div class="btn-border">
        <div class="pay-way flex-r ptb-10">
          <img class="img-20 mr-10" alt="" src="@/static/icon/card.svg" />
          <div class="text-line1 bold flex">Debit or Credit</div>
          <div class="bold pl-10">Change</div>
          <img class="icon-arrow" alt="" src="@/static/icon/arrow-down.svg" />
        </div>
        <div class="flex-r ptb-10">
          <img class="pay-card" alt="" src="@/static/icon/card.svg" />
          <img class="pay-card" alt="" src="@/static/icon/card.svg" />
          <img class="pay-card" alt="" src="@/static/icon/card.svg" />
          <img class="pay-card" alt="" src="@/static/icon/card.svg" />
        </div>
      </div>
    </div>

    <van-button
        class="g-radius mt-13"
        type="info"
        :disabled="!price"
        @click="getPrice()"
    >
      获取报价
    </van-button>
  </div>
</template>

<style scoped lang="scss">
@import "~@/static/style/trade.scss";
</style>
