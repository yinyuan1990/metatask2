<script>
import * as echarts from "echarts";
import {load} from "@/bbjs/AccountManager"
import { fetchTokenDetailWithFallback,fetchTokenDetail,fetchTokenBalance,fetchMainCoinHistory,fetchTokenHistory } from "@/bbjs/priceService"
import {chainDefaultAssetMap,chainArr,chainDefaultTokenMap} from "@/bbjs/chain-default-assets"
import { formatLargeNumber,formatPrice,formatBalance } from "@/bbjs/utils"
import { formatDate } from "@/static/js/common"
import receivePayment from "@/components/index/receivePayment.vue";
import ChainIcon2 from '@/components/common/ChainIcon2.vue'
import { networkManager} from '@/bbjs/networkManager.js'
export default {
  components:{
    ChainIcon2,
    receivePaymentVue:receivePayment
  },
  computed: {
  timeList() {
    return this.$t('timeList')
  },
  setList() {
    return [
      { name: this.$t('action.buy'),    img: require('@/static/icon/addicon.png'),              id: 1 },
      { name: this.$t('action.swap'),   img: require('@/static/icon/swap-horizontal.svg'),      id: 2 },
      { name: this.$t('action.bridge'), img: require('@/static/icon/bridge.svg'),               id: 3 },
      { name: this.$t('action.send'),   img: require('@/static/icon/arrow-2-up-right.svg'),     id: 4 },
      { name: this.$t('action.receive'),img: require('@/static/icon/scan-barcode.svg'),         id: 5 }
    ]
  }
  },
  data() {
    return {
        timeKey:0,
        timeDaysMap: [1, 7, 30, 90, 365],
        closeSvg: require('@/static/icon/close.svg'),
        dbitem:{},// 代币参数
        details:{}, // 详情参数
        newTime:'',// 当前时间
    };
  },
  mounted() {
    let dbitem = load('dbitem')
    this.dbitem = dbitem
    console.log( dbitem )
    this.$nextTick(()=>{
        this.init();
    })
    this.newTime = formatDate( new Date().getTime(),'MM月DD日 hh:ii' )
  },
  methods: {
    getNameByChainId2(){

      return networkManager.getByChainId(this.dbitem.chainId).name
    },
    formatLargeNumber,
    formatPrice,
    formatBalance,
        formatSmartNumber(value, options = {}) {
            const { useChinese = false, decimals = 2 } = options
            const num = parseFloat(value)
            if (isNaN(num)) return '0'

            // 小于 0.0001 显示为 <0.0001
            if (num > 0 && num < 0.0001) return '<0.0001'

            // 使用中文单位（万、百万、亿）
            if (useChinese) {
                if (num >= 1e11) return (num / 1e8).toFixed(2) + ' 亿'
                if (num >= 1e8) return (num / 1e8).toFixed(2) + ' 亿'
                if (num >= 1e6) return (num / 1e6).toFixed(2) + ' 百万'
                if (num >= 1e4) return (num / 1e4).toFixed(2) + ' 万'
            } else {
                // 英文缩写：B, M, K
                if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
                if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
                if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
            }

            // 正常显示小数（去除多余0）
            return num.toFixed(decimals).replace(/\.?0+$/, '')
            },
    goDbSc(){ // 去市场
            
        window.open('https://portfolio.metamask.io/buy?metamaskEntry=ext_buy_banner_activity&chainId=1&metametricsId=0x90f3346b1d4226d7a4a6f6188cfd7b89cc71620bdeb47c62abae8570b8d94126&metricsEnabled=true&marketingEnabled=true','_blank')
    },
    setListChange(id){

        console.log("join--->  "+id)
        let urls;
        if(id == 1){
          this.$router.push({ path: '/buy' });
            //urls = 'https://portfolio.metamask.io/buy?metamaskEntry=ext_buy_sell_button&chainId=1&metametricsId=0x90f3346b1d4226d7a4a6f6188cfd7b89cc71620bdeb47c62abae8570b8d94126&metricsEnabled=true&marketingEnabled=true'
        }else if( id == 2){
            this.$router.push({
                path:'/swap'
            })
        }else if( id == 3){

          /*
          this.$router.push({
            path:'/klqbox'
          })*/
          window.location.href = 'https://portfolio.metamask.io/explore?MetaMaskEntry=mobile%2F&metricsEnabled=true&marketingEnabled=true';
        }else if( id == 4){
            

          //const walletId = accountManager.getCurrentAccount()?.walletId; // 获取当前钱包ID
          //const chainId = accountManager.getCurrentAccount()?.currentChainId; // 当前链id
          const assets = this.dbitem;

          const payload = {
            assets: assets,
          };

          localStorage.setItem('transferData1', JSON.stringify(payload));
          this.$router.push({ path: '/send1' });

        }else if( id == 5){
            //this.receivePaymentVueShow = true
            this.$router.push({ path: '/receive' });
        }

        urls && ( window.open(urls,'_blank') )
    },
    backFn(){ // 返回
      this.$router.back()
    },
    getDbInfo(){ // 获取代币数据
      let chainArrAct = chainArr.filter(it=>{
        return it.chainId == this.dbitem.chainId
      })[0];
      let dbInfo = chainDefaultAssetMap[chainArrAct.chainId];
      let wlAndDbinfo = {
        ...chainArrAct,
        ...dbInfo,
      }
      console.log('wlAndDbinfo',wlAndDbinfo,this.dbitem)
      let ajaxfn;
      let paramsObj;


      /*
          coinGeckoCoinId: 'binancecoin',
    coinGeckoPlatformId: 'binance-smart-chain',
      */

      if( this.dbitem.isMainCoin ){
        ajaxfn = fetchTokenDetail
        paramsObj = {
          coinGeckoPlatformId:wlAndDbinfo.coinGeckoPlatformId,
          contractAddress:this.dbitem.contractAddress
        }
      }else{
        ajaxfn = fetchTokenDetail
        paramsObj = {
          rpcUrl:wlAndDbinfo.rpcUrls[0],
          platformId:wlAndDbinfo.coinGeckoCoinId,
          contractAddress:this.dbitem.contractAddress
        }
      }
      console.log('paramsObj',paramsObj,ajaxfn)
      ajaxfn(paramsObj).then(res=>{
        console.log(res,'---res--')
        
  //       {
  //   name: data.name, // 代币名称，例如 "Avalanche"
  //   symbol: data.symbol, // 代币符号，例如 "AVAX"
  //   logo: data.image.large, // 图标地址，用于 UI 显示

  //   marketCap: data.market_data.market_cap.usd, // 市值（单位：美元），例如 95450000000 -> 95.45 十亿
  //   volume: data.market_data.total_volume.usd, // 24小时交易额（单位：美元），例如 913080000 -> 913.08 百万
  //   circulatingSupply: data.market_data.circulating_supply, // 流通供应数量（单位：个），例如 145890000 -> 145.89 百万

  //   ath: data.market_data.ath.usd, // 有史以来最高价（单位：美元），例如 787.77
  //   atl: data.market_data.atl.usd, // 有史以来最低价（单位：美元），例如 0.0398

  //   change24h: data.market_data.price_change_percentage_24h, // 24 小时涨跌幅（百分比），例如 -1.23
  //   price: data.market_data.current_price.usd, // 当前价格（单位：美元）

  //   platform: data.asset_platform_id || '', // 平台 ID（如 'ethereum'，仅代币有）
  //   updatedAt: Date.now() // 时间戳，标记最后更新时间
  // }
        this.details = res;
        let conAdd = this.dbitem.isMainCoin?'':this.dbitem.contractAddress;
        let newOjb = {
          rpcUrl: wlAndDbinfo.rpcUrls[0],
          address:this.dbitem.address,
          contractAddress:conAdd,
          decimals:this.dbitem.decimals
        }
        console.log(newOjb,'fetchTokenBalance--')
        fetchTokenBalance(newOjb).then(yures=>{
          console.log( yures,'--yures' )
          this.details = {
            ...this.details,
            ...yures
          }
        })
      })
    },
    init() {
      this.swapPrice(1)
      this.getDbInfo();  
    },
    async onTimeSelect(index) {
      this.timeKey = index
      const days = this.timeDaysMap[index]
      await this.swapPrice(days)
    },
    onTokenIconError(e) {
        e.target.src = require("@/static/icon/moren.png");
      }
    ,
    async swapPrice(days){
      
      const meta = chainDefaultTokenMap[this.dbitem.chainId];
        // 使用 $nextTick 确保 DOM 已更新
      await this.$nextTick();
      const chartDom = document.getElementById("main")
      if (!chartDom) return
      chartDom.style.width = "100%"; 
      const myChart = echarts.init(chartDom,null, {
        devicePixelRatio: 1  // 强制 1:1 绘制，图会模糊
      })
      myChart.resize();
      // 添加窗口大小变化监听
      const resizeHandler = () => myChart.resize();
      window.addEventListener('resize', resizeHandler);
       // 在组件销毁时移除监听器
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', resizeHandler);
        myChart.dispose();
      });


      let prices = []
      try {
        if (this.dbitem.isMainCoin) {
          prices = await fetchMainCoinHistory(meta.coinGeckoPlatformId, days)
        } else {
          prices = await fetchTokenHistory(meta.coinGeckoCoinId, this.dbitem.contractAddress, days)
        }
      } catch (e) {
        console.error("获取价格失败:", e)
        return
      }

      if (prices.length > 200) {
        prices = prices.slice(-200) // 保留最后 50 条数据（通常是最新的）
      }
      console.log(JSON.stringify(prices))
      const xAxisData = prices.map(([timestamp]) => {
        const date = new Date(timestamp)
        return days > 1
          ? `${date.getMonth() + 1}/${date.getDate()}`
          : `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
      })
      const yAxisData = prices.map(([_, price]) => Number(price.toFixed(4)))
      const option = {
          xAxis: {
            type: "category",
            show: false,
            data: xAxisData,
          },
          yAxis: {
            type: "value",
            show: false,
            min: value => value.min ,
            max: value => value.max ,
          },
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "line" },
          },
          grid: {
          left: "10", // 左侧边距
          right: "0", // 右侧边距
          top: "0px", // 顶部边距
          bottom: "0px", // 底部边距
          containLabel: false, // 包含坐标轴标签区域
          },
          series: [
            {
              type: "line",
              data: yAxisData,
              showSymbol: false,
              smooth: true,
              lineStyle: {
                width: 2,
                color: "#3E6CFF",
              },
              areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#3E6CFF" },
                  { offset: 1, color: "rgba(62,108,255,0)" },
                ]),
              },
            },
          ],
      }
      console.log("join=====>22222")
      myChart.setOption(option);
      myChart.resize(); // 再次确保 resize
     
    }
  },
};
</script>
<template>
  <div class="dbdetails">
     
    <div  class="dbdetails_head p16">
      <span
        class="mm-box mm-icon ts backSvg mm-icon--size-sm mm-box--display-inline-block mm-box--color-inherit"
        @click="backFn"
      ></span>
      
      <div class="bdbdetails_head_tt">
        
        <div class="btitle-main" >{{ this.dbitem.name }}</div>
        <div class="btitle-sub" > {{ getNameByChainId2() }}</div>
      </div>
      <span
        class="mm-box mm-icon ts more-vertical mm-icon--size-sm mm-box--display-inline-block mm-box--color-inherit"
      ></span>
    </div>


    <div class="p16">
      <h1
        class="mm-box mm-text mm-text--display-md mm-text--font-weight-medium mm-box--margin-bottom-1 mm-box--color-text-default mm-box--rounded-lg"
        data-testid="asset-hovered-price"
        style="opacity: 1"
      >
        ${{ details.price  }}
      </h1>
      <div class="mm-box" style="opacity: 1">
        <svg
          class="chart-up"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          v-if="details.change24h>= 0"
        >
          <path
            d="M9.75 3.8125L6.25 7.4875L4.91667 5.3875L2.25 8.1875"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M8.08398 3.8125H9.75065V5.5625"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
        <svg class="chart-down" width="12" height="12" v-else
        viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.75 8.1875L6.25 4.5125L4.91667 6.6125L2.25 3.8125" 
          stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M8.08398 8.1875H9.75065V6.4375" stroke-linecap="round" 
          stroke-linejoin="round"></path>
        </svg>
        <p
          class="mm-box mm-text mm-text--body-md-medium 
          mm-box--margin-right-1 mm-box--margin-left-1 
          mm-box--display-inline-block 
          "
          :class="details.change24h>= 0?'mm-box--color-success-default':'mm-box--color-error-default'"
        >
          {{ details.change24h}}%
        </p>
        <p
          class="mm-box mm-text mm-text--body-md-medium mm-box--display-inline-block mm-box--color-text-alternative"
        >
          {{newTime}}
        </p>
      </div>
    </div>
    <div class="chart-container">
      <div id="main" ref="chartDom"></div>
    </div>
    
     <div class="timelist p16 "> 
        <div class="timelist_it mm-text--body-sm-medium mm-box--color-text-alternative" 
        v-for="(it,i) in timeList" :key="i"
        :class="{'time-range-button__selected':timeKey==i}"
        @click="onTimeSelect(i)"
        >
            {{ it }}
        </div>
    </div> 
    <div class="setList">
        <button class="icon-button eth-overview__button" 
        data-testid="eth-overview-buy" 
        v-for="(it) in setList" @click="setListChange(it.id)"
            :key="it.id">
            <div data-theme="light" 
            class="icon-button__circle eth-overview__icon-button">
                <iconimgVue :url="it.img"
                    class="mm-box mm-icon ts mm-icon--size-sm mm-box--display-inline-block mm-box--color-primary-inverse">
                </iconimgVue>
                <!-- <span class="mm-box mm-icon mm-icon--size-sm mm-box--display-inline-block mm-box--color-primary-inverse" 
                :style="`mask-image: url(&quot;./images/icons/plus-minus.svg&quot;);`"></span> -->
            </div>
            <p
                class="mm-box mm-text icon-button__label mm-text--body-sm mm-text--ellipsis mm-box--color-text-default">
                {{ it.name }}
            </p>
        </button>
    </div>
    <div class="p16">
     
        <h3 class="mm-box mm-text mm-text--heading-md 
            mm-box--padding-bottom-2 
            mm-box--padding-left-4 mm-box--color-text-default">
          {{ $t('asset.balanceTitle') }}
        </h3>


        <div class="mm-box mm-box--display-flex mm-box--gap-4 
        mm-box--flex-direction-row mm-box--width-full mm-box--height-full">
            <a class="mm-box mm-box--padding-top-2 
            mm-box--padding-right-4 mm-box--padding-bottom-2 
            mm-box--padding-left-4 mm-box--display-flex 
            mm-box--flex-direction-row mm-box--width-full" 
            data-testid="multichain-token-list-button" style="height: 62px; cursor: auto; 
            background-color: transparent; transition: background-color 0.2s ease-in-out;">
                <div 
                    class="mm-box mm-badge-wrapper mm-box--margin-right-4 
                    mm-box--display-inline-block" style="align-self: center;margin-right: 16px;">
                        <div class="mm-box mm-text mm-avatar-base 
                        mm-avatar-base--size-md mm-avatar-token mm-text--body-sm 
                        mm-text--text-transform-uppercase mm-box--display-flex 
                        mm-box--justify-content-center mm-box--align-items-center 
                        mm-box--color-text-default mm-box--background-color-background-muted 
                        mm-box--rounded-full">
                            

                            <img
                              :src="this.dbitem.iconUrl"
                              alt="token icon"
                              class="token-icon"
                              @error="onTokenIconError($event)"
                            />
                        </div>
                        <div class="mm-box mm-badge-wrapper__badge-container rsmallicon
                        mm-badge-wrapper__badge-container--rectangular-bottom-right">
                            <div class="mm-box mm-text mm-avatar-base 
                            mm-avatar-base--size-xs mm-avatar-network 
                            mm-text--body-xs mm-text--text-transform-uppercase 
                            mm-box--display-flex mm-box--justify-content-center 
                            mm-box--align-items-center mm-box--color-text-default 
                            mm-box--background-color-background-muted mm-box--rounded-md 
                            mm-box--border-color-background-default mm-box--border-width-2 
                            box--border-style-solid">
                              
                            <ChainIcon2
                                :chainId="this.dbitem.chainId"
                                :isTestnet="false"
                                class="chain-icon"
                              />

                                </div>
                            </div>
                        </div>
                        <div class="mm-box mm-box--display-flex 
                        mm-box--flex-direction-column mm-box--justify-content-center 
                        mm-box--width-full" style="flex-grow: 1; overflow: hidden;">
                            <div class="mm-box mm-box--display-flex 
                            mm-box--flex-direction-row mm-box--justify-content-space-between">
                                <p class="mm-box mm-text mm-text--body-md 
                                mm-text--font-weight-medium mm-text--ellipsis 
                                mm-box--color-text-default">{{ details.name }}
                                    <button v-if="dbitem.isMainCoin && dbitem.chainId == '1'"
                                    class="mm-box mm-box--padding-inline-0 
                                    mm-box--padding-inline-start-1 mm-box--padding-inline-end-1 
                                    mm-box--gap-1 mm-box--background-color-transparent" 
                                    data-testid="staking-entrypoint-0x1" tabindex="0">
                                        <span class="mm-box mm-text mm-text--body-md 
                                        mm-box--color-text-default">•</span>
                                        <span class="mm-box mm-text mm-text--body-md 
                                        mm-text--font-weight-medium mm-box--padding-inline-start-1 
                                        mm-box--padding-inline-end-1 
                                        mm-box--color-primary-default">{{ $t('asset.stake') }}</span>
                                        <span class="mm-box mm-icon ts stakeSvg
                                        mm-icon--size-sm 
                                        mm-box--display-inline-block 
                                        mm-box--color-primary-default" 
                                        ></span>
                                    </button>
                                </p>
                                <p class="mm-box mm-text mm-text--body-md 
                                mm-text--font-weight-medium mm-text--ellipsis 
                                mm-text--text-align-end mm-box--color-text-default" 
                                data-testid="multichain-token-list-item-secondary-value" 
                                style="white-space: nowrap; padding-inline-start: 8px;">
                                US${{ formatBalance(dbitem.price*details.formatted) }}</p>
                            </div>
                            <div class="mm-box mm-box--display-flex 
                            mm-box--flex-direction-row 
                            mm-box--justify-content-space-between">
                            <div class="mm-box mm-box--display-flex">
                                <p class="mm-box mm-text mm-text--body-sm-medium 
                                mm-text--ellipsis " 
                                :class="details.change24h>= 0?'mm-box--color-success-default':'mm-box--color-error-default'"
                                data-testid="token-increase-decrease-percentage-0x0000000000000000000000000000000000000000">
                                {{ details.change24h }}%
                                </p>
                            </div>
                            <p class="mm-box mm-text 
                            mm-text--body-sm-medium 
                            mm-text--text-align-end 
                            mm-box--color-text-alternative" 
                            data-testid="multichain-token-list-item-value">
                            {{ (  formatSmartNumber(details.formatted, { decimals: 4 }) +' '+dbitem.symbol) }}
                            </p>
                        </div>
                    </div>
                </a>
            </div>
        <h3 class="mm-box mm-text mm-text--heading-md 
        mm-box--padding-bottom-2 
        mm-box--padding-left-4 mm-box--color-text-default">{{ $t('asset.tokenDetails') }}</h3>
        <div class="mm-box mm-box--display-flex mt12px
        mm-box--justify-content-space-between">
            <p class="mm-box mm-text 
            mm-text--body-md-medium 
            mm-box--color-text-alternative">{{ $t('asset.network') }}</p>
            <div class="mm-box mm-text 
            mm-text--body-md mm-box--display-flex 
            mm-box--gap-1 mm-box--align-items-center 
            mm-box--color-text-default" data-testid="asset-network">
                <div>
                </div>
                {{ getNameByChainId2() }}
            </div>
        </div>
        <div class="mm-box mm-box--display-flex mt12px
        mm-box--justify-content-space-between">
            <p class="mm-box mm-text mm-text--body-md-medium 
            mm-box--color-text-alternative">{{ $t('asset.spendingCap') }}</p>
            <a class="mm-box mm-text mm-button-base 
            asset-page__spending-caps mm-text--body-md-medium mm-button-link 
            mm-button-link--size-auto mm-text--body-md-medium 
            mm-box--padding-0 mm-box--padding-right-0 
            mm-box--padding-left-0 mm-box--display-inline-flex 
            mm-box--justify-content-center mm-box--align-items-center 
            mm-box--color-primary-default mm-box--background-color-transparent" 
            href="https://portfolio.metamask.io/?metamaskEntry=asset_page&amp;metametricsId=0x90f3346b1d4226d7a4a6f6188cfd7b89cc71620bdeb47c62abae8570b8d94126&amp;metricsEnabled=true&amp;marketingEnabled=true&amp;accountAddress=0x9b5e3e15d28b856ee1077370bbbb303b2d95ee52&amp;tab=spending-caps" 
            target="_blank" rel="noopener noreferrer">{{ $t('asset.editInPortfolio') }}</a>
        </div>
        <h3 class="mm-box mm-text mm-text--heading-md 
        mm-box--padding-bottom-2 
        mm-box--padding-left-4 mm-box--color-text-default">{{ $t('asset.marketDetail') }}</h3>
        <div class="mm-box mm-box--display-flex mt12px
        mm-box--justify-content-space-between">
            <p class="mm-box mm-text 
            mm-text--body-md-medium 
            mm-box--color-text-alternative">{{ $t('asset.marketCap') }}</p>
            <p class="mm-box mm-text mm-text--body-md 
            mm-box--color-text-default" 
            data-testid="asset-market-cap">{{ formatLargeNumber(details.marketCap) }}</p>
        </div>
        <div class="mm-box mm-box--display-flex mt12px
        mm-box--justify-content-space-between">
            <p class="mm-box mm-text 
            mm-text--body-md-medium 
            mm-box--color-text-alternative">{{ $t('asset.totalVolume') }}</p>
            <p class="mm-box mm-text mm-text--body-md 
            mm-box--color-text-default" 
            data-testid="asset-market-cap">{{ formatLargeNumber(details.volume) }}</p>
        </div>
        <div class="mm-box mm-box--display-flex mt12px
        mm-box--justify-content-space-between">
            <p class="mm-box mm-text 
            mm-text--body-md-medium 
            mm-box--color-text-alternative">{{ $t('asset.circulatingSupply') }}</p>
            <p class="mm-box mm-text mm-text--body-md 
            mm-box--color-text-default" 
            data-testid="asset-market-cap">{{ formatLargeNumber(details.marketCap) }}</p>
        </div>
        <div class="mm-box mm-box--display-flex mt12px
        mm-box--justify-content-space-between">
            <p class="mm-box mm-text 
            mm-text--body-md-medium 
            mm-box--color-text-alternative">{{ $t('asset.allTimeHigh') }}</p>
            <p class="mm-box mm-text mm-text--body-md 
            mm-box--color-text-default" 
            data-testid="asset-market-cap">{{ formatPrice(details.ath) }}</p>
        </div>
        <div class="mm-box mm-box--display-flex mt12px
        mm-box--justify-content-space-between">
            <p class="mm-box mm-text 
            mm-text--body-md-medium 
            mm-box--color-text-alternative">{{ $t('asset.allTimeLow') }}</p>
            <p class="mm-box mm-text mm-text--body-md 
            mm-box--color-text-default" 
            data-testid="asset-market-cap">{{ formatPrice(details.atl) }}</p>
        </div>
        <h3 class="mm-box mm-text mm-text--heading-md 
        mm-box--padding-bottom-2 
        mm-box--padding-left-4 mm-box--color-text-default">{{ $t('asset.yourActivity') }}</h3>

        
    </div>

  </div>
</template>
<style scoped lang="scss">
.dbdetails {
  width: 100vw;
  height: 100vh;
  &_head {

    /*
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 16px 0;
    color: #686e7d;*/

    position: sticky;
    top: 0;
    z-index: 10; // 保证在内容上方
    background: white; // 避免滚动时内容透过
    padding: 16px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eee;

    &_tt {
      flex: 1;
      margin: 0 10px;
      


      .title-sub {
        font-size: 12px;
        color: #999;
        line-height: 16px;
        
      }

      .title-main {
        font-size: 16px;
        font-weight: bold;
        line-height: 20px;
        
        color: #333;
      }
      

    }

    
  }
  .p16 {
    padding: 0 16px;
    box-sizing: border-box;
  }
  .timelist{
    display: flex;
    justify-content: space-between;
    margin: 16px 0;
    width: 100%;
    &_it{
        padding: 0 16px;
        height: 24px;
        border-radius: 12px;
    }
  }
  .setList{
    margin: 12px 0;
  }
  .rsmallicon{
    right: var(--badge-wrapper-position-rectangular);
    transform: scale(1) translate(50%, 50%);
    transform-origin: 100% 100%;
  }
}
.backSvg {
  mask-image: url("@/static/icon/arrow-left.svg");
}
.more-vertical {
  mask-image: url("@/static/icon/more-vertical.svg");
}
.stakeSvg {
  mask-image: url("@/static/icon/stake.svg");
}
.eharbox {
  width: 100vh;
  height: 40vh;
}
.chart-container {
  width:  100%;       /* 父容器宽度（可调整） */
  height: 40vh;     /* 父容器高度 */
  margin: 0 auto;   /* 水平居中（可选） */
}
#main {
  width: 100%;      /* 继承父容器宽度 */
  height: 100%;     /* 继承父容器高度 */
}
.mt12px{
    margin: 12px 0;
}
.lsjbls {
    background: url('@/static/img/ramps-card-token-illustration.png') right bottom / contain no-repeat, linear-gradient(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12)), linear-gradient(90deg, rgb(1, 137, 236) 0%, rgb(75, 122, 237) 35%, rgb(103, 116, 238) 58%, rgb(112, 106, 244) 80.5%, rgb(124, 91, 252) 100%);
    margin: 0;
}
.lsjbls.newbg{
    background: url('@/static/img/ramps-card-activity-illustration.png') right bottom / contain no-repeat, linear-gradient(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12)), linear-gradient(90deg, rgb(87, 197, 220) 0%, rgb(6, 191, 221) 49.39%, rgb(53, 169, 199) 100%);
}
.token-icon {
    height: 30px;
    width: 30px;
    border-radius: 50%;
  }
  .chain-icon {
    position: absolute;
    width: 15px;
    height: 15px;
  }
  .chain-icon1 {
    
    width: 15px;
    height: 15px;
  }

  .bdbdetails_head_tt {
  display: flex;                // 使用 Flex 布局
  flex-direction: column;       // 子元素竖直排列（默认是水平排列）
  align-items: center;          // 子元素在水平方向上居中（即左右居中）
  justify-content: center;      // 子元素在垂直方向上居中（即上下居中）
  position: absolute;           // 使该元素相对定位，配合下面的居中
  left: 50%;                    // 左边到容器中心
  transform: translateX(-50%);  // 水平居中（向左平移自身一半宽度）
  top: 50%;                     // 如果你希望它上下也居中，可加这个
  transform: translate(-50%, -50%); // 同时水平 & 垂直居中
  text-align: center;           // 文字居中对齐
}

.btitle-sub {
  margin-top: 5px;
  font-size: 14px;
  color: #333;
  line-height: 16px;
}

.btitle-main {
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
  color: #333;
}

</style>