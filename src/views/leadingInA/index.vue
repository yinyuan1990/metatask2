<template>
  <div class="page leading-in-a f-14">
    <div class="text-right bg-box">
      <img
        class="head-close p-13 box-set"
        alt=""
        src="@/static/icon/close.svg"
        @click="goBack"
      />
    </div>

    <div class="flex-auto" style="margin-top: -1px;">
      <div class="bg-box p-13">
        <img class="dao-ru box-set" alt="" src="@/static/icon/daoru.svg" />
        <div class="tit-1">{{ $t('importAccount.title') }}</div>
        <div class="f-12 text-line mb-10">{{ $t('importAccount.warn1') }}</div>
        <div class="f-12 text-line mb-10">{{ $t('importAccount.warn2') }}</div>
      </div>

      <div class="bg-f-part">
        <div class="f-16 bold">{{ $t('importAccount.pasteKey') }}</div>
          <!-- ✅ 改为 textarea 可自动换行 -->
        <textarea
          v-model="privateKeyInput"
          :placeholder="$t('importAccount.example')"
          class="private-key-textarea"
          rows="4"
        ></textarea>
        
      </div>
    </div>

    <van-button class="van-btn-reset" type="info" @click="onTap()">
      {{ $t('importAccount.import') }}
    </van-button>

     <!-- 直接在模板中用 v-if 控制显示隐藏 -->
		<Loading :active.sync="isLoading" :is-full-page="false" :can-cancel="false" :opacity="0.7" color="#4259ff" loader="spinner" width="64" height="64" />
  </div>
</template>

<script>
import { accountManager } from '@/bbjs/AccountManager'
export default {
  data() {
    return {
      isLoading: false,
      privateKeyInput: '',
    }
  },
  methods: {
    async onTap() {
      let cleaned = this.privateKeyInput?.trim() || ''

      if (/^0x[0-9a-fA-F]{64}$/.test(cleaned)) {
        // 合法私钥（带 0x）
      } else if (/^[0-9a-fA-F]{64}$/.test(cleaned)) {
        cleaned = '0x' + cleaned
      } else {
        return this.$toast?.fail?.('请输入有效的助记词或私钥')
      }


      this.isLoading = true

      await this.$nextTick(); 
      
      // TODO: 执行导入逻辑
      try {
				await accountManager.importPrivateKey(cleaned,accountManager.getCurrentAccount().payPassword);
        this.$toast.success(this.$t('assetManager.addSuccess'))
			} catch (err) {
				console.error(err);

			} finally {
				this.isLoading = false;
			}
      

      
    },
    goBack() {
      this.$router.back()
    },
  },
}
</script>

<style scoped lang="scss">
@import "~@/static/style/base.css";

.bg-box {
  background: #f5f5f5;
}

.leading-in-a {
  .head-close {
    width: 20px;
  }

  .dao-ru {
    width: 32px;
  }

  .text-line {
    line-height: 18px;
  }

  .tit-1 {
    padding: 13px 0 30px;
    font-size: 20px;
  }

  .bg-f-part {
    padding: 25px 13px 13px;
  }

  .private-key-input {
    font-size: 16px;
    width: 100%;
    height: 120px;
    border: 1px solid #f5f5f5;
    border-radius: 10px;
    padding: 12px;
    box-sizing: border-box;
    margin: 15px 0 30px;
    background-color: #fafafa;
    resize: none;
  }
  .private-key-textarea {
  font-size: 16px;
  width: 100%;
  border: 1px solid #f5f5f5;
  border-radius: 10px;
  padding: 12px;
  box-sizing: border-box;
  margin: 15px 0 30px;
  background-color: #fafafa;
  resize: vertical;
}


  .van-btn-reset {
    font-size: 18px;
    margin: 13px;
    height: 50px;
  }
}
</style>
