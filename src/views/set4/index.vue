<script>
import TitleBar from '@/components/common/TitleBar.vue'
import { accountManager } from "@/bbjs/AccountManager"
export default {
    components:{
      TitleBar,
      IosSwitch: () => import('@/components/common/IosSwitch.vue'), // 异步加载开关组件
    },
  data() {
    return {
       show:false
    };
  },
  methods:{
    
    tjlxxcclick() {
      // 跳转到添加联系信息页面
      this.$router.push({ path: '/set4/addContactInfo' });
    },
    
  }
};
</script>
<template>
  <div class="set-page">
    <!-- 标题栏 -->
    <div class="title-wrapper">
      <titleBar :title="$t('setting.title3')" />
    </div>

    <!-- 你的设置内容 -->
    <section class="set-section">
      <!-- 省略其余设置项 -->
    </section>

    <!-- 添加联系信息按钮 -->
    <div class="bottom-button-wrapper">
      <div class="btn-blue" @click="tjlxxcclick">
        {{ $t('setting.addContactInfo') }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.set-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 16px;
  background: #fff;
}

.bottom-button-wrapper {
  margin-top: auto;
  margin-bottom: 20px;
}

.btn-blue {
  height: 40px;
  border-radius: 40px;
  background-color: #4259FF;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}


</style>