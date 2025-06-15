<script>
import { accountManager } from '@/bbjs/AccountManager'
import { getSymbolByChainId ,getNameByChainId} from '@/bbjs/chain-default-assets'
import { assetManager } from "@/bbjs/AssetManager";
import QRCode from 'qrcode'

import { networkManager} from '@/bbjs/networkManager.js'

export default {
  data() {
    return {
      networkName: "",
      accountName: "",
      addressDisplay: "",
      address: ''
      
    }
  },
  created() {
      this.networkName = this.getNetworkName(),
      this.accountName= 'Account'+ (this.getAccountIndex()+1),
      this.addressDisplay= this.shortAddress()
      
  },
  mounted() {
    const addr = accountManager.getCurrentAddress()?.address || ''
    this.address = addr
    this.generateQRCode(addr)
  },
  methods: {
    formatAddress(addr) {
      return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''
    },
    getAccountIndex() {
  
      return accountManager.getCurrentAccountIndex()
    },
    getNetworkName() {
      
      return networkManager.getByChainId((accountManager.getCurrentChainId())).name
    },
    shortAddress() {
      const addr = accountManager.getCurrentAddress()?.address || '0x0000...0000'
      return addr.slice(0, 6) + '...' + addr.slice(-4)
    },
    async generateQRCode(text) {
  const canvas = document.getElementById('imgqr')
  if (!canvas || !text) return

  try {
    // 1. 先生成二维码
    await QRCode.toCanvas(canvas, text, {
      width: 166,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })

    // 2. 加载图标
    const ctx = canvas.getContext('2d')
    const logo = new Image()
    logo.src = require('@/static/icon/fox.png')  // 注意路径要被 webpack 支持

    logo.onload = () => {
      const iconSize = 36 // 图标尺寸
      const x = (canvas.width - iconSize) / 2
      const y = (canvas.height - iconSize) / 2
      ctx.drawImage(logo, x, y, iconSize, iconSize)
    }
  } catch (err) {
    console.error('二维码生成失败:', err)
  }
}

  }
}
</script>

<template>
  <div class="page receive-page text-center">
    <div class="head flex-r p-13">
      <div class="flex bold">{{ $t('receive.title') }}</div>
      <img class="close" alt="close" src="@/static/icon/close.svg" @click="$router.go(-1)" />
    </div>

    <div class="flex-auto">
      <div class="f-12 c-6">{{ networkName }}</div>

      <div class="txt-btn c-main f-15">{{ $t('receive.qrTitle') }}</div>

      <div class="skypeGroups_qrcode">
        <canvas id="imgqr" class="imgqr" width="166" height="166"></canvas>
      </div>

      <div class="mm-text--body-lg-medium mm-text--text-align-center mm-box--color-text-default">
        {{ accountName }}
      </div>

      <div class="miyaob mm-text--body-lg-medium f-14 break-all">
        {{ addressDisplay }}
      </div>

      <div class="copybox f-14">
        <span class="copybox_icon mm-icon--size-sm mm-icon"></span>
        {{ $t('receive.copyAddress') }}
      </div>

      <div class="btn-line f-15">{{ $t('receive.requestPayment') }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "~@/static/style/base.css";

.receive-page {
  .head {
    padding: 13px 13px 10px 13px;
    justify-content: space-between;

    .close {
      width: 20px;
    }
  }

  .txt-btn {
    margin: 10px 50px 50px;
    padding: 10px;
    box-shadow: 0 0 10px #f5f5f5;
    border-radius: 50px;
  }

  .skypeGroups_qrcode {
    margin-bottom: 50px;
  }

  .btn-line {
    margin: 50px 20px 20px;
  }

  .miyaob {
    word-break: break-all;
    padding: 10px;
  }
}
</style>
