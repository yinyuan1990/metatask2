<template>
    <PageContainer title="更改密码">
        <template v-if="!confirmPasswordSuccess">
            <div class="mm-box mm-text mm-text--body-lg-medium lg-font-size">
                确认您的密码
            </div>
            <div class="mm-box mm-text mm-text--body-md-medium m-y">在继续之前，我们需要您确认自己的密码</div>
            <MInput type="password" placeholder="Password" size="sm" name="password" v-model="oldPassword" />
            <div v-if="hasError" class="mm-text mm-box--color-error-default m-t-small">密码不正确</div>
            <MButton :customStyle="{
                'margin-top': '32px'
            }" :onClickBtn="onConfirnPassword">
                确认
            </MButton>
        </template>
        <div v-else class="reset-password--wrapper">
            <div class="mm-box mm-text mm-box--color-text-default title">
                <div class="main-title mm-text--body-lg-medium">
                    更改密码
                </div>
                <div class="sub-title mm-text--body-md">此密码将仅在此设备上解锁您的MetaMask钱包</div>
            </div>
            <div class="input--wrapper">
                <div class="password-input">
                    <div class="mm-text--body-sm">
                        <div class="new-password mb-8">
                            <div>密码</div>
                            <div @click="onToggleInputType" style="cursor: pointer;">{{ showPassword ? '隐藏' : '显示'
                                }}</div>
                        </div>
                        <MInput v-model="newPass.val" :type="showPassword ? 'text' : 'password'" placeholder=""
                            name="newPassword" />
                    </div>
                    <div v-if="safeLevel" class="mm-text m-text--body-sm password-level">
                        <div>密码强度：</div>
                        <div v-if="safeLevel === 2" class="mm-box--color-primary-default">好</div>
                        <div v-if="safeLevel === 1" class="mm-box--color-error-default">弱</div>
                        <div v-if="safeLevel === 3" class="mm-box--color-success-default">强</div>
                    </div>
                </div>
                <div class="password-input mm-text--body-sm">
                    <div>
                        <div class="mb-8">确认密码</div>
                        <MInput v-model="newPass.confirmVal" type="password" placeholder="" name="reNewPassword" />
                    </div>
                    <div>必须至少包含8个字符</div>
                </div>
                <MCheckBox @onCheckChange="onCheckChange">
                    <slot>我了解MetaMask无法为我找回此密码。<span @click="(e) => e.stopPropagation()"
                            class="mm-box mm-text mm-button-base mm-button-link mm-button-link--size-auto mm-text--body-md-medium mm-box--color-primary-default mm-box--background-color-transparent"
                            data-testid="srp-quiz-learn-more">了解更多</span></slot>
                </MCheckBox>
                <MButton :onClickBtn="onClickBtn" :disabled="disabledBtn" :customStyle="{
                    'margin-top': '16px'
                }">
                    重置密码
                </MButton>
            </div>
        </div>
    </PageContainer>
</template>
<script>
import MInput from '@/components/common/Input.vue'
import MButton from '@/components/common/Button.vue'
import MCheckBox from '@/components/common/CheckBox.vue'
import PageContainer from '@/components/common/Page-Container.vue'
import { accountManager,save } from "@/bbjs/AccountManager";
export default {
    name: 'UpdatePassword',
    components: {
        MInput,
        MButton,
        MCheckBox,
        PageContainer
    },
    data: () => {
        return {
            hasError: true,
            confirmPasswordSuccess: false,
            showPassword: false,
            oldPassword: '',
            newPass: {
                val: '',
                confirmVal: ''
            },
            checked: false
        }
    },
    computed: {
        disabledBtn() {
            return !this.newPass.val || !this.newPass.confirmVal || !this.checked
        },
        safeLevel() {
            const password = this.newPass.val;
            if (!password) {
                return 0;
            }
            let score = 0;

            if (password.length >= 8) score++;
            if (/[a-z]/.test(password)) score++;
            if (/[A-Z]/.test(password)) score++;
            if (/\d/.test(password)) score++;
            if (/[\W_]/.test(password)) score++; // 特殊字符

            if (score <= 2) return 1;
            if (score === 3 || score === 4) return 2;
            return 3;
        }

    },
    methods: {
        onCheckChange(checked) {
            this.checked = checked
        },
        onConfirnPassword() {


            console.log(this.oldPassword)
            console.log(accountManager.getCurrentAccount().payPassword)


            if(this.oldPassword === accountManager.getCurrentAccount().payPassword){
                this.confirmPasswordSuccess = true
            }else{

                this.$toast('密码错误');
            }

            
            
        },
        onToggleInputType() {
            const oldVal = this.showPassword;
            this.showPassword = oldVal ? false : true;
        },
        onClickBtn() {


            /*
updatePayPassword
            newPass: {
                val: '',
                confirmVal: ''
            }
            */ 
           // */
 
            console.log(JSON.stringify(this.newPass))

            if(this.newPass.confirmVal.length<6){
                this.$toast.fail('密码长度至少6位！');
            }else{
            
                    if (!this.disabledBtn&& this.newPass.val === this.newPass.confirmVal ) {
                        accountManager.updatePayPassword(this.newPass.confirmVal)
                        this.$router.push({
                            path: '/setting'
                        })
                    }else{
                        this.$toast('密码不一致');
                    }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.lg-font-size {
    font-size: var(--typography-l-heading-lg-font-size);
    line-height: var(--typography-l-heading-lg-line-height);
}

.m-y {
    margin-top: 16px;
    margin-bottom: 12px;
    font-weight: normal;
}

.m-t-small {
    margin-top: 12px;
    font-size: var(--font-size-3);
    line-height: var(--line-height-4);
}

.reset-password--wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 32px;

    .title {
        width: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        row-gap: 24px;
    }

    .main-title {
        font-size: var(--font-size-6);
        line-height: var(--line-height-4);
    }

    .input--wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 24px;
    }

    .password-input {
        display: flex;
        flex-direction: column;
        row-gap: 16px;
    }

    .new-password {
        display: flex;
        justify-content: space-between;
    }

    .mb-8 {
        margin-bottom: 8px;
    }

    .password-level {
        display: flex;
        align-items: center;
        font-size: var(--font-size-3);
    }
}
</style>