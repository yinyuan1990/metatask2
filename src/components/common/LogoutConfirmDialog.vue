<template>
    <div class="overlay" @click.self="closeDialog">
      <div class="dialog-container">
        <div class="dialog-title">{{ $t('setting.title') }}</div>
        <div class="btn-group">
          <button class="btn cancel" @click="closeDialog">{{ $t('setting.no') }}</button>
          <button class="btn confirm" @click="confirmLogout">{{ $t('setting.yes') }}</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
   import { accountManager,save } from "@/bbjs/AccountManager";
  export default {
    name: 'LogoutConfirmDialog',
    methods: {
      closeDialog() {
        this.$emit('close')
      },
      confirmLogout() {



        var operate = accountManager.deleteCurrentAccount()

        if(operate){


          this.$toast.success("操作成功");
          if (accountManager.getAllAccounts().length === 0) {
            // 清空当前缓存和状态（如果有 Vuex，也一起清理）
            localStorage.clear()
            // 强制跳转登录页并清空历史记录
            this.$router.replace({ path: '/login' })
            
            // ⏱️ 等 DOM 渲染完成后刷新整个页面，彻底干掉导航栈
            setTimeout(() => {
              location.reload()
            }, 100)

          }else{

            
            EventBus.$emit('deleteAccount');
            this.$emit('close')
             
          }

          
        }else{
          this.$toast.fail("操作失败");
        }


        
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
  .overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .dialog-container {
    background: #fff;
    width: calc(100vw - 40px); /* 屏幕宽度减去左右 margin 20px */
    height: 20vh; /* 屏幕高度的1/4 */
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .dialog-title {
    font-size: 20px;
    font-weight: 700;
    color: #000;
    /* 居中 */
    text-align: center;
  }
  
  .btn-group {
    display: flex;
    justify-content: flex-end;
    gap: 20px;
  }
  
  .btn {
    font-size: 12px;
    color: #000;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 4px;
    user-select: none;
  }
  
  .btn.cancel {
    /* 否按钮 */
  }
  
  .btn.confirm {
    /* 是按钮 */
  }
  </style>
  