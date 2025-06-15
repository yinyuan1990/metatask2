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
       show:false,
       name: '',
      address: '',
      note: ''
    };
  },
  methods:{
    tjlxxxclick() {
      // 添加处理逻辑
      console.log('添加联系信息:', this.name, this.address, this.note)
    }
  }
};
</script>
<template>
   <div class="set-page">
    <!-- 标题栏 -->
    <div class="title-wrapper">
      <titleBar :title="$t('setting.addContactInfo')" />
    </div>

 <section class="set-section scroll-content">
    <div class="contact-form">
    <!-- 名称 -->
    <h2 class="p1">{{ $t('setting.contactName') }}</h2>
    <input class="input-field" v-model="name" :placeholder="$t('setting.contactNamePlaceholder')" />

    <!-- 地址 -->
    <h2 class="p1">{{ $t('setting.contactAddress') }}</h2>
    <input class="input-field" v-model="address" :placeholder="$t('setting.contactAddressPlaceholder')" />

    <!-- 备注 -->
    <h2 class="p1">{{ $t('setting.contactNote') }}</h2>
    <input class="input-field" v-model="note" :placeholder="$t('setting.contactNotePlaceholder')" />

     
    <div class="spacing-30"></div> 
    <!-- 添加联系信息按钮 -->
    <div class="btn-blue mt20" @click="tjlxxxclick">
      {{ $t('setting.addContactInfo') }}
    </div>
  </div>

 </section> 

   
  </div>
</template>
<style scoped lang="scss">

.p1 {
  font-size: 20px;
  color: #0B0B0A;
  margin-top: 20px;
  margin-bottom: 10px;
}

.input-field {
  height: 50px;
  border-radius: 10px;
  background-color: white;
  border: 1px solid #B8BAC8;
  padding: 0 16px;
  font-size: 16px;
  color: #0B0B0A;
  width: 100%;
  box-sizing: border-box;
}

.input-field::placeholder {
  color: #B8BAC8;
}

.btn-blue {
  margin-top: 20px;
  height: 50px;
  border-radius: 40px;
  background-color: #4259FF;
  color: #B8BFFF;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}


</style>