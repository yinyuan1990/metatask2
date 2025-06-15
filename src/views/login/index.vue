<script>
import { checkPasswordStrength,copyText } from "@/static/js/common";
// import { createWallet } from "@/bbjs/walletManager"
import { accountManager } from "@/bbjs/AccountManager"
import { assetManager } from "@/bbjs/AssetManager"
import {chainDefaultTokenMap} from "@/bbjs/chain-default-assets"
import { Notify } from 'vant';
import huli from '@/components/icon/huli.vue';
import * as bip39 from 'bip39'
export default {
  components: { huli },
  data() {
    return {
      mnemonicWords: [],        // 原有助记词数组
      verifyIndexes: [],        // 新增：随机需要验证的位置（索引）
      showSecurePopup: false,
      oneCheck: true,// 登录 协议同意
      tabKey: 0,// 当前状态
      //tabKey: 3,// 当前状态
      createdOrAdd: 1,// 导入还是创建 1创建 2导入
      checkSvg: require('@/static/icon/check.svg'),
      checkSvgBold: require('@/static/icon/check-bold.svg'),
      isshowSign: false,// 是否显示私钥助记词
      isShowOneSign: true,// 是否是第一次显示
      copySvg: require('@/static/icon/copy.svg'),
      settingSvg: require('@/static/icon/setting.svg'),
      formPsw:{ // 创建密码对象
        psw1:'',// 密码
        psw1_txt:'', // 密码错误提示
        psw1_qd:'',// 密码强度
        psw2:'', // 确认密码
        psw2_txt:'',
        psw2_qd:'',
        zjctxt:'',// 助记词
        pwdzjcsy:'',// 密码
        pwdzjcsy1:'',// 密码
        
    
        shuffledWords: [],           // 打乱后的助记词
        selectedWords: [],           // 用户点击的顺序
        userVerifiedWords: [],       // 用户验证的助记词
        verifyProgress: 0            // 验证进度
        
      },
      showMim:[false,false,false], //是否显示 对应密码 确认密码 助记词
      createWallet:{ // 创建的当前钱包信息

      },
      querIsOk:false,// 确认助记词是否完成
      checked:true,
      showPassword: false,// 👈 控制显示密码
      buttonEnabled: false,          // 按钮是否启用（根据进度控制）
      selectedWordMap: new Map(), // word.name -> 上方index
      isVerifyReady: false, // 是否准备好验证助记词
      //selectedWordMap: new Set(),
      querIsOk2:false,// 确认助记词是否完成
      mstate: -1, // -1验证中 0 备份失败 1备份成功 
    };
  },
  computed:{
    isBtn2Ok(){
      return this.formPsw.psw1 && this.formPsw.psw2 && !this.formPsw.psw1_txt && !this.formPsw.psw2_txt
    },
    reorderedMnemonicWords() {
      const half = Math.ceil(this.mnemonicWords.length / 2); // 6
      const result = [];

      for (let i = 0; i < half; i++) {
        if (this.mnemonicWords[i]) {
          result.push({
            name: this.mnemonicWords[i].name,
            index: i + 1
          });
        }
        if (this.mnemonicWords[i + half]) {
          result.push({
            name: this.mnemonicWords[i + half].name,
            index: i + 1 + half
          });
        }
      }

      return result;
    }
    

  },
  created() {
    this.shuffledWords = [...this.mnemonicWords].sort(() => Math.random() - 0.5); // 打乱
    this.selectedWords = new Array(this.mnemonicWords.length).fill('');
  },
  mounted(){
    this.generateVerifyIndexes()
    // 
   let isGuide = localStorage.getItem('isGuide')
    if(!isGuide){
        this.$router.replace({
            path:'/guide'
        })
    }
   console.log( user,'--' +isGuide)
    
  //  this.createWallet = accountManager.createFromMnemonic()
  },
  methods: {

  shuffleArray(array) {

      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  },
  
  shuffleArray2(array) {
  const copy = array.map((item, index) => {
    return {
      name: item.name || item,
      uid: item.uid || `${item.name || item}-${index}`  // 如果没有 uid 就构造一个
    };
  });

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}
,
  initShuffled() {

    console.log('初始化打乱词汇', this.mnemonicWords);

   
    this.selectedWordMap.clear(); // 清空之前的选择映射
    this.formPsw.shuffledWords =this.shuffleArray2(this.mnemonicWords.map((name, idx) => ({
        name: `${name.name}` ,
        uid: `${name.name}-${idx}`  // 用 index 保证唯一
      })));
      
    this.formPsw.selectedWords = Array(12).fill(null); // 初始化空数组，记录用户点击的词
    this.formPsw.userVerifiedWords = Array(12).fill(null); // 用于记录用户点击顺序的数组
    this.formPsw.verifyProgress = 0;  // 重置进度
    this.buttonEnabled = false; // 重置按钮状态
    this.querIsOk2 = false; // 重置验证状态
    this.mstate = -1; // 重置状态
  },

  // 处理用户点击

  handleWordClick(word) {
  const key = word.uid;
  console.log('处理用户点击的单词:', key, word.name);

  if (this.selectedWordMap.has(key)) {
    const index = this.selectedWordMap.get(key);
    this.$set(this.formPsw.selectedWords, index, null);
    this.selectedWordMap.delete(key);
  } else {
    const emptyIndexes = [];
    for (let i = 0; i < 6; i++) {
      if (!this.formPsw.selectedWords[i]) emptyIndexes.push(i);
    }
    for (let i = 6; i < 12; i++) {
      if (!this.formPsw.selectedWords[i]) emptyIndexes.push(i);
    }

    if (emptyIndexes.length === 0) return;

    const targetIndex = emptyIndexes[0];
    this.$set(this.formPsw.selectedWords, targetIndex, word);
    this.selectedWordMap = new Map(this.selectedWordMap.set(key, targetIndex));
  }
  console.log(JSON.stringify(this.formPsw.selectedWords));
  this.formPsw.verifyProgress = this.formPsw.selectedWords.filter(v => v !== null).length / 12;

  if(this.formPsw.verifyProgress === 1){
      
      const isCorrect = this.formPsw.selectedWords.every((word, index) => {
        console.log('验证单词:', word?.name,"--",this.mnemonicWords[index].name);
        return word?.name === this.mnemonicWords[index].name;
      });

      if (isCorrect) {
        console.log("✅ 助记词顺序验证成功");
        this.querIsOk2 = true; // 可设置状态用于展示验证通过提示
        this.buttonEnabled = true;
        this.mstate = 1; 
      } else {
        console.log("❌ 助记词顺序错误");
        this.querIsOk2 = false;
        this.buttonEnabled = false;
        this.mstate = 0; 

      }

  }else{
    this.buttonEnabled = false;
    this.mstate = -1; 
  }


 
  

}


,

  // 检查用户输入的单词是否与原始助记词顺序一致
  checkVerification() {
    if (this.formPsw.userVerifiedWords.join(",") === this.mnemonicWords.join(",")) {
      console.log("验证通过！");
      // 可以触发成功逻辑，可能是跳转或者显示成功提示
    }
  },

  // 处理提交按钮点击
  onConfirmSecure2() {
    if (this.querIsOk2 ) {
          
        this.setAddFn('');
     
    }
  },

    async onImport() {
    // 处理私钥助记词 + 密码验证逻辑
     console.log('执行导入逻辑', this.formPsw)
    // 这里可以调用你之前写的 accountManager.importMnemonic(this.formPsw.zjctxt)
    // 并校验密码强度 / 长度 / 是否一致等

        const pwd1 = this.formPsw.pwdzjcsy?.trim();
        const pwd2 = this.formPsw.pwdzjcsy1?.trim();

        if (!pwd1 || !pwd2) {
          return Notify({ type: 'danger', message: '请输入密码和确认密码' });
        }

        if (pwd1.length < 8) {
          return Notify({ type: 'danger', message: '密码至少必须包含8个字符' });
        }

        if (pwd1 !== pwd2) {
          return Notify({ type: 'danger', message: '两次密码输入不一致' });
        }

        // 通过验证，继续处理导入逻辑
        // 你可以在这里继续调用 accountManager.importMnemonic(...)
        console.log('密码验证通过，可执行导入逻辑');

        const zjc = this.formPsw.zjctxt?.trim();
        
        try {
          let account;
          let cleaned = zjc.trim();

          // 是否助记词（按空格分隔是否是 12 或 24 个单词）
          const words = cleaned.split(/\s+/);
          if ((words.length === 12 || words.length === 24) && bip39.validateMnemonic(this.formPsw.zjctxt)) {
            // 是助记词
            account = await accountManager.importMnemonic(this.formPsw.zjctxt, pwd1);
          } else {
            // 清洗私钥（兼容带不带 0x）
            if (/^0x[0-9a-fA-F]{64}$/.test(cleaned)) {
              // 带 0x 的合法私钥
            } else if (/^[0-9a-fA-F]{64}$/.test(cleaned)) {
              // 不带 0x 的合法私钥，加上前缀
              cleaned = '0x' + cleaned;
            } else {
              return Notify({ type: 'danger', message: '请输入有效的助记词或私钥' });
            }

            // 是合法私钥
            account = await  accountManager.importPrivateKey(cleaned, pwd1);
          }

          console.log('导入的账户信息:', account);

          setTimeout(() => {
            this.$router.push({ path: '/rhome' });
          }, 500);

        } catch (e) {
          console.error(e);
          Notify({ type: 'danger', message: '导入失败，请检查内容格式是否正确' });
        }




    },
  
    generateVerifyIndexes() {
    const indexes = new Set()
    while (indexes.size < 3) {
      indexes.add(Math.floor(Math.random() * 12))
    }
    this.verifyIndexes = [...indexes]
   },
    onConfirmSecure() {
    this.showSecurePopup = false;
    this.setAddFn(''); // 或你需要执行的操作，比如进入助记词页
    },

    okSetBtn(){
      // if( this.createdOrAdd == 2 ){

      // }
      console.log( this.createWallet,'okSetBtn' )
      for(let i=0;i<this.createWallet.addresses.length;i++){
        let it = this.createWallet.addresses[i];
        console.log( it,'---createWallet-addresses' )
        //assetManager.addDefaultMainAsset( this.createWallet.walletId,it.chainId,it.address );
        let meta = chainDefaultTokenMap[ it.chainId ]
        //assetManager.addContractTokenAsset( this.createWallet.walletId,it.chainId,it.address,meta.contractAddress );
      }
      let userAddInfo = {
        ...this.createWallet,
        psw:this.formPsw.psw1,
        time: new Date().getTime()
      }
      console.log('--userAddInfo',userAddInfo)
      localStorage.setItem('userAddInfo',JSON.stringify(userAddInfo))
      // return;
      setTimeout(()=>{
        this.$router.push({
          path:'/rhome'
        })
      },500)
      
    },
    async setAddFn(type) { // 下一步

      console.log( type,'setAddFn',this.tabKey ) ;
      if (!this.oneCheck) return;
      if(this.tabKey == 4){
        console.log( type,'setAddFnjoin',this.tabKey ) ;
        this.initShuffled();

      }
      if( this.tabKey == 0 && type == 1 ){
        // this.createWallet = createWallet()
        
        //this.createWallet = await accountManager.createFromMnemonic()
        //console.log("createmm---> 2")
        //console.log(  this.createWallet  )
        // this.createWallet.mnemonic
        


      }
      if( this.tabKey ==  3){
        if(this.createdOrAdd == 2){ // 导入助记词

          this.tabKey =6
          this.mnemonicWords = this.mnemonicWords.map(it=>{
            return {
              value:'',
              name:'',
              tiptxt:''
            }
          })
        }else{
          this.tabKey += 1;
        }
      }else if(this.tabKey ==  5){

        this.createWallet.mnemonic = this.mnemonicWords.map(it=>it.value).join(' ');
        this.tabKey += 1;
        
      }else{
        this.tabKey += 1;
      }
      
      type && (this.createdOrAdd = type)
    },
    showTipTan() { // 设置提醒

    },
    goShowSign() { // 设置显示 私钥
      if (!this.isShowOneSign) {
        this.oneCheck = true;
        this.setAddFn();
        return;
      }
      this.isShowOneSign = false;
      this.isshowSign = true;
    },
    copyFn(txt) { // 复制
      copyText(txt)
    },
    // checkPwsOne(){ // 验证密码是否一致
    //   if( this.formPsw.psw1 != this.formPsw.psw2 ){
    //     this.formPsw.psw2_txt = '请确认下密码'
    //     return false;
    //   }
    // },
    zjcChangeInp(i) {
      const obj = this.mnemonicWords[i];

      // 判空
      if (!obj.value) {
        this.mnemonicWords[i].tiptxt = '请输入助记词';
        return;
      }

      // 验证助记词是否匹配
      if (obj.name !== obj.value && this.createdOrAdd === 1) {
        this.mnemonicWords[i].tiptxt = '助记词不正确';
      } else {
        this.mnemonicWords[i].tiptxt = '';
      }

      // ⬇️ 替换这里的验证数组为动态 verifyIndexes
      const arr = this.createdOrAdd === 1 ? this.verifyIndexes : Array.from({ length: 12 }, (_, i) => i);

      let borrs = true;
      for (let o = 0; o < arr.length; o++) {
        const it = this.mnemonicWords[arr[o]];
        if (
          (this.createdOrAdd === 1 && (!it.value || it.name !== it.value)) || // 创建验证
          (!it.value)                                                         // 导入验证
        ) {
          borrs = false;
          break;
        }
      }

      this.querIsOk = borrs;
    },
    blurFn(txt){ // 验证密码强度
      console.log(txt)
      
      let inpval = this.formPsw[txt];
      if( !inpval ) return;
      inpval = inpval.trim()
      this.formPsw[txt] = inpval;
      let strpsw = checkPasswordStrength(inpval);
      console.log( inpval ,strpsw)
      if( !strpsw ){
        this.formPsw[txt+'_txt'] = '密码至少为8位'
      }else{
        this.formPsw[txt+'_qd'] = strpsw
        this.formPsw[txt+'_txt'] = ''
      }
      if( txt=='psw2' ){
        if( this.formPsw.psw1 != this.formPsw.psw2 ){
          this.formPsw.psw2_txt = '密码不一致'
          return false;
        }
      }
    },
    async querenyanz() { // 确认私钥助记词
      const arr = this.createdOrAdd === 1
        ? this.verifyIndexes  // ⬅️ 使用动态随机索引
        : Array.from({ length: 12 }, (_, i) => i);

      let borrs = true;

      for (let o = 0; o < arr.length; o++) {
        const it = this.mnemonicWords[arr[o]];
        if (
          (this.createdOrAdd === 1 && (!it.value || it.name !== it.value)) ||
          (!it.value)
        ) {
          borrs = false;
          break;
        }
      }

      this.querIsOk = borrs;
      console.log(this.mnemonicWords);

      if (!this.querIsOk) return;

      // 构造助记词字符串
      const zijcStr = this.mnemonicWords.map(it => {
        return this.createdOrAdd === 1 ? it.name : it.value;
      }).join(' ');

      let errTxt;
      console.log(zijcStr, '--zijcStr');

      try {
        if (this.createdOrAdd === 2) {
          this.createWallet = await accountManager.importMnemonic(zijcStr);
        }
      } catch (error) {
        errTxt = error;
        console.error(error);
      }

      if (errTxt) {
        Notify({ type: 'danger', message: '无效助记词' });
        this.querIsOk = false;
        return;
      }

      this.setAddFn('');
    },
    async setMimaFn(){ // 设置事件
      // this.blurFn('');
      //console.log( this.formPsw,'setMimaFn' )
      //console.log( this.isBtn2Ok,'setMimaFn' )
      console.log( 
        this.isBtn2Ok,'setMimaFn',
        this.formPsw
       )
      //  debugger;
      if( !this.formPsw.psw1_txt && !this.formPsw.psw1 ){
        return
      }
      if( !this.formPsw.psw2 && !this.formPsw.psw2_txt ){
        return
      }
      if( !this.formPsw.psw1 && !this.formPsw.psw2 ){
        return
      } 
      if(!this.isBtn2Ok) return;
      // console.log( 
      //   this.isBtn2Ok,'setMimaFn'
      //  )
      this.oneCheck = true;

      
      this.createWallet = await accountManager.createFromMnemonic(this.formPsw.psw1)
        console.log(  this.createWallet  )
        // this.createWallet.mnemonic
          this.mnemonicWords = this.createWallet.mnemonic.split(' ').map(it=>{
            return {
              value:'',
              name:it,
              tiptxt:''
            }
          })


      this.setAddFn('')
    },
    filterEnglish(it) { // 设置输入只能英文
      it.value = it.value.replace(/[^a-zA-Z]/g, '')
    },
    backFnKey(){ // 返回
      if( this.tabKey == 0 ){
        localStorage.setItem('isGuide','')
        this.$router.replace({
          path:'/guide'
        })
      }else{
        this.tabKey -= 1;
      }
    },
    ipmFnShow(i){ // 显示
      console.log(i,this.showMim)
      // this.showMim[2] = !this.showMim[2]
      // this.$forceUpdate()
      this.$set(this.showMim,i,!this.showMim[i])
    },
  }
};
</script>
<template>
  <div class="app os-win">
    <div class="onboarding-app-header">
      <div class="apphead_left" @click="backFnKey">
        <i class="iconfont icon-arrow-left-full"></i>
      </div>
      <!-- <div class="apphead_cont"></div> -->
      <img src="@/static/img/metamask1.png" alt="" class="apphead_cont"/>
      <div class="apphead_right"></div>
    </div>

  

    <!-- 主体内容  <div class="onboarding-flow"> -->

     
      <div class="mm-box main-container-wrapper">  
      <div class="onboarding-flow">
        <div class="onboarding-flow__wrapper" v-if="tabKey == 0">
          <div class="onboarding-welcome" data-testid="onboarding-welcome">
            <div class="carousel-root" tabindex="0">
              <div class="carousel carousel-slider" style="width: 100%">
                <div>
                  
                  <div class="onboarding-welcome__mascot">
                    <hulibox class="hulifangfa"></hulibox>
                  </div>

                  <h2
                    class="mm-box mm-text mm-text--heading-lg mm-text--font-weight-bold mm-text--text-align-center mm-box--color-text-default">
                    钱包设置
                  </h2>
                  <p
                    style="margin-top:10px;"
                    class="mm-box mm-text mm-text--body-md 
                    mm-text--text-align-center mm-box--margin-right-6 
                    mm-box--margin-left-6 mm-box--color-text-default">
                    导入现有钱包或创建新钱包
                  </p>
                </div>
              </div>
            </div>
            <ul class="onboarding-welcome__buttons">
              <li>
                <button class="button btn--rounded btn-secondary" data-testid="onboarding-import-wallet"
                  :disabled="!oneCheck" @click="setAddFn(2)">
                  使用私钥助记词导入
                </button>
              </li>
              <li>
                <button class="button btn--rounded btn-primary" 
                data-testid="onboarding-create-wallet"
                  :disabled="!oneCheck" @click="setAddFn(1)">
                  创建新钱包
                </button>
              </li>
              
            </ul>
          </div>
        </div>
        <div class="onboarding-flow__wrapper" v-else-if="tabKey == 1">
          <div class="onboarding-metametrics" data-testid="onboarding-metametrics">
            <h2
              class="mm-box mm-text mm-text--heading-lg mm-text--font-weight-bold mm-text--text-align-center mm-box--color-text-default">
              请帮助我们改进 MetaMask</h2>
            <p
              class="mm-box mm-text onboarding-metametrics__desc mm-text--body-md mm-text--text-align-left mm-box--color-text-default">
              我们希望收集基本的使用和诊断数据，以改进 MetaMask。请注意，我们绝不会出卖您在此处提供的数据。</p>
            <div class="mm-box mm-box--padding-top-2 mm-box--padding-bottom-2"><a
                class="mm-box mm-text mm-text--body-md mm-box--color-primary-default"
                href="https://support.metamask.io/privacy-and-security/profile-privacy#how-is-the-profile-created"
                target="_blank" rel="noopener noreferrer">了解我们如何在收集您的个人资料使用数据的同时保护您的隐私。</a></div>
            <p
              class="mm-box mm-text onboarding-metametrics__desc mm-text--body-md mm-text--text-align-left mm-box--color-text-default">
              当我们收集指标时，总是...</p>
            <ul>
              <li>
                <div class="mm-box"><span
                    class="mm-box mm-icon mm-icon--size-sm mm-box--margin-inline-end-2 mm-box--display-inline-block mm-box--color-success-default"
                    :style="`mask-image: url(${checkSvg});`"></span><span> <span
                      class="mm-box mm-text mm-text--inherit mm-text--font-weight-bold mm-box--margin-top-0 mm-box--color-text-default">私密：</span>
                    会存储点击量和应用程序的浏览量，但不会存储其他详情（如您的公钥）。 </span></div>
              </li>
              <li>
                <div class="mm-box"><span
                    class="mm-box mm-icon mm-icon--size-sm mm-box--margin-inline-end-2 mm-box--display-inline-block mm-box--color-success-default"
                    :style="`mask-image: url(${checkSvg});`"></span><span> <span
                      class="mm-box mm-text mm-text--inherit mm-text--font-weight-bold mm-box--color-text-default">通用：</span>
                    我们暂时使用您的 IP 地址来检测一般位置（如您的国家或地区），但从来不会进行存储。 </span></div>
              </li>
              <li>
                <div class="mm-box"><span
                    class="mm-box mm-icon mm-icon--size-sm mm-box--margin-inline-end-2 mm-box--display-inline-block mm-box--color-success-default"
                    :style="`mask-image: url(${checkSvg});`"></span><span> <span
                      class="mm-box mm-text mm-text--inherit mm-text--font-weight-bold mm-box--color-text-default">可选：</span>
                    您可以随时决定是否通过设置共享或删除您的使用数据。 </span></div>
              </li>
            </ul>
            <label
              class="mm-box mm-text mm-checkbox mm-text--body-md mm-box--padding-bottom-3 mm-box--display-inline-flex mm-box--align-items-center mm-box--color-text-default"
              for="metametrics-opt-in" data-testid="metametrics-data-collection-checkbox">
              <span class="mm-checkbox__input-wrapper"
              style="margin-right: 8px;">
                <input
                  class="mm-box mm-checkbox__input mm-checkbox__input--checked mm-box--margin-0 mm-box--margin-right-2 mm-box--display-flex mm-box--background-color-primary-default mm-box--rounded-sm mm-box--border-color-primary-default mm-box--border-width-2 box--border-style-solid"
                  type="checkbox" title="我们将使用此数据来了解您如何与我们的营销通信交互。我们可能会分享相关资讯（例如产品特点）。" id="metametrics-opt-in"
                  :checked="false">
                <span
                  class="mm-box mm-checkbox__icon mm-icon mm-icon--size-md mm-box--display-inline-block mm-box--color-primary-inverse"
                  :style="`mask-image: url(${checkSvgBold});`"></span>
              </span>
              <span>我们将使用此数据来了解您如何与我们的营销通信交互。我们可能会分享相关资讯（例如产品特点）。</span>
            </label>
            <p
              class="mm-box mm-text onboarding-metametrics__terms mm-text--body-sm mm-text--text-align-left mm-box--color-text-alternative">
              <span> 如果我们决定将这些数据用于其他目的，我们会通知您。您可以查看我们的 <a href="https://metamask.io/privacy.html" target="_blank"
                  rel="noopener noreferrer">隐私政策</a> 以了解更多信息。请记住，您可以随时转到设置并选择退出。 </span>
            </p>
            <div
              class="mm-box onboarding-metametrics__buttons mm-box--display-flex mm-box--gap-4 mm-box--flex-direction-row mm-box--width-full">
              <button
                class="mm-box mm-text mm-button-base mm-button-base--size-lg mm-button-secondary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--color-primary-default mm-box--background-color-transparent mm-box--rounded-pill mm-box--border-color-primary-default box--border-style-solid box--border-width-1"
                data-testid="metametrics-no-thanks" @click="setAddFn('')">不，谢谢
              </button>
              <button
                class="mm-box mm-text mm-button-base mm-button-base--size-lg mm-button-primary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--color-primary-inverse mm-box--background-color-primary-default mm-box--rounded-pill"
                data-theme="light" data-testid="metametrics-i-agree" @click="setAddFn('')">我同意
              </button>
            </div>
          </div>
        </div>
        <div class="onboarding-flow__wrapper" v-else-if="tabKey == 2 && createdOrAdd == 1">
          <div class="create-password__wrapper" data-testid="create-password">
            <div class="box box--margin-bottom-4 box--flex-direction-row">
              <ul class="progressbar">
                <li class="active">创建密码</li>
                <li class="">安全钱包</li>
                <li class="">确认私钥助记词</li>
              </ul>
            </div>
            <h2 class="mm-box mm-text mm-text--heading-lg mm-box--margin-bottom-3 mm-box--color-text-default">创建密码</h2>
            <h4 style="width: 64%;"
              class="mm-box mm-text mm-text--heading-sm mm-text--font-weight-normal mm-text--text-align-center mm-box--color-text-default">
              此密码将仅在此设备上解锁您的MetaMask 钱包。</h4>
            <div class="mm-box mm-box--margin-top-3 mm-box--justify-content-center">
              <div class="create-password__form">
                <div class="form-field">
                  <label class="mm-box">
                    <div class="form-field__heading">
                      <div class="mm-box form-field__heading-title mm-box--display-flex mm-box--align-items-baseline">
                        <h6
                          class="mm-box mm-text mm-text--body-sm-bold mm-box--display-inline-block mm-box--color-text-default">
                          新密码</h6>
                      </div>
                      <div class="mm-box form-field__heading-detail mm-box--margin-right-2 mm-box--text-align-end">
                        

                          <a 
                          class="mm-box mm-text mm-button-base create-password__form--password-button mm-button-link mm-button-link--size-auto mm-text--body-sm mm-box--margin-bottom-1 mm-box--padding-0 mm-box--padding-right-0 mm-box--padding-left-0 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--color-primary-default mm-box--background-color-transparent"
                          href="#" @click.prevent="showPassword = !showPassword">{{ showPassword ? '隐藏' : '显示' }}</a>
  
                        </div>
                    </div>
                    <!-- autocomplete="new-password" -->
                    <input class="form-field__input" v-model="formPsw.psw1" @blur="blurFn('psw1')"
                    
                    autocomplete="off"
                    :type="showPassword ? 'text' : 'password'" data-testid="create-password-new" />
                     <p class="MuiFormHelperText-root Mui-error MuiFormHelperText-filled" v-if="formPsw.psw1_txt"
                    id="password-helper-text">{{ formPsw.psw1_txt }}</p>
                    <h6
                      v-if="formPsw.psw1_qd"
                      class="mm-box mm-text form-field__password-strength 
                      mm-text--body-sm mm-box--color-text-default">
                      <span> 密码强度：
                        <span data-testid="weak-password" class="create-password__weak">{{formPsw.psw1_qd}}</span> 
                      </span>
                    </h6>
                    
                  </label>
                </div>
                <div class="form-field" style="margin-top: 20px;"><label class="mm-box">
                    <div class="form-field__heading">
                      <div class="mm-box form-field__heading-title mm-box--display-flex mm-box--align-items-baseline">
                        <h6
                          class="mm-box mm-text mm-text--body-sm-bold mm-box--display-inline-block mm-box--color-text-default">
                          确认密码</h6>
                      </div>
                      <div class="mm-box form-field__heading-detail mm-box--margin-right-2 mm-box--text-align-end">
                        <div class="create-password__form--checkmark">
                          <span
                            v-if="formPsw.psw2 &&  !formPsw.psw2_txt"
                            class="mm-box mm-icon mm-icon--size-md 
                            mm-box--display-inline-block mm-box--color-inherit"
                            :style="`mask-image: url(${checkSvg});`"></span>
                          </div>
                      </div>
                    </div>
                    <input class="form-field__input" type="password" v-model="formPsw.psw2" 
                    @blur="blurFn('psw2')"
                    data-testid="create-password-confirm">
                    <p class="MuiFormHelperText-root Mui-error MuiFormHelperText-filled" v-if="formPsw.psw2_txt"
                    id="password-helper-text">{{ formPsw.psw2_txt }}</p>
                    <h6 style="padding: 12px 0;"
                      class="mm-box mm-text form-field__password-strength-text mm-text--body-xs mm-box--color-text-alternative">
                      必须至少包含8个字符</h6>
                  </label></div>

                <div style="display: flex;justify-content: space-between;align-items: center;padding: 20px 0;">
                  使用指纹登录？<van-switch v-model="checked" size="20px" />
                </div>
                <div
                  class="mm-box mm-box--margin-top-4 mm-box--margin-bottom-4 mm-box--justify-content-space-between mm-box--align-items-center">
                  <label
                    class="mm-box mm-text mm-checkbox create-password__form__terms-checkbox mm-text--body-md mm-box--display-inline-flex mm-box--align-items-flex-start mm-box--color-text-default"><span
                      class="mm-checkbox__input-wrapper">
                      <input
                        class="mm-box mm-checkbox__input mm-checkbox__input--checked 
                        mm-box--margin-0 mm-box--margin-right-2 mm-box--display-flex mm-box--background-color-primary-default mm-box--rounded-sm mm-box--border-color-primary-default mm-box--border-width-2 box--border-style-solid"
                        type="checkbox" data-testid="create-password-terms">
                      <span
                        class="mm-box mm-checkbox__icon mm-icon mm-icon--size-md mm-box--display-inline-block mm-box--color-primary-inverse"
                        :style="`mask-image: url(${checkSvg});`"></span>
                    </span>
                    <span>
                      <p class="mm-box mm-text mm-text--body-md mm-box--margin-left-2 mm-box--color-text-default"><span style="margin-left: 10px;">
                          我了解 MetaMask 无法为我找回此密码。<a
                            href="https://support.metamask.io/managing-my-wallet/resetting-deleting-and-restoring/how-can-i-reset-my-password/"
                            target="_blank" rel="noopener noreferrer"><span
                              class="create-password__link-text" style="text-decoration: underline;">了解更多</span></a> </span></p>
                    </span></label>
                </div>
                <button 
                class="button 
                btn--rounded 
                btn-primary 
                btn--large 
                create-password__form--submit-button"
                :class="isBtn2Ok?'':'huibtn'"
                  data-testid="create-password-wallet" @click="setMimaFn('')">创建新钱包</button>
              </div>
            </div>
          </div>
        </div>


        <div class="inputboxsss" v-else-if="tabKey == 2 && createdOrAdd == 2">
          <div class="inpboxit_til">从私钥助记词导入</div>
          <div class="inpboxit_con">
            <div class="inpboxit_con_head">
              <div class="head_lef">私钥助记词</div>
              <div class="head_rig" @click.stop="ipmFnShow(2)"
              >{{showMim[2]?'隐藏':'显示'}}</div>
            </div>
            <input :type="showMim[2] ? 'text' : 'password'"
                v-model="formPsw.zjctxt"
                class="inpboxit_con_inpb"
                placeholder="在此输入您的助记词" />
            <div class=""></div>
          </div>
          <div class="inpboxit_con">
            <div class="inpboxit_con_head">
              <div class="head_lef">新密码</div>
              <div class="head_rig" @click.stop="ipmFnShow(0)"
              >{{showMim[0]?'隐藏':'显示'}}</div>
            </div>
           
            <input
              :type="showMim[0] ? 'text' : 'password'"
              v-model="formPsw.pwdzjcsy"
              class="inpboxit_con_inpb"
              placeholder="在此输入您的密码"
            />

            <div class=""></div>
          </div>
          <div class="inpboxit_con">
            <div class="inpboxit_con_head">
              <div class="head_lef">确认密码</div>
            </div>
             
            <input
                :type="showMim[1] ? 'text' : 'password'"
                v-model="formPsw.pwdzjcsy1"
                class="inpboxit_con_inpb"
                placeholder="确认密码"
              />
            <div class="inpboxit_con_txt">至少必须包含8个字符</div>
          </div>
          <div
            @click="onImport"
            style="
              height: 50px;
              line-height: 50px;
              margin-top: 40px;
              text-align: center;
              background: #4459ff;
              font-size: 14px;
              color: #fff;
              border-radius: 25px;
              opacity: 1;">
               导入
             </div>

      
        </div>


        <div class="onboarding-flow__wrapper" v-else-if="tabKey == 3">
          <div
            class="mm-box secure-your-wallet mm-box--display-flex mm-box--flex-direction-column mm-box--justify-content-center mm-box--align-items-center"
            data-testid="secure-your-wallet">
            <div class="box box--margin-bottom-4 box--flex-direction-row">
              <ul class="progressbar">
                <li class="active complete">创建密码</li>
                <li class="active">安全钱包</li>
                <li class="">确认私钥助记词</li>
              </ul>
            </div>
            <h2
              class="mm-box mm-text mm-text--heading-lg mm-text--text-align-center mm-box--margin-bottom-4 mm-box--color-text-default">
              保护您的钱包安全</h2>
            <div class="mm-box secure-your-wallet__srp-design-container"><img
                class="secure-your-wallet__srp-design-image" src="@/static/img/srp-lock-design.png" alt="SRP Design">
            </div>
            <p style="font-size: 14px;line-height: 1.5;padding-bottom:80px;">不要冒丢失资金的风险。在信任的地点保存您的 <span style="color: #4459ff;">私钥助记词</span>  ，以此保护您的钱包。<span style="font-weight: bold;">如果您被应用锁定或换新设备，这是找回钱包的唯一途径</span>。</p>
            <div
              class="mm-box secure-your-wallet__actions mm-box--margin-bottom-8 mm-box--display-flex mm-box--gap-4 mm-box--flex-direction-column mm-box--sm:flex-direction-row mm-box--justify-content-space-between mm-box--width-full">
              <button style="display: block;border: 0;"
                class="mm-box mm-text mm-button-base mm-button-base--size-lg mm-button-base--block mm-button-secondary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--color-primary-default mm-box--background-color-transparent mm-box--rounded-pill mm-box--border-color-primary-default box--border-style-solid box--border-width-1"
                data-testid="secure-wallet-later" @click="setAddFn('')">稍后提醒我 <p style="color: #999;font-size: 12px;">（不推荐）</p></button>
             
                <button
                  class="mm-box mm-text mm-button-base mm-button-base--size-lg mm-button-base--block mm-button-primary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--color-primary-inverse mm-box--background-color-primary-default mm-box--rounded-pill"
                  @click="showSecurePopup = true"
                >开始</button>  
                <p style="color: #999;font-size: 12px;text-align: center;">强烈建议</p>
            </div>
            <!-- <div class="mm-box secure-your-wallet__desc">
              <h3 class="mm-box mm-text mm-text--heading-sm mm-box--color-text-default">什么是账户私钥助记词？</h3>
              <p class="mm-box mm-text mm-text--body-md mm-box--margin-bottom-4 mm-box--color-text-default">
                您的账户私钥助记词是由12个单词组成的短语，它是您的钱包和资金的“主私钥”</p>
              <h3 class="mm-box mm-text mm-text--heading-sm mm-box--color-text-default">如何保存我的账户私钥助记词？</h3>
              <ul class="mm-box secure-your-wallet__list mm-box--margin-bottom-4">
                <li class="mm-box mm-text mm-text--body-md mm-box--color-text-default">写下并存储在多个秘密位置。</li>
                <li class="mm-box mm-text mm-text--body-md mm-box--color-text-default">安全存放在保险箱内。</li>
              </ul>
              <h3 class="mm-box mm-text mm-text--heading-sm mm-box--color-text-default">我是否应该分享我的账户私钥助记词？</h3>
              <p class="mm-box mm-text mm-text--body-md mm-box--margin-bottom-4 mm-box--color-text-default">
                切勿分享您的账户私钥助记词，包括也不能与 MetaMask 分享！</p>
              <h3
                class="mm-box mm-text mm-text--heading-sm mm-box--padding-4 mm-box--color-text-default mm-box--background-color-primary-muted mm-box--rounded-lg">
                如果有人要求您的恢复短语，他们可能会试图欺诈您并偷窃您的钱包资金</h3>
            </div> -->
          </div>
        </div>
        <div class="onboarding-flow__wrapper" v-else-if="tabKey == 4">
          <div class="recovery-phrase" data-testid="recovery-phrase">
            <div class="box box--flex-direction-row">
              <ul class="progressbar">
                <li class="active complete">创建密码</li>
                <li class="active">安全钱包</li>
                <li class="">确认私钥助记词</li>
              </ul>
            </div>
            <div class="mm-box mm-box--margin-bottom-4 mm-box--justify-content-center mm-box--text-align-center" style="margin-top: 20px;">
              <h2
                class="mm-box mm-text recovery-phrase__header mm-text--heading-lg mm-text--font-weight-bold mm-box--color-text-default">
                写下您的私钥助记词</h2>
            </div>
            <div class="mm-box mm-box--margin-bottom-4 mm-box--justify-content-center mm-box--text-align-center">
              <h4 class="mm-box mm-text mm-text--heading-sm mm-text--font-weight-normal mm-box--color-text-default">
                请写下这个由12个单词组成的账户私钥助记词，然后将其保存到您信任并且只有您可以访问的地方。</h4>
            </div>
            
            <div
              class="box recovery-phrase__secret box--margin-bottom-4 box--padding-4 box--display-grid box--flex-direction-row box--rounded-md box--border-style-solid box--border-color-border-muted box--border-width-1">

 
              <!-- 重新排序的助记词 
          <div
            data-testid="recovery-phrase-chips"
            class="recovery-phrase__chips"
            :class='{ "recovery-phrase__chips--hidden": !isshowSign }'
          >
            <div
              class="recovery-phrase__chip-item"
              v-for="(it, i) in reorderedMnemonicWords"
              :key="i"
            >
              <div class="recovery-phrase__chip-item__number">{{ it.index }}.</div>
              <div class="recovery-phrase__chip chip chip--border-color-border-default">
                {{ it.name }}
              </div>
            </div>
          </div>
