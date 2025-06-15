<script>
import tabNum from '@/components/number/index'

export default {
  components: {
    tabNum
  },
  data() {
    return {
      percentage: ['25%', '50%', '75%']
    }
  },
  methods: {
    percentageTap(item) {
      console.log('当前点击', item)
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>


<template>
  <div class="page pledge-page">
    <div class="flex-r p-13">
      <div class="flex bold text-center">{{ $t('stake.title') }}</div>
      <div class="f-13 pl-10 c-main" @click="onCancel">{{ $t('common.cancel') }}</div>
    </div>

    <div class="flex-auto plr-13">
      <div class="num-box text-center">
        <div class="f-12 c-6">{{ $t('stake.balance') }}：0 ETH</div>
        <div class="bold">0 <span class="c-9">ETH</span></div>
        <div class="dis-i f-14">
          <span class="vertical-align-m pl-10">0 USD</span>
          <img class="vertical-align-m box-set img" alt="" src="@/static/icon/swap-vertical.svg" />
        </div>
      </div>

      <div class="percentage flex-r">
        <div>MetaMask Pool</div>
        <img class="img box-set" alt="" src="@/static/icon/question.svg" />

        <div class="flex f-12 text-right">
          <div class="number mb-5 bold">2.7%</div>
          <div class="c-6">{{ $t('stake.annualReward') }}</div>
        </div>
      </div>

      <div class="percentage-btn flex-b f-14 text-center">
        <div
          class="number"
          v-for="(item, i) in percentage"
          :key="i"
          @click="percentageTap(item)"
        >
          {{ item }}
        </div>

        <div class="number" @click="percentageTap('最大')">
          <img class="img box-set vertical-align-m" alt="" src="@/static/img/star.jpg" />
          <span class="vertical-align-m pl-5">{{ $t('common.max') }}</span>
        </div>
      </div>

      <tabNum />

      <van-button class="van-btn-reset" type="info" disabled block>
        {{ $t('stake.inputAmount') }}
      </van-button>
    </div>
  </div>
</template>


<style scoped lang="scss">
@import "~@/static/style/base.css";

.pledge-page {
  .num-box {
    padding: 50px 13px;

    .bold {
      padding: 20px 0;
      font-size: 26px;
    }

    .dis-i {
      border: 1px solid #f5f5f5;
      border-radius: 50px;
    }

    .img {
      width: 15px;
      padding: 8px 10px;
    }
  }

  .percentage {
    padding: 10px 13px;
    border: 1px solid #f5f5f5;
    border-radius: 10px;

    .img {
      padding: 0 10px;
      width: 18px;
    }

    .number {
      color: #1C7E33;
    }
  }

  .percentage-btn {
    padding-top: 25px;

    .number {
      width: 23%;
      padding: 8px 0;
      border: 1px solid #f5f5f5;
      border-radius: 50px;

      &:active {
        color: #999;

        .img {
          opacity: .5;
        }
      }
    }

    .img {
      width: 18px;
    }
  }
}
</style>
