 // plugins/toast.js
import Vue from 'vue';
import Toast from '@/components/common/Toast.vue';

const ToastConstructor = Vue.extend(Toast);
let toastInstance;

function createToast() {
  toastInstance = new ToastConstructor();
  toastInstance.$mount(document.createElement('div'));
  document.body.appendChild(toastInstance.$el);
}

function showToast(message, duration) {
  if (!toastInstance) {
    createToast();
  }
  toastInstance.show(message, duration);
}

export default {
  install(Vue) {
    Vue.prototype.$toast = showToast;
  }
};
