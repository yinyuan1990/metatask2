<script>
import tabVue from '@/components/tabbox/tab.vue'
import LogoutConfirmDialog from '@/components/common/LogoutConfirmDialog.vue'
export default {
  components: {
    tabVue,
    LogoutConfirmDialog 
  },
  data() {
    return {

        showLogoutConfirm: false,  
      list: [
        { title: this.$t('setting.general'), text: this.$t('setting.generalDesc') },
        { title: this.$t('setting.security'), text: this.$t('setting.securityDesc') },
        { title: this.$t('setting.advanced'), text: this.$t('setting.advancedDesc') },
        { title: this.$t('setting.contacts'), text: this.$t('setting.contactsDesc') },
        { title: this.$t('setting.network'), text: this.$t('setting.networkDesc') },
        { title: this.$t('setting.buySellCrypto'), text: this.$t('setting.buySellCryptoDesc') },
        { title: this.$t('setting.experimental'), text: this.$t('setting.experimentalDesc') },
        { title: this.$t('setting.metamaskIntro'), text: '' },
        { title: this.$t('setting.featureRequests'), text: '' },
        { title: this.$t('setting.contactSupport'), text: '' }
      ]
    }
  },
  methods: {
    onItemClick(item, index) {
    const routeMap = {
      [this.$t('setting.general')]: '/set1',
      [this.$t('setting.security')]: '/set2',
      [this.$t('setting.advanced')]: '/set3',
      [this.$t('setting.contacts')]: '/set4',
      [this.$t('setting.network')]: '/set5',
      [this.$t('setting.buySellCrypto')]: '/set6',
      [this.$t('setting.experimental')]: '/set7',
      [this.$t('setting.metamaskIntro')]: '/set8',
    };

    const externalUrls = {
      [this.$t('setting.featureRequests')]: 'https://community.metamask.io/c/feature-requests-ideas/',
      [this.$t('setting.contactSupport')]: 'https://support.metamask.io',
    };

    if (routeMap[item.title]) {
      this.$router.push(routeMap[item.title]);
    } else if (externalUrls[item.title]) {
      // 调用你的公共网页组件，传入标题和url

      if(item.title === this.$t('setting.featureRequests')) 
        window.location.href = 'https://community.metamask.io/c/feature-requests-ideas/';
      else if(item.title === this.$t('setting.contactSupport'))
        this.$router.push({
            name: 'wwwcom',  // 你公共网页组件的路由名
            query: {
            title: item.title,
            url: externalUrls[item.title]
            }
        });
    } else {
      this.$toast(this.$t('setting.notOpen'));
    }
  }
  }
}
</script>

<template>
  <div class="setting">
    <h1 class="h1">{{ $t('setting.title') }}</h1>

    <div class="list-container">
      <div class="list" v-for="(item, i) in list" :key="i" @click="onItemClick(item, i)">
        <div class="list_text">
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </div>
        <img
          src="@/static/icon/arrow-right.svg"
          alt=""
          class="arrow-right"
          v-if="item.title !== $t('setting.featureRequests') && item.title !== $t('setting.contactSupport')"
        />
      </div>
      <p class="p" @click="showLogoutConfirm = true">{{ $t('setting.logout') }}</p>
      
      <tabVue :active="4" />
    </div>

    <LogoutConfirmDialog v-if="showLogoutConfirm" @close="showLogoutConfirm = false" />
  </div>
</template>

<style scoped lang="scss">
.setting {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .h1 {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    line-height: 1.5;
    padding: 10px 20px;
    background: #fff;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 10;
    border-bottom: 1px solid #eee;
  }

  .list-container {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 20px;
    background: #fff;
  }

  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    //border-bottom: 1px solid #eee;
    cursor: pointer;

    .list_text {
      h3 {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        line-height: 1.5;
      }
      p {
        font-size: 14px;
        color: #6e6e6e;
        line-height: 1.5;
      }
    }

    .arrow-right {
      width: 20px;
      height: 20px;
    }
  }

  .p {
    font-size: 14px;
    color: #4459ff;
    line-height: 1.5;
    padding: 10px 20px;
    font-weight: bold;
    margin-bottom: 50px;
  }
}
</style>
