<script>
import tabVue from '@/components/tabbox/tab.vue'
export default {
    components:{
        tabVue,
    },
  data() {
    return {
        
    };
  },
  methods:{
    
  }
};
</script>
<template>
  <div class="setting">
    <iframe src="https://www.baidu.com" frameborder="0" style="width: 100%;height: 100%;"></iframe>
    <tabVue :active="3"></tabVue>
  </div>
</template>
<style scoped lang="scss">
.setting{
 height: 100vh;
 
}
</style>