-->


          <div
            data-testid="recovery-phrase-chips"
            class="recovery-phrase__chips"
            :class='{ "recovery-phrase__chips--hidden": !isshowSign }'
            style="display: flex; flex-wrap: wrap; gap: 8px;"
          >
            <div
              class="recovery-phrase__chip-item"
              v-for="(it, i) in reorderedMnemonicWords"
              :key="i"
              style="width: calc(50% - 4px); display: flex; align-items: center;"
            >
              <div class="recovery-phrase__chip-item__number" style="margin-right: 8px;">{{ it.index }}.</div>
              <div class="recovery-phrase__chip chip chip--border-color-border-default" style="flex: 1;">
                {{ it.name }}
              </div>
            </div>
          </div>




              
              <div class="recovery-phrase__secret-blocker" v-show="!isshowSign">
                <i class="iconfont icon-yanjing_xianshi" style="    font-size: 16px;" color="white"
                  v-show="isShowOneSign"></i>
                <!-- <i class="far fa-eye" color="white"></i> -->
                <p v-show="isShowOneSign"
                  class="mm-box mm-text recovery-phrase__secret-blocker--text mm-text--body-sm mm-box--color-overlay-inverse">
                  请确保没有人在看您的屏幕</p>
              </div>
            </div>
            <div class="recovery-phrase__footer">
              <div class="recovery-phrase__footer__copy-and-hide__area" v-show="!isShowOneSign">
                <a class="button btn-link recovery-phrase__footer__copy-and-hide__button recovery-phrase__footer__copy-and-hide__button__hide-seed"
                  role="button" tabindex="0" @click="isshowSign = !isshowSign">
                  <span class="button__icon">
                    <i class="iconfont " :class="isshowSign ? 'icon-yanjing_yincang' : 'icon-yanjing_xianshi'"
                      color="var(--color-primary-default)">
                    </i>
                  </span>
                  {{ isshowSign ? '隐藏助记词' : '显示助记词' }}
                </a>

                <a class="button btn-link recovery-phrase__footer__copy-and-hide__button 
                recovery-phrase__footer__copy-and-hide__button__copy-to-clipboard"
                  role="button" tabindex="0"
                  @click="copyFn(createWallet.mnemonic)">
                  <span class="button__icon">
                    <span
                      class="mm-box mm-icon mm-icon--size-md mm-box--display-inline-block mm-box--color-primary-default"
                      :style="`mask-image: url(${copySvg});`">
                    </span>
                  </span>
                  复制到剪贴板
                </a>
              </div>
              <button class="button btn--rounded btn-primary recovery-phrase__footer--button"
                data-testid="recovery-phrase-reveal" @click="goShowSign">{{ isShowOneSign ? '显示私钥助记词' : '下一步'
                }}</button>
            </div>
          </div>
        </div>
        <div class="onboarding-flow__wrapper" v-else-if="tabKey == 5">
          <div class="recovery-phrase__confirm" data-testid="confirm-recovery-phrase">
            <div class="box box--margin-bottom-4 box--flex-direction-row">
              <ul class="progressbar">
                <li class="active complete">创建密码</li>
                <li class="active complete l34">安全钱包</li>
                <li class="active l34">确认私钥助记词</li>
              </ul>
            </div>
            <div
              class="box box--margin-bottom-4 box--flex-direction-row box--justify-content-center box--text-align-center box--display-flex">
              <h2 class="mm-box mm-text mm-text--heading-lg mm-text--font-weight-bold mm-box--color-text-default">
                确认私钥助记词</h2>
            </div>
            <div
              class="box box--margin-bottom-4 box--flex-direction-row box--justify-content-center box--text-align-center box--display-flex">
              <h4 class="mm-box mm-text mm-text--heading-sm mm-text--font-weight-normal mm-box--color-text-default">
                按照之前呈现的顺序选择每个字母</h4>
            </div>
           

 <!-- 重新排序的助记词 
            <div  class="box recovery-phrase__secret box--margin-bottom-4 box--padding-4 box--display-grid box--flex-direction-row box--rounded-md box--border-style-solid box--border-color-border-muted box--border-width-1">
              <div
                data-testid="recovery-phrase-chips"
                class="recovery-phrase__chips"
                style="display: flex; flex-wrap: wrap; gap: 12px;"
              >
                <div
                  class="recovery-phrase__chip-item"
                  v-for="(it,i) in mnemonicWords"
                  :key="i"
                  style="width: calc(50% - 6px); display: flex; align-items: flex-start;"
                >
                  <div class="recovery-phrase__chip-item__number" style="margin-right: 8px;">{{ i+1 }}.</div>

                 
                  <div
                    data-testid="recovery-phrase-chip-0"
                    v-if="!verifyIndexes.includes(i) && createdOrAdd == 1"
                    class="recovery-phrase__chip chip chip--border-color-border-default chip--background-color-undefined chip--max-content"
                    style="flex: 1;"
                  >
                    {{ it.name }}
                  </div>

                 
                  <div
                    v-else
                    class="recovery-phrase__chip--with-input chip--with-input chip chip--border-color-primary-default chip--background-color-undefined chip--max-content"
                    style="flex: 1;"
                  >
                    <input
                      data-testid="recovery-phrase-input-2"
                      type="text"
                      class="chip__input"
                      @blur="zjcChangeInp(i)"
                      @input="filterEnglish(it)"
                      v-model="it.value"
                      autocomplete="new-password"
                      style="width: 100%;"
                    />
                    <p
                      class="MuiFormHelperText-root postittt Mui-error MuiFormHelperText-filled"
                      v-show="it.tiptxt"
                      id="password-helper-text"
                      style="margin-top: 4px; font-size: 12px; color: red;"
                    >
                      {{ it.tiptxt }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          -->


        



          <!-- 外层容器 -->
<div
  style="display: flex; flex-direction: row; border: 1px solid #ccc; border-radius: 10px; padding: 12px; gap: 10px; width: 100%; box-sizing: border-box;"
>
  <!-- 左列 -->
  <div style="width: calc(50% - 5px); display: flex; flex-direction: column; gap: 0px;">
    <div v-for="i in 6" :key="'l' + i" style="display: flex; align-items: center; height: 36px; min-height: 36px; max-height: 36px; margin-bottom: 8px;">
      <div style="margin-right: 6px;">{{ i }}.</div>
      <div
        v-if="formPsw.selectedWords[i - 1]"
        style="flex: 1; padding: 6px 10px; border: 1px solid #4459ff; border-radius: 999px; text-align: center;"
      >
        {{ formPsw.selectedWords[i - 1]?.name || '' }}
      </div>
      <div
        v-else
        style="flex: 1; padding: 6px 10px; border: 1px dashed #4459ff; border-radius: 999px;"
      >
        &nbsp;
      </div>
    </div>
  </div>

  <!-- 右列 -->
  <div style="width: calc(50% - 5px); display: flex; flex-direction: column; gap: 0px;">
    <div v-for="i in 6" :key="'r' + i" style="display: flex; align-items: center; height: 36px; min-height: 36px; max-height: 36px; margin-bottom: 8px;">
      <div style="margin-right: 6px;">{{ i + 6 }}.</div>
      <div
        v-if="formPsw.selectedWords[i + 5]"
        style="flex: 1; padding: 6px 10px; border: 1px solid #4459ff; border-radius: 999px; text-align: center;"
      >
        {{ formPsw.selectedWords[i + 5]?.name || '' }}
      </div>
      <div
        v-else
        style="flex: 1; padding: 6px 10px; border: 1px dashed #4459ff; border-radius: 999px;"
      >
        &nbsp;
      </div>
    </div>
  </div>
</div>




                  


                    <!-- 下方打乱单词区域（3列） -->
                    <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; margin-top: 20px;">
                    <div
                      v-for="(word, index) in formPsw.shuffledWords"
                      :key="index"
                      @click="handleWordClick(word)"
                      :style="{
                        width: '30%',
                        padding: '8px',
                        textAlign: 'center',
                        border: '2px solid',
                        borderColor: selectedWordMap.has(word.uid) ? '#ccc' : '#4459ff',
                        backgroundColor: selectedWordMap.has(word.uid) ? '#eee' : '#fff',
                        borderRadius: '999px',
                        fontSize: '14px',
                        color: '#000',
                        cursor: 'pointer'
                      }"
                    >
                      {{ word.name }}
                    </div>
                  </div>


                 <!-- 备份状态提示 -->
                <div
                  v-if="mstate !== -1"
                  :style="{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'flex-end',       // 👈 靠右对齐
                    color: mstate === 0 ? 'red' : '#00c853',
                    fontSize: '15px',
                    marginTop: '10px'
                  }"
                >
                  {{ mstate === 0 ? '备份失败' : '备份成功' }}
                </div>




                   <!-- 验证按钮 -->
                   <button
                    @click="onConfirmSecure2"
                    
                    :style="{
                      
                      width: '100%',
                      marginTop: '20px',
                      height: '44px',
                      border: 'none',
                      borderRadius: '999px',
                      backgroundColor: '#4459ff',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      opacity: buttonEnabled ? 1 : 0.5,
                      cursor: buttonEnabled ? 'pointer' : 'not-allowed'
                    }"
                  >
                    验证
                  </button>

            
          

      


          </div>
        </div>
        <div class="onboarding-flow" v-else-if="tabKey == 6">
          <div class="onboarding-flow__wrapper">
            <div class="mm-box creation-successful mm-box--display-flex mm-box--flex-direction-column"
              data-testid="creation-successful">
              <div
                class="mm-box mm-box--margin-top-6 mm-box--display-flex mm-box--flex-direction-column mm-box--justify-content-center">
                <p class="mm-box mm-text mm-text--body-md mm-box--margin-bottom-4 mm-box--justify-content-center mm-box--color-text-default"
                  style="align-self: center; font-size: 70px;"><span>🎉</span></p>
                <h2
                  class="mm-box mm-text mm-text--heading-lg mm-box--margin-6 mm-box--justify-content-center mm-box--color-text-default"
                  style="align-self: center;">恭喜！</h2>
                <p class="mm-box mm-text mm-text--body-lg-medium mm-box--margin-bottom-6 mm-box--color-text-default">
                  <span> 您的钱包受到保护，可随时使用。您可在 <b>设置 &gt; 安全与隐私。</b> 找到私钥助记词 </span></p>
              </div>
              <p class="mm-box mm-text mm-text--body-lg-medium mm-box--margin-bottom-6 mm-box--color-text-default">
                <span> 将您的私钥助记词提醒存放在安全的地方。如果遗失，没有人能帮您找回。更糟糕的是，您将无法再访问您的钱包。<a
                    class="mm-box mm-text mm-button-base mm-button-link mm-button-link--size-inherit mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-0 mm-box--padding-left-0 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--color-primary-default mm-box--background-color-transparent"
                    href="https://support.metamask.io/hc/en-us/articles/360015489591-Basic-Safety-and-Security-Tips-for-MetaMask"
                    target="_blank" rel="noopener noreferrer">了解更多。</a> </span></p>
              <div class="mm-box mm-box--display-flex mm-box--flex-direction-column mm-box--align-items-flex-start">
                <button
                  class="mm-box mm-text mm-button-base mm-button-link mm-button-link--size-auto mm-text--body-md-medium mm-box--margin-top-4 mm-box--margin-bottom-4 mm-box--padding-0 mm-box--padding-right-0 mm-box--padding-left-0 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--color-primary-default mm-box--background-color-transparent"
                  style="font-size: var(--font-size-5);"><span
                    class="mm-box mm-icon mm-icon--size-md mm-box--margin-inline-end-1 mm-box--display-inline-block mm-box--color-inherit"
                    :style="`mask-image: url(${settingSvg});`"></span>管理默认隐私设置</button>
                <p class="mm-box mm-text mm-text--body-sm mm-box--color-text-default">设置经过优化，更具易用性和安全性。可随时对此进行更改。</p>
              </div>
              <div
                class="mm-box creation-successful__actions mm-box--margin-top-6 mm-box--display-flex mm-box--flex-direction-column mm-box--justify-content-center mm-box--align-items-center">
                <button
                  class="mm-box mm-text mm-button-base mm-button-base--size-lg 
                  mm-button-primary mm-text--body-md-medium mm-box--margin-top-6 mm-box--padding-0 
                  mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex 
                  mm-box--justify-content-center mm-box--align-items-center mm-box--color-primary-inverse 
                  mm-box--background-color-primary-default mm-box--rounded-pill"
                  @click="okSetBtn"
                  data-theme="light" data-testid="onboarding-complete-done" style="width: 184px;">完成</button>
                </div>
            </div>
          </div><a class="button btn-link onboarding-flow__twitter-button" href="https://twitter.com/MetaMask"
            target="_blank" role="button" tabindex="0"><span>在 Twitter 上关注我们</span><i
              class="fab fa-twitter onboarding-flow__twitter-button__icon"></i></a>
        </div>
      </div>
    </div>


   
    <Teleport to="body">
  <div v-if="showSecurePopup" class="secure-fullscreen" style="height: 100vh; display: flex; flex-direction: column;">
    
    <!-- 顶部固定  class="secure-container"-->
    <div  style="flex-shrink: 0; ">

      <div class="onboarding-app-header">
        <div class="apphead_left" @click="showSecurePopup = false">
          <i class="iconfont icon-arrow-left-full"></i>
        </div>
        <img src="@/static/img/metamask1.png" alt="" class="apphead_cont" />
        <div class="apphead_right"></div>
      </div>

    
    </div>

    <!-- 内容滚动区 -->
    <div style="flex: 1; overflow-y: auto; padding: 0 16px;">

             


            
              <!-- 步骤条 -->
              <div style="display: flex; justify-content: center;">
              <ul class="progressbar" style="display: flex; padding: 0; list-style: none; margin: 0px 0 0 0;">
                <li class="active complete" style="width: 140px; text-align: center;">创建密码</li>
                <li class="active" style="width: 140px; text-align: center;">安全钱包</li>
                <li style="width: 140px; text-align: center;">确认私钥助记词</li>
              </ul>
              </div>

            <div class="wallet-protect-wrapper">
              <h2 class="title" style="color: #000; font-size: 30px; font-weight: bold; margin-bottom: 16px">保护您的钱包安全</h2>
              <p class="subtitle" style="font-size: 15px; margin-bottom: 16px">
                <span style="color: #000;">保护您的钱包</span>
                <span style="color: #4459ff;"> 私钥助记词。</span>
              </p>

              <p style="font-size: 15px; color: #4459ff; margin-bottom: 16px">
                <span style="display: inline-block; width: 18px; height: 18px; background-color: #4459ff; color: #fff; border-radius: 50%; text-align: center; line-height: 18px; font-size: 12px; font-weight: bold; margin-right: 6px;">i</span>
                它为什么重要？
              </p>
            </div>

            <div style="background: #fff; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 20px; margin-bottom: 20px;">
              <p style="font-size: 15px; font-weight: bold; margin-bottom: 8px;">手动</p>
              <p style="font-size: 12px; margin-bottom: 16px;">在一张纸上写下您的私钥助记词并将其存放在安全的地方。</p>
              <p style="font-size: 12px; margin-bottom: 6px;">安全级别：很强</p>

              <div style="display: flex; gap: 2px; margin-bottom: 16px;">
                <div style="width: 20px; height: 5px; background-color: #4459ff;"></div>
                <div style="width: 20px; height: 5px; background-color: #4459ff;"></div>
                <div style="width: 20px; height: 5px; background-color: #4459ff;"></div>
              </div>

              <p style="font-size: 12px; margin-bottom: 4px;">风险是：</p>
              <ul style="font-size: 12px; margin: 0 0 16px 20px; padding: 0;">
                <li>您丟失它</li>
                <li>您忘记放在哪里</li>
                <li>别人发现它</li>
              </ul>

              <p style="font-size: 12px; margin-bottom: 4px;">其他选项：不一定用纸！</p>
              <p style="font-size: 12px; margin-bottom: 4px;">提示：</p>
              <ul style="font-size: 12px; margin: 0 0 0 20px; padding: 0;">
                <li>存放在银行金库中</li>
                <li>存放在保险箱中</li>
                <li>存放在多个秘密地点</li>
              </ul>

              <div style="padding: 0 0px; margin-top: 20px;">
                <button style="width: 100%; height: 50px; background-color: #4459ff; color: #fff; border: none; border-radius: 50px; font-size: 15px; font-weight: bold; cursor: pointer;" @click="onConfirmSecure">
                  开始
                </button>
              </div>

             </div> 
    


    </div>
  </div>
