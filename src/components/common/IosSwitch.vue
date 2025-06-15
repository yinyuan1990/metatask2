<template>
  <label class="switch">
    <input type="checkbox" v-model="value" />
    <span class="slider" />
  </label>
</template>

<script>
export default {
  name: 'IosSwitch',
  props: {
    value: Boolean
  }
}
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 22px; /* 为容纳按钮的垂直溢出做出调整 */
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  top: 2px; /* 垂直居中背景 */
  left: 0;
  right: 0;
  height: 18px;
  background-color: #E2E4E7;
  border-radius: 18px;
  transition: background-color 0.4s;
}

.slider:before {
  content: "";
  position: absolute;
  width: 22px;
  height: 22px;
  left: 0;
  top: -2px; /* 向上偏移 2px 形成超出效果 */
  background-color: #fff;
  border-radius: 50%;
  transition: transform 0.4s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

input:checked + .slider {
  background-color: #4259FF;
}

input:checked + .slider:before {
  transform: translateX(14px);
}
</style>
