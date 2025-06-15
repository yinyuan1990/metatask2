<script>

import { accountManager } from "@/bbjs/AccountManager";

export default {
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    closeFn() {
      this.$emit("closeFn");
    },
    backFn(){
      this.$emit('backFn','addAccVueShow')
    },
    goTanFn(showtxt){ // 去弹框

      //this.$emit('nextFn',{hide:'addAccVueShow',show:showtxt})
      if(showtxt === "importVocabularyVueShow"){

         console.log("importVocabularyVueShow")
      }else{
        console.log("signttVueShow")
      }

    },
    /*
    async createEth(){
      console.log("createEth")
      this.isLoading=true
      await accountManager.createFromMnemonic(accountManager.getCurrentAccount().payPassword)
      this.isLoading=false
      this.$emit("createEth");
       
    },*/
    async createEth() {
      console.log("createEth")
      //this.isLoading = true;

      //await this.$nextTick(); // 等 Vue 渲染完 isLoading = true

      // 再加一个小延迟，确保 Loading 组件已经挂载
      //await new Promise((resolve) => setTimeout(resolve, 50));
      
      try {
        await accountManager.createFromMnemonic(accountManager.getCurrentAccount().payPassword);
        this.$emit("createEth");
      } catch (err) {
        console.error(err);
      } finally {
        this.isLoading = false;
      }

      
    }

  },
};
</script>
<template>
  <div class="tanbox1">
    <div class="tanbox_bj1" @click="closeFn"></div>
    <div class="skypeGroups2">
      <div class="skypeGroups_head">{{ $t('account.addAccount') }}</div>
      <span class="skypeGroups_close" @click="closeFn"></span>
      <span class="skypeGroups_close back" @click="backFn"></span>
      <div class="skypeGroups_body">
        <p class="mm-box mm-text mm-text--body-sm-medium mm-box--margin-bottom-2 mm-box--color-text-alternative">
          {{ $t('account.createNewAccount') }}
        </p>
        <div class="exprotboxs" @click="createEth">
          <span class="exprotboxs_icon"></span>
          {{ $t('account.ethereumAccount') }}
        </div>

        <p class="mm-box mm-text mm-text--body-sm-medium mm-box--margin-bottom-2 mm-box--color-text-alternative">
          {{ $t('account.importWalletOrAccount') }}
        </p>
        <div class="exprotboxs" @click="goTanFn('importVocabularyVueShow')">
          <span class="exprotboxs_icon syqb"></span>
          {{ $t('account.mnemonicOrPrivateKey') }}
        </div>
        <div class="exprotboxs syq" @click="goTanFn('signttVueShow')">
          <span class="exprotboxs_icon"></span>
          {{ $t('account.privateKeyOnly') }}
        </div>

        <p class="mm-box mm-text mm-text--body-sm-medium mm-box--margin-bottom-2 mm-box--color-text-alternative">
          {{ $t('account.importWalletOrAccount') }}
        </p>
        <div class="exprotboxs">
          <span class="exprotboxs_icon qbs"></span>
          {{ $t('account.hardwareWallet') }}
        </div>
      </div>
    </div>

          <!-- 直接在模板中用 v-if 控制显示隐藏 -->
          <Loading :active.sync="isLoading" 
              :is-full-page="false" 
              :can-cancel="false" 
              :opacity="0.7" 
              color="#4259ff" 
              loader="spinner"
              width="64"
              height="64"
              />
  </div>
</template>

<style scoped lang="scss">


.tanbox1 {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 999;
}
.tanbox_bj1 {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
}


.skypeGroups2 {
  position: absolute;
  background: #ffffff;
  left: 0px;
  bottom: 0px;
  box-shadow: var(--shadow-size-lg) (--color-shadow-default);
  width: calc(100%);
  border-radius: 10px 10px 0px 0px;
  min-height: 200px;
  padding: 16px 0;
  max-height: calc(100vh - 32px);
  overflow: hidden;
  overflow-y: auto;
}

.skypeGroups_body{
    padding: 16px;

}
.syqb.exprotboxs_icon{
    mask-image: url('@/static/icon/wallet.svg');
}
.syq.exprotboxs_icon{
    mask-image: url('@/static/icon/key.svg');
}
.qbs.exprotboxs_icon{
    mask-image: url('@/static/icon/hardware.svg');
}
</style>