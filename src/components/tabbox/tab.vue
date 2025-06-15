<script>
import { EventBus } from '@/bbjs/bus.js';
export default {
  name: 'TabBox',
  props: {
    active: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      list: [
        {
          name: this.$t('setting.wallet'),
          img1: require('@/static/img/tab/1.png'),
          img2: require('@/static/img/tab/setting2.png'),
          img3: require('@/static/img/tab/setting3.png'),
          img4: require('@/static/img/tab/11.png'),
          path: '/rhome'
        },
        {
          name: this.$t('setting.wallet'),
          img1: require('@/static/img/tab/2.png'),
          img2: require('@/static/img/tab/setting2.png'),
          img3: require('@/static/img/tab/setting3.png'),
          img4: require('@/static/img/tab/22.png'),
          path: '/change'
        },
        {
          id: 3
        },
        {
          name: this.$t('setting.wallet'),
          img1: require('@/static/img/tab/4.png'),
          img2: require('@/static/img/tab/setting2.png'),
          img3: require('@/static/img/tab/setting3.png'),
          img4: require('@/static/img/tab/44.png'),
          path: '/transaction'
        },
        {
          name: this.$t('setting.wallet'),
          img1: require('@/static/img/tab/5.png'),
          img2: require('@/static/img/tab/setting2.png'),
          img3: require('@/static/img/tab/setting3.png'),
          img4: require('@/static/img/tab/55.png'),
          path: '/setting'
        }
      ],
      show: false,
      list1: [
        {
          img: require('@/static/icon/add.svg'),
          title: this.$t('setting.buy'),
          text: this.$t('setting.buyDesc')
        },
        {
          img: require('@/static/icon/swap-vertica1.svg'),
          title: this.$t('setting.sell'),
          text: this.$t('setting.sellDesc')
        },
        {
          img: require('@/static/icon/swap-horizontal.svg'),
          title: this.$t('setting.exchange'),
          text: this.$t('setting.exchangeDesc')
        },
        {
          img: require('@/static/icon/bridge.svg'),
          title: this.$t('setting.bridge'),
          text: this.$t('setting.bridgeDesc')
        },
        {
          img: require('@/static/icon/arrow-2-up-right.svg'),
          title: this.$t('setting.send'),
          text: this.$t('setting.sendDesc')
        },
        {
          img: require('@/static/icon/received.svg'),
          title: this.$t('setting.receive'),
          text: this.$t('setting.receiveDesc')
        }
      ]
    }
  },
  
  
  
    beforeDestroy() {

EventBus.$off('danhao-1', this.goItem2)

},
created() {

EventBus.$on('danhao-1',this.goItem2)
 

},
  methods: {
    goItem2(){

      console.log("gohome sucess")
      goPage(this.list[1],1)

    },
    goPage(item, i) {
      if (i === 2) {
        this.show = true
        return
      }
      if (i === 3) {
        window.location.href = 'https://portfolio.metamask.io/explore?MetaMaskEntry=mobile%2F&metricsEnabled=true&marketingEnabled=true'
        return
      }
      this.active = i
      if (item.path) {
        this.$router.push(item.path)
      }
    },
    onListItemClick(item, index) {
       console.log('点击了项:', item, '索引:', index)
       // 根据 item 或 index 做相应的操作
       if (item.title === this.$t('setting.buy')) {
        // 买入操作
        console.log('点击买入')
        // 跳转或业务逻辑
        } else if (item.title === this.$t('setting.sell')) {
        // 卖出操作
        console.log('点击卖出')
        } else if (item.title === this.$t('setting.exchange')) {
        // 兑换操作
        console.log('点击兑换')
        this.$router.push({ path: '/swap' });

        } else if (item.title === this.$t('setting.bridge')) {
        // 跨链桥操作
          console.log('点击跨链桥')
          window.location.href = 'https://portfolio.metamask.io/explore?MetaMaskEntry=mobile%2F&metricsEnabled=true&marketingEnabled=true'

        } else if (item.title === this.$t('setting.send')) {

          //this.$router.push({ path: '/send'});
        // 发送操作
         this.show = false
         console.log('点击发送')
         EventBus.$emit('send-acount')
         console.log('点击发送1')
         

        } else if (item.title === this.$t('setting.receive')) {
        // 接收操作
          console.log('点击接收')
          this.$router.push({ path: '/receive' });

        } else {
        console.log('未知操作')
        }
     }
  }
}
</script>

<template>
  <div class="tab-box-container">
    <div class="tabboxew">
      <div class="tabboxew_it" v-for="(item, i) in list" :key="i" @click="goPage(item, i)">
        <template v-if="!item.id">
          <img :src="active === i ? item.img4 : item.img1" class="tabboxew_it_img" />
        </template>
        <div class="tabboxew_it_yuan" v-else>
          <i class="iconfont icon-arrow-up-down-line"></i>
        </div>
      </div>
    </div>
    <van-popup v-model="show" overlay-class="aaa" position="bottom" round>
        <div class="list_box1">
            <div
            class="list1"
            v-for="(item, i) in list1"
            :key="i"
            @click="onListItemClick(item, i)"
            >
            <div class="list_img1">
                <img :src="item.img" alt="" />
            </div>
            <div class="list_item1">
                <h3>{{ item.title }}</h3>
                <p>{{ item.text }}</p>
            </div>
            </div>
        </div>
    </van-popup>



  </div>
</template>

<style scoped lang="scss">
.tabboxew {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  border-top: 1px solid #f6f6f6;
  display: flex;
  padding: 0 40px;
  align-items: center;
  justify-content: space-between;
  background: #fff;

  &_it {
    &_img {
      width: 24px;
      height: 24px;
      display: block;
    }
    &_yuan {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #4459ff;
      .iconfont {
        color: #fff;
        font-size: 14px;
      }
    }
  }
}

.list_box1 {
  padding: 20px 0 20px 0;
}

.list1 {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  margin-bottom: 0px;
  .list_img1 {
    width: 30px;
    height: 30px;
    background: #4459ff;
    border-radius: 100%;
    padding: 4px;
    box-sizing: border-box;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .list_item1 {
    margin-left: 4vw;
    h3 {
      font-size: 16px;
      font-weight: 500;
    }
    p {
      font-size: 14px;
      color: #6e6e6e;
    }
  }
}
</style>
