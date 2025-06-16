<template>
    <PageContainer title="显示私钥">
        <div style="display: flex; flex-direction: column; row-gap: 8px;">
            <p class="mm-box mm-text mm-text--body-sm mm-box--color-text-default">
                将它保存在安全、秘密的地方
            </p>
            <div class="mm-box mm-banner-base mm-banner-alert mm-banner-alert--severity-danger mm-box--padding-4 mm-box--padding-left-2 mm-box--display-flex mm-box--gap-2 mm-box--background-color-error-muted mm-box--rounded-sm"
                style="align-items: center; column-gap: 12px; border: 1px solid var(--color-error-default); border-radius: 8px; margin: 12px 0px;">
                <span class="mm-box mm-icon mm-icon--size-lg mm-box--display-inline-block mm-box--color-error-default"
                    :style="`mask-image: url(${EyeSlash});`"></span>
                <div class="mm-box mm-box--min-width-0">
                    <p class="mm-box mm-text mm-text--body-sm mm-box--color-text-default">
                        请勿泄漏此密钥。任何得到您的私钥的人都可以完全控制您的账户，包括转账所有资金。
                    </p>
                </div>
            </div>

            <div v-if="!verifySuccess" class="mm-text--body-sm flex-cloumn">
                <div>输入密码继续</div>
                <MInput type="password" placeholder="Password" v-model="password" />
                <div v-if="hasError" class="mm-text mm-box--color-error-default m-t-small">密码不正确</div>
            </div>
            <div v-else>
                <div class="mm-box tabs" defaultactivetabname="文本">
                    <ul
                        class="mm-box tabs__list mm-box--display-flex mm-box--gap-0 mm-box--justify-content-flex-start mm-box--background-color-background-default">
                        <li @click="onToggle('text')" :class="{
                            'mm-box tab reveal-seed__tab reveal-seed__active-tab': true,
                            'tab--active': activeTab === 'text'
                        }"><button
                                class="mm-box mm-text mm-text--body-md mm-text--text-align-center mm-box--padding-2 mm-box--display-block mm-box--width-full mm-box--color-inherit">文本</button>
                        </li>
                        <li @click="onToggle('qr')" :class="{
                            'mm-box tab reveal-seed__tab reveal-seed__active-tab': true,
                            'tab--active': activeTab === 'qr'
                        }"><button
                                class="mm-box mm-text mm-text--body-md mm-text--text-align-center mm-box--padding-2 mm-box--display-block mm-box--width-full mm-box--color-inherit">QR</button>
                        </li>
                    </ul>
                    <div v-if="activeTab === 'text'" class="mm-box tabs__content"><label
                            class="mm-box mm-text mm-label mm-text--body-md mm-text--font-weight-medium mm-box--margin-top-4 mm-box--display-inline-flex mm-box--align-items-center mm-box--color-text-default">您的私钥</label>
                        <div
                            class="mm-box mm-box--padding-4 mm-box--display-flex mm-box--gap-4 mm-box--flex-direction-column mm-box--justify-content-center mm-box--align-items-center mm-box--rounded-md mm-box--border-color-border-default box--border-style-solid box--border-width-1">
                            <p style="word-break: break-all;
  word-wrap: break-word;
  overflow-wrap: break-word;" class="mm-box mm-text notranslate mm-text--body-lg-medium mm-box--display-flex mm-box--justify-content-center mm-box--color-text-default"
                                data-testid="srp_text">{{ word }}</p><button @click="copyToClipboard(word)"
                                class="mm-box mm-text mm-button-base mm-button-base--size-md mm-button-base--block export-text-container__button mm-button-secondary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--color-primary-default mm-box--background-color-transparent mm-box--rounded-pill mm-box--border-color-primary-default box--border-style-solid box--border-width-1">复制到剪贴板</button>
                        </div>
                    </div>
                    <div v-else style="display: flex; align-items: center; justify-content: center; margin-top: 24px;">
                        <img :src="qrcodeDataUrl" alt="二维码" />
                    </div>
                </div>
            </div>
        </div>
        <div style="display: flex; column-gap: 6px; margin-top: 48px;">
            <template v-if="!verifySuccess">
                <button @click="onClose"
                    class="mm-box mm-text mm-button-base mm-button-base--size-lg mm-button-secondary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--width-full mm-box--color-primary-default mm-box--background-color-transparent mm-box--rounded-pill mm-box--border-color-primary-default box--border-style-solid box--border-width-1"
                    data-testid="srp-quiz-right-answer">取消</button>
                <button @click="onContinue" :class="{
                    'mm-box mm-text mm-button-base mm-button-base--size-lg mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--width-full mm-box--color-primary-default mm-box--background-color-transparent mm-box--rounded-pill mm-box--border-color-primary-default box--border-style-solid box--border-width-1': true,
                    'mm-button-primary--disabled mm-button-base--disabled': !password,
                    'mm-button-secondary': password
                }" data-testid="srp-quiz-right-answer">下一步</button>
            </template>
            <button v-else @click="onFinished"
                class="mm-box mm-text mm-button-base mm-button-base--size-lg mm-button-secondary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--width-full mm-box--color-primary-default mm-box--background-color-transparent mm-box--rounded-pill mm-box--border-color-primary-default box--border-style-solid box--border-width-1"
                data-testid="srp-quiz-right-answer">完成</button>
        </div>

        <Dialog v-if="showDialog" @onClose="onClose" :headerCustomStyle="{
            'margin-left': '0'
        }">
            <template v-slot:header>
                <h4 class="mm-box mm-text mm-text--heading-sm mm-box--color-text-default">保护好您的 <span
                        style="padding: 0 4px;">私钥</span> 安全</h4>
            </template>
            <div class="mm-box mm-box--margin-top-4 mm-box--margin-bottom-6 mm-box--display-flex mm-box--gap-2 mm-box--flex-direction-column"
                style="margin: 0;">
                <p class="mm-box mm-text mm-text--body-md mm-box--color-text-default"><span> 您的<span
                            style="padding: 0 4px;">私钥</span>提供<span
                            class="mm-box mm-text mm-text--body-md-bold mm-box--color-text-default">对您的账户和资金的完全访问权限。</span>
                    </span>
                </p>
                <p class="mm-box mm-text mm-text--body-md-bold mm-box--color-text-default">
                <div class="mm-box mm-text mm-text--body-md-bold mm-box--color-text-default"> 请勿与任何人分享。</div>
                <span class="mm-box mm-text mm-text--body-sm mm-box--display-inline mm-box--color-text-default">MetaMask
                    支持团队不会要求提供此项信息， <a
                        class="mm-box mm-text mm-button-base mm-button-link mm-button-link--size-inherit mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-0 mm-box--padding-left-0 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--color-primary-default mm-box--background-color-transparent"
                        target="_blank" rel="noopener noreferrer"
                        href="https://support.metamask.io/getting-started/metamask-is-a-self-custodial-wallet/">但网络钓鱼者可能会。</a>
                </span>
                </p>
            </div>
            <button @mousedown="startHold" @mouseup="cancelHold" @mouseleave="cancelHold" @touchstart="startHold"
                @touchend="cancelHold" @touchcancel="cancelHold"
                class="mm-box mm-text mm-button-base mm-button-base--size-md hold-to-reveal-button__button-hold mm-button-primary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--width-full mm-box--color-primary-inverse mm-box--background-color-primary-default mm-box--rounded-pill"
                data-theme="light"><span
                    class="mm-box mm-text mm-text--inherit mm-box--display-flex mm-box--align-items-center mm-box--color-primary-inverse"
                    style="column-gap: 8px;">
                    <div class="mm-box hold-to-reveal-button__icon-container mm-box--margin-right-2">
                        <div class="mm-box hold-to-reveal-button__absolute-fill">
                            <div class="mm-box hold-to-reveal-button__absolute-fill"><svg
                                    class="hold-to-reveal-button__circle-svg">
                                    <circle class="hold-to-reveal-button__circle-background" cx="14" cy="14" r="13">
                                    </circle>
                                </svg></div>
                            <div class="mm-box hold-to-reveal-button__absolute-fill"><svg
                                    class="hold-to-reveal-button__circle-svg">
                                    <circle aria-label="按住以显示圆圈锁定" class="hold-to-reveal-button__circle-foreground"
                                        cx="14" cy="14" r="13"></circle>
                                </svg></div>
                            <div
                                class="mm-box hold-to-reveal-button__lock-icon-container mm-box--display-flex mm-box--justify-content-center mm-box--align-items-center">
                                <img :src="Lock" alt="挂锁" class="hold-to-reveal-button__lock-icon" :style="{
                                    width: '7.88px',
                                    height: '9px',
                                    color: 'white'
                                }">
                            </div>
                        </div>
                    </div>
                    按住以显示 私钥
                </span></button>
        </Dialog>
    </PageContainer>
