<script>
export default {
  data() {
    return {
      numBtn: [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '←']
    }
  },
  methods: {
    numBtnTap(item) {
      console.log('当前点击', item)
    }
  }
}
</script>

<template>
  <div class="number-box flex-n text-center bold">
    <div
        class="number"
        v-for="(item,i) in numBtn"
        :key="i"
        @click="numBtnTap(item)"
    >
      {{ item }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.number-box {
  padding: 20px 30px;

  .number {
    width: 33.3%;
    line-height: 50px;
    font-size: 20px;

    &:active {
      color: #999;
    }
  }
}
</style>
