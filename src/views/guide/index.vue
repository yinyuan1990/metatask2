<script>
export default {
  name:'',
  data(){ return {
    list:[
        {
            name:'欢迎使用',
            desc:'MetaMask 深受数百万人信任，是一款可以让所有人进入 web3 世界的安全钱包。',
            img:require('@/static/img/banner1.png')
        },
        {
            name:'管理您的数字资产',
            desc:'存储、支出和发送数字资产，如代币、以太币、独特收藏品。',
            img:require('@/static/img/banner2.png')
        },
        {
            name:'您通往 web3 的门户',
            desc:'使用 MetaMask 登录并进行交易，以便投资、赚钱、玩游戏、销售等!',
            img:require('@/static/img/banner3.png')
        },
    ],
    listKey:0
  } },
  mounted(){
    let isGuide = localStorage.getItem('isGuide')
    if(isGuide){
        this.$router.replace({
            path:'/login'
        })
    }
  },
  methods:{
    onChange(index){ // 切换
        this.listKey = index;
    },
    goLogin(){
        localStorage.setItem('isGuide',1)
        this.$router.replace({
            path:'/login'
        })
    }
  }
}
</script>
<template>
  <div class="guide">
    <img src="@/static/img/metamask1.png" alt="" class="guide_icon"/>
    <van-swipe class="my-swipe" indicator-color="#333333" @change="onChange">
        <van-swipe-item v-for="(item,i) in list" :key="i">
            <div class="guide_head">
                {{ item.name }} 
                <img class="guide_head_im" src="@/static/img/metamask2.png" 
                v-if="listKey==0"/>
            </div>
            <div class="guide_tips">
                <span class="guide_tips_tt">
                    {{ item.desc }}
                </span>
            </div>
            <img :src="item.img" alt="" class="guide_banimg" style="width: 80%;display: block;margin: 50px auto;"/>
        </van-swipe-item>
    </van-swipe>
    <div class="guide_btns" @click="goLogin">开始使用</div>
  </div>
</template>
<style scoped lang="scss">
.guide{
    width: 100vw;
    height: 100vh;
    display: block;
    padding: 10px 0 80px;
    position: relative;
    &_icon{
        display: block;
        width: 20%;
        margin: 0 auto;
    }
    &_head{
        margin: 10vw auto 4vw;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 5.2vw;
        font-weight: bold;
        letter-spacing: 1px;
        &_im{
            width: 30vw;
            display: block;
            margin-left: 1vw;
        }
    }
    &_tips{
        text-align: center;
        font-size: 3.2vw;
        color: #333;
        &_tt{
            width: 120%;
            text-align: center;
            transform: scale(0.8);
            font-size: 3.2vw;
            margin-left: -10%;
            display: block;
        }
    }
    &_banimg{
        width: 100%;
        display: block;
    }
    .my-swipe{
        width: 100%;
    }
    &_btns{
        width: 90%;
        text-align: center;
        height: 44px;
        line-height: 44px;
        border: 1px #465BFF solid;
        border-radius: 32px;
        position: fixed;
        left: 5%;
        bottom: 30px;
        font-size: 14px;
        color: #465BFF;
    }
}
::v-deep(.van-swipe__indicator){
    background: #838383;
}
</style>