</template>
<script>
import QRCode from 'qrcode'
import Lock from '@/static/icon/lock-icon.svg'
import PageContainer from '@/components/common/Page-Container.vue';
import EyeSlash from '@/static/icon/eye-slash.svg'
import MInput from '@/components/common/Input.vue';
import Dialog from '@/components/common/Dialog.vue';
import { accountManager,save } from "@/bbjs/AccountManager";
export default {
    name: 'DisplayPrivateKey',
    components: {
        PageContainer,
        MInput,
        Dialog
    },
    data() {
        return {
            EyeSlash,
            hasError: true,
            password: '',
            Lock,
            showDialog: false,
            holdTime: 3000,
            progress: 0,
            interval: null,
            startTimestamp: null,
            circumference: 2 * Math.PI * 13,
            verifySuccess: false,
            qrcodeDataUrl: '',
            activeTab: 'text',
            word: accountManager.getCurrentAccount().privateKey,
        }
    },
    watch: {
        activeTab(val) {
            if (val === 'qr') {
                this.generateQRCode(this.word)
            }
        }
    },
    methods: {
        generateQRCode() {
            QRCode.toDataURL(this.word)
                .then(url => {
                    this.qrcodeDataUrl = url;
                })
                .catch(err => {
                    console.error(err);
                });
        },
        onFinished() {
            this.onClose();
        },
        copyToClipboard(text) {
            if (navigator.clipboard && window.isSecureContext) {
                // HTTPS 环境下使用更现代的方式
                navigator.clipboard.writeText(text)
                    .then(() => {
                        this.$toast('私钥助记词已复制到剪切板上');
                    })
                    .catch(err => {
                        this.$toast('复制失败');
                    });
            } else {
                // 回退方案（不安全上下文或不支持 clipboard API）
                this.fallbackCopy(text);
            }
        },

        fallbackCopy(text) {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed"; // 避免影响布局
            textarea.style.opacity = 0;
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            try {
                const successful = document.execCommand('copy');
                this.$toast(successful ? '私钥助记词已复制到剪切板上' : '复制失败！');
            } catch (err) {
                this.$toast('浏览器不支持复制');
            }

            document.body.removeChild(textarea);
        },
        onToggle(type) {
            this.activeTab = type
        },
        startHold() {
            this.triggered = false;
            this.progress = 0;

            // 进度条动画
            const step = 100;
            this.interval = setInterval(() => {
                this.progress += step / this.holdTime;
                if (this.progress >= 1) this.progress = 1;
            }, step);

            // 精准的长按触发逻辑
            this.holdTimeout = setTimeout(() => {
                this.triggered = true;
                this.triggerReveal();
            }, this.holdTime);
        },
        cancelHold() {
            clearTimeout(this.holdTimeout);
            clearInterval(this.interval);
            this.holdTimeout = null;
            this.interval = null;

            if (!this.triggered) {
                this.progress = 0; // 重置动画
            }
        },
        triggerReveal() {
            this.showDialog = false;
            this.verifySuccess = true
        },
        onClose() {
            this.showDialog = false
        },
        onContinue() {
            
            if (this.password === accountManager.getCurrentAccount().payPassword) {
                this.showDialog = true
            }else{
                this.$toast('密码错误');
            }
            
        },
        onClose() {
            this.$router.push({
                path: '/set2'
            })
        }

    }
}
</script>
<style lang="css" scoped>
.flex-cloumn {
    display: flex;
    flex-direction: column;
    row-gap: 6px;
}

.mm-button-primary--disabled:active {
    background-color: #fff;
}
</style>