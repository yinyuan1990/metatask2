<script>
export default {
  data() {
    return {
        aniShow:true,// 动画
        value:'',
        valTxt:'',// 
        userInfo:{}
    };
  },
  mounted(){
    this.userInfo = this.$getUser()
  },
  methods:{
    checkPsw(){
        if(this.value != this.userInfo.psw){
            this.valTxt = '密码不正确'
            return false
        }else{
            this.valTxt = ''
            return true;
        }
    },
    goHome(){
        if(!this.checkPsw()) return;
        if(!this.value) return;
        this.$router.replace({
            path:'/index'
        })
    }
  }
};
</script>
<template>
  <div id="app-content">
    <div class="app os-win">
      <div
        class="mm-box multichain-app-header 
        multichain-app-header-shadow mm-box--margin-bottom-0 
        mm-box--display-flex mm-box--align-items-center 
        mm-box--width-full mm-box--background-color-background-default"
      >
        <div
          class="mm-box multichain-app-header__lock-contents 
          mm-box--padding-2 mm-box--display-flex mm-box--gap-2 
          mm-box--justify-content-space-between mm-box--align-items-center 
          mm-box--width-full mm-box--background-color-background-default"
        >
          <div>
            <button
              class="mm-box mm-picker-network 
              multichain-app-header__contents__network-picker 
              mm-box--padding-right-2 mm-box--padding-left-2 mm-box--display-flex 
              mm-box--gap-2 mm-box--align-items-center 
              mm-box--background-color-background-alternative mm-box--rounded-pill"
              aria-label="网络菜单 Ethereum Mainnet"
              data-testid="network-display"
            >
              <div
                class="mm-box mm-text 
                mm-avatar-base mm-avatar-base--size-xs 
                mm-avatar-network mm-picker-network__avatar-network 
                mm-text--body-xs mm-text--text-transform-uppercase 
                mm-box--display-flex mm-box--justify-content-center 
                mm-box--align-items-center mm-box--color-text-default 
                mm-box--background-color-background-alternative mm-box--rounded-md 
                mm-box--border-color-background-default mm-box--border-width-1 
                box--border-style-solid"
                role="img"
              >
                <img
                  class="mm-avatar-network__network-image"
                  src="@/static/icon/eth_logo.svg"
                  alt="Ethereum Mainnet logo"
                />
              </div>
              <p
                class="mm-box mm-text 
                mm-text--body-sm mm-text--ellipsis
                mm-box--color-text-default"
              >
                Ethereum Mainnet
              </p>
              <span
                class="
                mm-box mm-picker-network__arrow-down-icon arrow-down
                mm-icon mm-icon--size-xs mm-box--margin-left-auto 
                mm-box--display-inline-block mm-box--color-icon-default"
                style=""
              ></span>
            </button>
          </div>
          <button
            class="mm-box app-header__logo-container app-header__logo-container--clickable mm-box--background-color-transparent"
            data-testid="app-header-logo"
          >
            <svg
              height="30"
              width="162"
              viewBox="0 0 696 344"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="app-header__metafox-logo--horizontal"
            >
              <path
                d="M394.102 265.407V340.812H355.162V288.57L310.786 293.73C301.039 294.854 296.75 298.041 296.75 303.912C296.75 312.512 304.892 316.136 322.344 316.136C332.985 316.136 344.773 314.553 355.184 311.824L335.026 340.353C326.885 342.165 318.95 343.06 310.579 343.06C275.262 343.06 255.103 329.024 255.103 304.119C255.103 282.149 270.95 270.613 306.956 266.531L354.519 261.004C351.951 247.175 341.516 241.167 320.762 241.167C301.291 241.167 279.78 246.143 260.539 255.431L266.662 221.696C284.55 214.22 304.938 210.367 325.532 210.367C370.825 210.367 394.148 229.173 394.148 265.384L394.102 265.407ZM43.7957 170.991L1.23138 340.812H43.7957L64.9173 255.477L101.542 299.372H145.918L182.542 255.477L203.664 340.812H246.228L203.664 170.968L123.718 265.912L43.7727 170.968L43.7957 170.991ZM203.664 1.14648L123.718 96.0905L43.7957 1.14648L1.23138 170.991H43.7957L64.9173 85.6558L101.542 129.55H145.918L182.542 85.6558L203.664 170.991H246.228L203.664 1.14648ZM496.454 263.825L462.031 258.848C453.431 257.495 450.037 254.766 450.037 250.019C450.037 242.313 458.407 238.919 475.63 238.919C495.559 238.919 513.447 243.001 532.253 251.831L527.506 218.554C512.324 213.119 494.894 210.413 476.777 210.413C434.442 210.413 411.325 225.136 411.325 251.624C411.325 272.241 424.007 283.777 450.954 287.859L485.836 293.065C494.665 294.418 498.289 297.812 498.289 303.247C498.289 310.953 490.147 314.576 473.612 314.576C451.871 314.576 428.319 309.37 409.078 300.082L412.931 333.359C429.466 339.482 450.977 343.105 471.135 343.105C514.617 343.105 537.252 327.924 537.252 300.977C537.252 279.465 524.57 267.907 496.5 263.848L496.454 263.825ZM552.388 186.15V340.812H591.329V186.15H552.388ZM636.829 271.301L690.974 212.638H642.516L591.329 273.319L645.91 340.789H695.057L636.829 271.278V271.301ZM546.953 134.297C546.953 159.203 567.111 173.238 602.429 173.238C610.799 173.238 618.734 172.321 626.876 170.532L647.034 142.003C636.622 144.709 624.835 146.314 614.194 146.314C596.764 146.314 588.6 142.691 588.6 134.091C588.6 128.197 592.911 125.032 602.635 123.909L647.011 118.749V170.991H685.952V95.586C685.952 59.3513 662.629 40.5689 617.335 40.5689C596.718 40.5689 576.354 44.4217 558.466 51.8979L552.342 85.6329C571.583 76.3449 593.095 71.3684 612.565 71.3684C633.32 71.3684 643.755 77.3769 646.323 91.2057L598.759 96.7326C562.754 100.815 546.907 112.35 546.907 134.32L546.953 134.297ZM438.043 126.156C438.043 157.414 456.16 173.261 491.936 173.261C506.201 173.261 517.988 170.991 529.294 165.785L534.271 131.591C523.4 138.15 512.301 141.544 501.201 141.544C484.437 141.544 476.961 134.756 476.961 119.574V74.2809H536.06V42.8163H476.961V16.099L402.909 55.2691V74.2809H437.997V126.133L438.043 126.156ZM399.767 111.892V119.597H294.526C299.273 135.284 313.377 142.462 338.42 142.462C358.349 142.462 376.925 138.38 393.437 130.468L388.69 163.537C373.508 169.867 354.267 173.284 334.567 173.284C282.257 173.284 253.727 150.19 253.727 107.397C253.727 64.603 282.715 40.5918 327.55 40.5918C372.384 40.5918 399.79 66.6441 399.79 111.914L399.767 111.892ZM294.021 93.3155H360.574C357.065 78.2942 345.53 70.451 327.091 70.451C308.653 70.451 297.714 78.0878 294.021 93.3155Z"
                fill="rgb(22,22,22)"
              ></path></svg
            ><img
              src="@/static/icon/metamask-fox.svg"
              class="app-header__metafox-logo--icon"
              alt=""
            />
          </button>
        </div>
      </div>
      <div class="mm-box main-container-wrapper">
        <div class="unlock-page__container">
          <div class="unlock-page" data-testid="unlock-page">
            <div class="unlock-page__mascot-container">
              <hulibox></hulibox>
            </div>
            <h1
              class="mm-box mm-text mm-text--display-md 
              mm-text--font-weight-medium mm-box--margin-top-1 
              mm-box--margin-bottom-1 mm-box--color-text-default"
              data-testid="unlock-page-title"
            >
              欢迎回来！
            </h1>
            <p
              class="mm-box mm-text mm-text--body-md 
              mm-box--color-text-alternative"
            >
              即将进入去中心化网络
            </p>
            <form class="unlock-page__form">
              <div
                class="MuiFormControl-root MuiTextField-root 
                MuiFormControl-fullWidth"
              >
                <label
                  class="MuiFormLabel-root MuiInputLabel-root 
                  jss16 MuiInputLabel-formControl MuiInputLabel-animated"
                  data-shrink="false"
                  for="password"
                  id="password-label"
                  :class="aniShow?'anshow':'anhide'"
                  >密码</label
                >
                <div
                  class="MuiInputBase-root MuiInput-root 
                  MuiInput-underline jss18 MuiInputBase-fullWidth 
                  MuiInput-fullWidth MuiInputBase-formControl MuiInput-formControl"
                >
                  <input
                    aria-invalid="false"
                    autocomplete="current-password"
                    id="password"
                    v-model="value"
                    type="password"
                    dir="auto"
                    data-testid="unlock-password"
                    class="MuiInputBase-input MuiInput-input"
                  />
                </div>
                <p class="MuiFormHelperText-root Mui-error MuiFormHelperText-filled" v-if="valTxt"
                id="password-helper-text">
                    {{ valTxt }}
                </p>
              </div>
            </form>
            <button
              class="button btn--rounded btn-default"
              data-testid="unlock-submit"
              variant="contained"
              :class="value?'valueok':''"
              @click="goHome"
              style="
                background-color: var(--color-primary-default);
                color: var(--color-primary-inverse);
                margin-top: 20px;
                height: 56px;
                font-weight: 500;
                box-shadow: none;
                border-radius: 100px;
              "
            >
              登录
            </button>
            <div class="unlock-page__links">
              <a
                class="button btn-link unlock-page__link"
                role="button"
                tabindex="0"
                >忘记密码了？</a
              >
            </div>
            <div class="unlock-page__support">
              <span>
                需要帮助？请联系
                <a
                  href="https://support.metamask.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  >MetaMask 支持</a
                >
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.login {
  width: 100vw;
  height: 100vh;
}
.arrow-down{
    mask-image: url('@/static/icon/arrow-down.svg')
}

