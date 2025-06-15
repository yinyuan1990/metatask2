<template>
    <div class="page-container">
      <!-- 适配iOS状态栏 -->
      <div class="title-bar">
        <img
          src="@/static/icon/arrow-2-left.svg"
          alt="返回"
          class="icon back-icon"
          @click="backfclick"
        />
        <div class="title-text">{{ title }}</div>
        <img
          src="@/static/icon/share.png"
          alt="分享"
          class="icon share-icon"
          @click="shareclick"
        />
      </div>
  
      <iframe
        :src="url"
        class="web-content"
        frameborder="0"
        scrolling="yes"
      ></iframe>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PublicWebPage',
    props: {
      title: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },
    methods: {
      backfclick() {
        this.$router.back()
      },
      shareclick() {
        // 这里可以调用系统分享API或自定义分享逻辑
        console.log('分享网页链接:', this.url)
        // 示例：调用剪贴板复制链接
        if (navigator.clipboard) {
          navigator.clipboard.writeText(this.url).then(() => {
            //alert('链接已复制到剪贴板')
          })
        } else {
          //alert('复制失败，请手动复制链接')
        }
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
  .page-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #fff;
  }
  
  /* iOS 状态栏适配占位，42px 高度，适配刘海等 */
  .title-bar {
    height: 60px;
    padding-top: env(safe-area-inset-top);
    padding-left: 20px;
    padding-right: 20px;
    
  
    display: flex;
    align-items: center;
    justify-content: space-between;
  
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 10;
    
  }
  
  .icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
    user-select: none;
  }
  
  .back-icon {
    flex-shrink: 0;
  }
  
  .share-icon {
    flex-shrink: 0;
  }
  
  .title-text {
    flex: 1;
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    color: #000;
    user-select: none;
  }
  
  /* iframe 占满剩余空间 */
  .web-content {
    flex: 1;
    width: 100%;
    border: none;
    /* 适配移动端安全区 */
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: border-box;
  }
  </style>
  