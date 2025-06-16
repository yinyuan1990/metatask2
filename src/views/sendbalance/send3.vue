<template>
    <div class="transfer-page">
      <!-- 头部 -->
  
      <div class="header">
        <div class="h1" @click="goBack">{{ $t('transfer.return') }}</div>
        <div class="h2">
          <h1 class="h21">{{ $t('transfer.confirm') }}</h1>
          <h2 class="h22">{{ getNameByChainId2() }}</h2>
        </div>
        <div class="h3" @click="goBack">{{ $t('transfer.cancel') }}</div>
      </div>

 
      <div class="address-info">
        <p class="label">{{ $t('transfer.from') }}</p>
        <div class="address-box">
            <div style="position: relative; width: 40px; height: 40px;">
            <headbox :height="40" :width="40" class="avatar-wrapper"/>
            <ChainIcon2
              :chainId="chainId"
              :isTestnet="false"
              class="chain-icon"
            />
          </div>
          <div class="address-details">
            <div class="line1">
              <span class="chain-name">{{ getNameByChainId2()}}</span>
              <span class="balance">{{ $t('transfer.balance') }}</span>
            </div>
            <div class="line2">
              <span class="account-name">Account {{ fromAccountIndex + 1 }}</span>
              <span class="token-balance">{{ formattedBalance }} {{ assets.symbol }}</span>
            </div>
            <div class="line3">
              <div class="imported-tag">{{ $t('transfer.imported') }}</div>
            </div>
          </div>
        </div>

        <p class="label">{{ $t('transfer.to') }}</p>
        <div class="address-box to-address-box">
          <div class="avatar-wrapper1">
            <headbox :height="30" :width="30" />
          </div>
          <div class="to-address-text">{{ formatAddress(toAddress) }}</div>
        </div>
        
      </div>
     
  
       
      <div class="transfer-details">
        <p class="amount-label">{{ $t('transfer.amount') }}</p>
        <p class="amount-value">{{ formattedAmount }}  {{ assets.symbol }}</p>
  
        <div class="fee-box">
          <div class="fee-row">
            <span class="fee-label">{{ $t('transfer.estimatedChange') }}</span>
          </div>
          <div class="spacing-30"></div>
          <div class="fee-row fee-values">
            <span class="fee-left">{{ $t('transfer.youSend') }}</span>
            <span class="fee-right">
              <span class="fee-amount-negative">-{{ formattedAmount }}</span>
              <span class="fee-token">{{ assets.symbol }}</span>
            </span>
          </div>
          <div class="fee-row fee-total">
            <span>US${{ formattedValue }}</span>
          </div>
        </div>
  
        <div class="network-fee-box">
          <div class="fee-info-row">
            <span>{{ $t('transfer.networkFee') }}</span>
            <span class="fee-highlight" @click="showFeeDetails">{{ formatSmartNumber(networkFee, { decimals: 8 }) }} {{ mainTokenSymbol }}</span>
          </div>
          <div class="spacing-30"></div>
          <div class="fee-info-row small">
            <span style="color: #27A17C; font-size: 12px;">{{ $t('transfer.hknz') }}: <{{ estimatedSeconds }} {{ $t('transfer.seconds') }}</span>
            <span>{{ $t('transfer.maxFee') }}: {{ formatSmartNumber(networkFee, { decimals: 8 }) }} {{ mainTokenSymbol }}</span>
          </div>
          <div class="spacing-10"></div>
          <div class="divider"></div>
          <div class="fee-info-row total">
            <span>{{ $t('transfer.total') }}</span>
            <span>
              {{ totalAmount }} {{ totalTokenLabel }}
            </span>
          </div>
          <div class="max-amount" v-if="isContractToken">
            {{ $t('transfer.maxAmount') }}: {{ maxAmount }} {{ assets.symbol }} + {{ networkFee }} {{ mainTokenSymbol }}
          </div>
          <div class="max-amount" v-else>
            {{ $t('transfer.maxAmount') }}: {{ totalAmount }} {{ mainTokenSymbol }}
          </div>
        </div>
      </div>
  
      
      <button class="confirm-btn" @click="sendOkclick">
        {{ $t('transfer.confirm') }}
      </button>
   

       <!-- 直接在模板中用 v-if 控制显示隐藏 -->
    <Loading :active.sync="isLoading" 
             :is-full-page="true" 
             :can-cancel="false" 
             :opacity="0.7" 
             color="#4259ff" 
             loader="dots"
             width="64"
             height="64"
             />


    </div>
  </template>
  
  <script>
  import { getSymbolByChainId, getNameByChainId } from '@/bbjs/chain-default-assets'
  import { chainDefaultTokenMap, chainDefaultAssetMap } from '@/bbjs/chain-default-assets'
  import { isValidAddress,formatSmartNumber } from '@/bbjs/utils'
  import { networkManager } from '@/bbjs/networkManager.js'
  import Headbox from '@/components/icon/headbox.vue'
  import ChainIcon2 from '@/components/common/ChainIcon2.vue'
  import { fetchTokenPrice } from '@/bbjs/priceService'; // 请替换路径
  import { accountManager } from "@/bbjs/AccountManager";
  import {estimateGasFee,sendToken,checkTxStatus } from '@/bbjs/transferService';
  import { fetchTokenBalance } from '@/bbjs/priceService'; // 请替换路径
  import { EventBus } from '@/bbjs/bus.js';
 import { TxRecordManager } from '@/bbjs/TxRecordManager'
  export default {
    name: 'TransferConfirmPage',
    components: { Headbox, ChainIcon2 },

    data() {
      return {
        fromAccount: null,
        toAddress: '',
        assets: null,
        amount: 0,
        chainId: null,
        balance: '0',
        price: 0,
        networkFee: '0',
        isLoading: false,
        estimatedSeconds: 1,
      }
    },

    
    computed: {
      fromAccountIndex() {
        // 你可以从父组件或者账户列表中获取fromAccount下标，这里演示默认0
        return 0
      },
      formattedAmount() {
        return formatSmartNumber(this.amount, { decimals: 4 })
      },
      formattedBalance() {
        return formatSmartNumber(this.balance, { decimals: 4 })
      },
      formattedValue() {
        const val = this.amount * this.price
        return val > 0 ? formatSmartNumber(val, { decimals: 4 }) : '$0'
      },
      mainTokenSymbol() {
        // 主链币符号，比如 ETH，BNB
        const chainInfo = chainDefaultAssetMap[this.chainId]
        return chainInfo ? chainInfo.symbol : ''
      },
      maxFee() {
        // 假设最大网络费 = 1.5 * networkFee
        return (parseFloat(this.networkFee) * 1.5).toFixed(6)
      },
      totalAmount() {
        if (this.isContractToken) {
          return formatSmartNumber(parseFloat(this.amount), { decimals: 10 }) // 转账代币数量，不包含手续费
        } else {
          // 主币转账数量 + 网络手续费
          return formatSmartNumber(parseFloat(this.amount) + parseFloat(this.networkFee), { decimals: 10 })
        }
      },
      totalTokenLabel() {
        return this.isContractToken ? this.assets.symbol : this.mainTokenSymbol
      },
      maxAmount() {
        // 合约代币最大金额 = 转账代币数量
        return formatSmartNumber(parseFloat(this.amount), { decimals: 4 })
      },
      isContractToken() {
        // 判断是否合约代币（主币没有 contractAddress 或为空）
        return this.assets && this.assets.contractAddress && this.assets.contractAddress.length > 0
      }
    },
    mounted() {
      this.loadDataFromLocalStorage()
    },
    methods: {

        showFeeDetails(){

        },
        formatAddress(address, head = 6, tail = 4) {
        if (!isValidAddress(address)) return address
        return `${address.slice(0, head)}...${address.slice(-tail)}`
      },
        getNameByChainId2(){

          if(this.chainId!=null){
            return networkManager.getByChainId(this.chainId).name
          }  
          return ""
          
        },
      formatSmartNumber,
      async loadDataFromLocalStorage() {
        try {
          const dataStr = localStorage.getItem('transferDataEnd')
          if (!dataStr) {
            console.warn('transferData not found in localStorage')
            return
          }
          console.warn('transferData found in localStorage')
          const data = JSON.parse(dataStr)
          this.fromAccount = data.fromAccount || null
          this.toAddress = data.toAddress || ''
          this.assets = data.assets || null
          this.amount = data.amount || 0
          this.chainId = this.assets?.chainId || null
          this.balance = this.assets?.balance || '0'
  
          //localStorage.removeItem('transferDataEnd')
  
          await this.fetchPrice()
          this.estimateNetworkFeeAndTime()
        } catch (e) {
          console.error('读取localStorage数据失败', e)
        }
      },
      async fetchPrice() {
        if (!this.assets || !this.assets.chainId) return
        try {
          const meta = chainDefaultTokenMap[this.assets.chainId]
          if (!meta) throw new Error('无效链ID')
          
          const priceData = await fetchTokenPrice(this.assets.isMainCoin?meta.coinGeckoPlatformId:meta.coinGeckoCoinId, 
          this.assets.contractAddress, this.assets.isMainCoin?meta.coinGeckoPlatformId:meta.coinGeckoCoinId)
          this.price = priceData?.price || 0
        } catch (e) {
          console.error('获取代币价格失败', e)
          this.price = 0
        }
      },
      async estimateNetworkFeeAndTime() {

        console.log("estimateNetworkFeeAndTime "+this.networkFee)
        // 默认手续费和时间
        this.networkFee = '0'
        const chainInfo = chainDefaultAssetMap[this.assets.chainId];
            if (!chainInfo) return;
            const rpcUrl = chainInfo.rpcUrl;
            

        const fromAddress =    accountManager.getAddressByWalletIdAndChainId(this.fromAccount.walletId,this.assets.chainId).address 
        
        console.log("estimateNetworkFeeAndTime "+rpcUrl+" from address "+fromAddress)
        const feeEth = await estimateGasFee({
            rpcUrl,
            fromAddress: fromAddress,
            toAddress: this.toAddress,
            contractAddress: this.assets.contractAddress,
            amount: this.amount,
            decimals: this.assets.decimals
        })
        this.networkFee = feeEth
        console.log("estimateNetworkFeeAndTime "+this.networkFee)

        this.estimatedSeconds = (Math.random() + 3).toFixed(1)  // 字符串，保留1位小数

        // TODO: 后续可根据链ID、fromAccount地址和转账类型调用链上API动态计算
      },
      goBack() {
        this.$router.back()
      },

      async getBanlance(){

        const chainInfo = chainDefaultAssetMap[this.chainId];
            const rpcUrl = chainInfo.rpcUrl;
            const address = accountManager.getAddressByWalletIdAndChainId(this.fromAccount.walletId, this.chainId)?.address;
            if (!address){

             }else{

              console.log("look",rpcUrl,"-",address,"-",this.assets.contractAddress,"-",this.assets.decimals)
              const { formatted } = await fetchTokenBalance({
              rpcUrl,
              address,
              contractAddress: this.assets.contractAddress || '',
              decimals: this.assets.decimals || 18,
              });

              this.balance = formatted;
              console.log("zero-->  "+this.balance)
            }

            this.estimateNetworkFeeAndTime()

      },
      async sendOkclick() {
          this.isLoading = true;

          const chainInfo = chainDefaultAssetMap[this.assets.chainId];
          if (!chainInfo) return;

          const rpcUrl = chainInfo.rpcUrl;
          const privateKey = accountManager.getAddressByWalletIdAndChainId(
            this.fromAccount.walletId,
            this.assets.chainId
          ).privateKey;

          const { success, txHash, error } = await sendToken({
            rpcUrl: rpcUrl,
            privateKey: privateKey,
            to: this.toAddress,
            amount: this.amount,
            contractAddress: this.assets.contractAddress,
            decimals: this.assets.decimals,
          });

          if (success) {
            console.log('交易提交成功，txHash:', txHash);
            this.isLoading = false;

            // 3秒后检查确认状态
            await new Promise(resolve => setTimeout(resolve, 3000));
            const status = await checkTxStatus(rpcUrl, txHash);
            this.isLoading = false;

            const finalStatus = status.confirmed
              ? (status.status === 1 ? 'confirmed' : 'failed')
              : 'pending';

              console.log("saveRecord ",this.assets.chainId,"=====> "+this.fromAccount.child.address )
            // ✅ 写入交易记录
            TxRecordManager.saveRecord(this.assets.chainId, this.fromAccount.child.address, {
              txHash,
              symbol: this.assets.symbol,
              name: this.assets.name,
              amount: this.amount,
              price: this.assets.priceUsd || null,
              contractAddress: this.assets.contractAddress || '',
              status: finalStatus,
              timestamp: Date.now(),
              chainId: this.assets.chainId,
            });

            this.getBanlance(); // 更新余额

            console.log(finalStatus === 'confirmed' ? '交易成功' : '交易失败');
          } else {
            this.isLoading = false;
            console.error('交易失败原因:', error);

            // ✅ 即使失败也记录（标记 failed）
            TxRecordManager.saveRecord(this.assets.chainId, this.fromAccount.address, {
              txHash: txHash || '', // 有些失败情况没有 txHash
              symbol: this.assets.symbol,
              name: this.assets.name,
              amount: this.amount,
              price: this.assets.priceUsd || null,
              contractAddress: this.assets.contractAddress || '',
              status: 'failed',
              timestamp: Date.now(),
              chainId: this.assets.chainId,
            });
          }
        }
      ,
      async sendOkclick2() {
        // 这里触发事件或调用转账逻辑


        this.isLoading = true;

        const chainInfo = chainDefaultAssetMap[this.assets.chainId];
            if (!chainInfo) return;
            const rpcUrl = chainInfo.rpcUrl;

            const privateKey =    accountManager.getAddressByWalletIdAndChainId(this.fromAccount.walletId,this.assets.chainId).privateKey    
        const { success, txHash, error } = await sendToken({
            rpcUrl: rpcUrl,
            privateKey: privateKey,
            to: this.toAddress,
            amount: this.amount,      // 发送0.01 BNB
            contractAddress: this.assets.contractAddress, // 主币转账不传
            decimals: this.assets.decimals,
        })

        
        if (success) {
            console.log('交易提交成功，txHash:', txHash)
            this.isLoading = false;
            // 延迟3秒再查询状态
            await new Promise(resolve => setTimeout(resolve, 3000))

            const status = await checkTxStatus(rpcUrl, txHash)
            this.isLoading = false;
            if (status.confirmed) {
                console.log(status.status === 1 ? '交易成功' : '交易失败')
                this.getBanlance()
                 //this.$router.back();
                 //EventBus.$emit('back-root')
                 //console.log("join laile ---->")
                 //EventBus.$emit('danhao-1')
                 //window.location.replace('/rhome')
                 //EventBus.$emit('danhao-1')


            } else {
                console.log('交易未确认')
                this.getBanlance()
            }
            } else {
                this.isLoading = false;
            console.error('交易失败原因:', error)
            }






      }
    }
  }
  </script>
  
  <style scoped>
  .transfer-page {
    padding: 10px;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  /* 头部 */
  .header {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
  }
  
  .h1,
  .h3 {
    color: #4259ff;
    font-size: 16px;
    cursor: pointer;
    height: 40px;
    display: flex;
    align-items: center;
  }
  
  .h2 {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    flex-grow: 1;
  }
  
  .h21 {
    font-weight: 700;
    font-size: 20px;
    color: #000;
    margin: 0;
    text-align: center;
  }
  
  .h22 {
    font-weight: 400;
    font-size: 18px;
    color: #000;
    margin: 0;
  }
  
  /* 转账地址区域 */
  .address-info {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
  }
  
  .label {
    font-size: 18px;
    color: #000;
    text-align: left;
    user-select: none;
  }
  
  .address-box {
    margin-left: 5px;
    margin-right: 5px;
    border: 1px solid gray;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .avatar-wrapper {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    background: #03555e;
    display: flex;
    justify-content: center;
    align-items: center;
   
  }

  .avatar-wrapper1 {
    position: relative;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    background: #03555e;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .chain-icon {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 20px;
    height: 20px;
    z-index: 10;
  }
  
  .address-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
  
  .line1,
  .line2,
  .line3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .chain-name,
  .balance,
  .account-name,
  .token-balance {
    font-size: 18px;
    color: #000;
  }
  
  .account-name,
  .token-balance {
    font-weight: 700;
  }
  
  .imported-tag {
    border: 1px solid black;
    border-radius: 10px;
    padding: 5px 10px;
    font-size: 18px;
    color: #000;
    text-align: center;
  }
  
  /* To地址 */
  .to-address-box {
    border: 1px solid gray;
    border-radius: 10px;
    padding: 10px;
    margin-left: 5px;
    margin-right: 5px;
    display: flex;
    gap: 10px;
    align-items: center;
    user-select: none;
    height: 60px;
  }
  
  .to-address-text {
    font-size: 18px;
    color: #666;
    overflow-wrap: break-word;
  }
  
  /* 转账详情 */
  .transfer-details {
    flex: 1;
    margin-top: 10px;
    margin-bottom: 90px;
    padding: 0 15px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    gap: 10px;
  }
  
  .amount-label {
    font-size: 16px;
    color: gray;
    text-align: center;
  }
  
  .amount-value {
    font-size: 30px;
    font-weight: 700;
    color: black;
    text-align: center;
    margin-top: 20px;
  }
  
  .fee-box {
    border: 1px solid gray;
    border-radius: 10px;
    padding: 20px;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 0px;
  }
  
  .fee-row {
    font-weight: 700;
    font-size: 18px;
    color: black;
    align-items: center; 
  }
  
  .fee-values {
    display: flex;
    justify-content: space-between;
    font-weight: 400;
  }

  .fee-left{
    align-items: center; 
     
  }
   
  .fee-right{
    align-items: center; 

}
  
  .fee-amount-negative {
    background-color: #fae9eb;
    color: #952731;
    border-radius: 15px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    text-align: center;
    margin-right: 2px;
  }
  
  .fee-token {
    background-color: #F4F5F9;
    color: black;
    border-radius: 15px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    text-align: center;
  }
  
  .fee-total {
    text-align: right;
    font-weight: 400;
    margin-top: 5px;
  }
  
  .network-fee-box {
    border: 1px solid gray;
    border-radius: 10px;
    margin-top: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 0px;
    user-select: none;
  }
  
  .fee-info-row {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    font-size: 18px;
  }
  
  .fee-highlight{
    color: #4259ff;
  }

  .fee-info-row.small {
    font-weight: 400;
    font-size: 12px;
    color: gray;
    margin-top: -10px;
  }
  
  .divider {
    height: 0.5px;
    background-color: gray;
    margin: 10px 0;
  }
  
  .total {
    margin-top: 20px;
  }
  
  .max-amount {
    margin-top: 5px;
    font-weight: 700;
    font-size: 16px;
    color: black;
    text-align: right;
  }
  
  /* 底部按钮 */
  .confirm-btn {
    position: fixed;
    bottom: 30px;
    left: 20px;
    right: 20px;
    height: 40px;
    background-color: #4259ff;
    border: none;
    border-radius: 40px;
    color: white;
    font-size: 20px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.3s;
  }
  </style>
  