.MuiInputBase-input {
    font: inherit;
    color: currentColor;
    width: 100%;
    border: 0;
    height: 1.1876em;
    margin: 0;
    display: block;
    padding: 6px 0 7px;
    min-width: 0;
    background: none;
    box-sizing: content-box;
    animation-name: mui-auto-fill-cancel;
    letter-spacing: inherit;
    animation-duration: 10ms;
    -webkit-tap-highlight-color: transparent;
}
.MuiInput-input, .MuiInputBase-input {
    color: var(--color-text-default) !important;
}
label + .MuiInput-formControl {
    margin-top: 16px;
}

.MuiInput-root {
    position: relative;
}

.MuiInputBase-fullWidth {
    width: 100%;
}

.MuiInputBase-root {
    color: rgba(0, 0, 0, 0.87);
    cursor: text;
    display: inline-flex;
    position: relative;
    font-size: 1rem;
    box-sizing: border-box;
    align-items: center;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1.1876em;
    letter-spacing: 0.00938em;
}
.multichain-app-header__lock-contents{
    height: 68px;
}
.MuiInput-underline:before {
    left: 0;
    right: 0;
    bottom: 0;
    content: "\00a0";
    position: absolute;
    transition: border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-bottom: 1px solid rgba(0, 0, 0, 0.42);
    pointer-events: none;
}
.jss18:before {
    border-bottom: 1px solid var(--color-text-default) !important;
}
.MuiInput-underline:after {
    left: 0;
    right: 0;
    bottom: 0;
    content: "";
    position: absolute;
    transform: scaleX(0);
    transition: transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;
    border-bottom: 2px solid #3f51b5;
    pointer-events: none;
}
.jss18:after {
    border-bottom: 2px solid var(--color-primary-default);
}
.jss16 {
    color: var(--color-text-alternative);
    font-weight: 400;
}
.jss16.jss17 {
  color: var(--color-text-alternative);
}
.MuiInputLabel-root {
    display: block;
    transform-origin: top left;
}
.MuiInputLabel-formControl {
    top: -23px;
    left: 0;
    position: absolute;
    transform: translate(0, 24px) scale(1);
}
.MuiInputLabel-animated {
    transition: color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;
}
// .MuiInputLabel-animated.anshow{
//     animation: jinrux 0.5s linear 1 1;
// }
// .MuiInputLabel-animated.anhide{
//     animation: jinruxhide 0.5s linear 1 1;
// }

.MuiFormControl-root {
    border: 0;
    margin: 0;
    display: inline-flex;
    padding: 0;
    position: relative;
    min-width: 0;
    flex-direction: column;
    vertical-align: top;
}
.MuiFormControl-fullWidth {
    width: 100%;
}
.btn--rounded.valueok{
    opacity: 1;
}

</style>
