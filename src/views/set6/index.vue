<script>
import TitleBar from '@/components/common/TitleBar.vue'
export default {
    components:{
      TitleBar,
    },
  data() {
    return {
       show:false
    };
  },
  methods:{
    
  }
};
</script>
<template>
   <div class="set-page">

    <div class="fixed-top">
      <TitleBar :title="$t('setting.title6')" />
    </div>

    <div class="region-container">
    <p class="current-region">当前地区</p>
    <p class="no-region">未选择地区</p>
  </div>
   
  </div>
</template>
<style scoped lang="scss">
.region-container {
  padding: 20px 10px;
}

.current-region {
  /* P1 样式，字体大小大一些，粗一点 */
  font-size: 20px;  /* 根据你的 P1 规范调整 */
  font-weight: 600;
  margin-top: 20px;
  color: #000;
}

.no-region {
  /* P2 样式，字体稍小，颜色灰色 */
  font-size: 16px;  /* 根据你的 P2 规范调整 */
  font-weight: 400;
  color: #666;
  margin-top: 20px;
  margin-left: 20px;
}
</style>