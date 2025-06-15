<template>
  <div class="chain-icon">
    <template v-if="isTestnetIcon">
      <div class="testnet-icon" :style="{ backgroundColor: testnetColor }">
        <span class="label">{{ testnetLabel }}</span>
      </div>
    </template>
    <template v-else>
      <img :src="logoURI" alt="chain" />
    </template>
  </div>
</template>

<script>
import { chainDefaultAssetMap } from '@/bbjs/chain-default-assets'

export default {
  props: {
    chainId: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    isTestnetIcon() {
      return ['11155111', '59141', '2710'].includes(String(this.chainId))
    },
    testnetColor() {
      const map = {
        '11155111': '#CEB5EE',
        '59141': '#5FE0FE',
        '2710': '#DED9D9'
      }
      return map[String(this.chainId)] || '#ccc'
    },
    testnetLabel() {
      const map = {
        '11155111': 'S',
        '59141': 'L',
        '2710': 'M'
      }
      return map[String(this.chainId)] || '?'
    },
    logoURI() {
      const localLogoMap = {
          '1': require('@/assets/icons/eth_logo.svg'),
          '56': require('@/assets/icons/bnb.svg'),
          '137': require('@/assets/icons/pol-token.svg'),
          '10': require('@/assets/icons/optimism.svg'),
          '42161': require('@/assets/icons/arbitrum.svg'),
          '43114': require('@/assets/icons/avax-token.svg'),
          '250': require('@/assets/icons/fantom-opera.svg'),
          '25': require('@/assets/icons/cronos.svg'),
          '324': require('@/assets/icons/zk-sync.svg'),
          '8453': require('@/assets/icons/base.svg'),
          // 继续添加
      }

      return localLogoMap[String(this.chainId)] || ''
    }
  }
}
</script>

<style scoped lang="scss">
.chain-icon {
  width: 100%;
  height: 100%;
}

.chain-icon img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: contain;
}

.testnet-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  font-size: 0.5em; /* 相对字体大小，跟宽高相关 */
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