</Teleport>







  </div>
 
</template>
<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-x: hidden;
  position: relative;
  align-items: center;
}

.onboarding-app-header {
  align-items: center;
  background: var(--color-background-default);
  position: relative;
  z-index: 12;
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  flex: 0 0 auto;
  padding: 16px 26px;
  z-index: 26;
  justify-content: space-between;
  flex-direction: row;
}
.apphead_left{
  /* width: 50px; */
  text-align: left;
  width: 100px;
}
.apphead_left .iconfont{
  font-size: 20px;
  color: var(--color-primary-default);
}
.apphead_cont{
  width: 20%;
}

.apphead_right{
  width: 100px;
}



.main-container-wrapper {
  display: flex;
  justify-content: center;
  flex: 1 0 auto;
  min-height: 0;
  width: 100%;
}

.onboarding-flow {
  background-color: #ffffff;
  padding: 0 16px;
  width: 100%;
}

.onboarding-flow__wrapper {
  margin: 24px auto;
  padding: 0px 16px;
  max-width: 600px;
  border: 0;
  border-radius: 24px;
}

.carousel-root {
  outline: none;
}

.checkbox {
  width: 18px;
  height: 18px;
  border: 1px solid #9ca1af;
  border-radius: 2px;
  box-sizing: border-box;
  margin-right: 6px;

}

