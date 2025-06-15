 <template>

     <div class="dialog-mask" @click.self="close">
      <div class="dialog-box">
        <div class="dialog-title">{{ $t('setting.language') }}

        </div>
        <div class="language-list">
          <div
            v-for="(lang, index) in languages"
            :key="index"
            class="language-item"
            @click="changeLanguage(lang.code)">
            {{ lang.label }}
          </div>
        </div>
      </div>
    </div> 
    
    
    
    </template>
  
  <script>
  export default {
    name: 'LanguageSelectDialog',
    data() {
      return {
        languages: [
          { label: 'German', code: 'de' },
          { label: 'Greek', code: 'el' },
          { label: 'English', code: 'en' },
          { label: 'Spanish', code: 'es' },
          { label: 'French', code: 'fr' },
          { label: 'Hindi', code: 'hi' },
          { label: 'Bahasa Indonesian', code: 'id' },
          { label: 'Japanese', code: 'ja' },
          { label: 'Korean', code: 'ko' },
          { label: 'Portuguese- Brazil', code: 'pt' },
          { label: 'Russian', code: 'ru' },
          { label: 'Filipino', code: 'fil' },
          { label: 'Turkish', code: 'tr' },
          { label: 'Vietnamese', code: 'vi' },
          { label: 'Chinese- China', code: 'zh' },
        ],
      };
    },
    methods: {
        changeLanguage(code) {
            if (code === 'zh') {
            this.$i18n.locale = 'zh';
            localStorage.setItem('lang', 'zh');
            this.close();
            } else if (code === 'en') {
            this.$i18n.locale = 'en';
            localStorage.setItem('lang', 'en');
            this.close();
            } else {
            this.$toast && this.$toast('This language is not supported yet.');
            alert('This language is not supported yet.');
            }
        },
        close() {
            this.$emit('close');
        },
    },
  };
  </script>
  
  
  <style scoped lang="scss">
  .dialog-mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center; // ✅ 居中显示
  }
  
  .dialog-box {
  width: calc(100% - 100px);
  background: #fff;
  border-radius: 10px;
  padding: 20px 30px;
  box-sizing: border-box;
  max-height: 50vh;
  display: flex;
  flex-direction: column;
}

.dialog-title {
  font-size: 30px;
  font-weight: bold;
  color: #000;
  text-align: center;
  margin-bottom: 10px;
  flex-shrink: 0; // ✅ 不参与滚动
}

.language-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

  
  .language-item {
    font-size: 12px;
    color: #000;
    text-align: center;
    cursor: pointer;
  }
  </style>
  