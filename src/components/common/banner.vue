<template>
    <div class="banner-outer-container">
      <div class="banner-container" ref="scrollContainer">
        <div
          v-for="(item, index) in banners"
          :key="index"
          class="banner-item"
        >
          <div class="ld">
            <div class="d1">
              <img :src="item.icon" alt="icon" />
            </div>
            <div class="d2">
              <div class="desc1">
                <template v-if="Array.isArray(item.des1)">
                  <span v-for="(part, i) in item.des1" :key="i">
                    {{ getText(part) }}
                  </span>
                </template>
                <template v-else>
                  {{ getText(item.des1) }}
                </template>
              </div>
              <div class="desc2">
                {{ getText(item.des2) }}
              </div>
            </div>
          </div>
          <div
            v-if="index !== banners.length - 1"
            class="rd"
            @click="removeItem(index)"
          >
            <img src="@/static/icon/close.svg" alt="close" />
          </div>
        </div>
      </div>
  
      <div class="banner-point">
        <div
          v-for="(item, index) in banners"
          :key="'point-' + index"
          class="point"
          :class="{ active: index === currentIndex }"
          @click="goToIndex(index)"
        ></div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Banner",
    props: {
      bannerData: {
        type: Array,
        required: true,
        default: () => [],
      },
    },
    data() {
      return {
        banners: [...this.bannerData],
        currentIndex: 0,
      };
    },
    watch: {
      bannerData(newVal) {
        this.banners = [...newVal];
        if (this.currentIndex >= this.banners.length) {
          this.currentIndex = this.banners.length - 1;
        }
      },
    },
    methods: {
      getText(text) {
        if (typeof text === "string") return text;
        if (text && text.i18nKey) return this.$t(text.i18nKey);
        return "";
      },
      removeItem(index) {
        if (this.banners.length === 1) return;
        this.banners.splice(index, 1);
        if (this.currentIndex >= this.banners.length) {
          this.currentIndex = this.banners.length - 1;
        }
        this.$emit("update:banners", this.banners);
      },
      goToIndex(index) {
        this.currentIndex = index;
        // 滚动到对应banner
        const container = this.$refs.scrollContainer;
        if (container) {
          const bannerWidth = container.clientWidth;
          container.scrollTo({
            left: bannerWidth * index,
            behavior: "smooth",
          });
        }
      },
    },
    mounted() {
      // 监听滚动同步 currentIndex（可选）
      const container = this.$refs.scrollContainer;
      if (container) {
        container.addEventListener("scroll", () => {
          const scrollLeft = container.scrollLeft;
          const bannerWidth = container.clientWidth;
          const index = Math.round(scrollLeft / bannerWidth);
          if (index !== this.currentIndex) {
            this.currentIndex = index;
          }
        });
      }
    },
  };
  </script>
  
  <style scoped>
  .banner-outer-container {
    padding: 0 20px;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden; /* 隐藏多余滚动条 */
  }
  
  .banner-container {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    width: 100%;
    -webkit-overflow-scrolling: touch; /* iOS 滚动优化 */

     /* 隐藏滚动条 - Chrome, Edge, Safari */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  }
  
  .banner-item {
    flex: 0 0 100%;
    scroll-snap-align: start;
    display: flex;
    background-color: #f4f5f9;
    border: 1px solid #e2e3e7;
    height: 80px;
    margin-bottom: 0; /* 外层间距用gap控制 */
    align-items: center;
    padding: 0 10px;
    box-sizing: border-box;
    position: relative;
    border-radius: 10px;
  }
  
  .ld {
    display: flex;
    align-items: center;
    flex: 1;
  }
  
  .d1 {
    margin-left: 0px;
    height: 80px;
    display: flex;
    align-items: center;
  }
  
  .d1 img {
    height: 80px;
    width: auto;
    display: block;
  }
  
  .d2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    margin-left: 10px;
  }
  
  .desc1,
  .desc2 {
    font-size: 12px;
    color: #000;
  }
  
  .rd {
  position: absolute;
  top: 8px;      /* 你可以根据需要调整距离顶部的距离 */
  right: 8px;    /* 右侧距离 */
  width: 20px;   /* 关闭按钮容器大小 */
  height: 20px;
  cursor: pointer;
  user-select: none;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: transparent;
  border-radius: 50%; /* 如果需要圆形按钮 */
}

.rd img {
  width: 10px;    /* 关闭图标大小 */
  height: 10px;
  display: block;
}
  
  .banner-point {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    gap: 5px;
    width: 100%;
    box-sizing: border-box;
  }
  
  .point {
    width: 5px;
    height: 5px;
    background-color: #9ca0ae;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .point.active {
    background-color: #101415;
  }
  </style>
  