.checkbox.active {
  background: url('~@/static/img/check.png') no-repeat;
  background-size: 100% 100%;
}

.recovery-phrase__footer__copy-and-hide__area {
  width: 100%;
}
.huibtn{
  opacity: var(--opacity-disabled);
}
.progressbar li{
  width: 140px;
}
.progressbar li::after{
  left: -53px;
  background-color: #bbbbbb;
}
.progressbar li.l34::after{
  left: -53px;
  background-color: #bbbbbb;
}
.recovery-phrase__chip-item{
  position: relative;
}
.recovery-phrase__chip-item .postittt{
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  text-align: center;
}
.onboarding-welcome__mascot{
  display: flex;
  justify-content: center;
  align-items: center;
  
}
.onboarding-welcome__mascot .hulifangfa{
    transform: scale(2.2);
  }
.onboarding-flow__wrapper{

}
.inputboxsss{
  padding: 0 16px;
  box-sizing: border-box;
  .inpboxit_til{
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .inpboxit_con{
    margin: 15px auto;
    &_head{
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      color: #333;
    }
    &_inpb{
      border: 1px #aab5c0  solid;
      height: 40px;
      line-height: 40px;
      padding: 0 16px;
      font-size: 14px;
      display: block;
      width: 100%;
      margin: 10px auto;
      border-radius: 6px;
    }
    &_txt{
      font-size: 12px;
      color: #555;
    }
  }
  .inpboxit_btnbx{
    height: 50px;
    line-height: 50px;
    margin-top: 40px;
    text-align: center;
    background: var(--color-primary-default);
    font-size: 14px;
    color: #fff;
    border-radius: 25px;
    opacity: 0.5;
    &.act{
      opacity: 1;
    }
  }
}

.secure-fullscreen {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: #ffffff; /* 背景直接是白色页面 */
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
}

.secure-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.top-bar h2 {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
}

.secure-body {
  flex: 1;
  font-size: 14px;
  color: #666;
  line-height: 22px;
  padding: 12px;
}

.secure-bottom {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 12px 0;
  font-size: 16px;
  border: none;
  border-radius: 10px;
}

.cancel-btn {
  background: #f1f1f1;
  color: #333;
}

.confirm-btn {
  background: #4459ff;
  color: white;
}

.wallet-protect-wrapper {
  display: flex;
  flex-direction: column;  /* 垂直排列子项 */
  align-items: center;     /* 子项水平居中 */
  text-align: center;      /* 多行文字居中 */
  padding: 24px;
}



</style>