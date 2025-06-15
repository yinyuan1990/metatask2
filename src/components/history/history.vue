<template>
    <div class="tx-history-list" ref="scrollContainer">
      <div class="scroll-content">
        <div v-for="(item, index) in records" :key="item.txHash" class="tx-item">
          <!-- i1 -->
          <div class="i1">
            <span class="tx-id">#{{ index + 1 }}</span>
            <span class="tx-date">
              {{ formatTimestamp(item.timestamp) }} {{ $t('history.fromThisDevice') }}
            </span>
          </div>
  
          <!-- i2 -->
          <div class="i2">
            <!-- i2-1 图标 + 链图标 -->
            <div class="i2-1">
              <img src="@/static/icon/sendcoin.png" class="main-icon" />
              <ChainIcon2 :chainId="item.chainId" class="chain-icon" />
            </div>
  
            <!-- i2-2 文本内容 -->
            <div class="i2-2">
              <!-- i2-2-1 -->
              <div class="i2-2-1">
                <span class="i2-2-1-1">
                  {{ $t('history.sent') }} {{ item.name }} {{ $t('history.unit') }}
                </span>
                <span class="i2-2-1-2">
                  ${{ formatSmartNumber(item.amount * item.price, { decimals: 4 }) }}
                </span>
              </div>
  
              <!-- i2-2-2 -->
              <div class="i2-2-2">
                <span class="i2-2-2-1" :class="statusClass(item.status)">
                  {{ getStatusText(item.status) }}
                </span>
                <span class="i2-2-2-2">
                  {{ item.amount }} {{ item.symbol }}
                </span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 链跳转 -->
        <div class="tx-footer" @click="goToExplorer">
          {{ $t('history.viewOnExplorer') }} {{ getChainName() }}scan
        </div>
  
        <!-- 市场说明 -->
        <div class="tx-hint">
          {{ $t('history.marketDisclaimer') }}
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import BScroll from 'better-scroll'

  import ChainIcon2 from '@/components/common/ChainIcon2.vue'
  import { assetManager } from "@/bbjs/AssetManager";
  import { accountManager } from '@/bbjs/AccountManager';
  import { formatSmartNumber } from '@/bbjs/utils'
  import { getSymbolByChainId, chainDefaultAssetMap,getNameByChainId,getExplorerUrlByChainId } from '@/bbjs/chain-default-assets'
  import { TxRecordManager } from '@/bbjs/TxRecordManager'

  export default {
    components: { ChainIcon2 },
    data() {
      return {

        chainId: accountManager.getCurrentChainId(),
        address: accountManager.getCurrentAddress().address,
        records: [],
        scroll: null
      }
    },
    mounted() {
      this.loadData(),
      
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.scrollContainer, {
          scrollY: true,
          click: true,
          probeType: 1,
          pullDownRefresh: {
            threshold: 50,
            stop: 20
          }
        })
        this.scroll.on('pullingDown', async () => {
          await this.refreshList()
          this.scroll.finishPullDown()
          this.scroll.refresh()
        })
      })
    },
    methods: {
        formatSmartNumber,
        getExplorerUrl(){


            return getExplorerUrlByChainId(this.chainId)+"/address/"+this.address

        },
        getChainName(){

            return getNameByChainId(this.chainId)
        },
      loadData() {

        TxRecordManager.csLogin()
        this.records = TxRecordManager.getRecords(this.chainId, this.address)
      },
      async refreshList() {
        this.loadData()
      },
      formatTimestamp(ts) {
        const d = new Date(ts)
        return `${d.getMonth() + 1}月${d.getDate()}日于${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')} ${d.getHours() < 12 ? 'am' : 'pm'}`
      },
      getStatusText(status) {
        return status === 'confirmed' ? '已确认' : status === 'failed' ? '交易失败' : '待确认'
      },
      statusClass(status) {
        return {
          confirmed: 'status-green',
          failed: 'status-red',
          pending: 'status-gray'
        }[status] || 'status-gray'
      },
      goToExplorer() {
        const url = this.getExplorerUrl()
        window.open(url, '_blank')
      }
    }
  }
  </script>
  
  <style scoped>
  .tx-history-list {
    height: 100vh;
    overflow: hidden;
  }
  .scroll-content {
    padding: 16px;
  }
  .tx-item {
    margin-bottom: 20px;
  }
  .i1 {
    font-size: 10px;
    color: #999;
    margin-bottom: 10px;
  }
  .i2 {
    display: flex;
  }
  .i2-1 {
    position: relative;
    width: 40px;
    height: 40px;
  }
  .main-icon {
    width: 40px;
    height: 40px;
  }
  .chain-icon {
    width: 15px;
    height: 15px;
    position: absolute;
    top: 0;
    right: 0;
  }
  .i2-2 {
    margin-left: 20px;
    flex: 1;
  }
  .i2-2-1 {
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    font-weight: bold;
    color: #000;
  }
  .i2-2-1-2 {
    font-size: 18px;
    color: #999;
  }
  .i2-2-2 {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  .i2-2-2-1 {
    font-size: 18px;
    color: #1C7E33;
  }
  .i2-2-2-2 {
    font-size: 18px;
    color: #686E7D;
  }
  .tx-footer {
    text-align: center;
    color: #4259FF;
    font-size: 16px;
    margin-top: 20px;
    cursor: pointer;
  }
  .tx-hint {
    font-size: 14px;
    color: #888;
    text-align: center;
    margin-top: 16px;
    padding: 0 12px;
    line-height: 1.5;
  }
  </style>
  